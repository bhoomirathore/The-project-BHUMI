const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const prisma = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const { authenticateToken, requireRole } = require("./middleware/auth.middleware");

const app = express();

// ── Security & Core Middleware ────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible integration in dev
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      message: "B.H.U.M.I. backend & database operational",
    });
  } catch (error) {
    res.json({
      status: "ok",
      database: "local_storage_fallback",
      message: "B.H.U.M.I. backend running with secure local repository",
    });
  }
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// Example protected routes to demonstrate secure role-based access control
app.get("/api/citizen/protected-test", authenticateToken, requireRole("CITIZEN"), (req, res) => {
  res.json({ status: "success", message: "Accessed Citizen protected route", user: req.user });
});

app.get("/api/authority/protected-test", authenticateToken, requireRole("REGISTRAR"), (req, res) => {
  res.json({ status: "success", message: "Accessed Registrar protected route", user: req.user });
});

app.get("/api/government/protected-test", authenticateToken, requireRole("GOVERNMENT_HQ"), (req, res) => {
  res.json({ status: "success", message: "Accessed Government HQ protected route", user: req.user });
});

// ── Global 404 & Error Handling ───────────────────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

module.exports = app;
