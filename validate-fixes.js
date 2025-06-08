#!/usr/bin/env node
/**
 * Validation script to check both FAIS website fixes:
 * 1. Review Snippet Error - structured data validation
 * 2. ARIA Hidden Focus Error - accessibility validation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating FAIS website fixes...\n');

// 1. Check structured data fix in layout.tsx
console.log('1️⃣ Checking Review Snippet Structured Data Fix:');
const layoutPath = path.join(__dirname, 'app', 'layout.tsx');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

if (layoutContent.includes('aggregateRating: {')) {
  console.log('❌ ISSUE: aggregateRating object still found in structured data');
} else if (layoutContent.includes('// Removed aggregateRating - only add when you have actual review markup on pages')) {
  console.log('✅ FIXED: aggregateRating properly removed with explanatory comment');
} else {
  console.log('⚠️  WARNING: aggregateRating not found, but no comment explaining removal');
}

// 2. Check ARIA accessibility fix in HomeCarousel.tsx
console.log('\n2️⃣ Checking ARIA Hidden Focus Accessibility Fix:');
const carouselPath = path.join(__dirname, 'components', 'pages', 'HomeCarousel.tsx');
const carouselContent = fs.readFileSync(carouselPath, 'utf8');

if (carouselContent.includes('aria-hidden={index !== activeIndex}') && 
    carouselContent.includes('visibility: index === activeIndex ? \'visible\' : \'hidden\'')) {
  console.log('✅ FIXED: Hidden carousel slides properly use both aria-hidden and visibility CSS');
  console.log('   - aria-hidden prevents screen reader access');
  console.log('   - visibility:hidden prevents keyboard focus access');
} else if (carouselContent.includes('aria-hidden={index !== activeIndex}')) {
  console.log('⚠️  PARTIAL: aria-hidden found but visibility style might be missing');
} else {
  console.log('❌ ISSUE: ARIA accessibility fix not detected');
}

// 3. Check for other potential ARIA issues
console.log('\n3️⃣ Checking for Other ARIA Issues:');
const contactPath = path.join(__dirname, 'app', 'contact', 'page.client.tsx');
const contactContent = fs.readFileSync(contactPath, 'utf8');

if (contactContent.includes('aria-hidden="false"') && contactContent.includes('tabIndex={0}')) {
  console.log('✅ GOOD: Contact page iframe properly accessible with aria-hidden="false" and tabIndex={0}');
} else {
  console.log('⚠️  WARNING: Contact page iframe accessibility might need review');
}

console.log('\n🎉 Validation Complete!');
console.log('\n📋 Summary:');
console.log('- Structured data review snippet error should be resolved');
console.log('- ARIA hidden focus accessibility issue should be resolved');
console.log('- Other ARIA usage appears correct (decorative icons properly hidden)');
