import pool from '../db/db.js';

export const homePage = async (req, res) => {
  try {
    const [quizCountResult, userCountResult, attemptCountResult, featuredQuizzesResult] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM quizzes'),
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM attempts'),
      pool.query(`
        SELECT id, title, description, level, total_questions, marks_per_question
        FROM quizzes
        ORDER BY created_at DESC
        LIMIT 6
      `),
    ]);

    res.render("home", {
      user: req.session.user?.username || null,
      stats: {
        quizzes: quizCountResult.rows[0].count,
        users: userCountResult.rows[0].count,
        attempts: attemptCountResult.rows[0].count,
      },
      featuredQuizzes: featuredQuizzesResult.rows,
    });
  } catch (error) {
    console.error('Error loading home page:', error.message);
    res.render("home", {
      user: req.session.user?.username || null,
      stats: { quizzes: 0, users: 0, attempts: 0 },
      featuredQuizzes: [],
    });
  }
};

