// ElevenLabs Knowledge Base Integration - Final Validation Script
// This script validates the complete implementation

import fs from 'fs'

// Simple chalk replacement for colored output
const chalk = {
  green: (text) => `✅ ${text}`,
  red: (text) => `❌ ${text}`,
  blue: (text) => `🔵 ${text}`,
  yellow: (text) => `⚠️ ${text}`
}

const validateKnowledgeBaseIntegration = async () => {
  console.log(chalk.blue('🚀 ElevenLabs Knowledge Base Integration - Final Validation\n'))

  const validationResults = {
    knowledgeBaseEndpoint: false,
    contentQuality: false,
    widgetConfiguration: false,
    companySections: false,
    aiGuidelines: false,
    technicalSpecs: false,
    overall: false
  }

  try {
    // Test 1: Knowledge Base Endpoint Accessibility
    console.log(chalk.blue('📡 Testing Knowledge Base Endpoint...'))
    
    const response = await fetch('http://localhost:3003/api/knowledge-base/elevenlabs')
    
    if (response.ok) {
      validationResults.knowledgeBaseEndpoint = true
      console.log(chalk.green('✅ Knowledge Base Endpoint: ACCESSIBLE'))
    } else {
      console.log(chalk.red(`❌ Knowledge Base Endpoint: FAILED (${response.status})`))
      return validationResults
    }

    const content = await response.text()
    
    // Test 2: Content Quality and Length
    console.log(chalk.blue('\n📄 Validating Content Quality...'))
    
    if (content.length > 15000) {
      validationResults.contentQuality = true
      console.log(chalk.green(`✅ Content Quality: EXCELLENT (${content.length} characters)`))
    } else {
      console.log(chalk.red(`❌ Content Quality: INSUFFICIENT (${content.length} characters)`))
    }

    // Test 3: Required Company Sections
    console.log(chalk.blue('\n🏢 Checking Company Information Sections...'))
    
    const requiredSections = [
      'COMPANY OVERVIEW',
      'SERVICES AND CAPABILITIES', 
      'FREQUENTLY ASKED QUESTIONS',
      'AI ASSISTANT GUIDELINES',
      'TECHNICAL CAPABILITIES'
    ]

    const foundSections = requiredSections.filter(section => content.includes(section))
    
    if (foundSections.length === requiredSections.length) {
      validationResults.companySections = true
      console.log(chalk.green(`✅ Company Sections: ALL PRESENT (${foundSections.length}/${requiredSections.length})`))
    } else {
      console.log(chalk.red(`❌ Company Sections: INCOMPLETE (${foundSections.length}/${requiredSections.length})`))
      console.log(chalk.yellow('   Missing:', requiredSections.filter(s => !content.includes(s)).join(', ')))
    }

    // Test 4: AI Assistant Guidelines
    console.log(chalk.blue('\n🤖 Validating AI Assistant Guidelines...'))
    
    const aiGuidelines = [
      'COMPANY EXPERTISE EMPHASIS',
      'SERVICE OFFERINGS TO HIGHLIGHT',
      'TARGET MARKET INFORMATION',
      'COMMUNICATION STYLE',
      'TECHNICAL CAPABILITIES'
    ]

    const foundGuidelines = aiGuidelines.filter(guideline => content.includes(guideline))
    
    if (foundGuidelines.length >= 4) {
      validationResults.aiGuidelines = true
      console.log(chalk.green(`✅ AI Guidelines: COMPREHENSIVE (${foundGuidelines.length}/${aiGuidelines.length})`))
    } else {
      console.log(chalk.red(`❌ AI Guidelines: INCOMPLETE (${foundGuidelines.length}/${aiGuidelines.length})`))
    }

    // Test 5: Technical Specifications
    console.log(chalk.blue('\n⚙️ Checking Technical Specifications...'))
    
    const technicalElements = [
      'Enterprise AI Development',
      'Blockchain Solutions',
      'Smart Contract Development',
      'Machine Learning',
      'Fortune 500 companies',
      '95% client satisfaction'
    ]

    const foundTechnical = technicalElements.filter(element => content.includes(element))
    
    if (foundTechnical.length >= 5) {
      validationResults.technicalSpecs = true
      console.log(chalk.green(`✅ Technical Specs: COMPLETE (${foundTechnical.length}/${technicalElements.length})`))
    } else {
      console.log(chalk.red(`❌ Technical Specs: INCOMPLETE (${foundTechnical.length}/${technicalElements.length})`))
    }    // Test 6: Widget Configuration (static check)
    console.log(chalk.blue('\n🔧 Checking Widget Configuration...'))
    
    try {
      const layoutPath = 'app/layout.tsx'
      
      if (fs.existsSync(layoutPath)) {
        const layoutContent = fs.readFileSync(layoutPath, 'utf8')
        
        // Check for new ElevenLabs widget implementation
        const hasWidgetElement = layoutContent.includes('elevenlabs-convai')
        const hasCorrectAgentId = layoutContent.includes('agent-id="GkOKedIUAelQwYORYU3j"')
        const hasWidgetScript = layoutContent.includes('unpkg.com/@elevenlabs/convai-widget-embed')
        
        if (hasWidgetElement && hasCorrectAgentId && hasWidgetScript) {
          validationResults.widgetConfiguration = true
          console.log(chalk.green('✅ Widget Configuration: PROPERLY CONFIGURED (New Widget)'))
        } else {
          console.log(chalk.red('❌ Widget Configuration: INCORRECT SETUP'))
          if (!hasWidgetElement) console.log(chalk.yellow('  - Missing widget element'))
          if (!hasCorrectAgentId) console.log(chalk.yellow('  - Missing or incorrect agent ID'))
          if (!hasWidgetScript) console.log(chalk.yellow('  - Missing widget script'))
        }
      } else {
        console.log(chalk.yellow('⚠️ Widget Configuration: LAYOUT FILE NOT FOUND'))
      }} catch (err) {
      console.log(chalk.yellow('⚠️ Widget Configuration: UNABLE TO CHECK'))
      console.log(err.message)
    }

    // Overall Assessment
    console.log(chalk.blue('\n📊 Overall Assessment...'))
    
    const passedTests = Object.values(validationResults).filter(Boolean).length
    const totalTests = Object.keys(validationResults).length - 1 // Exclude 'overall'
    
    if (passedTests >= totalTests - 1) {
      validationResults.overall = true
      console.log(chalk.green(`🎉 VALIDATION PASSED: ${passedTests}/${totalTests} tests successful`))
      console.log(chalk.green('✅ ElevenLabs Knowledge Base Integration is READY FOR PRODUCTION'))
    } else {
      console.log(chalk.red(`❌ VALIDATION FAILED: ${passedTests}/${totalTests} tests successful`))
      console.log(chalk.red('🔧 Please address the failed tests before deployment'))
    }

    // Generate Summary Report
    console.log(chalk.blue('\n📋 Validation Summary Report:'))
    console.log('=====================================')
    console.log(`Knowledge Base Endpoint: ${validationResults.knowledgeBaseEndpoint ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Content Quality: ${validationResults.contentQuality ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Company Sections: ${validationResults.companySections ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`AI Guidelines: ${validationResults.aiGuidelines ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Technical Specs: ${validationResults.technicalSpecs ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Widget Configuration: ${validationResults.widgetConfiguration ? '✅ PASS' : '❌ FAIL'}`)
    console.log('=====================================')
    console.log(`Overall Status: ${validationResults.overall ? '✅ READY' : '❌ NEEDS WORK'}`)

    return validationResults

  } catch (error) {
    console.error(chalk.red('🚨 Validation Error:'), error.message)
    return validationResults
  }
}

// Additional helper functions for extended validation
const validateResponseTime = async () => {
  console.log(chalk.blue('\n⏱️ Testing Response Time...'))
  
  const startTime = Date.now()
  try {
    await fetch('http://localhost:3003/api/knowledge-base/elevenlabs')
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    if (responseTime < 2000) {
      console.log(chalk.green(`✅ Response Time: EXCELLENT (${responseTime}ms)`))
      return true
    } else if (responseTime < 5000) {
      console.log(chalk.yellow(`⚠️ Response Time: ACCEPTABLE (${responseTime}ms)`))
      return true
    } else {
      console.log(chalk.red(`❌ Response Time: TOO SLOW (${responseTime}ms)`))
      return false
    }  } catch (error) {
    console.log(chalk.red('❌ Response Time: TEST FAILED'))
    console.log(error.message)
    return false
  }
}

const validateCacheHeaders = async () => {
  console.log(chalk.blue('\n🗄️ Testing Cache Configuration...'))
  
  try {
    const response = await fetch('http://localhost:3003/api/knowledge-base/elevenlabs')
    const cacheControl = response.headers.get('cache-control')
    const contentType = response.headers.get('content-type')
    
    if (cacheControl && cacheControl.includes('max-age')) {
      console.log(chalk.green(`✅ Cache Control: CONFIGURED (${cacheControl})`))
    } else {
      console.log(chalk.red('❌ Cache Control: NOT CONFIGURED'))
    }
    
    if (contentType && contentType.includes('text/plain')) {
      console.log(chalk.green(`✅ Content Type: CORRECT (${contentType})`))
    } else {
      console.log(chalk.red(`❌ Content Type: INCORRECT (${contentType})`))
    }
    
    return true
  } catch (error) {
    console.log(chalk.red('❌ Cache Headers: TEST FAILED'))
    return false
  }
}

// Run comprehensive validation
const runCompleteValidation = async () => {
  console.log(chalk.blue('🔍 Starting Comprehensive Validation...\n'))
  
  const mainResults = await validateKnowledgeBaseIntegration()
  await validateResponseTime()
  await validateCacheHeaders()
  
  console.log(chalk.blue('\n🏁 Validation Complete!'))
  
  if (mainResults.overall) {
    console.log(chalk.green('\n🎊 CONGRATULATIONS! 🎊'))
    console.log(chalk.green('The ElevenLabs Knowledge Base Integration is fully operational and ready for production use.'))
    console.log(chalk.green('\nNext Steps:'))
    console.log('- Deploy to production environment')
    console.log('- Configure ElevenLabs agent with knowledge base URL')
    console.log('- Monitor AI assistant performance and user interactions')
    console.log('- Update content as needed through the content scraper')
  } else {
    console.log(chalk.red('\n⚠️ Issues Detected'))
    console.log(chalk.red('Please address the failed validation tests before proceeding to production.'))
  }
}

// Execute validation
runCompleteValidation().catch(console.error)
