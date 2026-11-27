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


// Root route — Live API Status Page for Presentation/Monitoring
app.get("/", async (req, res) => {
  let dbStatus = "Connected";
  let isConnected = true;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "Disconnected";
    isConnected = false;
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>B.H.U.M.I. API Server</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #FAF8F5;
            color: #221814;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background: #FFFFFF;
            border: 1px solid #E6E0D8;
            border-radius: 14px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 8px 24px rgba(34, 24, 20, 0.06);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 999px;
            background: ${isConnected ? "#ECFDF5" : "#FEF2F2"};
            color: ${isConnected ? "#047857" : "#B91C1C"};
            margin-bottom: 16px;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${isConnected ? "#10B981" : "#EF4444"};
          }
          h1 { margin: 0 0 8px; font-size: 24px; letter-spacing: 0.5px; }
          p { margin: 0 0 20px; color: #5C524B; font-size: 14px; line-height: 1.5; }
          .info {
            background: #FAF8F5;
            border-radius: 8px;
            padding: 14px;
            font-size: 13px;
            margin-bottom: 20px;
          }
          .row { display: flex; justify-content: space-between; padding: 4px 0; }
          .label { color: #786D65; }
          .val { font-weight: 600; }
          a {
            display: inline-block;
            text-decoration: none;
            background: #221814;
            color: #FFFFFF;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> API & Database ${dbStatus}</div>
          <h1>B.H.U.M.I. Backend API</h1>
          <p>Blockchain-Hosted Unified Mutation Infrastructure — REST API server is active and ready for requests.</p>
          <div class="info">
            <div class="row"><span class="label">Environment</span><span class="val">Development (Port ${process.env.PORT || 5000})</span></div>
            <div class="row"><span class="label">Database</span><span class="val">Neon PostgreSQL (Prisma ORM)</span></div>
            <div class="row"><span class="label">Storage Layer</span><span class="val">IPFS (Pinata) + AES-256</span></div>
            <div class="row"><span class="label">Version</span><span class="val">v1.0.0-alpha</span></div>
          </div>
          <a href="/api/health">Inspect JSON Health Endpoint &rarr;</a>
        </div>
      </body>
    </html>
  `);
});



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
