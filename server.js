const express = require('express');
const app = express();

/**
 * Render provides PORT dynamically.
 * Binding to 0.0.0.0 is required.
 */
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

/**
 * Root endpoint
 * Purpose: Render health + human sanity check
 * DO NOT REMOVE
 */
app.get('/', (req, res) => {
  res.json({
    service: 'SeekReap Tier-4 API',
    status: 'running'
  });
});
// Versioned health endpoint
app.get('/v1/health', (req, res) => {
  res.json({
    service: 'SeekReap',
    tier: 4,
    version: 'v1',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});
/**
 * Versioned health endpoint
 * Purpose: Machine health check for orchestration & monitoring
 */
app.get('/v1/health', (req, res) => {
  res.json({
    service: 'SeekReap',
    tier: 4,
    version: 'v1',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Tier-4 API listening on ${HOST}:${PORT}`);
});
