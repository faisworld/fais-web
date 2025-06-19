#!/usr/bin/env node

/**
 * Test script to validate ElevenLabs widget exclusion on Kvitka-poloniny page
 * This script checks that:
 * 1. Global FAIS widget is excluded from /kvitka-poloniny
 * 2. Only the Kvitka-specific widget appears on that page
 * 3. Global widget appears on other pages
 */

import puppeteer from 'puppeteer';

const BASE_URL = 'http://localhost:3000';

async function testWidgetExclusion() {
  console.log('🧪 Testing ElevenLabs Widget Exclusion Logic...\n');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: false, // Set to true for CI
      defaultViewport: { width: 1280, height: 720 }
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
      if (msg.text().includes('ConditionalElevenLabsWidget') || 
          msg.text().includes('Kvitka') || 
          msg.text().includes('elevenlabs')) {
        console.log('🖥️  Browser:', msg.text());
      }
    });
      // Test 1: Check home page (should have global widget)
    console.log('📋 Test 1: Home page - should have global FAIS widget');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const homeGlobalWidgets = await page.$$('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
    const homeKvitkaWidgets = await page.$$('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]');
    
    console.log(`   ✅ Global FAIS widgets found: ${homeGlobalWidgets.length}`);
    console.log(`   ✅ Kvitka widgets found: ${homeKvitkaWidgets.length}`);
    
    if (homeGlobalWidgets.length > 0 && homeKvitkaWidgets.length === 0) {
      console.log('   ✅ PASS: Home page correctly shows global widget only\n');
    } else {
      console.log('   ❌ FAIL: Home page widget configuration incorrect\n');
    }
    
    // Test 2: Check Kvitka-poloniny page (should have only Kvitka widget)
    console.log('📋 Test 2: Kvitka-poloniny page - should have only Kvitka widget');
    await page.goto(`${BASE_URL}/kvitka-poloniny`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Extra time for cleanup to work
    
    const kvitkaGlobalWidgets = await page.$$('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
    const kvitkaSpecificWidgets = await page.$$('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]');
    
    console.log(`   🎯 Global FAIS widgets found: ${kvitkaGlobalWidgets.length}`);
    console.log(`   🎯 Kvitka widgets found: ${kvitkaSpecificWidgets.length}`);
    
    if (kvitkaGlobalWidgets.length === 0 && kvitkaSpecificWidgets.length > 0) {
      console.log('   ✅ PASS: Kvitka page correctly shows only Kvitka widget\n');
    } else {
      console.log('   ❌ FAIL: Kvitka page widget configuration incorrect\n');
      if (kvitkaGlobalWidgets.length > 0) {
        console.log('   🚨 ISSUE: Global widget is appearing on Kvitka page!');
      }
      if (kvitkaSpecificWidgets.length === 0) {
        console.log('   🚨 ISSUE: Kvitka widget is not appearing!');
      }
    }
    
    // Test 3: Check about page (should have global widget)
    console.log('📋 Test 3: About page - should have global FAIS widget');
    await page.goto(`${BASE_URL}/about`, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const aboutGlobalWidgets = await page.$$('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
    const aboutKvitkaWidgets = await page.$$('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]');
    
    console.log(`   📄 Global FAIS widgets found: ${aboutGlobalWidgets.length}`);
    console.log(`   📄 Kvitka widgets found: ${aboutKvitkaWidgets.length}`);
    
    if (aboutGlobalWidgets.length > 0 && aboutKvitkaWidgets.length === 0) {
      console.log('   ✅ PASS: About page correctly shows global widget only\n');
    } else {
      console.log('   ❌ FAIL: About page widget configuration incorrect\n');
    }
    
    console.log('🎉 Widget exclusion testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testWidgetExclusion().catch(console.error);
