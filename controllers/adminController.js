import bcrypt from 'bcrypt';
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
    const storedPassword = user?.password || user?.password_hash;

    if (user && storedPassword && await bcrypt.compare(password, storedPassword)) {
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
    const [quizCountResult, userCountResult, attemptCountResult, feedbackCountResult, recentQuizzesResult, recentAttemptsResult, topPerformersResult] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM quizzes'),
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM attempts'),
      pool.query('SELECT COUNT(*)::int AS count FROM feedback'),
      pool.query(`
        SELECT id, title, level, total_questions, marks_per_question, created_at
        FROM quizzes
        ORDER BY created_at DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT u.username, q.title, a.score, a.total_marks, a.attempted_at
        FROM attempts a
        JOIN users u ON u.id = a.user_id
        JOIN quizzes q ON q.id = a.quiz_id
        ORDER BY a.attempted_at DESC
        LIMIT 5
      `),
      pool.query(`
        SELECT u.username,
               COUNT(a.id) AS attempts,
               COALESCE(MAX(a.score), 0) AS best_score,
               COALESCE(AVG(a.score), 0) AS average_score
        FROM users u
        LEFT JOIN attempts a ON a.user_id = u.id
        GROUP BY u.id, u.username
        ORDER BY average_score DESC, attempts DESC
        LIMIT 5
      `),
    ]);

    res.render("admin", {
      user: req.session.user?.username || "Admin",
      dashboard: {
        quizzes: quizCountResult.rows[0].count,
        users: userCountResult.rows[0].count,
        attempts: attemptCountResult.rows[0].count,
        feedbacks: feedbackCountResult.rows[0].count,
      },
      recentQuizzes: recentQuizzesResult.rows,
      recentAttempts: recentAttemptsResult.rows,
      topPerformers: topPerformersResult.rows,
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });

  } catch (error) {
    console.error("❌ Error loading admin dashboard:", error.message);
    req.flash("error", "Failed to load admin dashboard.");
    res.redirect("/");
  }
};

// Todo : Add dynamic updation of participation and manuly update marks

export const addParticipants = (req, res) => {
  (async () => {
    try {
      const q = (req.query.q || '').trim();
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const perPage = 10;
      const offset = (page - 1) * perPage;

      let where = "WHERE u.role = 'user'";
      const params = [];

      if (q) {
        params.push(`%${q}%`);
        where += ` AND u.username ILIKE $${params.length}`;
      }

      // participants with aggregated best score and attempts count
      const sql = `
        SELECT u.id, u.username, COALESCE(MAX(a.score),0)::int AS best_score, COUNT(a.id)::int AS attempts
        FROM users u
        LEFT JOIN attempts a ON a.user_id = u.id
        ${where}
        GROUP BY u.id, u.username
        ORDER BY u.id DESC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}
      `;

      params.push(perPage);
      params.push(offset);

      const result = await pool.query(sql, params);

      // total count for pagination
      const countSql = `SELECT COUNT(*)::int AS count FROM users u ${where}`;
      const countRes = await pool.query(countSql, params.slice(0, params.length - 2));
      const total = countRes.rows[0]?.count || 0;

      res.render('add_participants', {
        user: req.session.user?.username || 'Admin',
        participants: result.rows,
        page,
        perPage,
        total,
        q,
        success: req.flash('success') || [],
        error: req.flash('error') || []
      });
    } catch (err) {
      console.error('Error loading participants', err.message);
      req.flash('error', 'Failed to load participants.');
      res.redirect('/admin');
    }
  })();
}

export const createParticipant = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.flash('error', '❌ Username and password are required.');
    return res.redirect('/admin/participants');
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE username = $1', [username.trim()]);
    if (exists.rows.length > 0) {
      req.flash('error', '❌ Username already exists.');
      return res.redirect('/admin/participants');
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password, role) VALUES ($1, $2, $3)', [username.trim(), hashed, 'user']);

    req.flash('success', '✅ Participant added successfully.');
    res.redirect('/admin/participants');
  } catch (err) {
    console.error('❌ Error adding participant:', err.message);
    req.flash('error', '❌ Failed to add participant.');
    res.redirect('/admin/participants');
  }
};

export const deleteParticipant = async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    req.flash('success', '✅ Participant removed.');
    res.redirect('/admin/participants');
  } catch (err) {
    console.error('❌ Error deleting participant:', err.message);
    req.flash('error', '❌ Failed to delete participant.');
    res.redirect('/admin/participants');
  }
};

