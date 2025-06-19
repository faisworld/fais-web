#!/usr/bin/env node

/**
 * CODEBASE CLEANUP SCRIPT
 * 
 * This script identifies and cleans up:
 * 1. Outdated documentation files
 * 2. Unused test scripts  
 * 3. TypeScript and ESLint errors
 * 4. Unreferenced files
 */

import { readdir, stat, readFile, unlink } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Files to potentially remove (if not referenced)
const POTENTIAL_CLEANUP_FILES = [
  'docs/article-generation-system.md',
  'docs/article-image-organization-completion-report.md', 
  'docs/blog-image-regeneration-report.md',
  'docs/carousel-gallery-fixes.md',
  'docs/carousel-update-fixes.md',
  'docs/carousel-updates.md',
  'docs/carousel-video-setup.md',
  'docs/dynamic-recaptcha-implementation.md',
  'docs/footer-alignment-deep-fix-report.md',
  'docs/footer-alignment-fix-summary.md',
  'docs/gallery-carousel-simplification.md',
  'docs/quirks-mode-fix.md',
  'docs/seo-critical-issues-resolution-report.md',
  'test-blog-data.mjs',
  'setup-blog-env.mjs',
  'validate-elevenlabs-integration.js',
  'check-widget-status.cjs'
];

// Files to keep (actively used)
const KEEP_FILES = [
  'INSTRUCTION.MD',
  'README.md',
  'docs/knowledge-base-separation-report.md',
  'docs/final-completion-report-june-14.md',
  'docs/kvitka-poloniny-widget-update.md',
  'docs/elevenlabs-widget-final-status-report.md'
];

async function findFileReferences(filePath) {
  const references = [];
  
  try {
    // Search for file references in the codebase
    const searchCommand = `grep -r "${filePath}" --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" --include="*.md" --include="*.json" . 2>/dev/null || true`;
    const result = execSync(searchCommand, { cwd: projectRoot, encoding: 'utf8' });
    
    if (result.trim()) {
      references.push(...result.split('\\n').filter(line => line.trim()));
    }
  } catch (error) {
    // Ignore errors from grep command
  }
  
  return references;
}

async function analyzeFile(filePath) {
  const fullPath = join(projectRoot, filePath);
  
  try {
    const stats = await stat(fullPath);
    const content = await readFile(fullPath, 'utf8');
    const references = await findFileReferences(filePath);
    
    return {
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime,
      hasReferences: references.length > 0,
      references,
      lineCount: content.split('\\n').length,
      isOutdated: stats.mtime < new Date('2025-06-01') // Older than June 1st
    };
  } catch (error) {
    return null; // File doesn't exist
  }
}

async function getTypescriptErrors() {
  try {
    const result = execSync('npx tsc --noEmit --pretty false', { 
      cwd: projectRoot, 
      encoding: 'utf8' 
    });
    return [];
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    const errors = output.split('\\n')
      .filter(line => line.includes('error TS'))
      .map(line => line.trim())
      .filter(Boolean);
    return errors;
  }
}

async function getESLintErrors() {
  try {
    const result = execSync('npm run lint -- --format=compact', { 
      cwd: projectRoot, 
      encoding: 'utf8' 
    });
    return [];
  } catch (error) {
    const output = error.stdout || error.stderr || '';
    const errors = output.split('\\n')
      .filter(line => line.includes(' Error: ') || line.includes(' Warning: '))
      .map(line => line.trim())
      .filter(Boolean);
    return errors;
  }
}

