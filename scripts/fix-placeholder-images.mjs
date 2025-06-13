#!/usr/bin/env node

/**
 * Simple Image Generation for Placeholder Articles
 * This script generates unique images for articles using the placeholder image
 */

import Replicate from 'replicate';
import { put } from '@vercel/blob';
import fs from 'fs/promises';

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

// Articles that need new images (manually identified from blog-data.ts)
const articlesNeedingImages = [
  {
    id: "1b7f607b",
    title: "NFT marketplaces and digital ownership",
    slug: "nft-marketplaces-and-digital-ownership",
    category: "blockchain"
  },
  {
    id: "40e49042",
    title: "Smart contracts in real estate",
    slug: "smart-contracts-in-real-estate",
    category: "ai"
  },
  {
    id: "94ff4f62",
    title: "Decentralized finance (DeFi) latest developments",
    slug: "decentralized-finance-defi-latest-developments",
    category: "blockchain"
  }
];

// Generate image for a specific article
async function generateImageForArticle(post) {
  console.log(`🎨 Generating image for: "${post.title}"`);
  
  const imagePrompt = `Create a professional, modern illustration for a blog article about "${post.title}". 
  Style: Clean, minimalist, tech-focused, suitable for ${post.category} content. 
  Colors: Modern, professional palette. No text or logos.`;  try {
    const output = await replicate.run(
      "stability-ai/stable-diffusion-3",
      {
        input: {
          prompt: imagePrompt,
          aspect_ratio: "16:9",
          output_format: "jpg"
        }
      }
    );

    if (!output || !output[0]) {
      throw new Error('No image generated');
    }

    // Download the image
    const imageResponse = await fetch(output[0]);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Upload to Vercel Blob
    const filename = `blog-${post.slug}-${Date.now()}.jpg`;
    const blob = await put(filename, imageBuffer, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });

    console.log(`✅ Generated image: ${blob.url}`);
    return blob.url;
    
  } catch (error) {
    console.error(`❌ Failed to generate image for "${post.title}":`, error);
    return null;
  }
}

// Update blog data file with new image URLs
async function updateBlogData(updatedPosts) {
  const blogDataPath = 'app/blog/blog-data.ts';
  
  // Read current file
  let content = await fs.readFile(blogDataPath, 'utf-8');
  
  // Update each post with new image URL
  for (const post of updatedPosts) {
    if (post.newImageUrl) {
      // Find and replace the placeholder image URL for this specific post
      const placeholderUrl = 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-placeholder-ai-generated-LSpH7hJk2vXbDcYqRzWnPfG3tS8aFm.png';
      
      // Create a regex to match the specific post's coverImage line
      const postRegex = new RegExp(
        `(id: "${post.id}"[\\s\\S]*?coverImage: ")${placeholderUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(")`,
        'g'
      );
      
      content = content.replace(postRegex, `$1${post.newImageUrl}$2`);
      console.log(`📝 Updated image URL for "${post.title}"`);
    }
  }
  
  // Write updated content
  await fs.writeFile(blogDataPath, content, 'utf-8');
  console.log('💾 Saved updated blog-data.ts');
}

async function main() {
  try {
    console.log('🚀 Starting image generation for placeholder articles...\n');
    console.log(`🖼️  Found ${articlesNeedingImages.length} articles needing images\n`);
    
    // Generate images for articles that need them
    const updatedPosts = [];
    
    for (let i = 0; i < articlesNeedingImages.length; i++) {
      const post = articlesNeedingImages[i];
      console.log(`[${i + 1}/${articlesNeedingImages.length}] Processing: ${post.title}`);
      
      const newImageUrl = await generateImageForArticle(post);
      
      if (newImageUrl) {
        updatedPosts.push({
          ...post,
          newImageUrl
        });
      }
      
      // Add delay to respect API rate limits
      if (i < articlesNeedingImages.length - 1) {
        console.log('⏳ Waiting 5 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Update the blog data file
    if (updatedPosts.length > 0) {
      await updateBlogData(updatedPosts);
      console.log(`\n🎉 Successfully generated ${updatedPosts.length} images!`);
      
      console.log('\n📋 Summary:');
      updatedPosts.forEach(post => {
        console.log(`   ✅ ${post.title}`);
        console.log(`      ${post.newImageUrl}`);
      });
      
      console.log('\n🔄 Next steps:');
      console.log('   1. Commit and push the updated blog-data.ts file');
      console.log('   2. Deploy to production: vercel --prod');
      console.log('   3. Check the blog at https://fais.world/blog');
    } else {
      console.log('\n❌ No images were successfully generated');
    }
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

main();
