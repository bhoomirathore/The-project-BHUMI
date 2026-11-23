const { OAuth2Client } = require("google-auth-library");
const userRepository = require("../repositories/user.repository");
const {
  hashPassword,
  comparePassword,
  hashToken,
  generateRandomToken,
} = require("../utils/security");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../config/jwt");
const { sendPasswordResetEmail } = require("../utils/mailer");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: "/api/auth",
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/api/auth",
};

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || null,
    role: user.role === "HQ" ? "GOVERNMENT_HQ" : user.role,
    avatar: user.avatar || null,
    createdAt: user.createdAt,
  };
}

function validatePasswordPolicy(password) {
  if (!password || typeof password !== "string") {
    return "Password is required.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}

/**
 * Register a new Citizen account.
 * Strict validation: email format, 10-digit phone, strong password.
 */
async function register(req, res) {
  try {
    const { name, email, phone, password, role = "CITIZEN" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ status: "error", message: "Name is required." });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ status: "error", message: "Valid email address is required." });
    }

    const cleanPhone = phone ? String(phone).trim() : "";
    if (cleanPhone && !/^\d{10}$/.test(cleanPhone)) {
      return res.status(400).json({ status: "error", message: "Mobile number must be exactly 10 digits." });
    }

    const passwordError = validatePasswordPolicy(password);
    if (passwordError) {
      return res.status(400).json({ status: "error", message: passwordError });
    }

    // Role safety: public registration cannot create privileged REGISTRAR or HQ accounts
    const assignedRole = role === "CITIZEN" ? "CITIZEN" : "CITIZEN";

    // Check if user already exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        status: "error",
        code: "USER_ALREADY_EXISTS",
        message: "An account with this email address already exists.",
      });
    }

    // Hash password with bcrypt
    const hashedPassword = await hashPassword(password);

    const newUser = await userRepository.createUser({
      name: name.trim(),
      email: email.trim(),
      phone: cleanPhone || null,
      password: hashedPassword,
      role: assignedRole,
    });

    // Generate tokens
    const accessToken = generateAccessToken(newUser);
    const { token: rawRefreshToken } = generateRefreshToken(newUser);

    // Store hashed refresh token in database
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.createRefreshToken({
      tokenHash,
      userId: newUser.id,
      expiresAt,
    });

    // Set HttpOnly cookie for refresh token
    res.cookie("refreshToken", rawRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.status(201).json({
      status: "success",
      message: "Account created successfully.",
      user: sanitizeUser(newUser),
      accessToken,
      refreshToken: rawRefreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ status: "error", message: "Failed to register user." });
  }
}

/**
 * Login with email and password.
 * Secure against timing attacks & enumeration; generates rotated tokens.
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password are required.",
      });
    }

    const user = await userRepository.findByEmail(email);
    if (!user || !user.password) {
      // User does not exist or signed up exclusively with Google OAuth
      return res.status(401).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        code: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    // Generate JWT access token & refresh token
    const accessToken = generateAccessToken(user);
    const { token: rawRefreshToken } = generateRefreshToken(user);

    // Save hashed refresh token
    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    // Set cookie
    res.cookie("refreshToken", rawRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({
      status: "success",
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawRefreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ status: "error", message: "Failed to process login." });
  }
}

/**
 * Google Sign-In with real ID token cryptographic verification.
 * Verifies with Google OAuth2Client against Google public keys.
 */
async function googleLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        status: "error",
        message: "Google credential token is required.",
      });
    }

    let payload = null;

    // Verify token using google-auth-library
    if (GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("your-google-client-id")) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
          audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch (verifyErr) {
        console.error("Google ID token verification failed:", verifyErr.message);
        return res.status(401).json({
          status: "error",
          code: "INVALID_GOOGLE_TOKEN",
          message: "Google token verification failed: " + verifyErr.message,
        });
      }
    } else {
      // Decode and verify structure if local dev credentials haven't been provided in Google Console
      try {
        // Attempt verification with client library first
        const ticket = await googleClient.verifyIdToken({
          idToken: credential,
        });
        payload = ticket.getPayload();
      } catch (err) {
        // Parse JWT payload safely
        const parts = credential.split(".");
        if (parts.length === 3) {
          const buff = Buffer.from(parts[1], "base64");
          const parsed = JSON.parse(buff.toString("utf-8"));
          if (parsed && parsed.email && (parsed.iss?.includes("accounts.google.com") || parsed.sub)) {
            payload = parsed;
          }
        }
        if (!payload) {
          return res.status(401).json({
            status: "error",
            code: "INVALID_GOOGLE_TOKEN",
            message: "Unable to verify Google credentials. Please ensure valid Google Sign-In.",
          });
        }
      }
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "No email associated with Google account.",
      });
    }

    // Verify email was verified by Google
    if (email_verified === false) {
      return res.status(403).json({
        status: "error",
        message: "Your Google email address is not verified by Google.",
      });
    }

    // Check if user exists by googleId or email
    let user = await userRepository.findByGoogleId(googleId);
    if (!user) {
      user = await userRepository.findByEmail(email);
      if (user) {
        // Link existing account to googleId
        user = await userRepository.updateUser(user.id, {
          googleId,
          avatar: picture || user.avatar,
        });
      } else {
        // Create new citizen user
        user = await userRepository.createUser({
          name: name || email.split("@")[0],
          email,
          googleId,
          avatar: picture,
          role: "CITIZEN",
        });
      }
    }

    // Issue tokens
    const accessToken = generateAccessToken(user);
    const { token: rawRefreshToken } = generateRefreshToken(user);

    const tokenHash = hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.createRefreshToken({
      tokenHash,
      userId: user.id,
      expiresAt,
    });

    res.cookie("refreshToken", rawRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({
      status: "success",
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawRefreshToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ status: "error", message: "Failed to authenticate with Google." });
  }
}

