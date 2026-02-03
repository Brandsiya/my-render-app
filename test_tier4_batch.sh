#!/bin/bash
TIER4_URL="${TIER4_URL:-http://localhost:3000}"
inputs=("approve project" "urgent case" "hold for review" "reject request")
response=$(curl -s -X POST "$TIER4_URL/v1/decision/batch" \
    -H "Content-Type: application/json" \
    -d "{\"inputs\": $(printf '%s\n' "${inputs[@]}" | jq -R . | jq -s .)}")
echo "$response" | jq
