# paste above content
nano test_tier4_batch.sh
# paste above content
chmod +x test_tier4_decisions.sh test_tier4_batch.sh
node server.js &  # start the server
export TIER4_URL="http://localhost:3000"
./test_tier4_decisions.sh
./test_tier4_batch.sh#!/bin/bash
# Test single decision endpoint for Tier-4 v3

echo "=== Testing Tier-4 Decision Endpoint ==="

inputs=(
  "approve this"
  "reject that"
  "hold for review"
  "urgent case"
  "long input to trigger review because it exceeds fifty characters easily"
)

for input in "${inputs[@]}"; do
  echo "Input: $input"
  response=$(curl -s -X POST "$TIER4_URL/v1/decision" \
    -H "Content-Type: application/json" \
    -d "{\"input\":\"$input\"}")
  echo "Response: $response"
  echo "-----------------------------------"
done

echo "=== Done ==="
