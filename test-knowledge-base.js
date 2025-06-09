// Test script for ElevenLabs Knowledge Base Integration
// Run this to verify the knowledge base is working correctly

const testKnowledgeBase = async () => {
  try {
    console.log('🔍 Testing ElevenLabs Knowledge Base Endpoint...')
    
    const response = await fetch('http://localhost:3000/api/knowledge-base/elevenlabs')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const content = await response.text()
    
    console.log('✅ Knowledge Base Endpoint Response:')
    console.log('📊 Content Length:', content.length, 'characters')
    console.log('📄 Content Type:', response.headers.get('content-type'))
    console.log('🔄 Cache Control:', response.headers.get('cache-control'))
    
    // Check for key sections
    const checkSections = [
      'COMPANY OVERVIEW',
      'SERVICES AND CAPABILITIES',
      'WEBSITE CONTENT ANALYSIS',
      'FREQUENTLY ASKED QUESTIONS',
      'AI ASSISTANT GUIDELINES'
    ]
    
    console.log('\n🔍 Checking for required sections:')
    checkSections.forEach(section => {
      const found = content.includes(section)
      console.log(`${found ? '✅' : '❌'} ${section}: ${found ? 'Found' : 'Missing'}`)
    })
    
    // Check for company information
    const companyChecks = [
      'Fantastic AI Studio',
      'https://fais.world',
      'Fortune 500 companies',
      '95% client satisfaction rate',
      'Enterprise AI Development',
      'Blockchain Solutions'
    ]
    
    console.log('\n🏢 Checking for company information:')
    companyChecks.forEach(info => {
      const found = content.includes(info)
      console.log(`${found ? '✅' : '❌'} ${info}: ${found ? 'Found' : 'Missing'}`)
    })
    
    // Show sample content
    console.log('\n📝 Sample content (first 500 characters):')
    console.log(content.substring(0, 500) + '...')
    
    console.log('\n🎉 Knowledge Base Test Complete!')
    
    return {
      success: true,
      contentLength: content.length,
      sectionsFound: checkSections.filter(section => content.includes(section)).length,
      companyInfoFound: companyChecks.filter(info => content.includes(info)).length
    }
    
  } catch (error) {
    console.error('❌ Knowledge Base Test Failed:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Run the test
testKnowledgeBase().then(result => {
  console.log('\n📊 Test Results:', result)
})
