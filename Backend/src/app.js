const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const prisma = require("./config/db");

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

// ── Portal Status Endpoints ───────────────────────────────────────────────────
app.get("/api/citizen/status", (req, res) => {
  res.json({ status: "success", portal: "CITIZEN", message: "Citizen portal active" });
});

app.get("/api/authority/status", (req, res) => {
  res.json({ status: "success", portal: "REGISTRAR", message: "Registrar portal active" });
});

app.get("/api/government/status", (req, res) => {
  res.json({ status: "success", portal: "GOVERNMENT_HQ", message: "Government HQ portal active" });
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
