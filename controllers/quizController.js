import db from "../db/db.js";
import pool from '../db/db.js'; // Adjust the path based on your project structure

// ✅ GET all quizzes
export const getAllQuizzes = async (req, res) => {
  try {
    const { count, marks, tier } = req.query;
    let sql = "SELECT * FROM quizzes";
    const params = [];
    if (tier) {
      params.push(Number(tier));
      sql += ` WHERE tier = $${params.length}`;
    }
    const result = await db.query(sql, params);

    res.render("getAllQuiz", {
      quizzes: result.rows,
      count: count || null,
      marks: marks || null,
      selectedTier: tier || 'all',
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
      `SELECT id, question_text, option_a, option_b, option_c, option_d, difficulty
       FROM questions WHERE quiz_id = $1 ORDER BY id ASC`,
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
      return res.redirect(`/quiz/${quizId}`);
    }

    // 1. Validate quiz exists
    const quizResult = await db.query(
      "SELECT id, title, marks_per_question FROM quizzes WHERE id = $1",
      [quizId]
    );
    if (quizResult.rows.length === 0) {
      return res.status(404).send("Quiz not found");
    }

    const quiz = quizResult.rows[0];

    const questionResult = await db.query(
      "SELECT id, correct_option, difficulty FROM questions WHERE quiz_id = $1 ORDER BY id ASC",
      [quizId]
    );
    const questions = questionResult.rows;

    let correctCount = 0;
    const answersByQuestion = {};

    if (Array.isArray(req.body.answers)) {
      questions.forEach((question, index) => {
        const selectedOption = req.body.answers[index];
        if (selectedOption !== undefined) {
          answersByQuestion[String(question.id)] = selectedOption;
        }
      });
    } else if (req.body.answers && typeof req.body.answers === 'object') {
      Object.assign(answersByQuestion, req.body.answers);
    }

    for (const [fieldName, fieldValue] of Object.entries(req.body)) {
      const match = fieldName.match(/^answers\[(\d+)\]$/);
      if (match) {
        answersByQuestion[match[1]] = fieldValue;
      }
    }

    for (let q of questions) {
      const selectedOption = answersByQuestion[String(q.id)];
      if (!selectedOption) continue;

      const normalizedSelected = String(selectedOption).trim().toUpperCase();
      const normalizedCorrect = String(q.correct_option).trim().toUpperCase();
      const isCorrect = normalizedSelected === normalizedCorrect;
      if (isCorrect) correctCount++;
    }

    // Advanced scoring for tiered quizzes
    const difficultyMultiplier = (d) => {
      if (!d) return 1;
      const dd = String(d).toLowerCase();
      if (dd === 'easy') return 1;
      if (dd === 'medium') return 1.5;
      if (dd === 'hard') return 2;
      return 1;
    };

    let totalMarks = 0;
    let score = 0;

    for (let q of questions) {
      const selectedOption = answersByQuestion[String(q.id)];
      const perQMultiplier = difficultyMultiplier(q.difficulty || 'medium');
      const perQMarks = (Number(quiz.marks_per_question) || 1) * perQMultiplier;
      totalMarks += perQMarks;

      if (!selectedOption) continue;
      const normalizedSelected = String(selectedOption).trim().toUpperCase();
      const normalizedCorrect = String(q.correct_option).trim().toUpperCase();
      const isCorrect = normalizedSelected === normalizedCorrect;
      if (isCorrect) {
        score += perQMarks;
      } else {
        // Apply light negative marking for tier >=2
        if (Number(quiz.tier || 1) >= 2) {
          score -= perQMarks * 0.25; // penalize 25% of question marks
        }
      }
    }

    // Normalize score bounds
    if (score < 0) score = 0;
    // Round scores to integer
    const roundedScore = Math.round(score);
    const roundedTotal = Math.round(totalMarks);

    const insertAttempt = await db.query(
      "INSERT INTO attempts (user_id, quiz_id, score, total_marks) VALUES ($1, $2, $3, $4) RETURNING id",
      [userId, quizId, roundedScore, roundedTotal]
    );
    const attemptId = insertAttempt.rows[0].id;

    // Persist per-question responses for reporting
    const insertRespQ = `INSERT INTO responses (attempt_id, question_id, selected_option, is_correct) VALUES ($1,$2,$3,$4)`;
    for (let q of questions) {
      const sel = answersByQuestion[String(q.id)];
      if (!sel) continue;
      const normalizedSelected = String(sel).trim().toUpperCase();
      const normalizedCorrect = String(q.correct_option).trim().toUpperCase();
      const isCorrect = normalizedSelected === normalizedCorrect;
      await db.query(insertRespQ, [attemptId, q.id, normalizedSelected, isCorrect]);
    }

    req.flash("success", `✅ Quiz submitted! You scored ${roundedScore} out of ${roundedTotal}.`);
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
      `SELECT a.id, q.title, a.score, a.total_marks, a.attempted_at AS started_at
       FROM attempts a
       JOIN quizzes q ON a.quiz_id = q.id
       WHERE a.user_id = $1
       ORDER BY a.attempted_at DESC`,
      [userId]
    );

    res.render("userResult", {
      results: result.rows,
      username: req.session.user.username,
      summary: {
        attempts: result.rows.length,
        bestScore: result.rows.length ? Math.max(...result.rows.map(item => Number(item.score || 0))) : 0,
        averageScore: result.rows.length ? (result.rows.reduce((sum, item) => sum + Number(item.score || 0), 0) / result.rows.length).toFixed(1) : '0.0',
      }
    });

  } catch (error) {
    console.error("Error fetching user results:", error);
    res.status(500).send("Internal Server Error");
  }
};


