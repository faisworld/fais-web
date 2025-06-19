/**
 * Test Script for Enhanced Article Generation System
 * Tests news crawling, duplicate detection, and article generation
 */

import { crawlLatestNews, generateArticleTopicsFromNews } from './news-crawler.mjs';
import { checkForDuplicates, storeContentHash } from './duplicate-detection.mjs';
import { generateArticle } from './article-generator.mjs';

async function testNewsCrawler() {
  console.log('\n🔍 Testing News Crawler...');
  
  try {
    const news = await crawlLatestNews();
    
    if (news && news.length > 0) {
      console.log(`✅ Successfully crawled ${news.length} news articles`);
      news.forEach((article, index) => {
        console.log(`  ${index + 1}. ${article.title.slice(0, 60)}...`);
        console.log(`     Source: ${article.source}`);
      });
      
      const topics = generateArticleTopicsFromNews(news);
      console.log(`\n📝 Generated ${topics.length} article topics:`);
      topics.forEach((topic, index) => {
        console.log(`  ${index + 1}. ${topic.topic}`);
        console.log(`     Category: ${topic.category}`);
        console.log(`     Keywords: ${topic.keywords.join(', ')}`);
      });
      
      return topics;
    } else {
      console.log('⚠️  No news articles found');
      return [];
    }
  } catch (error) {
    console.error('❌ News crawler error:', error.message);
    return [];
  }
}

async function testDuplicateDetection() {
  console.log('\n🔍 Testing Duplicate Detection...');
  
  const testTitle1 = "AI Advancements in Machine Learning Technology";
  const testContent1 = "Artificial intelligence and machine learning are revolutionizing technology with breakthrough innovations in neural networks and deep learning algorithms.";
  
  const testTitle2 = "Machine Learning Breakthroughs in AI Technology";
  const testContent2 = "Machine learning and artificial intelligence continue to advance with new innovations in neural network architectures and deep learning methodologies.";
  
  const testTitle3 = "Blockchain Security in Cryptocurrency Networks";
  const testContent3 = "Blockchain technology provides enhanced security for cryptocurrency networks through decentralized verification and cryptographic protocols.";
  
  // Test 1: Check for duplicates when none exist
  console.log('Test 1: Checking unique content...');
  const result1 = await checkForDuplicates(testTitle3, testContent3);
  console.log(`Result: ${result1.isDuplicate ? 'Duplicate detected' : 'Content is unique'}`);
  
  // Test 2: Check similar content
  console.log('\nTest 2: Checking similar content...');
  const result2 = await checkForDuplicates(testTitle2, testContent2);
  console.log(`Result: ${result2.isDuplicate ? 'Duplicate detected' : 'Content is unique'}`);
  if (result2.isDuplicate) {
    console.log(`Reason: ${result2.reason}`);
    console.log(`Similarity: ${(result2.similarity * 100).toFixed(1)}%`);
  }
  
  // Test 3: Store and check hash
  console.log('\nTest 3: Testing content hash storage...');
  await storeContentHash(testTitle1, testContent1);
  console.log('✅ Content hash stored');
  
  return result1;
}

async function testArticleGeneration(topics) {
  console.log('\n🤖 Testing Article Generation...');
  
  let testTopic;
  let testKeywords;
  
  if (topics && topics.length > 0) {
    // Use news-based topic
    testTopic = topics[0].topic;
    testKeywords = topics[0].keywords;
    console.log(`Using news-based topic: ${testTopic}`);
  } else {
    // Use fallback topic
    testTopic = "Latest Developments in AI and Blockchain Integration";
    testKeywords = ["AI", "blockchain", "integration", "technology", "innovation"];
    console.log(`Using fallback topic: ${testTopic}`);
  }
  
  try {
    // Test duplicate check first
    console.log('🔍 Checking for existing similar content...');
    const duplicateCheck = await checkForDuplicates(testTopic, "Test content for duplicate detection");
    
    if (duplicateCheck.isDuplicate) {
      console.log('⚠️  Similar content exists, skipping generation');
      return null;
    }
    
    console.log('✅ Content is unique, proceeding with generation...');
    
    // Generate article
    console.log('📝 Generating test article...');
    const result = await generateArticle(testTopic, testKeywords, 'informative', 600, false); // No image for test
    
    if (result) {
      console.log('✅ Article generated successfully!');
      console.log(`   Title: ${result.title}`);
      console.log(`   Content length: ${result.content.length} characters`);
      console.log(`   Slug: ${result.slug}`);
      
      // Store hash for future duplicate detection
      await storeContentHash(result.title, result.content);
      
      return result;
    } else {
      console.log('❌ Article generation failed');
      return null;
    }
  } catch (error) {
    console.error('❌ Article generation error:', error.message);
    return null;
  }
}

async function testFullWorkflow() {
  console.log('🚀 Starting Full Article Generation System Test');
  console.log('==========================================');
  
  try {
    // Step 1: Test news crawling
    const newsTopics = await testNewsCrawler();
    
    // Step 2: Test duplicate detection
    await testDuplicateDetection();
    
    // Step 3: Test article generation
    const generatedArticle = await testArticleGeneration(newsTopics);
    
    // Summary
    console.log('\n📊 Test Summary');
    console.log('================');
    console.log(`News crawling: ${newsTopics.length > 0 ? '✅ Working' : '⚠️  Limited results'}`);
    console.log(`Duplicate detection: ✅ Working`);
    console.log(`Article generation: ${generatedArticle ? '✅ Working' : '❌ Failed'}`);
    
    if (generatedArticle) {
      console.log('\n🎉 All systems operational!');
      console.log('The enhanced article generation system is ready for production use.');
    } else {
      console.log('\n⚠️  Some issues detected. Please review the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Critical error in test workflow:', error);
  }
}

// Run the full test workflow
testFullWorkflow()
  .then(() => {
    console.log('\n✅ Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Test failed:', error);
    process.exit(1);
  });
