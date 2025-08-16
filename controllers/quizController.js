import db from "../db/db.js";
import pool from '../db/db.js'; // Adjust the path based on your project structure

// ✅ GET all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM quizzes");
    const { count, marks } = req.query;

    res.render("getAllQuiz", {
      quizzes: result.rows,
      count: count || null,
      marks: marks || null,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Take quiz page
export const takeQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quizResult = await db.query("SELECT * FROM quizzes WHERE id = $1", [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).send("Quiz not found");
    }

    const questionResult = await db.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d 
       FROM questions WHERE quiz_id = $1`,
      [quizId]
    );

    res.render("QuizPage", {
      quiz: quizResult.rows[0],
      questions: questionResult.rows,
    });
  } catch (err) {
    console.error("Error in takeQuiz:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ✅ Submit quiz and save user answers
export const submitQuiz = async (req, res) => {
  try {
    // Ensure user is logged in
    if (!req.session.user || !req.session.user.id) {
      req.flash("error", "Please log in to submit the quiz.");
      return res.redirect("/login");
    }

    const userId = req.session.user.id;
    const quizId = req.params.id;
    const answers = req.body.answers; // Expected format: { questionId: selectedOption }

    if (!answers || Object.keys(answers).length === 0) {
      req.flash("error", "No answers submitted.");
      return res.redirect(`/user/take-quiz/${quizId}`);
    }

    // 1. Validate quiz exists
    const quizResult = await db.query("SELECT * FROM quizzes WHERE id = $1", [quizId]);
    if (quizResult.rows.length === 0) {
      return res.status(404).send("Quiz not found");
    }

    // 2. Insert into attempts table
    const attemptInsert = await db.query(
      "INSERT INTO attempts (user_id, quiz_id) VALUES ($1, $2) RETURNING id",
      [userId, quizId]
    );
    const attemptId = attemptInsert.rows[0].id;

    // 3. Fetch questions and correct answers
    const questionResult = await db.query(
      "SELECT id, correct_option FROM questions WHERE quiz_id = $1",
      [quizId]
    );
    const questions = questionResult.rows;

    let correctCount = 0;

    // 4. Process each question
    for (let q of questions) {
      const selectedOption = answers[q.id];
      if (!selectedOption) continue;

      const isCorrect = selectedOption.toUpperCase() === q.correct_option.toUpperCase();
      if (isCorrect) correctCount++;

      await db.query(
        `INSERT INTO user_answers (attempt_id, question_id, selected_option, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [attemptId, q.id, selectedOption.toUpperCase(), isCorrect]
      );
    }

    // 5. Optional: Store result in flash or redirect
    req.flash("success", `✅ Quiz submitted! You got ${correctCount} out of ${questions.length} correct.`);
    res.redirect(`/feedback/${quizId}`);


  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).send("Internal Server Error");
  }
};


export const renderFeedbackForm = async (req, res) => {
  const quizId = req.params.quizId;
  const quizResult = await db.query("SELECT * FROM quizzes WHERE id = $1", [quizId]);

  if (quizResult.rows.length === 0) {
    req.flash("error", "Quiz not found");
    return res.redirect("/quiz");
  }

  res.render("feedback", {
    quiz: quizResult.rows[0],
    success: req.flash("success"),
    error: req.flash("error")
  });
};

export const submitFeedback = async (req, res) => {
  const userId = req.session.user?.id;
  const quizId = req.params.quizId;
  const { message } = req.body;

  try {
    await db.query(
      "INSERT INTO feedback (user_id, quiz_id, message) VALUES ($1, $2, $3)",
      [userId, quizId, message]
    );

    req.flash("success", "✅ Thank you for your feedback!");
    res.redirect(`/`);
  } catch (err) {
    console.error("Feedback submission error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect(`/feedback/${quizId}`);
  }
};


export const userResult = async (req, res) => {
  try {
    if (!req.session.user) {
      req.flash("error", "⚠️ Please log in to view your results.");
      return res.redirect("/login");
    }

    const userId = req.session.user.id;

    const result = await pool.query(
      `SELECT a.id, q.title, a.score, a.total_marks, a.started_at
       FROM attempts a
       JOIN quizzes q ON a.quiz_id = q.id
       WHERE a.user_id = $1
       ORDER BY a.started_at DESC`,
      [userId]
    );

    res.render("userResult", {
      results: result.rows,
      username: req.session.user.username
    });

  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).send("Internal Server Error");
  }
};


