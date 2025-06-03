#!/usr/bin/env node

/**
 * Test script to verify the automated article generation system works
 * with production authentication setup
 */

import { generateArticle } from './article-generator.mjs';

async function testArticleGeneration() {
  console.log('🧪 Testing Automated Article Generation System');
  console.log('===============================================');
  
  // Check environment setup
  console.log('\n📋 Environment Check:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`INTERNAL_API_KEY: ${process.env.INTERNAL_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log(`OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}`);
  
  if (!process.env.INTERNAL_API_KEY) {
    console.log('\n❌ INTERNAL_API_KEY is required for production testing');
    console.log('Set it with: export INTERNAL_API_KEY=your_secure_key');
    process.exit(1);
  }
  
  if (!process.env.OPENAI_API_KEY) {
    console.log('\n❌ OPENAI_API_KEY is required for article generation');
    console.log('Set it with: export OPENAI_API_KEY=your_openai_key');
    process.exit(1);
  }
  
  // Test article generation
  console.log('\n🚀 Testing Article Generation...');
  
  const testTopic = 'Latest developments in AI chatbot technology';
  const testKeywords = ['AI', 'chatbot', 'technology', 'artificial intelligence'];
  
  try {
    console.log(`Topic: ${testTopic}`);
    console.log(`Keywords: ${testKeywords.join(', ')}`);
    console.log('\nGenerating article...');
    
    const result = await generateArticle(testTopic, testKeywords, 'informative', 600);
    
    if (result) {
      console.log('\n✅ Article Generation Successful!');
      console.log(`Title: ${result.title}`);
      console.log(`Slug: ${result.slug}`);
      console.log(`Image URL: ${result.imageUrl ? '✅ Generated' : '❌ Missing'}`);
      console.log(`Content length: ${result.content.length} characters`);
      console.log('\n🎉 System is working correctly!');
    } else {
      console.log('\n❌ Article generation returned no result');
    }
    
  } catch (error) {
    console.error('\n❌ Article Generation Failed:');
    console.error(error.message);
    
    if (error.message.includes('401')) {
      console.log('\n💡 This might be an authentication issue.');
      console.log('Make sure INTERNAL_API_KEY matches your server configuration.');
    }
    
    if (error.message.includes('fetch')) {
      console.log('\n💡 This might be a network connectivity issue.');
      console.log('Make sure your server is running and accessible.');
    }
    
    process.exit(1);
  }
}

// Run the test
testArticleGeneration()
  .then(() => {
    console.log('\n✅ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
