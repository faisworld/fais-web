#!/usr/bin/env node

/**
 * Generate Missing Images for Blog Articles
 * This script identifies articles with placeholder images and generates unique cover images for them
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

// Read current blog data
async function loadBlogPosts() {
  const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
  const content = await fs.readFile(blogDataPath, 'utf-8');
  
  // Simple approach: extract basic info using regex without JSON parsing
  const posts = [];
  
  // Match blog post objects with required fields
  const postPattern = /{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?coverImage:\s*"([^"]+)"[\s\S]*?}/g;
  
  let match;
  while ((match = postPattern.exec(content)) !== null) {
    const [, id, slug, title, coverImage] = match;
    
    // Extract category if possible
    const categoryMatch = match[0].match(/category:\s*"([^"]+)"/);
    const category = categoryMatch ? categoryMatch[1] : 'technology';
    
    posts.push({
      id,
      slug,
      title,
      coverImage,
      category
    });
  }
  
  console.log(`📚 Successfully extracted ${posts.length} blog posts`);
  return posts;
}

// Generate image for a specific article
async function generateImageForArticle(post) {
  console.log(`🎨 Generating image for: "${post.title}"`);
  
  const imagePrompt = `Create a professional, modern illustration for a blog article about "${post.title}". 
  Style: Clean, minimalist, tech-focused, suitable for ${post.category} content. 
  Colors: Modern, professional palette. No text or logos.`;
  try {    const output = await replicate.run(
      "google/imagen-3",
      {
        input: {
          prompt: imagePrompt,
          aspect_ratio: "16:9",
          output_format: "jpg",
          safety_filter_level: "block_only_high",
          output_quality: 95
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
async function updateBlogData(posts) {
  const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
  
  // Read current file
  let content = await fs.readFile(blogDataPath, 'utf-8');
  
  // Update each post with new image URL
  for (const post of posts) {
    if (post.newImageUrl) {
      const oldPattern = new RegExp(`"coverImage": "${post.coverImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
      content = content.replace(oldPattern, `"coverImage": "${post.newImageUrl}"`);
    }
  }
  
  // Write updated content
  await fs.writeFile(blogDataPath, content, 'utf-8');
  console.log('📝 Updated blog-data.ts with new image URLs');
}

async function main() {
  try {
    console.log('🚀 Starting missing image generation process...\n');
    
    // Load current blog posts
    const blogPosts = await loadBlogPosts();
    console.log(`📚 Found ${blogPosts.length} total articles`);
    
    // Find articles with placeholder images
    const articlesNeedingImages = blogPosts.filter(post => 
      post.coverImage.includes('blog-placeholder-ai-generated') || 
      post.coverImage === '/placeholder.svg'
    );
    
    console.log(`🖼️  Found ${articlesNeedingImages.length} articles needing images\n`);
    
    if (articlesNeedingImages.length === 0) {
      console.log('✅ All articles already have proper images!');
      return;
    }
    
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
        console.log('⏳ Waiting 3 seconds before next generation...\n');
        await new Promise(resolve => setTimeout(resolve, 3000));
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
