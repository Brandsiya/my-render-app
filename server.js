// server.js - Tier-4 v4 production-ready
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;
const API_KEY = process.env.TIER4_API_KEY || "changeme";

// Load rules.json dynamically
let rules = {};
function loadRules() {
    try {
        rules = JSON.parse(fs.readFileSync('rules.json'));
        console.log('Rules loaded:', rules);
    } catch (err) {
        console.error('Failed to load rules.json:', err);
        rules = {};
    }
}
loadRules();

// SQLite DB setup
const db = new sqlite3.Database('tier4_logs.db');
db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input TEXT,
    decision TEXT,
    timestamp TEXT
)`);

// Middleware
app.use(bodyParser.json());

// API key middleware
app.use((req, res, next) => {
    const key = req.headers['x-api-key'];
    if (!key || key !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: invalid API key' });
    }
    next();
});

// Decision logic
function decide(input) {
    input = input.toLowerCase();
    if (rules.approve && rules.approve.some(word => input.includes(word))) return 'approved';
    if (rules.reject && rules.reject.some(word => input.includes(word))) return 'rejected';
    if (rules.pending && rules.pending.some(word => input.includes(word))) return 'pending';
    if (rules.escalate && rules.escalate.some(word => input.includes(word))) return 'escalate';
    if (input.length > 50) return 'review';
    return 'pending';
}

// Log to SQLite
function logDecision(input, decision) {
    const timestamp = new Date().toISOString();
    db.run('INSERT INTO logs (input, decision, timestamp) VALUES (?, ?, ?)', [input, decision, timestamp]);
    return { input, decision, timestamp };
}

// Health endpoint
app.get('/health', (req, res) => {
    res.json({ service: 'SeekReap', tier: 4, status: 'healthy', timestamp: new Date().toISOString() });
});

// Single decision
app.post('/v1/decision', (req, res) => {
    const { input } = req.body;
    const decision = decide(input);
    const logEntry = logDecision(input, decision);
    res.json({ service: 'SeekReap', tier: 4, version: 'v4', status: 'success', ...logEntry });
});

// Batch decisions
app.post('/v1/decision/batch', (req, res) => {
    const { inputs } = req.body;
    const results = inputs.map(i => logDecision(i, decide(i)));
    res.json({ service: 'SeekReap', tier: 4, version: 'v4', status: 'success', results });
});

// Logs
app.get('/v1/logs', (req, res) => {
    db.all('SELECT * FROM logs ORDER BY id DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ service: 'SeekReap', tier: 4, version: 'v4', status: 'success', count: rows.length, logs: rows });
    });
});

app.listen(PORT, () => console.log(`Server running on http://0.0.0.0:${PORT}`));
