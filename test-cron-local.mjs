#!/usr/bin/env node

/**
 * Test script to verify cron functionality locally
 */

const CRON_SECRET = 'aQ7zL9kR3!xW1mP8*oN5bC2jH4fG0eD6uT9yI';
const LOCAL_URL = 'http://localhost:3000';

async function testCronEndpoint() {
  console.log('🧪 Testing cron endpoint locally...');
  
  try {
    const url = `${LOCAL_URL}/api/cron/simple-article-generation?cron_secret=${CRON_SECRET}`;
    
    console.log(`📞 Calling: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET'
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Cron test successful!');
      console.log('📄 Response:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Cron test failed!');
      console.error('📄 Response:', JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Cron test error:', error.message);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testCronEndpoint();
}

export { testCronEndpoint };
