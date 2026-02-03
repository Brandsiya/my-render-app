#!/bin/bash
# test_tier4_batch.sh
# Test Tier-4 batch endpoint

TIER4_URL=${TIER4_URL:-"http://localhost:3000"}

inputs=("approve project" "reject request" "hold for review" "urgent case" "very long input that should trigger review because it's more than fifty characters")

echo "=== Testing Tier-4 Batch Endpoint ==="
payload="{\"inputs\":$(printf '%s\n' "${inputs[@]}" | jq -R . | jq -s .)}"
response=$(curl -s -X POST "$TIER4_URL/v1/decision/batch" -H "Content-Type: application/json" -d "$payload")
echo "$response" | jq
echo "=== Done ==="
