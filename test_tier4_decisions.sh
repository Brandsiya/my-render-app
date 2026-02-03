#!/bin/bash
# File: test_tier4_decisions.sh
# Purpose: Test SeekReap Tier-4 decision endpoint with multiple inputs

# Set your Render URL
TIER4_URL="https://seekreap-api.onrender.com"

# Array of test inputs
inputs=("approve this" "reject that" "hold for review" "urgent case")

echo "=== Testing Tier-4 Decision Endpoint ==="
echo

# Check if API is reachable
status_code=$(curl -s -o /dev/null -w "%{http_code}" "$TIER4_URL/health")
if [[ "$status_code" -ne 200 ]]; then
    echo "Error: Tier-4 API not reachable at $TIER4_URL (HTTP $status_code)"
    exit 1
fi

# Loop through test inputs
for input in "${inputs[@]}"; do
    echo "Input: $input"

    # Send POST request
    response=$(curl -s -X POST "$TIER4_URL/v1/decision" \
        -H "Content-Type: application/json" \
        -d "{\"input\": \"$input\"}")

    # Pretty-print JSON using jq (if installed)
    if command -v jq >/dev/null 2>&1; then
        echo "Response:"
        echo "$response" | jq
    else
        echo "Response: $response"
    fi

    echo "-----------------------------------"
done

echo
echo "=== Done ==="
