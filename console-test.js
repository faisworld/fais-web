// Copy and paste this into the browser console to test widget configuration

console.log('🔍 Testing ElevenLabs Widget Configuration...\n');

// Wait a moment for widgets to load
setTimeout(() => {
  const globalWidgets = document.querySelectorAll('elevenlabs-convai[agent-id="GkOKedIUAelQwYORYU3j"]');
  const kvitkaWidgets = document.querySelectorAll('elevenlabs-convai[agent-id="iNXsli5ADa6T5QV7XQIM"]');
  const currentPath = window.location.pathname;
  
  console.log(`📍 Current path: ${currentPath}`);
  console.log(`🌐 Global FAIS widgets: ${globalWidgets.length}`);
  console.log(`🌸 Kvitka widgets: ${kvitkaWidgets.length}`);
  
  if (currentPath === '/kvitka-poloniny') {
    if (globalWidgets.length === 0 && kvitkaWidgets.length > 0) {
      console.log('✅ SUCCESS: Kvitka page shows only Kvitka widget');
    } else {
      console.log('❌ ISSUE: Widget configuration incorrect on Kvitka page');
      if (globalWidgets.length > 0) {
        console.log('   🚨 Global widgets found on Kvitka page!');
      }
      if (kvitkaWidgets.length === 0) {
        console.log('   🚨 No Kvitka widgets found!');
      }
    }
  } else {
    if (globalWidgets.length > 0 && kvitkaWidgets.length === 0) {
      console.log('✅ SUCCESS: Non-Kvitka page shows only global widget');
    } else {
      console.log('❌ ISSUE: Widget configuration incorrect on non-Kvitka page');
    }
  }
  
  // Check visibility
  globalWidgets.forEach((widget, i) => {
    const style = window.getComputedStyle(widget);
    console.log(`Global widget ${i+1} visible: ${style.display !== 'none' && style.visibility !== 'hidden'}`);
  });
  
  kvitkaWidgets.forEach((widget, i) => {
    const style = window.getComputedStyle(widget);
    console.log(`Kvitka widget ${i+1} visible: ${style.display !== 'none' && style.visibility !== 'hidden'}`);
  });
  
}, 2000);

console.log('⏳ Checking in 2 seconds...');
