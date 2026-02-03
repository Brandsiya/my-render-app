// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory logs
let logs = [];
let decisionCounts = { approved: 0, rejected: 0, pending: 0, escalate: 0, review: 0 };

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ service: "SeekReap", tier: 4, status: "healthy", timestamp: new Date().toISOString() });
});

// Single decision endpoint
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ status: "error", message: "Missing input" });

  const decision = getDecision(input);

  const result = { service: "SeekReap", tier: 4, version: "v3", status: "success", input, decision, timestamp: new Date().toISOString() };
  
  logs.push(result);
  decisionCounts[decision] += 1;

  res.json(result);
});

// Batch decision endpoint
app.post('/v1/decision/batch', (req, res) => {
  const { inputs } = req.body;
  if (!inputs || !Array.isArray(inputs)) return res.status(400).json({ status: "error", message: "Invalid inputs" });

  const results = inputs.map(input => {
    const decision = getDecision(input);
    const r = { input, decision, timestamp: new Date().toISOString() };
    logs.push(r);
    decisionCounts[decision] += 1;
    return r;
  });

  res.json({ service: "SeekReap", tier: 4, version: "v3", status: "success", results });
});

// Logs endpoint
app.get('/v1/logs', (req, res) => {
  res.json({ service: "SeekReap", tier: 4, version: "v3", status: "success", count: logs.length, logs });
});

// Metrics endpoint
app.get('/v1/metrics', (req, res) => {
  res.json({ service: "SeekReap", tier: 4, version: "v3", status: "success", counts: decisionCounts });
});

// Decision logic
function getDecision(input) {
  const text = input.toLowerCase();
  if (text.includes("approve")) return "approved";
  if (text.includes("reject")) return "rejected";
  if (text.includes("urgent") || text.includes("escalate")) return "escalate";
  if (text.includes("hold")) return "pending";
  if (text.length > 50) return "review"; // new rule: long inputs go to review
  return "pending";
}

app.listen(port, () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
