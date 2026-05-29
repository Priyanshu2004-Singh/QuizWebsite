import express from "express";
import {ensureAuthenticated} from '../middleware/auth.js'
import { getAllQuizzes ,renderFeedbackForm,submitFeedback,submitQuiz,takeQuiz, userResult } from "../controllers/quizController.js";

const router = express.Router();
router.get("/quiz", ensureAuthenticated, getAllQuizzes);
router.get("/quiz/:id", ensureAuthenticated, takeQuiz);
router.get("/user/quiz/:id", ensureAuthenticated, takeQuiz);
router.post("/user/submit-quiz/:id", ensureAuthenticated, submitQuiz);
router.get('/feedback/:quizId', ensureAuthenticated, renderFeedbackForm);
router.post('/feedback/:quizId', ensureAuthenticated, submitFeedback);
router.get('/user/results', ensureAuthenticated, userResult)
export default router;