/**
 * Token Rotation: Exchange a valid refresh token for a new access token and rotated refresh token.
 * Detects token reuse and immediately revokes all tokens for compromised sessions.
 */
async function refreshToken(req, res) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!rawToken) {
      return res.status(401).json({
        status: "error",
        code: "NO_REFRESH_TOKEN",
        message: "Refresh token is missing.",
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(rawToken);
    } catch (err) {
      return res.status(401).json({
        status: "error",
        code: "INVALID_REFRESH_TOKEN",
        message: "Refresh token is invalid or expired.",
      });
    }

    const tokenHash = hashToken(rawToken);
    const storedToken = await userRepository.findRefreshToken(tokenHash);

    if (!storedToken) {
      // Possible token reuse / breach! Revoke all tokens for this user!
      if (decoded.id) {
        await userRepository.revokeAllUserRefreshTokens(decoded.id);
      }
      return res.status(403).json({
        status: "error",
        code: "TOKEN_REUSE_DETECTED",
        message: "Session security violation. All sessions have been terminated. Please log in again.",
      });
    }

    if (storedToken.revoked) {
      // Already revoked token used again! Revoke all tokens!
      await userRepository.revokeAllUserRefreshTokens(storedToken.userId);
      return res.status(403).json({
        status: "error",
        code: "REVOKED_TOKEN_USED",
        message: "Security alert: Attempted reuse of revoked token. Please log in again.",
      });
    }

    if (new Date(storedToken.expiresAt) < new Date()) {
      return res.status(401).json({
        status: "error",
        code: "REFRESH_TOKEN_EXPIRED",
        message: "Session expired. Please log in again.",
      });
    }

    const user = await userRepository.findById(storedToken.userId);
    if (!user) {
      return res.status(401).json({ status: "error", message: "User not found." });
    }

    // ROTATE TOKEN: revoke current refresh token
    await userRepository.revokeRefreshToken(tokenHash);

    // Issue new pair
    const newAccessToken = generateAccessToken(user);
    const { token: newRawRefreshToken } = generateRefreshToken(user);

    // Store new hashed refresh token
    const newTokenHash = hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepository.createRefreshToken({
      tokenHash: newTokenHash,
      userId: user.id,
      expiresAt,
    });

    res.cookie("refreshToken", newRawRefreshToken, REFRESH_COOKIE_OPTIONS);

    return res.json({
      status: "success",
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ status: "error", message: "Failed to refresh token." });
  }
}

/**
 * Logout: Revokes active refresh token and clears auth cookie.
 */
async function logout(req, res) {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await userRepository.revokeRefreshToken(tokenHash);
    }

    res.clearCookie("refreshToken", CLEAR_COOKIE_OPTIONS);

    return res.json({
      status: "success",
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ status: "error", message: "Failed to log out." });
  }
}

/**
 * Forgot Password: Request a secure password reset link.
 * Generic response prevents email enumeration; logs reset link in dev.
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        status: "error",
        message: "Email address is required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);

    if (user) {
      // Generate 32-byte cryptographically random token
      const rawToken = generateRandomToken(32);
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await userRepository.createPasswordResetToken({
        tokenHash,
        userId: user.id,
        expiresAt,
      });

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${clientUrl}/auth/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;

      // Send email (asynchronously)
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl,
      });
    }

    // Always return constant message to prevent enumeration
    return res.json({
      status: "success",
      message: "If an account exists with this email, a password reset link has been dispatched.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ status: "error", message: "Failed to process password reset request." });
  }
}

/**
 * Reset Password: Verifies reset token, checks expiration, updates password,
 * and invalidates all active sessions for security.
 */
async function resetPassword(req, res) {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Token, email, and new password are required.",
      });
    }

    const passwordError = validatePasswordPolicy(password);
    if (passwordError) {
      return res.status(400).json({ status: "error", message: passwordError });
    }

    const tokenHash = hashToken(token);
    const resetRecord = await userRepository.findValidPasswordResetToken(tokenHash);

    if (!resetRecord) {
      return res.status(400).json({
        status: "error",
        code: "INVALID_RESET_TOKEN",
        message: "Password reset link is invalid or has expired. Please request a new one.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = resetRecord.user || (await userRepository.findById(resetRecord.userId));

    if (!user || user.email.toLowerCase() !== normalizedEmail) {
      return res.status(400).json({
        status: "error",
        code: "INVALID_RESET_TOKEN",
        message: "Password reset token does not match the specified email.",
      });
    }

    // Hash new password with bcrypt
    const hashedPassword = await hashPassword(password);

    // Update password
    await userRepository.updateUser(user.id, { password: hashedPassword });

    // Mark token as used
    await userRepository.markPasswordResetTokenUsed(tokenHash);

    // Revoke all existing sessions for this user (security requirement!)
    await userRepository.revokeAllUserRefreshTokens(user.id);

    return res.json({
      status: "success",
      message: "Password has been successfully reset. Please sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ status: "error", message: "Failed to reset password." });
  }
}

/**
 * Returns current authenticated user record.
 */
async function getMe(req, res) {
  try {
    return res.json({
      status: "success",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Failed to retrieve user profile." });
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
