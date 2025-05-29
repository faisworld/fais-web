// Script to generate high-quality images for existing blog posts
import { generateArticleImageTool } from './utils/o3-assistant-tools/generateArticleImageTool.js';

const blogPosts = [
  {
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "Decentralized Finance (DeFi): Latest Developments and Innovations",
    topic: "DeFi blockchain finance cryptocurrency"
  },
  {
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities", 
    title: "The Convergence of AI and Blockchain: Unlocking New Opportunities",
    topic: "AI blockchain convergence technology"
  },
  {
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    title: "How Blockchain Is Revolutionizing Supply Chain Management", 
    topic: "blockchain supply chain logistics management"
  },
  {
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "Recent Advancements in AI and Machine Learning",
    topic: "AI machine learning neural networks technology"
  },
  {
    slug: "the-future-of-quantum-computing-in-ai",
    title: "The Future of Quantum Computing in AI",
    topic: "quantum computing AI future technology"
  }
];

async function generateImagesForPosts() {
  console.log('Starting image generation for blog posts...');
  
  for (const post of blogPosts) {
    try {
      console.log(`\nGenerating image for: ${post.title}`);
      
      const prompt = `Professional, high-quality blog featured image about ${post.topic}. Modern, clean, visually appealing design. Corporate style, professional photography aesthetic. Relevant icons, graphics, or abstract representation. Bright, vibrant colors. No text overlays. Suitable for a technology blog header.`;
      
      const result = await generateArticleImageTool.execute({
        prompt,
        aspectRatio: "16:9",
        modelIdentifier: "google/imagen-4:9e3ce855e6437b594a6716d54a8c7d0eaa10c28a8ada83c52ee84bde3b98f88d"
      });
      
      console.log(`✅ Generated image for ${post.slug}:`);
      console.log(`   URL: ${result.imageUrl}`);
      console.log(`   Alt: ${result.imageAlt}`);
      
      // Store the result for later use
      post.generatedImage = result.imageUrl;
      
    } catch (error) {
      console.error(`❌ Failed to generate image for ${post.slug}:`, error);
    }
  }
  
  console.log('\n📋 Generated Images Summary:');
  blogPosts.forEach(post => {
    if (post.generatedImage) {
      console.log(`${post.slug}: ${post.generatedImage}`);
    }
  });
}

generateImagesForPosts().catch(console.error);
