import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Config ────────────────────────────────────────────────────────────
const N8N_WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL ||
  "https://n8n.hamzasallam.online/webhook/horizonvista/api/send-message";

const N8N_USERNAME = process.env.N8N_USERNAME || "access_token";
const N8N_PASSWORD = process.env.N8N_PASSWORD || "cmpe412horizonVista";

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Chat proxy endpoint ──────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ error: "message must be a non-empty string" });
    }

    if (message.length > 2000) {
      return res
        .status(400)
        .json({ error: "message must be at most 2000 characters" });
    }

    const resolvedSessionId =
      sessionId && typeof sessionId === "string" && sessionId.length > 0
        ? sessionId
        : crypto.randomUUID();

    // Build Basic Auth header dynamically
    const authHeader = `Basic ${Buffer.from(`${N8N_USERNAME}:${N8N_PASSWORD}`).toString("base64")}`;

    const upstream = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: resolvedSessionId,
      }),
    });

    const rawText = await upstream.text();

    if (!upstream.ok) {
      console.error("n8n webhook failed", upstream.status, rawText);
      return res.status(502).json({
        error: `n8n webhook returned ${upstream.status}`,
        details: rawText.slice(0, 500),
      });
    }

    // Parse response — n8n typically returns JSON
    let parsed = null;
    try {
      parsed = rawText ? JSON.parse(rawText) : null;
    } catch {
      parsed = null;
    }

    const pick = (v) =>
      typeof v === "string" && v.trim().length > 0 ? v : null;

    const output =
      pick(parsed?.output) ??
      pick(parsed?.reply) ??
      pick(parsed?.answer) ??
      pick(parsed?.response) ??
      pick(parsed?.message) ??
      pick(rawText) ??
      "No response received.";

    return res.json({ output, sessionId: resolvedSessionId });
  } catch (err) {
    console.error("chat endpoint error:", err);
    const msg = err instanceof Error ? err.message : "Internal error";
    return res.status(500).json({ error: msg });
  }
});

// ── Health check ─────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ── Serve Vite build in production ───────────────────────────────────
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback — let React Router handle client-side routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ── Start ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ HorizonVista API server running on http://localhost:${PORT}`);
});
