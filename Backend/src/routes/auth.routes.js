const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const {
  authLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter.middleware");

// ── Public Routes (with rate limiting protection) ─────────────────────────────
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/google", authLimiter, authController.googleLogin);
router.post("/refresh", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", forgotPasswordLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);

// ── Protected Routes ──────────────────────────────────────────────────────────
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