export const admin_quiz_setup = async (req, res) => {
  res.render("adminQuizSetup", {
    user: req.session.user?.username || "Admin",
    success: req.flash("success") || [],
    error: req.flash("error") || [],
  });
};


export const render_create_quiz_form = (req, res) => {
  const hasCount = Object.prototype.hasOwnProperty.call(req.query, 'count');
  const hasMarks = Object.prototype.hasOwnProperty.call(req.query, 'marks');

  // First visit: show setup form (no validation yet).
  if (!hasCount && !hasMarks) {
    return res.render("adminQuizSetup", {
      user: req.session.user?.username || "Admin",
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });
  }

  const count = parseInt(req.query.count, 10);
  const marks = parseInt(req.query.marks, 10);

  if (!count || !marks || Number.isNaN(count) || Number.isNaN(marks)) {
    return res.render("adminQuizSetup", {
      user: req.session.user?.username || "Admin",
      success: req.flash('success') || [],
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
      SELECT a.id, a.score, a.total_marks, a.attempted_at AS started_at, a.completed_at, u.username
      FROM attempts a
      JOIN users u ON a.user_id = u.id
      WHERE a.quiz_id = $1
      ORDER BY a.attempted_at DESC NULLS LAST
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

// Leaderboard: overall top performers by average score
export const leaderboard = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.username,
             COUNT(a.id) AS attempts,
             COALESCE(MAX(a.score),0)::int AS best_score,
             COALESCE(ROUND(AVG(a.score)::numeric,2),0) AS avg_score
      FROM users u
      JOIN attempts a ON a.user_id = u.id
      GROUP BY u.id, u.username
      ORDER BY avg_score DESC, best_score DESC
      LIMIT 50
    `);

    res.render('adminLeaderboard', { user: req.session.user?.username || 'Admin', leaders: result.rows, success: req.flash('success') || [], error: req.flash('error') || [] });
  } catch (err) {
    console.error('Error loading leaderboard', err.message);
    req.flash('error', 'Failed to load leaderboard.');
    res.redirect('/admin');
  }
};

// Per-question detailed report for a quiz
export const quizDetailReport = async (req, res) => {
  const quizId = req.params.id;
  try {
    const quizRes = await pool.query('SELECT id, title FROM quizzes WHERE id = $1', [quizId]);
    if (quizRes.rows.length === 0) {
      req.flash('error', 'Quiz not found.');
      return res.redirect('/admin');
    }

    const questionsRes = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = $1 ORDER BY id ASC', [quizId]);
    const questions = questionsRes.rows;

    // For each question, compute selection counts from responses
    const stats = [];
    for (const q of questions) {
      const r = await pool.query(
        `SELECT selected_option, COUNT(*)::int AS count FROM responses WHERE question_id = $1 GROUP BY selected_option`,
        [q.id]
      );

      const counts = { A:0, B:0, C:0, D:0 };
      r.rows.forEach(row => { if (row.selected_option) counts[row.selected_option.toUpperCase()] = row.count; });
      const total = counts.A + counts.B + counts.C + counts.D;
      stats.push({ question: q, counts, total });
    }

    res.render('adminQuizDetail', { user: req.session.user?.username || 'Admin', quiz: quizRes.rows[0], stats, success: req.flash('success') || [], error: req.flash('error') || [] });

  } catch (err) {
    console.error('Error loading quiz detail report', err.message);
    req.flash('error', 'Failed to load quiz report.');
    res.redirect('/admin');
  }
};

// Export per-question report as CSV
export const quizDetailExport = async (req, res) => {
  const quizId = req.params.id;
  try {
    const quizRes = await pool.query('SELECT id, title FROM quizzes WHERE id = $1', [quizId]);
    if (quizRes.rows.length === 0) {
      req.flash('error', 'Quiz not found.');
      return res.redirect('/admin');
    }

    const questionsRes = await pool.query('SELECT id, question_text, option_a, option_b, option_c, option_d, correct_option FROM questions WHERE quiz_id = $1 ORDER BY id ASC', [quizId]);
    const questions = questionsRes.rows;

    // Build CSV header
    const header = 'question_id,question_text,option_a,option_b,option_c,option_d,correct_option,count_A,count_B,count_C,count_D,total,most_chosen\n';
    const rows = [];

    for (const q of questions) {
      const r = await pool.query(
        `SELECT selected_option, COUNT(*)::int AS count FROM responses WHERE question_id = $1 GROUP BY selected_option`,
        [q.id]
      );
      const counts = { A:0, B:0, C:0, D:0 };
      r.rows.forEach(row => { if (row.selected_option) counts[row.selected_option.toUpperCase()] = row.count; });
      const total = counts.A + counts.B + counts.C + counts.D;
      const max = Math.max(counts.A, counts.B, counts.C, counts.D);
      let most = '';
      if (max > 0) {
        if (counts.A === max) most = 'A'; else if (counts.B === max) most = 'B'; else if (counts.C === max) most = 'C'; else most = 'D';
      }

      // Escape quotes in question text
      const qtext = (q.question_text || '').replace(/"/g, '""');
      const line = `${q.id},"${qtext}","${(q.option_a||'').replace(/"/g,'""')}","${(q.option_b||'').replace(/"/g,'""')}","${(q.option_c||'').replace(/"/g,'""')}","${(q.option_d||'').replace(/"/g,'""')}",${q.correct_option||''},${counts.A},${counts.B},${counts.C},${counts.D},${total},${most}`;
      rows.push(line);
    }

    const csv = header + rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="quiz_${quizId}_report.csv"`);
    res.send(csv);

  } catch (err) {
    console.error('Error exporting quiz report', err.message);
    req.flash('error', 'Failed to export quiz report.');
    res.redirect(`/admin/quiz/${quizId}/detail`);
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

// --- AI Question Generation (Admin) ---
export const render_generate_questions = async (req, res) => {
  try {
    res.render('adminGenerateQuestions', {
      user: req.session.user?.username || 'Admin',
      success: req.flash('success') || [],
      error: req.flash('error') || []
    });
  } catch (err) {
    console.error('Error rendering generate questions form', err.message);
    req.flash('error', 'Failed to open generator.');
    res.redirect('/admin');
  }
};

export const generate_questions = async (req, res) => {
  const { topic, count = 5, difficulty = 'medium', title } = req.body;
  const num = Math.max(1, Math.min(50, parseInt(count, 10) || 5));

  if (!topic || !title) {
    req.flash('error', 'Please provide a title and a topic for generation.');
    return res.redirect('/admin/generate-questions');
  }

  // Helper: simple fallback generator
  const simpleGenerator = (t, n, diff) => {
    const qs = [];
    for (let i = 0; i < n; i++) {
      const q = {
        question: `${t} question ${i + 1} (${diff})`,
        options: [
          `Option A for ${i + 1}`,
          `Option B for ${i + 1}`,
          `Option C for ${i + 1}`,
          `Option D for ${i + 1}`
        ],
        correct: ['A','B','C','D'][i % 4]
      };
      qs.push(q);
    }
    return qs;
  };

  try {
    let questions = [];

    if (!process.env.OPENAI_API_KEY) {
      // No API key: use fallback generator
      questions = simpleGenerator(topic, num, difficulty);
    } else {
      // Call OpenAI Chat Completions to generate JSON array of questions
      const prompt = `Generate ${num} multiple choice questions about ${topic}. Respond ONLY with a JSON array of objects with keys: question, options (array of 4), correct (one of A,B,C,D). Keep difficulty: ${difficulty}.`;

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that outputs strictly JSON.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await resp.json();
      const text = data?.choices?.[0]?.message?.content || '';

      // Try to extract JSON from response
      const m = text.match(/\[\s*\{[\s\S]*\}\s*\]/m);
      const jsonText = m ? m[0] : text;
      try {
        questions = JSON.parse(jsonText);
      } catch (parseErr) {
        console.error('Failed to parse AI JSON, falling back to simple generator', parseErr.message);
        questions = simpleGenerator(topic, num, difficulty);
      }
    }

    // Persist: create a new quiz and insert generated questions
    await pool.query('BEGIN');
    const quizRes = await pool.query(
      `INSERT INTO quizzes (title, description, level, total_questions, marks_per_question, created_by, tier) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [title.trim(), `AI generated questions on ${topic}`, difficulty, questions.length, 1, req.session.user?.id || null, 2]
    );
    const quizId = quizRes.rows[0].id;

    const insertQuery = `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, ai_generated) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

    for (const q of questions) {
      const opts = q.options || [];
      const correct = (q.correct || 'A').toUpperCase();
      await pool.query(insertQuery, [quizId, q.question, opts[0] || '', opts[1] || '', opts[2] || '', opts[3] || '', correct, difficulty, true]);
    }

    await pool.query('COMMIT');
    req.flash('success', `✅ Generated and saved ${questions.length} questions under quiz: ${title}`);
    res.redirect('/admin');
  } catch (err) {
    await pool.query('ROLLBACK').catch(()=>{});
    console.error('Error generating questions:', err.message);
    req.flash('error', 'Failed to generate questions: ' + err.message);
    res.redirect('/admin/generate-questions');
  }
};
