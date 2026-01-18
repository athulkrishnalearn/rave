#!/bin/bash

echo "=== COMPREHENSIVE 404 ERROR CHECK ==="
echo ""

# Test all major routes
routes=(
  "/"
  "/login"
  "/register"
  "/about"
  "/how-it-works"
  "/faq"
  "/contact"
  "/rave-feed"
  "/rave-ideas"
  "/freelance"
  "/freelance/gigs"
  "/freelance/orders"
  "/freelance/earnings"
  "/freelance/profile"
  "/creator-dashboard"
  "/sales-agent-dashboard"
  "/admin-dashboard"
  "/support-dashboard"
  "/company-dashboard"
  "/management-dashboard"
)

echo "Testing ${#routes[@]} routes..."
echo ""

errors=0
success=0

for route in "${routes[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${route}")
  if [ "$status" = "200" ]; then
    echo "✅ $route → $status OK"
    ((success++))
  else
    echo "❌ $route → $status ERROR"
    ((errors++))
  fi
done

echo ""
echo "=== SUMMARY ==="
echo "✅ Success: $success"
echo "❌ Errors: $errors"
echo "Total: ${#routes[@]}"
