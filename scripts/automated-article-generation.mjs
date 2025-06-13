/**
 * Enhanced Automated Article Generation with News Crawling and Duplicate Detection
 * This script crawls latest AI/blockchain news, generates unique articles with images,
 * and updates the knowledge base for the O3 LLM assistant.
 * 
 * Key Features:
 * - Web crawling for latest AI/blockchain news (3-4 sources)
 * - Duplicate detection to prevent repeated articles
 * - Simultaneous image generation and storage in Blobstore
 * - Knowledge base updates for O3 LLM assistant
 * - Separation between manual (localhost) and automated (production) generation
 */

import { generateArticle } from './article-generator.mjs';
import { crawlLatestNews, generateArticleTopicsFromNews } from './news-crawler.mjs';
import { checkForDuplicates, storeContentHash } from './duplicate-detection.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get the directory name for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fallback topics if news crawling fails
const FALLBACK_TOPICS = [
  "Latest advancements in large language models and AI reasoning",
  "Blockchain innovations transforming supply chain transparency",
  "AI-powered healthcare diagnostics and patient care revolution",
  "Ethereum Layer 2 solutions scaling decentralized applications",
  "DeFi protocol innovations and yield optimization strategies",
  "AI image generation breakthroughs and creative applications",
  "Smart contract automation in real estate and property management",
  "Machine learning optimization for enterprise business processes",
  "NFT utility expansion beyond digital art and collectibles",
  "Quantum computing impact on blockchain cryptography and security"
];

const FALLBACK_KEYWORDS = [
  ["AI", "LLM", "machine learning", "artificial intelligence", "reasoning"],
  ["blockchain", "supply chain", "transparency", "traceability", "logistics"],
  ["healthcare AI", "medical diagnostics", "patient care", "healthcare innovation"],
  ["Ethereum", "Layer 2", "scaling", "DeFi", "dApps"],
  ["DeFi", "decentralized finance", "yield farming", "liquidity", "protocols"],
  ["AI art", "image generation", "creative AI", "generative models"],
  ["smart contracts", "real estate", "property", "automation", "blockchain"],
  ["automation", "business processes", "ML optimization", "enterprise AI"],
  ["NFT", "digital ownership", "utility tokens", "blockchain applications"],
  ["quantum computing", "cryptography", "blockchain security", "post-quantum"]
];

/**
 * Generate multiple articles based on latest news or fallback topics
 */
