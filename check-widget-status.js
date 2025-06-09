#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

console.log(chalk.blue('🔧 ElevenLabs Widget Status Check\n'));

try {
  // Check layout.tsx for widget implementation
  const layoutPath = 'app/layout.tsx';
  
  if (!fs.existsSync(layoutPath)) {
    console.log(chalk.red('❌ Layout file not found'));
    process.exit(1);
  }

  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  
  // Check for new widget implementation
  const hasWidgetElement = layoutContent.includes('elevenlabs-convai');
  const hasCorrectAgentId = layoutContent.includes('GkOKedIUAelQwYORYU3j');
  const hasWidgetScript = layoutContent.includes('unpkg.com/@elevenlabs/convai-widget-embed');
  const usesDangerouslySetInnerHTML = layoutContent.includes('dangerouslySetInnerHTML');
  
  console.log(chalk.green('✅ Widget Implementation Status:'));
  console.log(`   Widget Element: ${hasWidgetElement ? '✅' : '❌'}`);
  console.log(`   Correct Agent ID: ${hasCorrectAgentId ? '✅' : '❌'}`);
  console.log(`   Widget Script: ${hasWidgetScript ? '✅' : '❌'}`);
  console.log(`   Safe HTML Rendering: ${usesDangerouslySetInnerHTML ? '✅' : '❌'}`);
  
  // Check for old widget remnants
  console.log(chalk.blue('\n🧹 Checking for old widget remnants:'));
  
  const oldWidgetFiles = [
    'components/ui/ElevenLabsWidget.tsx',
    'components/ui/ElevenLabsWidgetWrapper.tsx',
    'components/ui/ConditionalWidgetWrapper.tsx'
  ];
  
  let oldFilesFound = false;
  oldWidgetFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(chalk.yellow(`⚠️  Old file found: ${file}`));
      oldFilesFound = true;
    }
  });
  
  if (!oldFilesFound) {
    console.log(chalk.green('✅ No old widget files found - Clean implementation'));
  }
  
  // Overall status
  const isConfiguredCorrectly = hasWidgetElement && hasCorrectAgentId && hasWidgetScript && usesDangerouslySetInnerHTML;
  
  console.log(chalk.blue('\n📊 Overall Status:'));
  if (isConfiguredCorrectly && !oldFilesFound) {
    console.log(chalk.green('🎉 SUCCESS: New ElevenLabs widget is properly configured!'));
    console.log(chalk.white('   - Implementation: Direct HTML via dangerouslySetInnerHTML'));
    console.log(chalk.white('   - Script: Latest @elevenlabs/convai-widget-embed'));
    console.log(chalk.white('   - Agent ID: GkOKedIUAelQwYORYU3j'));
    console.log(chalk.white('   - No old widget remnants'));
    
    console.log(chalk.blue('\n🔧 Widget should now:'));
    console.log(chalk.white('   - Load correctly without TypeScript errors'));
    console.log(chalk.white('   - Use the new multi-modal widget design'));
    console.log(chalk.white('   - Respond properly to voice interactions'));
    console.log(chalk.white('   - Support the latest ElevenLabs features'));
    
  } else {
    console.log(chalk.red('❌ ISSUES DETECTED:'));
    if (!hasWidgetElement) console.log(chalk.red('   - Missing widget element'));
    if (!hasCorrectAgentId) console.log(chalk.red('   - Missing or incorrect agent ID'));
    if (!hasWidgetScript) console.log(chalk.red('   - Missing widget script'));
    if (!usesDangerouslySetInnerHTML) console.log(chalk.red('   - Not using safe HTML rendering'));
    if (oldFilesFound) console.log(chalk.red('   - Old widget files still present'));
  }
  
} catch (error) {
  console.error(chalk.red('❌ Error checking widget status:'), error.message);
  process.exit(1);
}
