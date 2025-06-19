#!/bin/bash

# ARTICLE SYSTEM CLEANUP SCRIPT
# This script removes all conflicting implementations to start fresh

echo "🧹 Starting Article System Cleanup"
echo "=================================="

# Create backup directory
echo "📦 Creating backup directory..."
mkdir -p archive/cleanup-backup-$(date +%Y%m%d)
BACKUP_DIR="archive/cleanup-backup-$(date +%Y%m%d)"

# Function to safely remove file with backup
safe_remove() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "🗑️  Removing: $file"
        cp "$file" "$BACKUP_DIR/$(basename $file)" 2>/dev/null || true
        rm "$file"
    else
        echo "⚠️  File not found: $file"
    fi
}

# Function to safely remove directory with backup
safe_remove_dir() {
    local dir="$1"
    if [ -d "$dir" ]; then
        echo "🗑️  Removing directory: $dir"
        cp -r "$dir" "$BACKUP_DIR/$(basename $dir)" 2>/dev/null || true
        rm -rf "$dir"
    else
        echo "⚠️  Directory not found: $dir"
    fi
}

echo ""
echo "🔥 Removing Conflicting Scripts"
echo "==============================="

# Remove conflicting scripts
safe_remove "scripts/production-article-generation.mjs"
safe_remove "scripts/test-article-system.mjs"
safe_remove "scripts/news-crawler.mjs"
safe_remove "scripts/duplicate-detection.mjs"

echo ""
echo "🔥 Removing Conflicting API Endpoints"
echo "===================================="

# Remove conflicting API endpoints
safe_remove_dir "app/api/admin/manual-article-generation"

echo ""
echo "🔥 Removing Conflicting Documentation"
echo "===================================="

# Remove conflicting documentation
safe_remove "docs/enhanced-article-generation-system.md"
safe_remove "docs/production-automated-article-setup.md"
safe_remove "ENHANCED_ARTICLE_SYSTEM_IMPLEMENTATION_SUMMARY.md"
safe_remove "docs/automated-article-system-production-setup.md"

echo ""
echo "🔥 Removing Obsolete Files"
echo "========================="

# Remove obsolete files
safe_remove "scripts/setup-article-cron.sh"
safe_remove "test-blog-data.mjs"
safe_remove "content-hashes.json"

echo ""
echo "✅ Updating Vercel Configuration"
echo "==============================="

# Update vercel.json to use the new simplified endpoint
echo "📝 Updating vercel.json..."
cat > vercel.json << 'EOF'
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "ignoreCommand": "git check-ignore $VERCEL_GIT_COMMIT_REF",
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1",
      "SKIP_ENV_VALIDATION": "1"
    }
  },
  "crons": [
    {
      "path": "/api/cron/simple-article-generation?cron_secret=aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI",
      "schedule": "0 8,20 * * *"
    }
  ]
}
EOF

echo ""
echo "📝 Creating Cleanup Summary"
echo "=========================="

# Create cleanup summary
cat > docs/cleanup-summary-$(date +%Y%m%d).md << EOF
# Article System Cleanup Summary

## Date: $(date)

## Files Removed

### Conflicting Scripts
- scripts/production-article-generation.mjs
- scripts/test-article-system.mjs
- scripts/news-crawler.mjs
- scripts/duplicate-detection.mjs

### Conflicting API Endpoints
- app/api/admin/manual-article-generation/

### Conflicting Documentation
- docs/enhanced-article-generation-system.md
- docs/production-automated-article-setup.md
- ENHANCED_ARTICLE_SYSTEM_IMPLEMENTATION_SUMMARY.md
- docs/automated-article-system-production-setup.md

### Obsolete Files
- scripts/setup-article-cron.sh
- test-blog-data.mjs
- content-hashes.json

## New Simplified System

### Core Files
- scripts/simple-article-generator.mjs (NEW)
- app/api/cron/simple-article-generation/route.ts (NEW)
- vercel.json (UPDATED)

### Backup Location
All removed files have been backed up to: $BACKUP_DIR

## Next Steps
1. Test the admin panel: http://localhost:3000/admin/ai-tools/article-generation
2. Test the new cron endpoint: /api/cron/simple-article-generation
3. Deploy to production with updated vercel.json
4. Monitor for 24 hours to ensure stability

## Environment Variables Required
- OPENAI_API_KEY (for article generation)
- INTERNAL_API_KEY (for production automation)
- NODE_ENV=production (for production deployment)
EOF

echo ""
echo "🎉 Cleanup Complete!"
echo "==================="
echo ""
echo "✅ All conflicting files have been removed"
echo "📦 Backup created in: $BACKUP_DIR"
echo "📋 Summary created: docs/cleanup-summary-$(date +%Y%m%d).md"
echo ""
echo "🚀 Next Steps:"
echo "1. Test admin panel: npm run dev"
echo "2. Test new system: node scripts/simple-article-generator.mjs"
echo "3. Deploy to production when ready"
echo ""
echo "⚠️  Remember to set environment variables:"
echo "   - OPENAI_API_KEY"
echo "   - INTERNAL_API_KEY"
echo "   - NODE_ENV=production"
