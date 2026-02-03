// server.js - Tier-4 API v3
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory logs
const logs = [];

// Decision logic function
function getDecision(input) {
  let decision;

  // Custom rules
  if (input.length > 50) {
    decision = "review"; // long inputs automatically reviewed
  } else if (input.toLowerCase().includes("urgent")) {
    decision = "escalate"; // urgent inputs escalate
  } else if (input.toLowerCase().includes("approve")) {
    decision = "approved";
  } else if (input.toLowerCase().includes("reject")) {
    decision = "rejected";
  } else if (input.toLowerCase().includes("hold")) {
    decision = "pending";
  } else {
    decision = "pending"; // default fallback
  }

  const logEntry = {
    service: "SeekReap",
    tier: 4,
    version: "v3",
    status: "success",
    input,
    decision,
    timestamp: new Date().toISOString()
  };

  // Save log
  logs.push(logEntry);
  return logEntry;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Single decision endpoint
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: "Input is required" });

  const result = getDecision(input);
  res.json(result);
});

// Batch decision endpoint
app.post('/v1/decision/batch', (req, res) => {
  const { inputs } = req.body;
  if (!inputs || !Array.isArray(inputs)) return res.status(400).json({ error: "Array of inputs is required" });

  const results = inputs.map(getDecision);
  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v3",
    status: "success",
    results
  });
});

// Logs endpoint
app.get('/v1/logs', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v3",
    status: "success",
    count: logs.length,
    logs
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
