#!/usr/bin/env node
// Fix blog images by generating proper AI images for missing/placeholder images

import { generateArticleImageTool } from '../utils/o3-assistant-tools/generateArticleImageTool.js';

const imagesToGenerate = [
  {
    slug: "ai-image-generation-technology-breakthroughs",
    title: "AI Image Generation Technology Breakthroughs", 
    prompt: "Professional, high-quality blog featured image about AI image generation technology breakthroughs. Modern design showing neural networks, deep learning visualization, AI art generation, generative models, creativity algorithms. Clean corporate style with vibrant purple and blue gradients. No text overlays. 16:9 aspect ratio.",
    category: "ai"
  },
  {
    slug: "how-optimism-layer-2-can-transform-your-business",
    title: "How Optimism Layer 2 Can Transform Your Business",
    prompt: "Professional, high-quality blog featured image about Optimism Layer 2 blockchain technology for business transformation. Modern design showing network connections, blockchain scalability, business growth, Layer 2 solutions, fast transactions. Clean corporate style with red and blue colors (Optimism branding). No text overlays. 16:9 aspect ratio.",
    category: "blockchain"
  }
];

async function generateImageForBlogPost(blogPost) {
  try {
    console.log(`🎨 Generating image for: ${blogPost.title}`);
    
    const result = await generateArticleImageTool.execute({
      prompt: blogPost.prompt,
      aspectRatio: "16:9",
      modelIdentifier: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
    });
    
    console.log(`✅ Generated image for ${blogPost.slug}:`);
    console.log(`   URL: ${result.imageUrl}`);
    console.log(`   Alt: ${result.imageAlt}`);
    
    return {
      slug: blogPost.slug,
      imageUrl: result.imageUrl,
      alt: result.imageAlt,
      title: blogPost.title
    };
    
  } catch (error) {
    console.error(`❌ Failed to generate image for ${blogPost.slug}:`, error);
    return null;
  }
}

async function updateBlogDataWithNewImages(generatedImages) {
  console.log('\n📝 Updating blog-data.ts with new images...');
  
  generatedImages.forEach(image => {
    if (image) {
      console.log(`\n🔄 Update blog-data.ts for ${image.slug}:`);
      console.log(`   Replace coverImage with: "${image.imageUrl}"`);
    }
  });
  
  console.log('\n📋 Manual Update Instructions:');
  console.log('=====================================');
  console.log('Please manually update blog-data.ts with the following URLs:');
  
  generatedImages.forEach(image => {
    if (image) {
      console.log(`\n${image.slug}:`);
      console.log(`  coverImage: "${image.imageUrl}"`);
    }
  });
}

async function main() {
  console.log('🚀 Starting image generation for blog posts with missing images...\n');
  
  const results = [];
  
  for (const blogImage of imagesToGenerate) {
    const result = await generateImageForBlogPost(blogImage);
    if (result) {
      results.push(result);
    }
    
    // Wait 3 seconds between requests to avoid rate limiting
    if (imagesToGenerate.indexOf(blogImage) < imagesToGenerate.length - 1) {
      console.log('⏳ Waiting 3 seconds before next generation...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  if (results.length > 0) {
    await updateBlogDataWithNewImages(results);
  } else {
    console.log('❌ No images were successfully generated.');
  }
}

main().catch(console.error);
