// server.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const basicAuth = require("express-basic-auth");

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" })); // giới hạn size

const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;
const LOG_FILE = process.env.LOG_FILE || "./messages.log";
const BOT_NAME = process.env.BOT_NAME || "Website-Bot";

// Rate limiter cho endpoint submit
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000"), // 1 phút
  max: parseInt(process.env.RATE_LIMIT_MAX || "10"),
  message: { error: "Quá nhiều yêu cầu, thử lại sau." },
});
app.use("/api/submit", limiter);

// Helper: append JSON line vào file log
async function appendLog(obj) {
  try {
    const line = JSON.stringify(obj, Object.keys(obj)) + "\n";
    await fs.appendFile(path.resolve(LOG_FILE), line, "utf8");
  } catch (err) {
    console.error("Ghi log thất bại", err);
  }
}

// Endpoint nhận form
app.post(
  "/api/submit",
  [
    // Validation & sanitization
    body("name")
      .trim()
      .isLength({ max: 150 })
      .escape()
      .optional({ nullable: true, checkFalsy: true }),
    body("email")
      .trim()
      .optional({ checkFalsy: true })
      .isEmail()
      .normalizeEmail(),
    body("message").trim().isLength({ min: 1, max: 5000 }).escape(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ ok: false, errors: errors.array() });
      }

      const { name, email, message } = req.body;
      const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
      const now = new Date().toISOString();

      // Build record để lưu
      const record = {
        name: name || "",
        email: email || "",
        message,
        ip,
        created_at: now,
      };

      // 1) Lưu log (file) — thay bằng DB nếu muốn
      await appendLog(record);

      // 2) Chuẩn bị payload gửi qua Discord webhook
      // Discord embed fields giới hạn 1024 chars; mình cắt message nếu dài.
      const maxEmbedField = 1024;
      const safeMsg =
        message.length > maxEmbedField
          ? message.slice(0, maxEmbedField - 3) + "..."
          : message;

      const discordPayload = {
        username: BOT_NAME,
        embeds: [
          {
            title: "📩 Tin nhắn mới từ website",
            fields: [
              { name: "Tên", value: name || "—", inline: true },
              { name: "Email", value: email || "—", inline: true },
              { name: "IP", value: ip, inline: true },
              { name: "Nội dung", value: safeMsg },
            ],
            timestamp: now,
          },
        ],
      };

      // 3) Gửi tới Discord (nếu webhook cấu hình)
      if (!WEBHOOK) {
        console.warn("WEBHOOK chưa cấu hình, chỉ lưu log.");
      } else {
        // Gửi POST tới webhook
        try {
          await axios.post(WEBHOOK, discordPayload, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          // Nếu webhook lỗi, ta vẫn trả lại success nhưng log lỗi
          console.error(
            "Gửi webhook lỗi:",
            err.response?.status,
            err.response?.data || err.message
          );
        }
      }

      return res.json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  }
);

// Admin route - basic auth
app.use(
  "/admin",
  basicAuth({
    users: {
      [process.env.ADMIN_USER || "admin"]: process.env.ADMIN_PASS || "password",
    },
    challenge: true,
  })
);

// Xem log messages (admin)
app.get("/admin/messages", async (req, res) => {
  try {
    const raw = await fs
      .readFile(path.resolve(LOG_FILE), "utf8")
      .catch(() => "");
    const lines = raw.trim().split("\n").filter(Boolean);
    // trả về mấy dòng mới nhất (ví dụ 200)
    const lastLines = lines
      .slice(-200)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch (e) {
          return { raw: l };
        }
      })
      .reverse(); // newest first
    res.json({ ok: true, count: lastLines.length, data: lastLines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Cannot read logs" });
  }
});

const PORT = parseInt(process.env.PORT || "3000");
app.listen(PORT, () => console.log(`Server chạy port ${PORT}`));
