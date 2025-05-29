/**
 * This file contains a script to automate article generation for the blog.
 * It can be set up as a scheduled task or cron job to run at regular intervals.
 * 
 * This is an ESM module version.
 */

import { generateArticle } from './article-generator.mjs';

const TOPICS = [
  "Latest advancements in large language models",
  "Blockchain innovations in supply chain management",
  "AI trends in healthcare and diagnostics",
  "Ethereum Layer 2 scaling solutions",
  "Decentralized finance (DeFi) latest developments",
  "AI image generation technology breakthroughs",
  "Smart contracts in real estate",
  "Machine learning for business automation",
  "NFT marketplaces and digital ownership",
  "Quantum computing impacts on blockchain security"
];

const KEYWORDS = [
  ["AI", "LLM", "machine learning", "natural language processing"],
  ["blockchain", "supply chain", "traceability", "transparency"],
  ["healthcare AI", "medical diagnostics", "patient care"],
  ["Ethereum", "Layer 2", "scaling", "Optimism", "zkSync"],
  ["DeFi", "decentralized finance", "liquidity", "yield farming"],
  ["generative AI", "image generation", "creative AI"],
  ["real estate", "property", "blockchain", "smart contracts"],
  ["automation", "business processes", "efficiency"],
  ["NFT", "digital art", "collectibles", "ownership"],
  ["quantum computing", "cryptography", "security"]
];

/**
 * Generate multiple articles on various topics
 */
async function generateMultipleArticles() {
  console.log("Starting automated article generation...");
  
  // Get current date for logging
  const currentDate = new Date().toISOString();
  console.log(`Run started at: ${currentDate}`);
  
  // Select random topics to generate
  const numArticlesToGenerate = Math.floor(Math.random() * 2) + 1; // Generate 1-2 articles per run
  const selectedIndices = [];
  
  // Select random topic indices without duplication
  while (selectedIndices.length < numArticlesToGenerate) {
    const randomIndex = Math.floor(Math.random() * TOPICS.length);
    if (!selectedIndices.includes(randomIndex)) {
      selectedIndices.push(randomIndex);
    }
  }
  
  // Generate articles for selected topics
  for (const index of selectedIndices) {
    const topic = TOPICS[index];
    const keywords = KEYWORDS[index];
    
    console.log(`Generating article on topic: ${topic}`);
    
    try {
      await generateArticle(topic, keywords);
      console.log(`✅ Successfully generated article about: ${topic}`);
    } catch (error) {
      console.error(`❌ Failed to generate article about: ${topic}`, error);
    }
    
    // Add delay between article generations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  console.log("Article generation completed!");
}

// Run the process
generateMultipleArticles()
  .then(() => {
    console.log("Article generation process completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error in article generation process:", error);
    process.exit(1);
  });
