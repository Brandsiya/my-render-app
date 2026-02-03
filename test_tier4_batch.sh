#!/bin/bash
echo "=== Testing Tier-4 Batch Endpoint ==="

inputs=(
  "approve project"
  "reject request"
  "hold for review"
  "urgent case"
  "very long input that should trigger review because it's more than fifty characters"
)

json_payload=$(printf '{"inputs": [%s]}' "$(printf '"%s",' "${inputs[@]}" | sed 's/,$//')")

response=$(curl -s -X POST "$TIER4_URL/v1/decision/batch" \
  -H "Content-Type: application/json" \
  -H "x-api-key: default_key" \
  -d "$json_payload")

echo "$response" | jq
echo "=== Done ==="
