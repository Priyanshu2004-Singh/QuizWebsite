import express from "express";
import {
  showLogin,
  login,
  showRegister,
  register,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

// Auth pages
router.get("/login", showLogin);
router.post("/login", login);

router.get("/register", showRegister);
router.post("/register", register);

// Protected logout
router.get("/logout", logout);

export default router;
