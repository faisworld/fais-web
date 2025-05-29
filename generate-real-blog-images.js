#!/usr/bin/env node

// Generate real high-quality images for blog posts using the admin API

const blogImages = [
  {
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    topic: "DeFi",
    prompt: "Professional, high-quality blog featured image about Decentralized Finance (DeFi). Modern, clean, visually appealing design showing blockchain networks, cryptocurrency symbols, financial technology interfaces. Corporate style, professional photography aesthetic. Bright, vibrant colors with blue and gold accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities", 
    topic: "AI Blockchain",
    prompt: "Professional, high-quality blog featured image about AI and blockchain convergence. Modern, clean, visually appealing design showing artificial intelligence neural networks merged with blockchain technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with purple and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    topic: "Supply Chain",
    prompt: "Professional, high-quality blog featured image about blockchain supply chain management. Modern, clean, visually appealing design showing global logistics, shipping containers, blockchain networks. Corporate style, professional photography aesthetic. Bright, vibrant colors with green and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "recent-advancements-in-ai-and-machine-learning",
    topic: "AI ML",
    prompt: "Professional, high-quality blog featured image about AI and machine learning advancements. Modern, clean, visually appealing design showing neural networks, data processing, machine learning algorithms. Corporate style, professional photography aesthetic. Bright, vibrant colors with orange and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "the-future-of-quantum-computing-in-ai",
    topic: "Quantum AI",
    prompt: "Professional, high-quality blog featured image about quantum computing and AI. Modern, clean, visually appealing design showing quantum circuits, qubits, futuristic technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with cyan and purple accents. No text overlays. Suitable for a technology blog header."
  }
];

async function generateImageForBlogPost(blogImage) {
  try {
    console.log(`🎨 Generating image for: ${blogImage.topic}`);
    
    const response = await fetch('http://localhost:3003/api/admin/ai-tools/generate-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: blogImage.topic,
        keywords: [blogImage.topic],
        tone: 'Professional',
        wordCount: 500,
        includeImages: true,
        imagePromptOverride: blogImage.prompt
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.images && result.images.length > 0) {
      console.log(`✅ Generated image for ${blogImage.topic}:`);
      console.log(`   URL: ${result.images[0].url}`);
      return {
        slug: blogImage.slug,
        topic: blogImage.topic,
        imageUrl: result.images[0].url,
        alt: result.images[0].alt
      };
    } else {
      console.log(`❌ No image generated for ${blogImage.topic}`);
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error generating image for ${blogImage.topic}:`, error.message);
    return null;
  }
}

async function generateAllBlogImages() {
  console.log('🚀 Starting high-quality image generation for all blog posts...\n');
  
  const results = [];
  
  for (const blogImage of blogImages) {
    const result = await generateImageForBlogPost(blogImage);
    if (result) {
      results.push(result);
    }
    
    // Wait 3 seconds between requests to avoid rate limiting
    console.log('⏳ Waiting 3 seconds before next generation...\n');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n📋 Generated Images Summary:');
  console.log('=====================================');
  
  if (results.length === 0) {
    console.log('❌ No images were successfully generated.');
    return;
  }
  
  results.forEach(result => {
    console.log(`${result.topic}:`);
    console.log(`  Slug: ${result.slug}`);
    console.log(`  URL: ${result.imageUrl}`);
    console.log(`  Alt: ${result.alt}`);
    console.log('');
  });
  
  console.log('\n🔄 Update Commands for blog-data.ts:');
  console.log('===================================');
  results.forEach(result => {
    console.log(`// ${result.topic}`);
    console.log(`coverImage: "${result.imageUrl}",`);
    console.log('');
  });
}

generateAllBlogImages().catch(console.error);
