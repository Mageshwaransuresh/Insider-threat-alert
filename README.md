# 🛡 ThreatGuard — Insider Threat Email Alert System

> Real-time employee risk monitoring with **automatic email alerts** to your security team.

---

## ⚡ Quick Setup (5 minutes)

### Step 1 — Get a Gmail App Password
1. Go to **myaccount.google.com**
2. Security → **2-Step Verification** (must be ON)
3. At the bottom → **App Passwords**
4. Select app: **Mail** → Select device: **Other** → name it "ThreatGuard"
5. Copy the **16-character password** shown (e.g. `abcd efgh ijkl mnop`)

### Step 2 — Configure `.env`
Open `.env` and fill in:

```
SENDER_EMAIL=your_gmail@gmail.com
SENDER_PASSWORD=abcd efgh ijkl mnop    ← the App Password from Step 1
SECURITY_TEAM_EMAIL=where_alerts_go@gmail.com
```

> 💡 `SECURITY_TEAM_EMAIL` is where you want the alert email to arrive.  
>    For a live demo, put YOUR phone's email here so it appears during the presentation!

### Step 3 — Start the Server
```bash
node server.js
```

### Step 4 — Open the Dashboard
Visit: **http://localhost:3000**

---

## 🎯 Demo Flow

1. Open `http://localhost:3000` in your browser
2. The dashboard shows **5 employees** with risk scores
3. Click **🚨 Alert Security** on any CRITICAL employee
4. Watch the email arrive on your phone **live** during the demo!

### What to say:
> *"When our AI detects a CRITICAL risk employee — someone downloading gigabytes at 2AM or exporting customer databases — it automatically fires an email alert to the security team. No human monitoring needed. Watch this..."*
> 
> *(click the button — email arrives on phone)*
> 
> *"The security team gets the employee's name, ID, risk score, and every suspicious activity — right to their inbox, in real time."*

---

## 📁 Project Structure

```
insider-threat-alert/
├── server.js          ← Express server + email logic
├── public/
│   └── index.html     ← Dashboard UI
├── .env               ← Your credentials (never commit this!)
├── package.json
└── README.md
```

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| `Invalid login` | Use App Password, not your Gmail password |
| `Less secure app` error | Enable 2FA first, then create App Password |
| Email goes to spam | Check spam folder; mark as "not spam" before demo |
| Port 3000 in use | Change `PORT=3001` in `.env` |
