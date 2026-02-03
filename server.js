const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Middleware to parse JSON bodies
app.use(express.json());

// Health endpoint
app.get('/', (req, res) => {
  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v1",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// Decision endpoint
app.post('/v1/decision', (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({
      service: "SeekReap",
      tier: 4,
      version: "v1",
      status: "error",
      message: "Missing input field in request body",
      timestamp: new Date().toISOString()
    });
  }

  // Placeholder logic for decision processing
  const decision = input.length % 2 === 0 ? "approve" : "reject";

  res.json({
    service: "SeekReap",
    tier: 4,
    version: "v1",
    status: "success",
    input,
    decision,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