async function generateMultipleArticles() {
  console.log("🚀 Starting enhanced automated article generation...");
  
  // Get current date for logging
  const currentDate = new Date().toISOString();
  console.log(`Run started at: ${currentDate}`);
  
  // Check if this is production or development
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
  console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
  
  let selectedTopics = [];
  
  try {
    // Step 1: Crawl latest news for AI and blockchain topics
    console.log("\n🔍 Crawling latest AI and blockchain news...");
    const latestNews = await crawlLatestNews();
    
    if (latestNews && latestNews.length > 0) {
      console.log(`✅ Found ${latestNews.length} relevant news articles`);
      
      // Generate topics based on news
      const newsTopics = generateArticleTopicsFromNews(latestNews);
      selectedTopics = newsTopics.slice(0, 2); // Use 1-2 news-based topics
      
      console.log(`📝 Generated ${selectedTopics.length} topics from news`);
      selectedTopics.forEach((topic, index) => {
        console.log(`  ${index + 1}. ${topic.topic}`);
      });
    } else {
      console.log("⚠️  No relevant news found, using fallback topics");
    }
  } catch (error) {
    console.error("❌ Error crawling news:", error.message);
    console.log("⚠️  Falling back to predefined topics");
  }
  
  // Step 2: Use fallback topics if needed
  if (selectedTopics.length === 0) {
    const numArticlesToGenerate = Math.floor(Math.random() * 2) + 1; // Generate 1-2 articles
    const selectedIndices = [];
    
    // Select random topic indices without duplication
    while (selectedIndices.length < numArticlesToGenerate) {
      const randomIndex = Math.floor(Math.random() * FALLBACK_TOPICS.length);
      if (!selectedIndices.includes(randomIndex)) {
        selectedIndices.push(randomIndex);
      }
    }
    
    selectedTopics = selectedIndices.map(index => ({
      topic: FALLBACK_TOPICS[index],
      keywords: FALLBACK_KEYWORDS[index],
      category: index < 5 ? 'ai' : 'blockchain'
    }));
  }
  
  // Track generated article slugs for RAG update
  const generatedSlugs = [];
  let successfulGenerations = 0;
  
  // Step 3: Generate articles for selected topics with duplicate checking
  for (const topicObj of selectedTopics) {
    const topic = topicObj.topic;
    const keywords = topicObj.keywords;
    
    console.log(`\n📝 Processing topic: ${topic}`);
    console.log(`🔍 Keywords: ${keywords.join(', ')}`);
    
    try {
      // Step 3a: Generate article content first to check for duplicates
      console.log("🤖 Generating article content...");
      
      // Use a preliminary generation to check for duplicates
      const preliminaryResult = await generatePreliminaryArticle(topic, keywords);
      
      if (!preliminaryResult) {
        console.log("❌ Failed to generate preliminary article content");
        continue;
      }
      
      // Step 3b: Check for duplicates
      console.log("🔍 Checking for duplicate content...");
      const duplicateCheck = await checkForDuplicates(
        preliminaryResult.title, 
        preliminaryResult.content,
        0.65 // Slightly lower threshold for more unique content
      );
      
      if (duplicateCheck.isDuplicate) {
        console.log(`⚠️  Skipping duplicate article: ${duplicateCheck.reason}`);
        if (duplicateCheck.similarTitle) {
          console.log(`   Similar to: "${duplicateCheck.similarTitle}"`);
        }
        if (duplicateCheck.similarity) {
          console.log(`   Similarity: ${(duplicateCheck.similarity * 100).toFixed(1)}%`);
        }
        continue;
      }
      
      console.log("✅ Content is unique, proceeding with full generation...");
      
      // Step 3c: Generate full article with image
      const articleResult = await generateArticle(topic, keywords);
      
      if (articleResult && articleResult.slug) {
        console.log(`✅ Successfully generated article: "${articleResult.title}"`);
        console.log(`🖼️  Image URL: ${articleResult.imageUrl || 'No image generated'}`);
        
        // Store content hash to prevent future duplicates
        await storeContentHash(articleResult.title, articleResult.content);
        
        generatedSlugs.push(articleResult.slug);
        successfulGenerations++;
      } else {
        console.log(`❌ Failed to generate complete article for: ${topic}`);
      }
      
    } catch (error) {
      console.error(`❌ Error generating article for "${topic}":`, error.message);
    }
    
    // Add delay between article generations to avoid rate limiting
    if (selectedTopics.indexOf(topicObj) < selectedTopics.length - 1) {
      console.log("⏳ Waiting before next generation...");
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second delay
    }
  }
  
  console.log(`\n📊 Generation Summary:`);
  console.log(`   Attempted: ${selectedTopics.length} articles`);
  console.log(`   Successful: ${successfulGenerations} articles`);
  console.log(`   Generated slugs: ${generatedSlugs.join(', ')}`);
  
  console.log("✅ Article generation completed!");
  return generatedSlugs;
}

/**
 * Generate preliminary article content for duplicate checking
 */
async function generatePreliminaryArticle(topic, keywords) {
  try {
    // This is a simplified version just to get title and content for duplicate checking
    // We'll use the same API but won't save the result yet
    const result = await generateArticle(topic, keywords, 'informative', 600, false); // No image yet
    return result;
  } catch (error) {
    console.error('Error generating preliminary article:', error);
    return null;
  }
}

// Run the process
generateMultipleArticles()
  .then(async (generatedSlugs) => {
    console.log("Article generation process completed successfully");
    
    // Update the RAG knowledge base with new blog articles
    if (generatedSlugs && generatedSlugs.length > 0) {
      console.log("Updating RAG knowledge base with new articles...");
      try {
        // Run the blog knowledge base update script with the new article slugs
        const scriptPath = join(__dirname, 'update-blog-knowledge-base.mjs');
        const args = generatedSlugs.join(' ');
        const command = `node ${scriptPath} ${args}`;
        
        const { stdout, stderr } = await execAsync(command);
        console.log("RAG knowledge base update output:", stdout);
        if (stderr) console.error("RAG update stderr:", stderr);
        
        console.log("✅ RAG knowledge base updated successfully with new articles");
      } catch (error) {
        console.error("❌ Failed to update RAG knowledge base:", error);
      }
    } else {
      console.log("No articles were generated, skipping RAG knowledge base update");
    }
    
    // Also run the general website update as a fallback
    console.log("Running general RAG knowledge base update...");
    try {
      const generalScriptPath = join(__dirname, 'update-rag-knowledge-base.mjs');
      const { stdout, stderr } = await execAsync(`node ${generalScriptPath}`);
      
      console.log("General RAG update output:", stdout);
      if (stderr) console.error("General RAG update stderr:", stderr);
      console.log("✅ General RAG knowledge base update completed");
    } catch (error) {
      console.error("❌ Failed to run general RAG knowledge base update:", error);
    }
    
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error in article generation process:", error);
    process.exit(1);
  });
