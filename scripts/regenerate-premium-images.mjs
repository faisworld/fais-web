#!/usr/bin/env node

/**
 * PREMIUM IMAGE REGENERATION SCRIPT
 * 
 * This script uses ONLY Google's premium AI models for highest quality:
 * 1. Google Imagen 4 (most advanced, primary)
 * 2. Google Imagen 3 (reliable fallback)
 * 
 * Target: 3 blog articles that need better quality images
 * Replaces poor-quality Stability AI and other models with Google's best
 */

import Replicate from 'replicate';
import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!REPLICATE_API_TOKEN || !BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Missing required environment variables:');
  console.error('   - REPLICATE_API_TOKEN');
  console.error('   - BLOB_READ_WRITE_TOKEN');
  process.exit(1);
}

const replicate = new Replicate({
  auth: REPLICATE_API_TOKEN,
});

// Premium models in order of preference (GOOGLE'S BEST MODELS ONLY)
const PREMIUM_MODELS = [
  {
    name: "Google Imagen 4",
    id: "google/imagen-4",
    description: "Google's latest and most advanced image generation model",
    family: "google"
  },
  {
    name: "Google Imagen 3",
    id: "google/imagen-3", 
    description: "Google's previous generation - reliable fallback",
    family: "google"
  }
];

// The 3 articles that need premium image regeneration
const articlesNeedingPremiumImages = [
  {
    id: "1b7f607b",
    title: "NFT marketplaces and digital ownership",
    slug: "nft-marketplaces-and-digital-ownership",
    category: "blockchain",
    currentImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-nft-marketplaces-and-digital-ownership-stability-ai-stable-diffusion-3-1749818358071.jpg"
  },
  {
    id: "40e49042", 
    title: "Smart contracts in real estate",
    slug: "smart-contracts-in-real-estate",
    category: "ai",
    currentImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-smart-contracts-in-real-estate-stability-ai-stable-diffusion-3-1749818368774.jpg"
  },
  {
    id: "94ff4f62",
    title: "Decentralized finance (DeFi) latest developments", 
    slug: "decentralized-finance-defi-latest-developments",
    category: "blockchain",
    currentImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-decentralized-finance-defi-latest-developments-stability-ai-stable-diffusion-3-1749818378993.jpg"
  }
];

// Generate premium image with multiple model fallbacks
async function generatePremiumImage(article, modelIndex = 0) {
  if (modelIndex >= PREMIUM_MODELS.length) {
    throw new Error('All premium models failed to generate image');
  }

  const model = PREMIUM_MODELS[modelIndex];
  console.log(`🎨 Generating premium image for: "${article.title}"`);
  console.log(`🚀 Using: ${model.name} (${model.id})`);

  // Create a detailed, professional prompt for maximum quality
  const detailedPrompt = createPremiumPrompt(article);  try {
    let output;
    
    // Handle Google Imagen models with their specific parameters
    if (model.family === 'google') {
      console.log(`📝 Prompt: ${detailedPrompt.substring(0, 100)}...`);
      output = await replicate.run(model.id, {
        input: {
          prompt: detailedPrompt,
          aspect_ratio: "16:9",
          output_format: "jpg",
          safety_filter_level: "block_only_high",
          output_quality: 95
        }
      });
    }    console.log(`🔍 Raw output from ${model.name}:`, output);
    console.log(`🔍 Output type:`, typeof output);
    console.log(`🔍 Is array:`, Array.isArray(output));
    if (Array.isArray(output)) {
      console.log(`🔍 Array length:`, output.length);
      output.forEach((item, index) => {
        console.log(`🔍 Item ${index}:`, typeof item, item);
      });
    }

    // Handle different response formats from Google Imagen
    let imageUrl;
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else if (output && typeof output === 'object' && output.url) {
      imageUrl = output.url;
    } else if (output && typeof output === 'object' && output.data) {
      imageUrl = output.data;
    } else if (output && typeof output === 'object' && output.image) {
      imageUrl = output.image;
    } else if (output && typeof output === 'object' && output.output) {
      imageUrl = output.output;
    }

    if (!imageUrl) {
      console.log(`⚠️  ${model.name} returned no valid image URL, trying next model...`);
      console.log(`🔍 Full output structure:`, JSON.stringify(output, null, 2));
      return await generatePremiumImage(article, modelIndex + 1);
    }

    console.log(`✅ Got image URL from ${model.name}: ${imageUrl}`);    // Download and upload the premium image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Upload to Vercel Blob with premium naming
    const timestamp = Date.now();
    const modelName = model.id.replace('/', '-').replace('.', '-');
    const filename = `premium-${article.slug}-${modelName}-${timestamp}.jpg`;
    
    const blob = await put(filename, imageBuffer, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });

    console.log(`✅ Premium image generated with ${model.name}:`);
    console.log(`   URL: ${blob.url}`);
    
    return { url: blob.url, model: model.name };
    } catch (error) {
      console.log(`⚠️  ${model.name} failed: ${error.message}`);
      console.log(`🔍 Full error details:`, error);
      console.log(`🔄 Trying next model...`);
      return await generatePremiumImage(article, modelIndex + 1);
    }
}

