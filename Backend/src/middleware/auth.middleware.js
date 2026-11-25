const { verifyAccessToken } = require("../config/jwt");
const userRepository = require("../repositories/user.repository");

/**
 * Middleware: Verifies JWT access token in Authorization header or cookie.
 * Populates req.user with the verified user record.
 */
async function authenticateToken(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers["authorization"] || req.headers["Authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "Authentication required. No token provided.",
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "error",
          code: "TOKEN_EXPIRED",
          message: "Access token has expired. Please refresh your session.",
        });
      }
      return res.status(401).json({
        status: "error",
        code: "INVALID_TOKEN",
        message: "Invalid authentication token.",
      });
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: "USER_NOT_FOUND",
        message: "User account associated with this token no longer exists.",
      });
    }

    // Attach user (without password) to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role === "HQ" ? "GOVERNMENT_HQ" : user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal authentication error.",
    });
  }
}

/**
 * Middleware: Enforces user role permissions.
 * Supports CITIZEN, REGISTRAR, HQ (or GOVERNMENT_HQ).
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    // Normalize roles (HQ <-> GOVERNMENT_HQ)
    const normalizedAllowed = allowedRoles.map((r) =>
      r === "HQ" || r === "GOVERNMENT_HQ" ? ["HQ", "GOVERNMENT_HQ"] : [r]
    ).flat();

    const userRole = req.user.role;
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        status: "error",
        code: "FORBIDDEN",
        message: "Forbidden: You do not have permission to access this resource.",
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole,
};
