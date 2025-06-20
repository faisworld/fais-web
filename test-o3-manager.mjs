#!/usr/bin/env node

/**
 * Test script for Enhanced O3 Manager
 */

import { o3Manager } from './utils/enhanced-o3-manager.ts';

async function testO3Manager() {
  console.log('🧪 Testing Enhanced O3 Manager...\n');
    try {
    // Build context
    console.log('📋 Building website context...');
    await o3Manager.buildContext();
    
    console.log('\n📊 Context Summary:');
    console.log(o3Manager.getContextSummary());
    
    console.log('\n🔍 SEO Analysis Context:');
    const seoContext = await o3Manager.getSEOAnalysisContext();
    console.log(seoContext);
    
    console.log('\n✅ Enhanced O3 Manager test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test
testO3Manager();