async function main() {
  console.log('🧹 CODEBASE CLEANUP ANALYSIS');
  console.log('============================');
  console.log(`Date: ${new Date().toISOString()}\\n`);
  
  // Analyze TypeScript errors
  console.log('📊 Analyzing TypeScript Errors...');
  const tsErrors = await getTypescriptErrors();
  console.log(`   Found ${tsErrors.length} TypeScript errors\\n`);
  
  if (tsErrors.length > 0) {
    console.log('🔴 TypeScript Errors:');
    tsErrors.slice(0, 10).forEach(error => {
      console.log(`   ${error}`);
    });
    if (tsErrors.length > 10) {
      console.log(`   ... and ${tsErrors.length - 10} more errors\\n`);
    }
  }
  
  // Analyze ESLint errors
  console.log('📋 Analyzing ESLint Errors...');
  const eslintErrors = await getESLintErrors();
  console.log(`   Found ${eslintErrors.length} ESLint errors\\n`);
  
  if (eslintErrors.length > 0) {
    console.log('🟡 ESLint Errors (first 10):');
    eslintErrors.slice(0, 10).forEach(error => {
      console.log(`   ${error}`);
    });
    if (eslintErrors.length > 10) {
      console.log(`   ... and ${eslintErrors.length - 10} more errors\\n`);
    }
  }
  
  // Analyze potential cleanup files
  console.log('📁 Analyzing Potential Cleanup Files...');
  const analyses = [];
  
  for (const filePath of POTENTIAL_CLEANUP_FILES) {
    const analysis = await analyzeFile(filePath);
    if (analysis) {
      analyses.push(analysis);
    }
  }
  
  console.log(`   Analyzed ${analyses.length} files\\n`);
  
  // Files safe to remove
  const safeToRemove = analyses.filter(file => 
    !file.hasReferences && 
    file.isOutdated && 
    !KEEP_FILES.includes(file.path)
  );
  
  // Files with references
  const hasReferences = analyses.filter(file => file.hasReferences);
  
  // Recently modified files
  const recentlyModified = analyses.filter(file => !file.isOutdated);
  
  console.log('🗑️  Files Safe to Remove:');
  if (safeToRemove.length === 0) {
    console.log('   No files identified for removal\\n');
  } else {
    safeToRemove.forEach(file => {
      console.log(`   📄 ${file.path}`);
      console.log(`      Size: ${(file.size / 1024).toFixed(1)}KB`);
      console.log(`      Last modified: ${file.lastModified.toDateString()}`);
      console.log(`      Lines: ${file.lineCount}`);
      console.log('');
    });
  }
  
  console.log('🔗 Files with References (Keep):');
  hasReferences.forEach(file => {
    console.log(`   📄 ${file.path} (${file.references.length} references)`);
  });
  console.log('');
  
  console.log('📅 Recently Modified Files (Keep):');
  recentlyModified.forEach(file => {
    console.log(`   📄 ${file.path} (modified: ${file.lastModified.toDateString()})`);
  });
  console.log('');
  
  // Summary
  console.log('📊 CLEANUP SUMMARY:');
  console.log(`   Total analyzed files: ${analyses.length}`);
  console.log(`   Safe to remove: ${safeToRemove.length}`);
  console.log(`   Has references: ${hasReferences.length}`);
  console.log(`   Recently modified: ${recentlyModified.length}`);
  console.log(`   TypeScript errors: ${tsErrors.length}`);
  console.log(`   ESLint errors: ${eslintErrors.length}`);
  
  console.log('\\n🔧 RECOMMENDED ACTIONS:');
  console.log('   1. Fix TypeScript errors (priority)');
  console.log('   2. Fix ESLint errors');
  console.log('   3. Remove outdated files if confirmed safe');
  console.log('   4. Update documentation standards');
  
  if (safeToRemove.length > 0) {
    console.log('\\n⚠️  To remove files automatically, run with --remove flag');
    console.log('   WARNING: This will permanently delete files!');
  }
}

// Check for --remove flag
const shouldRemove = process.argv.includes('--remove');

if (shouldRemove) {
  console.log('🚨 REMOVE MODE ENABLED - This will delete files!');
  console.log('Continuing in 5 seconds... Press Ctrl+C to cancel\\n');
  
  setTimeout(async () => {
    console.log('⚠️  Starting file removal...');
    // Implementation for actual file removal would go here
    console.log('File removal not implemented yet for safety.');
  }, 5000);
} else {
  main().catch(console.error);
}
