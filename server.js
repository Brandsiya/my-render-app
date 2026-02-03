// server.js - Tier-4 v3
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory logs
let logs = [];

// Decision logic function
function makeDecision(input) {
  const lower = input.toLowerCase();
  if (lower.includes('approve')) return 'approved';
  if (lower.includes('reject')) return 'rejected';
  if (lower.includes('hold')) return 'pending';
  if (lower.includes('urgent')) return 'escalate';
  if (input.length > 50) return 'review'; // v3 logic for long inputs
  return 'pending';
}

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    service: 'SeekReap',
    tier: 4,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Single decision endpoint
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;
  const decision = makeDecision(input);
  const entry = {
    service: 'SeekReap',
    tier: 4,
    version: 'v3',
    status: 'success',
    input,
    decision,
    timestamp: new Date().toISOString(),
  };
  logs.push(entry);
  res.json(entry);
});

// Batch decision endpoint
app.post('/v1/decision/batch', (req, res) => {
  const { inputs } = req.body;
  const results = inputs.map((input) => {
    const decision = makeDecision(input);
    const entry = {
      input,
      decision,
      timestamp: new Date().toISOString(),
    };
    logs.push(entry);
    return entry;
  });
  res.json({
    service: 'SeekReap',
    tier: 4,
    version: 'v3',
    status: 'success',
    results,
  });
});

// Logs endpoint
app.get('/v1/logs', (req, res) => {
  res.json({
    service: 'SeekReap',
    tier: 4,
    version: 'v3',
    status: 'success',
    count: logs.length,
    logs,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
