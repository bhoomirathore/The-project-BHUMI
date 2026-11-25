const rateLimit = require("express-rate-limit");

/**
 * Rate limiter for sensitive auth endpoints (Login, Register, Forgot Password, Reset Password)
 * Restricts to 15 requests per 15 minutes per IP to block brute-force and credential stuffing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: "error",
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

/**
 * Rate limiter specifically for password reset requests
 * 5 attempts per 15 minutes per IP
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many password reset requests. Please check your inbox or try again in 15 minutes.",
  },
});

/**
 * General API rate limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  forgotPasswordLimiter,
  generalLimiter,
};
