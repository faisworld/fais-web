#!/bin/bash

# Test script for automated article generation system
# This script tests the entire pipeline without requiring admin panel access

echo "🧪 Testing Automated Article Generation System"
echo "=============================================="

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Set test environment variables
export NODE_ENV="development"
export INTERNAL_API_KEY="test-internal-key-123"

echo "🔧 Environment Setup:"
echo "   NODE_ENV: $NODE_ENV"
echo "   INTERNAL_API_KEY: ${INTERNAL_API_KEY:0:8}..."
echo ""

# Check if development server is running
echo "🌐 Checking if development server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Development server is running"
else
    echo "❌ Development server is not running"
    echo "   Please start it with: npm run dev"
    exit 1
fi

echo ""

# Test 1: Test the article generation API directly
echo "🧪 Test 1: Article Generation API"
echo "================================="

response=$(curl -s -X POST http://localhost:3000/api/admin/ai-tools/generate-article \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Test AI Automation System", 
    "keywords": ["automation", "testing", "AI"], 
    "wordCount": 300,
    "includeImage": false
  }')

if echo "$response" | grep -q "title"; then
    echo "✅ Article generation API is working"
    title=$(echo "$response" | grep -o '"title":"[^"]*"' | cut -d'"' -f4)
    echo "   Generated article: $title"
else
    echo "❌ Article generation API failed"
    echo "   Response: $response"
fi

echo ""

# Test 2: Test the automated script
echo "🧪 Test 2: Automated Article Generation Script"
echo "=============================================="

echo "Running automated article generation script..."
if node scripts/automated-article-generation.mjs; then
    echo "✅ Automated script completed successfully"
else
    echo "❌ Automated script failed"
fi

echo ""

# Test 3: Check if new articles were created
echo "🧪 Test 3: Article File Creation"
echo "================================"

content_dir="app/blog/content"
blog_data_file="app/blog/blog-data.ts"

echo "Checking content directory: $content_dir"
if [ -d "$content_dir" ]; then
    article_count=$(find "$content_dir" -name "*.md" -o -name "*.tsx" | wc -l)
    echo "✅ Found $article_count articles in content directory"
    
    # Show the most recent files
    echo "📄 Most recent articles:"
    find "$content_dir" -name "*.md" -o -name "*.tsx" | sort -r | head -3 | while read file; do
        echo "   - $(basename "$file")"
    done
else
    echo "❌ Content directory not found"
fi

echo ""

if [ -f "$blog_data_file" ]; then
    echo "✅ blog-data.ts file exists"
    
    # Check for recent updates
    blog_entries=$(grep -c "id:" "$blog_data_file" || echo "0")
    echo "   Found $blog_entries blog entries in blog-data.ts"
else
    echo "❌ blog-data.ts file not found"
fi

echo ""

# Test 4: Test the new cron endpoint
echo "🧪 Test 4: Cron Endpoint"
echo "========================"

cron_response=$(curl -s "http://localhost:3000/api/cron/automated-article-generation?cron_secret=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI")

if echo "$cron_response" | grep -q "success"; then
    echo "✅ Cron endpoint is working"
else
    echo "❌ Cron endpoint failed"
    echo "   Response: $cron_response"
fi

echo ""

# Summary
echo "📋 Test Summary"
echo "==============="
echo "✅ All tests completed!"
echo ""
echo "🔧 Next Steps for Production:"
echo "1. Set INTERNAL_API_KEY environment variable in Vercel"
echo "2. Ensure all required API keys are configured"
echo "3. Deploy the updated cron endpoint"
echo "4. Monitor the first automated run"
echo ""
echo "📚 See docs/production-automated-article-setup.md for full setup guide"
