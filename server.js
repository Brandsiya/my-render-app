const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let rules = {};

// Load rules from JSON file
const loadRules = () => {
  try {
    const data = fs.readFileSync("./rules.json");
    rules = JSON.parse(data);
    console.log("Rules loaded:", rules);
  } catch (err) {
    console.error("Error loading rules.json:", err);
    rules = {
      approve: ["approve", "ok", "yes"],
      reject: ["reject", "no", "deny"],
      pending: ["hold", "wait", "review"],
      escalate: ["urgent", "immediate", "critical"],
      review_length: 50
    };
  }
};

// Initial load
loadRules();

// Decision function
const decide = (input) => {
  const text = input.toLowerCase();
  if (text.length > rules.review_length) return "review";

  for (const key of ["approve", "reject", "pending", "escalate"]) {
    if (rules[key].some(keyword => text.includes(keyword))) return key;
  }

  return "pending"; // default fallback
};

// In-memory logs
let logs = [];

app.get("/health", (req, res) => {
  res.json({ service: "SeekReap", tier: 4, status: "healthy", timestamp: new Date().toISOString() });
});

app.post("/v1/decision", (req, res) => {
  const input = req.body.input || "";
  const decision = decide(input);
  const record = { service: "SeekReap", tier: 4, version: "v4", status: "success", input, decision, timestamp: new Date().toISOString() };
  logs.push(record);
  res.json(record);
});

app.post("/v1/decision/batch", (req, res) => {
  const inputs = req.body.inputs || [];
  const results = inputs.map(input => {
    const decision = decide(input);
    const record = { input, decision, timestamp: new Date().toISOString() };
    logs.push(record);
    return record;
  });
  res.json({ service: "SeekReap", tier: 4, version: "v4", status: "success", results });
});

app.get("/v1/logs", (req, res) => {
  res.json({ service: "SeekReap", tier: 4, version: "v4", status: "success", count: logs.length, logs });
});

app.listen(port, () => console.log(`Server running on http://0.0.0.0:${port}`));
