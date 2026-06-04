// ─────────────────────────────────────────────
//  INSIDER THREAT ALERT SYSTEM — server.js
// ─────────────────────────────────────────────
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ── Email Transporter (Gmail) ─────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASSWORD,
  },
});

// ── Mock Employee Database ────────────────────
const employees = [
  { id: "EMP001", name: "Alice Johnson",   dept: "Finance",    riskScore: 92, riskLevel: "CRITICAL", activities: ["Downloaded 4.2GB at 2AM", "Accessed restricted payroll DB", "USB drive inserted 3x today"] },
  { id: "EMP002", name: "Bob Martinez",    dept: "IT",         riskScore: 78, riskLevel: "HIGH",     activities: ["Multiple failed login attempts", "VPN from unusual location", "Accessed 47 files in 10 mins"] },
  { id: "EMP003", name: "Carol Singh",     dept: "Engineering",riskScore: 45, riskLevel: "MEDIUM",   activities: ["Late night login", "Shared files externally"] },
  { id: "EMP004", name: "David Chen",      dept: "HR",         riskScore: 12, riskLevel: "LOW",      activities: ["Normal activity patterns"] },
  { id: "EMP005", name: "Eva Patel",       dept: "Sales",      riskScore: 88, riskLevel: "CRITICAL", activities: ["Mass email to personal account", "Customer DB export (12,000 records)", "Resignation letter draft detected"] },
];

// ── Routes ────────────────────────────────────

// Serve dashboard
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all employees
app.get("/api/employees", (req, res) => {
  res.json(employees);
});

// Trigger alert for a specific employee
app.post("/api/alert", async (req, res) => {
  const { employeeId } = req.body;
  const employee = employees.find((e) => e.id === employeeId);

  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found" });
  }

  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // ── Build the Email ───────────────────────
  const mailOptions = {
    from: `"🚨 ThreatGuard AI" <${process.env.SENDER_EMAIL}>`,
    to: process.env.SECURITY_TEAM_EMAIL,
    subject: `🚨 CRITICAL RISK ALERT — ${employee.name} [${employee.id}]`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #e2e8f0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #0f0f1a; border: 1px solid #ef4444; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #7f1d1d, #991b1b); padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; color: #fca5a5; letter-spacing: 2px; }
    .badge { display: inline-block; background: #ef4444; color: white; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: bold; margin-top: 8px; }
    .body { padding: 30px; }
    .score-box { background: #1a0a0a; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .score-number { font-size: 56px; font-weight: 900; color: #ef4444; line-height: 1; }
    .score-label { color: #9ca3af; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .info-item { background: #1a1a2e; border-radius: 6px; padding: 12px 16px; }
    .info-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
    .info-value { font-size: 16px; font-weight: 600; color: #f1f5f9; margin-top: 3px; }
    .activities { margin-bottom: 24px; }
    .activities h3 { color: #fca5a5; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .activity-item { background: #1a1a2e; border-left: 3px solid #ef4444; padding: 10px 14px; margin-bottom: 8px; border-radius: 0 4px 4px 0; font-size: 14px; }
    .cta { background: #ef4444; color: white; text-align: center; padding: 16px; border-radius: 6px; font-size: 16px; font-weight: bold; letter-spacing: 1px; cursor: pointer; }
    .footer { background: #070710; padding: 16px; text-align: center; font-size: 11px; color: #4b5563; border-top: 1px solid #1f2937; }
    .timestamp { color: #6b7280; font-size: 12px; text-align: center; margin-top: 16px; }
  </style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>⚠ INSIDER THREAT DETECTED</h1>
    <div class="badge">CRITICAL RISK — IMMEDIATE ACTION REQUIRED</div>
  </div>
  <div class="body">
    <div class="score-box">
      <div class="score-number">${employee.riskScore}</div>
      <div class="score-label">Risk Score / 100</div>
    </div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Employee</div>
        <div class="info-value">${employee.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Employee ID</div>
        <div class="info-value">${employee.id}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Department</div>
        <div class="info-value">${employee.dept}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Alert Time</div>
        <div class="info-value">${timestamp}</div>
      </div>
    </div>
    <div class="activities">
      <h3>🔍 Suspicious Activities Detected</h3>
      ${employee.activities.map((a) => `<div class="activity-item">⚡ ${a}</div>`).join("")}
    </div>
    <div class="cta">🔒 REVIEW EMPLOYEE PROFILE IMMEDIATELY</div>
    <div class="timestamp">Alert generated automatically by ThreatGuard AI · ${timestamp}</div>
  </div>
  <div class="footer">
    This is an automated alert from ThreatGuard Insider Threat Detection System.<br>
    Do not reply to this email. Contact your security team directly.
  </div>
</div>
</body>
</html>
    `,
  };

  // ── Send Email ────────────────────────────
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Alert sent for ${employee.name} → ${process.env.SECURITY_TEAM_EMAIL}`);
    console.log(`   Message ID: ${info.messageId}`);

    res.json({
      success: true,
      message: `🚨 Alert emailed to security team for ${employee.name}`,
      messageId: info.messageId,
      sentTo: process.env.SECURITY_TEAM_EMAIL,
      timestamp,
    });
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Email failed: " + error.message,
      hint: "Check your .env credentials. Use a Gmail App Password, not your normal password.",
    });
  }
});

// ── Start Server ──────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   🛡  ThreatGuard Alert System        ║");
  console.log("╠══════════════════════════════════════╣");
  console.log(`║   Running at http://localhost:${PORT}     ║`);
  console.log("║   Open in browser to see dashboard   ║");
  console.log("╚══════════════════════════════════════╝\n");
});
