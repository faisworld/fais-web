@echo off
REM Codebase Cleanup Script - Safe Removal of Outdated Files (Windows)
REM Date: June 14, 2025
REM Purpose: Remove historical/obsolete files that are no longer needed

echo 🧹 Starting Codebase Cleanup...
echo ================================

REM Phase 1: Remove entire archive directory
echo 📁 Phase 1: Removing archive directory...
if exist "archive" (
    echo 🗑️  Removing: archive
    rmdir /s /q "archive"
    echo ✅ Deleted: archive
) else (
    echo ⚠️  Not found: archive (already removed)
)

REM Phase 2: Remove empty/outdated scripts
echo 📜 Phase 2: Removing outdated scripts...
if exist "scripts\test-basic-structure.mjs" (
    echo 🗑️  Removing: scripts\test-basic-structure.mjs
    del "scripts\test-basic-structure.mjs"
    echo ✅ Deleted: scripts\test-basic-structure.mjs
) else (
    echo ⚠️  Not found: scripts\test-basic-structure.mjs
)

if exist "scripts\test-cron-system.mjs" (
    echo 🗑️  Removing: scripts\test-cron-system.mjs
    del "scripts\test-cron-system.mjs"
    echo ✅ Deleted: scripts\test-cron-system.mjs
) else (
    echo ⚠️  Not found: scripts\test-cron-system.mjs
)

if exist "scripts\simple-production-generation.mjs" (
    echo 🗑️  Removing: scripts\simple-production-generation.mjs
    del "scripts\simple-production-generation.mjs"
    echo ✅ Deleted: scripts\simple-production-generation.mjs
) else (
    echo ⚠️  Not found: scripts\simple-production-generation.mjs
)

if exist "scripts\cleanup-article-system.sh" (
    echo 🗑️  Removing: scripts\cleanup-article-system.sh
    del "scripts\cleanup-article-system.sh"
    echo ✅ Deleted: scripts\cleanup-article-system.sh
) else (
    echo ⚠️  Not found: scripts\cleanup-article-system.sh
)

REM Phase 3: Remove historical documentation
echo 📄 Phase 3: Removing historical docs...
if exist "docs\system-cleanup-completion-2025-06-08.md" (
    echo 🗑️  Removing: docs\system-cleanup-completion-2025-06-08.md
    del "docs\system-cleanup-completion-2025-06-08.md"
    echo ✅ Deleted: docs\system-cleanup-completion-2025-06-08.md
) else (
    echo ⚠️  Not found: docs\system-cleanup-completion-2025-06-08.md
)

if exist "docs\system-status-2025-06-08.md" (
    echo 🗑️  Removing: docs\system-status-2025-06-08.md
    del "docs\system-status-2025-06-08.md"
    echo ✅ Deleted: docs\system-status-2025-06-08.md
) else (
    echo ⚠️  Not found: docs\system-status-2025-06-08.md
)

if exist "docs\system-analysis-and-recommendations.md" (
    echo 🗑️  Removing: docs\system-analysis-and-recommendations.md
    del "docs\system-analysis-and-recommendations.md"
    echo ✅ Deleted: docs\system-analysis-and-recommendations.md
) else (
    echo ⚠️  Not found: docs\system-analysis-and-recommendations.md
)

if exist "docs\elevenlabs-widget-fix-summary.md" (
    echo 🗑️  Removing: docs\elevenlabs-widget-fix-summary.md
    del "docs\elevenlabs-widget-fix-summary.md"
    echo ✅ Deleted: docs\elevenlabs-widget-fix-summary.md
) else (
    echo ⚠️  Not found: docs\elevenlabs-widget-fix-summary.md
)

if exist "docs\file-analysis-summary.md" (
    echo 🗑️  Removing: docs\file-analysis-summary.md
    del "docs\file-analysis-summary.md"
    echo ✅ Deleted: docs\file-analysis-summary.md
) else (
    echo ⚠️  Not found: docs\file-analysis-summary.md
)

REM Phase 4: Remove recent cleanup docs (now that cleanup is done)
echo 📋 Phase 4: Removing cleanup tracking docs...
if exist "docs\cleanup-summary-20250614.md" (
    echo 🗑️  Removing: docs\cleanup-summary-20250614.md
    del "docs\cleanup-summary-20250614.md"
    echo ✅ Deleted: docs\cleanup-summary-20250614.md
) else (
    echo ⚠️  Not found: docs\cleanup-summary-20250614.md
)

if exist "docs\article-system-action-plan.md" (
    echo 🗑️  Removing: docs\article-system-action-plan.md
    del "docs\article-system-action-plan.md"
    echo ✅ Deleted: docs\article-system-action-plan.md
) else (
    echo ⚠️  Not found: docs\article-system-action-plan.md
)

REM Summary
echo.
echo 🎉 Cleanup Complete!
echo ====================
echo Removed obsolete files and directories.
echo ✅ Archive directory removed
echo ✅ Empty test scripts removed
echo ✅ Historical documentation removed
echo ✅ Workspace is now cleaner and more organized
echo.
echo 📊 Remaining active files:
echo - Current documentation in docs/
echo - Active scripts in scripts/
echo - Core system files in root
echo.
echo 🔍 Next: Run 'npm run build' to verify everything still works
pause
