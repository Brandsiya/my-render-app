const express = require('express');

const app = express();

// Render provides PORT automatically
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());

// --- Health check (required for Render & monitoring) ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// --- Root (temporary informational endpoint) ---
app.get('/', (req, res) => {
  res.json({
    service: 'SeekReap Tier-4 API',
    status: 'running'
  });
});

// --- Placeholder: 3-question flow entry point ---
app.post('/decision', (req, res) => {
  // Later: validate answers, route logic, scoring
  res.json({
    message: 'Decision endpoint stub',
    received: req.body
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Tier-4 API listening on port ${PORT}`);
});
