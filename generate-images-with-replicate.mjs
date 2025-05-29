import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '.env.local') });

const blogPosts = [
  {
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "DeFi Blockchain Finance",
    prompt: "Professional, high-quality blog featured image about Decentralized Finance (DeFi). Modern, clean, visually appealing design showing blockchain networks, cryptocurrency symbols, financial technology interfaces. Corporate style, professional photography aesthetic. Bright, vibrant colors with blue and gold accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities",
    title: "AI Blockchain Convergence", 
    prompt: "Professional, high-quality blog featured image about AI and blockchain convergence. Modern, clean, visually appealing design showing artificial intelligence neural networks merged with blockchain technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with purple and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    title: "Blockchain Supply Chain",
    prompt: "Professional, high-quality blog featured image about blockchain supply chain management. Modern, clean, visually appealing design showing global logistics, shipping containers, blockchain networks. Corporate style, professional photography aesthetic. Bright, vibrant colors with green and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "AI Machine Learning",
    prompt: "Professional, high-quality blog featured image about AI and machine learning advancements. Modern, clean, visually appealing design showing neural networks, data processing, machine learning algorithms. Corporate style, professional photography aesthetic. Bright, vibrant colors with orange and blue accents. No text overlays. Suitable for a technology blog header."
  },
  {
    slug: "the-future-of-quantum-computing-in-ai",
    title: "Quantum Computing AI",
    prompt: "Professional, high-quality blog featured image about quantum computing and AI. Modern, clean, visually appealing design showing quantum circuits, qubits, futuristic technology. Corporate style, professional photography aesthetic. Bright, vibrant colors with cyan and purple accents. No text overlays. Suitable for a technology blog header."
  }
];

async function generateImageWithReplicate(prompt, title) {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  
  if (!replicateApiToken) {
    console.error('❌ REPLICATE_API_TOKEN not found in environment variables');
    return null;
  }
  
  try {
    console.log(`🎨 Generating image for: ${title}`);
    
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: '9e3ce855e6437b594a6716d54a8c7d0eaa10c28a8ada83c52ee84bde3b98f88d', // Google Imagen 4
        input: {
          prompt: prompt,
          aspect_ratio: '16:9'
        }
      })
    });
    
    if (!response.ok) {
      console.error(`❌ Replicate API error: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const prediction = await response.json();
    console.log(`⏳ Started prediction for ${title}: ${prediction.id}`);
    
    // Poll for completion
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes max
    
    while ((result.status === 'starting' || result.status === 'processing') && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
        headers: {
          'Authorization': `Bearer ${replicateApiToken}`,
        }
      });
      
      if (statusResponse.ok) {
        result = await statusResponse.json();
        console.log(`⏳ ${title} status: ${result.status} (attempt ${attempts}/${maxAttempts})`);
      }
    }
    
    if (result.status === 'succeeded' && result.output && result.output.length > 0) {
      console.log(`✅ Generated image for ${title}: ${result.output[0]}`);
      return result.output[0];
    } else {
      console.error(`❌ Failed to generate image for ${title}:`, result.error || 'Unknown error');
      return null;
    }
    
  } catch (error) {
    console.error(`❌ Error generating image for ${title}:`, error.message);
    return null;
  }
}

async function generateBlogImages() {
  console.log('🚀 Starting high-quality image generation with Google Imagen 4...\n');
  
  const results = [];
  
  for (const post of blogPosts) {
    const imageUrl = await generateImageWithReplicate(post.prompt, post.title);
    if (imageUrl) {
      results.push({
        slug: post.slug,
        title: post.title,
        imageUrl: imageUrl
      });
    }
    
    // Wait between requests
    if (blogPosts.indexOf(post) < blogPosts.length - 1) {
      console.log('⏳ Waiting 5 seconds before next generation...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  console.log('\n🎉 Image Generation Complete!');
  console.log('=====================================\n');
  
  if (results.length === 0) {
    console.log('❌ No images were successfully generated.');
    return;
  }
  
  console.log('📋 Generated Images:');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.title}`);
    console.log(`   Slug: ${result.slug}`);
    console.log(`   URL: ${result.imageUrl}`);
    console.log('');
  });
  
  // Save results to a file for easy updating
  const updateScript = `// Generated image URLs for blog posts
// Update blog-data.ts and markdown files with these URLs

export const generatedImageUrls = {
${results.map(result => `  "${result.slug}": "${result.imageUrl}"`).join(',\n')}
};

// Copy-paste ready coverImage values for blog-data.ts:
${results.map(result => `coverImage: "${result.imageUrl}",  // ${result.title}`).join('\n')}
`;

  fs.writeFileSync('generated-image-urls.js', updateScript);
  console.log('💾 Saved results to: generated-image-urls.js');
  
  return results;
}

generateBlogImages().catch(console.error);