// Create premium prompts optimized for high-quality image generation WITHOUT ANY TEXT
function createPremiumPrompt(article) {
  const basePrompts = {
    "blockchain": `Professional, modern digital illustration representing blockchain technology and ${article.title.toLowerCase()}. 
    IMPORTANT: NO TEXT, NO WORDS, NO LETTERS, NO WRITING of any kind in the image.
    Style: Clean, sophisticated tech aesthetic with premium design elements.
    Color palette: Deep blues, silver, gold accents, professional gradients.
    Composition: Balanced, visually striking, suitable for enterprise blog.
    Elements: Abstract blockchain networks, digital contracts, security icons, cryptocurrency symbols.
    Quality: Ultra-high resolution, sharp details, professional presentation.
    Lighting: Soft, professional lighting with subtle shadows and highlights.
    Strictly no text, no logos, no words, no letters, photorealistic rendering with clean modern style.`,
    
    "ai": `Premium professional illustration representing artificial intelligence and ${article.title.toLowerCase()}.
    IMPORTANT: NO TEXT, NO WORDS, NO LETTERS, NO WRITING of any kind in the image.
    Style: Cutting-edge AI/tech aesthetic, sophisticated and modern.
    Color palette: Electric blues, neon accents, silver, deep purples.
    Composition: Dynamic, balanced, enterprise-grade visual design.
    Elements: Neural networks, AI interfaces, smart technology, data flows, circuit patterns.
    Quality: Maximum resolution, crisp details, professional finish.
    Lighting: Futuristic ambient lighting with subtle glow effects.
    Strictly no text, no logos, no words, no letters, hyperrealistic rendering with premium design quality.`
  };

  return basePrompts[article.category] || basePrompts["blockchain"];
}

// Update blog data with new premium image URLs
async function updateBlogDataWithPremiumImages(updates) {
  const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
  let content = await fs.readFile(blogDataPath, 'utf-8');
  
  for (const update of updates) {
    // Replace the old image URL with the new premium one
    content = content.replace(update.oldUrl, update.newUrl);
  }
  
  await fs.writeFile(blogDataPath, content, 'utf-8');
  console.log('✅ Updated blog-data.ts with premium image URLs');
}

// Main execution
async function main() {
  console.log('🎨 PREMIUM IMAGE REGENERATION STARTING...');
  console.log('🚀 Using top-tier AI models for maximum quality\n');
  
  const updates = [];
  let successCount = 0;
  
  for (let i = 0; i < articlesNeedingPremiumImages.length; i++) {
    const article = articlesNeedingPremiumImages[i];
    
    console.log(`\n[${i + 1}/${articlesNeedingPremiumImages.length}] Processing: ${article.title}`);
    console.log(`📝 Current image: ${article.currentImage}`);
    
    try {
      const result = await generatePremiumImage(article);
      
      updates.push({
        oldUrl: article.currentImage,
        newUrl: result.url
      });
      
      successCount++;
      console.log(`✅ SUCCESS! Generated with ${result.model}`);
      
      // Wait between generations to avoid rate limits
      if (i < articlesNeedingPremiumImages.length - 1) {
        console.log('⏳ Waiting 5 seconds before next generation...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.log(`❌ FAILED to generate premium image for "${article.title}": ${error.message}`);
    }
  }
  
  // Update blog data if we have any successful generations
  if (updates.length > 0) {
    await updateBlogDataWithPremiumImages(updates);
  }
  
  console.log(`\n🎉 PREMIUM IMAGE REGENERATION COMPLETE!`);
  console.log(`✅ Successfully generated ${successCount}/${articlesNeedingPremiumImages.length} premium images`);
  
  if (successCount > 0) {
    console.log(`\n📋 Summary:`);
    updates.forEach((update, index) => {
      const article = articlesNeedingPremiumImages[index];
      console.log(`   ✅ ${article.title}`);
      console.log(`      ${update.newUrl}`);
    });
    
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Commit and push the updated blog-data.ts file`);
    console.log(`   2. Deploy to production: vercel --prod`);
    console.log(`   3. Check the blog at https://fais.world/blog`);
  }
}

main().catch(console.error);
