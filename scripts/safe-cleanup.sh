#!/bin/bash

# Codebase Cleanup Script - Safe Removal of Outdated Files
# Date: June 14, 2025
# Purpose: Remove historical/obsolete files that are no longer needed

echo "🧹 Starting Codebase Cleanup..."
echo "================================"

# Function to safely remove files/directories
safe_remove() {
    local path="$1"
    if [ -e "$path" ]; then
        echo "🗑️  Removing: $path"
        rm -rf "$path"
        echo "✅ Deleted: $path"
    else
        echo "⚠️  Not found: $path (already removed)"
    fi
}

# Phase 1: Remove entire archive directory
echo "📁 Phase 1: Removing archive directory..."
safe_remove "archive"

# Phase 2: Remove empty/outdated scripts
echo "📜 Phase 2: Removing outdated scripts..."
safe_remove "scripts/test-basic-structure.mjs"
safe_remove "scripts/test-cron-system.mjs"
safe_remove "scripts/simple-production-generation.mjs"
safe_remove "scripts/cleanup-article-system.sh"

# Phase 3: Remove historical documentation
echo "📄 Phase 3: Removing historical docs..."
safe_remove "docs/system-cleanup-completion-2025-06-08.md"
safe_remove "docs/system-status-2025-06-08.md"
safe_remove "docs/system-analysis-and-recommendations.md"
safe_remove "docs/elevenlabs-widget-fix-summary.md"
safe_remove "docs/file-analysis-summary.md"

# Phase 4: Remove recent cleanup docs (now that cleanup is done)
echo "📋 Phase 4: Removing cleanup tracking docs..."
safe_remove "docs/cleanup-summary-20250614.md"
safe_remove "docs/article-system-action-plan.md"

# Summary
echo ""
echo "🎉 Cleanup Complete!"
echo "===================="
echo "Removed obsolete files and directories."
echo "✅ Archive directory removed"
echo "✅ Empty test scripts removed"  
echo "✅ Historical documentation removed"
echo "✅ Workspace is now cleaner and more organized"
echo ""
echo "📊 Remaining active files:"
echo "- Current documentation in docs/"
echo "- Active scripts in scripts/"
echo "- Core system files in root"
echo ""
echo "🔍 Next: Run 'npm run build' to verify everything still works"
