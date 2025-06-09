#!/usr/bin/env node

/**
 * Final Widget Deployment Verification Script
 * Verifies all components are ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 ELEVENLABS WIDGET - FINAL DEPLOYMENT VERIFICATION\n');

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function addTest(name, passed, details = '') {
  results.tests.push({ name, passed, details });
  if (passed) {
    results.passed++;
    console.log(`✅ ${name}${details ? ': ' + details : ''}`);
  } else {
    results.failed++;
    console.log(`❌ ${name}${details ? ': ' + details : ''}`);
  }
}

async function runVerification() {
  console.log('📋 Checking Implementation Files...\n');

  // Check layout.tsx for widget implementation
  try {
    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    
    addTest(
      'Widget Integration in Layout', 
      layoutContent.includes('elevenlabs-convai') && layoutContent.includes('GkOKedIUAelQwYORYU3j'),
      'Direct implementation found'
    );
    
    addTest(
      'Widget Form Validation Script', 
      layoutContent.includes('elevenlabs-input-') && layoutContent.includes('fixWidgetFormElements'),
      'Form fixing script present'
    );
  } catch (error) {
    addTest('Layout File Check', false, 'Could not read layout.tsx');
  }

  // Check MediaGallery.tsx for form fixes
  try {
    const galleryPath = path.join(process.cwd(), 'components', 'admin', 'MediaGallery.tsx');
    const galleryContent = fs.readFileSync(galleryPath, 'utf8');
    
    addTest(
      'Form Validation Fix', 
      galleryContent.includes('id=\'select-all-items\'') && galleryContent.includes('name=\'selectAllItems\''),
      'Checkbox has proper id and name attributes'
    );
  } catch (error) {
    addTest('MediaGallery Form Fix', false, 'Could not verify form fixes');
  }

  // Check next.config.js for optimizations
  try {
    const configPath = path.join(process.cwd(), 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    addTest(
      'Build Optimization Config', 
      configContent.includes('cpus: 4') && configContent.includes('export default'),
      'Performance optimizations and ES module export'
    );
  } catch (error) {
    addTest('Next.js Config Check', false, 'Could not verify config');
  }

  // Test knowledge base endpoint
  console.log('\n📡 Testing API Endpoints...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/knowledge-base/elevenlabs');
    
    addTest(
      'Knowledge Base Endpoint', 
      response.ok,
      `Status: ${response.status}`
    );
    
    if (response.ok) {
      const content = await response.text();
      
      addTest(
        'Content Quality', 
        content.length > 20000,
        `${content.length} characters`
      );
      
      addTest(
        'Cache Headers', 
        response.headers.get('cache-control') === 'public, max-age=1800',
        'Proper cache configuration'
      );
      
      addTest(
        'Content Type', 
        response.headers.get('content-type') === 'text/plain; charset=utf-8',
        'Correct content type for AI processing'
      );
    }
  } catch (error) {
    addTest('Knowledge Base Endpoint', false, 'Could not connect to localhost:3000');
  }

  // Check for old files that should be deleted
  console.log('\n🗑️ Checking Cleanup...\n');
  
  const oldFiles = [
    'components/ui/ElevenLabsWidget.tsx',
    'components/ui/ElevenLabsWidgetWrapper.tsx',
    'components/ui/ConditionalWidgetWrapper.tsx'
  ];
  
  oldFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    addTest(
      `Cleanup: ${path.basename(filePath)}`, 
      !fs.existsSync(fullPath),
      'Old file properly removed'
    );
  });

  // Check documentation
  console.log('\n📚 Checking Documentation...\n');
  
  const docFiles = [
    'docs/elevenlabs-widget-final-status-report.md',
    'docs/elevenlabs-widget-fix-summary.md'
  ];
  
  docFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    addTest(
      `Documentation: ${path.basename(filePath)}`, 
      fs.existsSync(fullPath),
      'Documentation file exists'
    );
  });

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 VERIFICATION SUMMARY');
  console.log('='.repeat(60));
  
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`📊 Success Rate: ${Math.round((results.passed / results.tests.length) * 100)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('🚀 Ready for Production Deployment');
    console.log('\nNext Steps:');
    console.log('1. Deploy to Vercel production');
    console.log('2. Configure ElevenLabs agent with: https://fais.world/api/knowledge-base/elevenlabs');
    console.log('3. Monitor widget performance');
    console.log('4. Collect user feedback');
  } else {
    console.log('\n⚠️ Some tests failed. Please review and fix issues before deployment.');
    console.log('\nFailed tests:');
    results.tests.filter(t => !t.passed).forEach(test => {
      console.log(`- ${test.name}: ${test.details}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

// Run verification
runVerification().catch(console.error);
