// routes/adminRoutes.js
import express from 'express';
import flash from 'connect-flash';
import {
  adminDashboard,
  addParticipants,
  render_create_quiz_form,
  create_quiz,
  quizHistory,
  checkQuizEvaluation,
  render_check_quiz,
  render_feedbacks,
  delete_feedback
} from '../controllers/adminController.js';

import { ensureAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(flash());

router.get('/admin', ensureAdmin, adminDashboard);

router.get('/admin/participants', ensureAdmin, addParticipants);

// Step 1: Quiz Setup Form
router.get('/admin/create-quiz', ensureAdmin, render_create_quiz_form);

// Step 2: Final Quiz Submission
router.post('/admin/create-quiz', ensureAdmin, create_quiz);
//history of created quiz
router.get('/admin/history', ensureAdmin, quizHistory);

router.get('/admin/results', ensureAdmin, render_check_quiz);
router.get('/admin/quiz/:id/result', ensureAdmin, checkQuizEvaluation);

// Admin feedback checks : and delete 
router.get("/admin/feedbacks", render_feedbacks,ensureAdmin);
router.post("/admin/feedbacks/delete/:id", delete_feedback,ensureAdmin);
export default router;
