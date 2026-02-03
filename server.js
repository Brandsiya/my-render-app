const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.TIER4_API_KEY || "default_key";  // simple API key auth

app.use(bodyParser.json());

// --- Setup SQLite Database for Persistent Logs ---
const db = new sqlite3.Database('./tier4_logs.db', (err) => {
  if (err) console.error('DB error:', err.message);
  else console.log('SQLite DB connected');
});

db.run(`CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  input TEXT,
  decision TEXT,
  timestamp TEXT
)`);

// --- Middleware: API Key Auth ---
app.use((req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: invalid API key' });
  }
  next();
});

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ service: "SeekReap", tier: 4, status: "healthy", timestamp: new Date().toISOString() });
});

// --- Decision Rules (Configurable) ---
const rules = [
  { keyword: "approve", decision: "approved" },
  { keyword: "reject", decision: "rejected" },
  { keyword: "hold", decision: "pending" },
  { keyword: "urgent", decision: "escalate" },
];

function decide(input) {
  if (input.length > 50) return "review";  // long input triggers review
  for (const rule of rules) {
    if (input.toLowerCase().includes(rule.keyword)) return rule.decision;
  }
  return "pending"; // default
}

// --- Single Decision Endpoint ---
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;
  const decision = decide(input);
  const timestamp = new Date().toISOString();

  db.run(`INSERT INTO logs(input, decision, timestamp) VALUES(?,?,?)`, [input, decision, timestamp]);

  res.json({ service: "SeekReap", tier: 4, version: "v4", status: "success", input, decision, timestamp });
});

// --- Batch Decision Endpoint ---
app.post('/v1/decision/batch', (req, res) => {
  const { inputs } = req.body;
  const results = inputs.map(input => {
    const decision = decide(input);
    const timestamp = new Date().toISOString();
    db.run(`INSERT INTO logs(input, decision, timestamp) VALUES(?,?,?)`, [input, decision, timestamp]);
    return { input, decision, timestamp };
  });
  res.json({ service: "SeekReap", tier: 4, version: "v4", status: "success", results });
});

// --- Logs Endpoint ---
app.get('/v1/logs', (req, res) => {
  db.all("SELECT * FROM logs ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ service: "SeekReap", tier: 4, version: "v4", status: "success", count: rows.length, logs: rows });
  });
});


app.listen(PORT, () => console.log(`Server running on http://0.0.0.0:${PORT}`));
