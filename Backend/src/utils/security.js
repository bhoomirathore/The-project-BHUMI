const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = 12;

/**
 * Hashes a plaintext password using bcrypt with salt rounds = 12.
 */
async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a bcrypt hash.
 */
async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Creates a SHA-256 hash of a token string (used for storing refresh & reset tokens).
 * Ensures tokens stored in database are never stored in plaintext.
 */
function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Generates a high-entropy random hexadecimal token string.
 */
function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

module.exports = {
  hashPassword,
  comparePassword,
  hashToken,
  generateRandomToken,
};
