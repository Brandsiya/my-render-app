// server.js
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory log store
const decisionLogs = [];

// Health / info endpoint
app.get('/', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v2",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    status: "healthy",
    timestamp: new Date()
  });
});

// Decision logic function
function makeDecision(input) {
  const lower = input.toLowerCase();
  if (lower.includes("approve")) return "approved";
  if (lower.includes("reject")) return "rejected";
  if (lower.includes("urgent")) return "escalate";
  if (lower.includes("review") || lower.includes("hold")) return "pending";

  // Default fallback
  return input.length % 2 === 0 ? "approve" : "reject";
}

// Single decision endpoint
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;
  if (!input) {
    return res.status(400).json({
      service: "SeekReap",
      tier: 4,
      version: "v2",
      status: "error",
      message: "Missing input field in request body",
      timestamp: new Date().toISOString()
    });
  }

  const decision = makeDecision(input);

  const record = { input, decision, timestamp: new Date().toISOString() };
  decisionLogs.push(record);

  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v2",
    status: "success",
    ...record
  });
});

// Batch decision endpoint
app.post('/v1/decision/batch', (req, res) => {
  const { inputs } = req.body;
  if (!Array.isArray(inputs)) {
    return res.status(400).json({
      service: "SeekReap",
      tier: 4,
      version: "v2",
      status: "error",
      message: "Missing or invalid 'inputs' array",
      timestamp: new Date().toISOString()
    });
  }

  const results = inputs.map(input => {
    const decision = makeDecision(input);
    const record = { input, decision, timestamp: new Date().toISOString() };
    decisionLogs.push(record);
    return record;
  });

  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v2",
    status: "success",
    results
  });
});

// Logs endpoint (recent decisions)
app.get('/v1/logs', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v2",
    status: "success",
    count: decisionLogs.length,
    logs: decisionLogs
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
