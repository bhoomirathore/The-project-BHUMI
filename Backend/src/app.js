const express = require("express");
const cors = require("cors");
const prisma = require("./config/db");

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// ── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      message: "B.H.U.M.I. backend & PostgreSQL are running",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: error.message,
    });
  }
});

// ── Future Routes (placeholders) ──────────────────────────────────────────────
// app.use("/api/auth",       require("./routes/auth.routes"));
// app.use("/api/citizen",    require("./routes/citizen.routes"));
// app.use("/api/registrar",  require("./routes/registrar.routes"));
// app.use("/api/hq",         require("./routes/hq.routes"));

module.exports = app;
