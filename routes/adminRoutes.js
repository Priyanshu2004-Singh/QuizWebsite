// routes/adminRoutes.js
import express from 'express';
import flash from 'connect-flash';
import pool from '../db/db.js';

import {
  adminDashboard,
  addParticipants,
  createParticipant,
  render_create_quiz_form,
  create_quiz,
  render_generate_questions,
  generate_questions,
  leaderboard,
  quizDetailReport,
  quizDetailExport,
  quizHistory,
  checkQuizEvaluation,
  render_check_quiz,
  render_feedbacks,
  deleteParticipant,
  delete_feedback
} from '../controllers/adminController.js';

import { ensureAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(flash());

router.get('/admin', ensureAdmin, adminDashboard);

router.get('/admin/participants', ensureAdmin, addParticipants);

// Add / delete participants
router.post('/admin/participants', ensureAdmin, createParticipant);
router.post('/admin/participants/delete/:id', ensureAdmin, deleteParticipant);
// export participants CSV
router.get('/admin/participants/export', ensureAdmin, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const params = [];
    let where = "WHERE u.role = 'user'";
    if (q) {
      params.push(`%${q}%`);
      where += ` AND u.username ILIKE $${params.length}`;
    }

    const sql = `SELECT u.id, u.username, COALESCE(MAX(a.score),0)::int AS best_score, COUNT(a.id)::int AS attempts FROM users u LEFT JOIN attempts a ON a.user_id=u.id ${where} GROUP BY u.id, u.username ORDER BY u.id DESC`;
    const result = await pool.query(sql, params);

    // CSV
    const rows = result.rows;
    const header = 'id,username,best_score,attempts\n';
    const body = rows.map(r => `${r.id},"${r.username}",${r.best_score},${r.attempts}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="participants.csv"');
    res.send(header + body);
  } catch (err) {
    console.error('export participants failed', err.message);
    req.flash('error', 'Failed to export participants.');
    res.redirect('/admin/participants');
  }
});

// Step 1: Quiz Setup Form
router.get('/admin/create-quiz', ensureAdmin, render_create_quiz_form);

// AI question generator UI + action
router.get('/admin/generate-questions', ensureAdmin, render_generate_questions);
router.post('/admin/generate-questions', ensureAdmin, generate_questions);
 
// Leaderboard and per-quiz detail
router.get('/admin/leaderboard', ensureAdmin, leaderboard);
router.get('/admin/quiz/:id/detail', ensureAdmin, quizDetailReport);
router.get('/admin/quiz/:id/detail/export', ensureAdmin, quizDetailExport);

// Step 2: Final Quiz Submission
router.post('/admin/create-quiz', ensureAdmin, create_quiz);
//history of created quiz
router.get('/admin/history', ensureAdmin, quizHistory);

router.get('/admin/results', ensureAdmin, render_check_quiz);
router.get('/admin/quiz/:id/result', ensureAdmin, checkQuizEvaluation);

// Admin feedback checks : and delete 
router.get("/admin/feedbacks", ensureAdmin, render_feedbacks);
router.post("/admin/feedbacks/delete/:id", ensureAdmin, delete_feedback);
export default router;
