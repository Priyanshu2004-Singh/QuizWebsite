import express from "express";
import {
  showLogin,
  login,
  showRegister,
  register,
  logout,
  showForgot,
  handleForgot,
  showResetForm,
  handleReset
} from "../controllers/authController.js";

const router = express.Router();

// Auth pages
router.get("/login", showLogin);
router.post("/login", login);

router.get("/register", showRegister);
router.post("/register", register);

// Protected logout
router.get("/logout", logout);

// Password reset flow
router.get('/forgot', showForgot);
router.post('/forgot', handleForgot);
router.get('/reset/:token', showResetForm);
router.post('/reset/:token', handleReset);

export default router;
