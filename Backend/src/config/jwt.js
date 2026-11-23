const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_SECRET =
  process.env.JWT_SECRET || "bhumi_jwt_super_secret_access_key_2026_dev_fallback";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "bhumi_jwt_super_secret_refresh_key_2026_dev_fallback";

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRY || "7d";

/**
 * Generate a short-lived access token containing user identity and role.
 */
function generateAccessToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
}

/**
 * Generate a cryptographically signed refresh token with unique jti identifier.
 */
function generateRefreshToken(user) {
  const jti = crypto.randomUUID();
  const payload = {
    id: user.id,
    jti,
  };
  return {
    token: jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN }),
    jti,
  };
}

/**
 * Verify access token. Returns payload or throws JsonWebTokenError/TokenExpiredError.
 */
function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

/**
 * Verify refresh token. Returns payload or throws.
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_EXPIRES_IN,
  REFRESH_EXPIRES_IN,
};
