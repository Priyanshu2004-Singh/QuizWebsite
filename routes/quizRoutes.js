import express from "express";
import {ensureAuthenticated} from '../middleware/auth.js'
import { getAllQuizzes ,renderFeedbackForm,submitFeedback,submitQuiz,takeQuiz, userResult } from "../controllers/quizController.js";

const router = express.Router();
router.get("/quiz", getAllQuizzes,ensureAuthenticated);
router.get("/user/quiz/:id", takeQuiz,ensureAuthenticated);
router.post("/user/submit-quiz/:id", ensureAuthenticated,submitQuiz);
router.get('/feedback/:quizId',renderFeedbackForm);
router.post('/feedback/:quizId',submitFeedback);
router.get('/user/results',userResult,ensureAuthenticated)
export default router;
