/**
 * Browser Console Widget Validation Script
 * Run this in the browser console to check widget configuration
 */

console.log('🔍 Checking ElevenLabs Widgets Configuration...\n');

// Check for global FAIS widgets
const globalWidgets = document.querySelectorAll('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
console.log(`🌐 Global FAIS widgets found: ${globalWidgets.length}`);
globalWidgets.forEach((widget, index) => {
  console.log(`   Widget ${index + 1}:`, widget);
});

// Check for Kvitka-specific widgets
const kvitkaWidgets = document.querySelectorAll('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]');
console.log(`🌸 Kvitka widgets found: ${kvitkaWidgets.length}`);
kvitkaWidgets.forEach((widget, index) => {
  console.log(`   Widget ${index + 1}:`, widget);
});

// Check current page path
console.log(`📍 Current path: ${window.location.pathname}`);

// Determine expected behavior
const currentPath = window.location.pathname;
const isKvitkaPage = currentPath === '/kvitka-poloniny';

console.log('\n📋 Expected Behavior:');
if (isKvitkaPage) {
  console.log('   - Should have 0 global FAIS widgets');
  console.log('   - Should have 1+ Kvitka widgets');
} else {
  console.log('   - Should have 1+ global FAIS widgets');
  console.log('   - Should have 0 Kvitka widgets');
}

console.log('\n🎯 Results:');
if (isKvitkaPage) {
  if (globalWidgets.length === 0 && kvitkaWidgets.length > 0) {
    console.log('✅ PASS: Kvitka page correctly shows only Kvitka widget');
  } else {
    console.log('❌ FAIL: Kvitka page widget configuration is incorrect');
    if (globalWidgets.length > 0) {
      console.log('   🚨 ISSUE: Global widget is appearing on Kvitka page!');
    }
    if (kvitkaWidgets.length === 0) {
      console.log('   🚨 ISSUE: Kvitka widget is missing!');
    }
  }
} else {
  if (globalWidgets.length > 0 && kvitkaWidgets.length === 0) {
    console.log('✅ PASS: Non-Kvitka page correctly shows only global widget');
  } else {
    console.log('❌ FAIL: Non-Kvitka page widget configuration is incorrect');
  }
}

// Additional debug info
console.log('\n🔧 Debug Info:');
console.log('All elevenlabs-convai elements:', document.querySelectorAll('elevenlabs-convai'));
console.log('All script tags with elevenlabs:', document.querySelectorAll('script[src*="elevenlabs"]'));

// Set up live monitoring
let monitorCount = 0;
const monitor = setInterval(() => {
  monitorCount++;
  const currentGlobal = document.querySelectorAll('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]').length;
  const currentKvitka = document.querySelectorAll('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]').length;
  
  console.log(`📊 Monitor ${monitorCount}: Global=${currentGlobal}, Kvitka=${currentKvitka}`);
  
  if (monitorCount >= 10) {
    clearInterval(monitor);
    console.log('🏁 Monitoring complete');
  }
}, 1000);
