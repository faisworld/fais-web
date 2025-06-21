#!/bin/bash

# Test script to manually trigger the cron job
# This will call the production API directly to test the article generation

echo "🚀 Testing article generation cron job..."
echo "📅 Timestamp: $(date)"
echo ""

# Call the production cron endpoint
curl -X GET "https://fais.world/api/cron/simple-article-generation?cron_secret=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI" \
  -H "Content-Type: application/json" \
  -w "\n📊 HTTP Status: %{http_code}\n⏱️  Total time: %{time_total}s\n" \
  -s

echo ""
echo "✅ Test completed!"
echo "🔍 Check the production logs and database for results."
echo "📝 Check https://fais.world/blog for the new article."
