#!/bin/bash
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
    -H "x-api-key: default_key" \
    -d "{\"input\":\"$input\"}")
  echo "Response: $response"
  echo "-----------------------------------"
done

echo "=== Done ==="
