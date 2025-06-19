/**
 * This file contains a script to automate article generation for the blog.
 * It can be set up as a scheduled task or cron job to run at regular intervals.
 * 
 * This is an ESM module version.
 */

import { generateArticle } from './article-generator.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Get the directory name for proper path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  
  // Track generated article slugs for RAG update
  const generatedSlugs = [];
  
  // Generate articles for selected topics
  for (const index of selectedIndices) {
    const topic = TOPICS[index];
    const keywords = KEYWORDS[index];
    
    console.log(`Generating article on topic: ${topic}`);
    
    try {
      const articleResult = await generateArticle(topic, keywords);
      console.log(`✅ Successfully generated article about: ${topic}`);
      
      // Store the slug for RAG update
      if (articleResult && articleResult.slug) {
        generatedSlugs.push(articleResult.slug);
      }
    } catch (error) {
      console.error(`❌ Failed to generate article about: ${topic}`, error);
    }
    
    // Add delay between article generations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  console.log("Article generation completed!");
  return generatedSlugs;
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
