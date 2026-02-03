#!/bin/bash
# test_tier4_decisions.sh - Test single decisions for Tier-4 API v3

if [ -z "$TIER4_URL" ]; then
  echo "Please export TIER4_URL first, e.g. export TIER4_URL=http://localhost:3000"
  exit 1
fi

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
