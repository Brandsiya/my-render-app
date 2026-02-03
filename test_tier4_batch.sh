#!/bin/bash
# test_tier4_batch.sh - Test batch decisions for Tier-4 API v3

if [ -z "$TIER4_URL" ]; then
  echo "Please export TIER4_URL first, e.g. export TIER4_URL=http://localhost:3000"
  exit 1
fi

echo "=== Testing Tier-4 Batch Endpoint ==="

inputs=(
  "approve project"
  "reject request"
  "hold for review"
  "urgent case"
  "very long input that should trigger review because it's more than fifty characters"
)

# Convert bash array to JSON array
json_inputs=$(printf '%s\n' "${inputs[@]}" | jq -R . | jq -s .)

response=$(curl -s -X POST "$TIER4_URL/v1/decision/batch" \
  -H "Content-Type: application/json" \
  -d "{\"inputs\":$json_inputs}")

echo "$response" | jq
echo "=== Done ==="
