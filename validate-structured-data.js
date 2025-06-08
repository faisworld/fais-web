#!/usr/bin/env node

/**
 * Comprehensive Structured Data Validation Script
 * Tests all pages for proper JSON-LD structured data implementation
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3001';
const OUTPUT_FILE = 'structured-data-validation-report.json';

// Pages to test with expected schema types
const PAGES_TO_TEST = [
  {
    url: '/',
    name: 'Homepage',
    expectedSchemas: ['Organization', 'WebSite']
  },
  {
    url: '/services',
    name: 'Services Page',
    expectedSchemas: ['Service', 'BreadcrumbList']
  },
  {
    url: '/ai-services',
    name: 'AI Services Page',
    expectedSchemas: ['Service', 'BreadcrumbList']
  },
  {
    url: '/blockchain-services',
    name: 'Blockchain Services Page',
    expectedSchemas: ['Service', 'BreadcrumbList']
  },
  {
    url: '/contact',
    name: 'Contact Page',
    expectedSchemas: ['FAQPage', 'BreadcrumbList']
  },
  {
    url: '/blog/latest-advancements-in-large-language-models-2025',
    name: 'Blog Post Example',
    expectedSchemas: ['Article', 'BreadcrumbList']
  }
];

/**
 * Extract structured data from a page
 */
async function extractStructuredData(page, url) {
  try {
    await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle0' });
    
    // Extract all JSON-LD scripts
    const structuredData = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      return scripts.map(script => {
        try {
          return JSON.parse(script.textContent);
        } catch (e) {
          return { error: 'Invalid JSON', content: script.textContent };
        }
      });
    });

    return structuredData;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Validate schema structure
 */
function validateSchema(schema) {
  const issues = [];
  
  if (!schema['@context']) {
    issues.push('Missing @context');
  } else if (!schema['@context'].includes('schema.org')) {
    issues.push('Invalid @context - should include schema.org');
  }
  
  if (!schema['@type']) {
    issues.push('Missing @type');
  }
  
  // Type-specific validations
  switch (schema['@type']) {
    case 'Organization':
      if (!schema.name) issues.push('Organization missing name');
      if (!schema.url) issues.push('Organization missing url');
      break;
    case 'WebSite':
      if (!schema.name) issues.push('WebSite missing name');
      if (!schema.url) issues.push('WebSite missing url');
      break;
    case 'Service':
      if (!schema.name) issues.push('Service missing name');
      if (!schema.description) issues.push('Service missing description');
      break;
    case 'Article':
      if (!schema.headline) issues.push('Article missing headline');
      if (!schema.author) issues.push('Article missing author');
      if (!schema.datePublished) issues.push('Article missing datePublished');
      break;
    case 'BreadcrumbList':
      if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
        issues.push('BreadcrumbList missing itemListElement array');
      }
      break;
    case 'FAQPage':
      if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
        issues.push('FAQPage missing mainEntity array');
      }
      break;
  }
  
  return issues;
}

/**
 * Main validation function
 */
async function validateAllPages() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  console.log('🔍 Starting structured data validation...\n');
  
  for (const testPage of PAGES_TO_TEST) {
    console.log(`Testing: ${testPage.name} (${testPage.url})`);
    
    const structuredData = await extractStructuredData(page, testPage.url);
    
    const pageResult = {
      url: testPage.url,
      name: testPage.name,
      expectedSchemas: testPage.expectedSchemas,
      foundSchemas: [],
      validationResults: [],
      issues: [],
      status: 'success'
    };
    
    if (structuredData.error) {
      pageResult.status = 'error';
      pageResult.issues.push(`Failed to load page: ${structuredData.error}`);
    } else if (structuredData.length === 0) {
      pageResult.status = 'warning';
      pageResult.issues.push('No structured data found');
    } else {
      // Process each schema found
      structuredData.forEach((schema, index) => {
        if (schema.error) {
          pageResult.issues.push(`Schema ${index + 1}: ${schema.error}`);
          return;
        }
        
        const schemaType = schema['@type'];
        pageResult.foundSchemas.push(schemaType);
        
        const validationIssues = validateSchema(schema);
        pageResult.validationResults.push({
          type: schemaType,
          issues: validationIssues,
          valid: validationIssues.length === 0
        });
        
        if (validationIssues.length > 0) {
          pageResult.issues.push(`${schemaType}: ${validationIssues.join(', ')}`);
        }
      });
      
      // Check if expected schemas are present
      testPage.expectedSchemas.forEach(expectedSchema => {
        if (!pageResult.foundSchemas.includes(expectedSchema)) {
          pageResult.issues.push(`Missing expected schema: ${expectedSchema}`);
        }
      });
      
      if (pageResult.issues.length > 0) {
        pageResult.status = 'warning';
      }
    }
    
    results.push(pageResult);
    
    // Log immediate results
    if (pageResult.status === 'success') {
      console.log(`  ✅ Success - Found: ${pageResult.foundSchemas.join(', ')}`);
    } else if (pageResult.status === 'warning') {
      console.log(`  ⚠️  Warning - Issues: ${pageResult.issues.length}`);
    } else {
      console.log(`  ❌ Error - ${pageResult.issues[0]}`);
    }
    
    console.log('');
  }
  
  await browser.close();
  
  // Generate summary report
  const summary = {
    totalPages: results.length,
    successfulPages: results.filter(r => r.status === 'success').length,
    pagesWithWarnings: results.filter(r => r.status === 'warning').length,
    failedPages: results.filter(r => r.status === 'error').length,
    timestamp: new Date().toISOString()
  };
  
  const report = {
    summary,
    results
  };
  
  // Save detailed report
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('📊 VALIDATION SUMMARY');
  console.log('===================');
  console.log(`Total pages tested: ${summary.totalPages}`);
  console.log(`✅ Successful: ${summary.successfulPages}`);
  console.log(`⚠️  With warnings: ${summary.pagesWithWarnings}`);
  console.log(`❌ Failed: ${summary.failedPages}`);
  console.log(`\n📄 Detailed report saved to: ${OUTPUT_FILE}`);
  
  if (summary.pagesWithWarnings > 0 || summary.failedPages > 0) {
    console.log('\n🔍 ISSUES FOUND:');
    results.forEach(result => {
      if (result.issues.length > 0) {
        console.log(`\n${result.name}:`);
        result.issues.forEach(issue => console.log(`  - ${issue}`));
      }
    });
  }
  
  return report;
}

// Run validation if script is executed directly
if (require.main === module) {
  validateAllPages().catch(console.error);
}

module.exports = { validateAllPages, extractStructuredData, validateSchema };
