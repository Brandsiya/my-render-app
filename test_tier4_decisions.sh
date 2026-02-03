#!/bin/bash
# test_tier4_decisions.sh
# Test Tier-4 decision endpoint (single inputs)

TIER4_URL=${TIER4_URL:-"http://localhost:3000"}

inputs=("approve this" "reject that" "hold for review" "urgent case" "long input to trigger review because it exceeds fifty characters easily")

echo "=== Testing Tier-4 Decision Endpoint ==="
for input in "${inputs[@]}"; do
    echo "Input: $input"
    response=$(curl -s -X POST "$TIER4_URL/v1/decision" -H "Content-Type: application/json" -d "{\"input\":\"$input\"}")
    echo "Response: $response"
    echo "-----------------------------------"
done
echo "=== Done ==="
