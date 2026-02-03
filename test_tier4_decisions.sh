#!/bin/bash
# File: test_tier4_decisions.sh

# Set your Render URL
TIER4_URL="https://seekreap-api.onrender.com"

# Array of test inputs
inputs=("approve this" "reject that" "hold for review" "urgent case")

echo "=== Testing Tier-4 Decision Endpoint ==="

for input in "${inputs[@]}"; do
    echo
    echo "Input: $input"
    response=$(curl -s -X POST "$TIER4_URL/v1/decision" \
        -H "Content-Type: application/json" \
        -d "{\"input\": \"$input\"}")
    echo "Response: $response"
done

echo
echo "=== Done ==="
