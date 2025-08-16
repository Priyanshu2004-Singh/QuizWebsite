import pool from '../db/db.js';
import express from 'express';
import flash from 'connect-flash';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(flash());

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role // make sure role is selected from DB
      };

      // Role-based redirection
      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/');
      }
    } else {
      req.flash('error', '❌ Invalid username or password.');
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', '❌ Login error.');
    res.redirect('/login');
  }
};

export const adminDashboard = async (req, res) => {
  try {
    // Default fallback data (mock participants)
    const participants = [
      { id: 1, username: "alice", marks: 85 },
      { id: 2, username: "bob", marks: 92 },
      { id: 3, username: "charlie", marks: 76 }
    ];

    res.render("admin", {
      user: req.session.user?.username || "Admin",
      participants: participants,
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });

  } catch (error) {
    console.error("❌ Error loading admin dashboard:", error.message);
    req.flash("error", "Failed to load admin dashboard.");
    res.redirect("/");
  }
};

export const addParticipants = (req, res) => {
  const participants = [
    { id: 1, username: "alice", marks: 85 },
    { id: 2, username: "bob", marks: 72 },
    { id: 3, username: "charlie", marks: 90 },
    { id: 4, username: "diana", marks: 65 },
  ];

  res.render("add_participants", {
    user: req.session.user?.username || "Admin",
    participants: participants,
    success: req.flash("success") || [],
    error: req.flash("error") || []
  });
}

export const admin_quiz_setup = async (req, res) => {
  res.render("adminQuizSetup", {
    user: req.session.user?.username || "Admin",
    success: req.flash("success") || [],
    error: req.flash("error") || [],
  });
};


export const render_create_quiz_form = (req, res) => {
  const count = parseInt(req.query.count);
  const marks = parseInt(req.query.marks);

  if (!count || !marks || isNaN(count) || isNaN(marks)) {
    return res.render("adminQuizSetup", {
      user: req.session.user?.username || "Admin",
      success: [],
      error: ["❌ Invalid input. Please enter valid numbers."]
    });
  }

  res.render("adminCreateQuiz", {
    count,
    marks,
    user: req.session.user?.username || "Admin",
    success: req.flash('success') || [],
    error: req.flash('error') || []
  });
};



export const create_quiz = async (req, res) => {
  const { title, questions, marks } = req.body;

  // Basic validation
  if (!title || !questions || Object.keys(questions).length === 0 || !marks) {
    req.flash("error", "❌ Please fill all quiz details.");
    return res.redirect("/admin/create-quiz");
  }

  const total_questions = Object.keys(questions).length;// fetching questions count
  const created_by = req.session.user?.id; // 'Admin'

  try {
    await pool.query('BEGIN');

    // Insert into quizzes
    const insertQuizQuery = `
      INSERT INTO quizzes (title, total_questions, marks_per_question, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const quizResult = await pool.query(insertQuizQuery, [
      title.trim(),
      total_questions,
      marks,
      created_by
    ]);

    const quizId = quizResult.rows[0].id;

    const insertQuestionQuery = `
      INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    for (let key in questions) {
      const q = questions[key];

      // Extracting question data
      const question_text = q.question?.trim();
      const options = q.options?.map(opt => opt.trim());
      const correct_option = q.correct?.trim().toUpperCase();

      // Validate
      if (
        !question_text ||
        !options || options.length !== 4 ||
        options.some(opt => !opt) ||
        !["A", "B", "C", "D"].includes(correct_option)
      ) {
        await pool.query("ROLLBACK");
        req.flash("error", `❌ Invalid data for question ${+key + 1}.`);
        return res.redirect("/admin/create-quiz");
      }

      // Insert into questions
      await pool.query(insertQuestionQuery, [
        quizId,
        question_text,
        options[0],
        options[1],
        options[2],
        options[3],
        correct_option
      ]);
    }

    await pool.query('COMMIT');
    req.flash("success", "✅ Quiz and questions saved successfully.");
    res.redirect("/admin");
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error("❌ Error saving quiz and questions:", err.message);
    req.flash("error", "❌ Error saving quiz and questions: " + err.message);
    res.redirect("/admin/create-quiz");
  }
};



export const quizHistory = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes ORDER BY created_at DESC');
    const quizzes = result.rows;

    res.render("quizHistory", {
      user: req.session.user?.username || "Admin",
      quizzes: quizzes,
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });
  } catch (error) {
    console.error("❌ Error loading quiz history:", error.message);
    req.flash("error", "Failed to load quiz history.");
    res.redirect("/admin");
  }
}

export const checkQuizEvaluation = async (req, res) => {
  const quizId = req.params.id;

  try {
    // Fetch quiz details
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);
    const quiz = quizResult.rows[0];

    if (!quiz) {
      req.flash('error', '❌ Quiz not found.');
      return res.redirect('/admin/results');
    }

    // Fetch questions
    const questionsResult = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [quizId]);
    const questions = questionsResult.rows;

    // Fetch user attempts
    const attemptsResult = await pool.query(`
      SELECT a.*, u.username
      FROM attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.quiz_id = $1
      ORDER BY a.completed_at DESC NULLS LAST
    `, [quizId]);

    const attempts = attemptsResult.rows;

    // Render check-quiz.ejs
    res.render("check-quiz", {
      user: req.session.user?.username || "Admin",
      quiz,
      questions,
      attempts,
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });

  } catch (err) {
    console.error("❌ Error fetching quiz evaluation:", err.message);
    req.flash('error', 'Failed to fetch quiz evaluation.');
    res.redirect('/admin/results');
  }
};

export const render_check_quiz = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM quizzes ORDER BY id DESC');

    res.render("renderQuizCheck", {
      quizzes: result.rows, // from SELECT id, title FROM quizzes
      user: req.session.user?.username || "Admin",
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });

  } catch (err) {
    console.error("❌ Error fetching quizzes:", err.message);
    req.flash('error', 'Failed to fetch quizzes.');
    res.redirect('/admin');
  }
};


export const render_feedbacks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM feedback ORDER BY id DESC");
    res.render("adminFeedback", { feedbacks: result.rows });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong while fetching feedbacks.");
    res.redirect("/admin");
  }
};

export const delete_feedback = async (req, res) => {
  const feedbackId = req.params.id;

  try {
    await pool.query("DELETE FROM feedback WHERE id = $1", [feedbackId]);
    req.flash("success", "✅ Feedback deleted successfully.");
    res.redirect("/admin/feedbacks");
  } catch (err) {
    console.error(err);
    req.flash("error", "❌ Failed to delete feedback.");
    res.redirect("/admin/feedbacks");
  }
};
