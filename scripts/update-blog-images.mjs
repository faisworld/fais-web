#!/usr/bin/env node

/**
 * UPDATE BLOG IMAGES WITH MANUALLY SELECTED PREMIUM IMAGES
 * 
 * Downloads the manually selected high-quality images and updates blog data
 */

import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Missing BLOB_READ_WRITE_TOKEN environment variable');
  process.exit(1);
}

// Manually selected premium images
const selectedImages = [
  {
    id: "1b7f607b",
    title: "NFT marketplaces and digital ownership",
    slug: "nft-marketplaces-and-digital-ownership",
    selectedImageUrl: "https://replicate.delivery/xezq/8Tk5VubU7Kb1CNFJMhj541es2UZu55oe6e3mKCcMLVQh35spA/tmp8l552om_.jpg",
    currentImageInBlog: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-nft-marketplaces-and-digital-ownership-stability-ai-stable-diffusion-3-1749818358071.jpg",
    model: "Google Imagen 4"
  },
  {
    id: "40e49042",
    title: "Smart contracts in real estate", 
    slug: "smart-contracts-in-real-estate",
    selectedImageUrl: "https://replicate.delivery/xezq/pEiTHmn6GJ4GNZFPNdYQmUVl3aSPd2CnPL0cIV4XczdfdObKA/tmpbmb0dfo5.jpg",
    currentImageInBlog: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-smart-contracts-in-real-estate-stability-ai-stable-diffusion-3-1749818368774.jpg",
    model: "Google Imagen 4"
  },
  {
    id: "94ff4f62",
    title: "Decentralized finance (DeFi) latest developments",
    slug: "decentralized-finance-defi-latest-developments", 
    selectedImageUrl: "https://replicate.delivery/xezq/EuHgvRVAZBISA921HODrHp7t1FIYe8yJAQeJ098OrrOfj5spA/tmpny1c_zdr.jpg",
    currentImageInBlog: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/premium-decentralized-finance-defi-latest-developments-stability-ai-stable-diffusion-3-1749818378993.jpg",
    model: "Black Forest Labs Flux 1.1 Pro"
  }
];

// Download image and upload to Vercel Blob
async function downloadAndUploadImage(imageData) {
  console.log(`📥 Downloading: "${imageData.title}"`);
  console.log(`🔗 From: ${imageData.selectedImageUrl}`);
  console.log(`🤖 Model: ${imageData.model}`);
  
  try {
    // Download the image
    const response = await fetch(imageData.selectedImageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate filename
    const timestamp = Date.now();
    const modelName = imageData.model.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `selected-premium-${imageData.slug}-${modelName}-${timestamp}.jpg`;
    
    // Upload to Vercel Blob
    const blob = await put(filename, imageBuffer, {
      access: 'public',
      token: BLOB_READ_WRITE_TOKEN,
    });
    
    console.log(`✅ Uploaded to Blob: ${blob.url}`);
    
    return {
      ...imageData,
      newBlobUrl: blob.url
    };
    
  } catch (error) {
    console.error(`❌ Failed to process "${imageData.title}": ${error.message}`);
    throw error;
  }
}

// Update blog data with new image URLs
async function updateBlogData(imageUpdates) {
  const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
  let content = await fs.readFile(blogDataPath, 'utf-8');
  
  console.log('\n📝 Updating blog-data.ts...');
  
  for (const update of imageUpdates) {
    console.log(`🔄 Replacing image for: ${update.title}`);
    console.log(`   Old: ${update.currentImageInBlog}`);
    console.log(`   New: ${update.newBlobUrl}`);
    
    content = content.replace(update.currentImageInBlog, update.newBlobUrl);
  }
  
  await fs.writeFile(blogDataPath, content, 'utf-8');
  console.log('✅ Blog data updated successfully!');
}

// Main execution
async function main() {
  console.log('🎨 UPDATING BLOG IMAGES WITH SELECTED PREMIUM IMAGES\n');
  
  const imageUpdates = [];
  
  // Process each selected image
  for (let i = 0; i < selectedImages.length; i++) {
    const imageData = selectedImages[i];
    
    console.log(`\n[${i + 1}/${selectedImages.length}] Processing: ${imageData.title}`);
    
    try {
      const result = await downloadAndUploadImage(imageData);
      imageUpdates.push(result);
      
      // Small delay between downloads
      if (i < selectedImages.length - 1) {
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
    } catch (error) {
      console.error(`❌ Failed to process ${imageData.title}`);
    }
  }
  
  // Update blog data if we have any successful uploads
  if (imageUpdates.length > 0) {
    await updateBlogData(imageUpdates);
  }
  
  console.log(`\n🎉 IMAGE UPDATE COMPLETE!`);
  console.log(`✅ Successfully updated ${imageUpdates.length}/${selectedImages.length} images\n`);
  
  if (imageUpdates.length > 0) {
    console.log('📋 Summary:');
    imageUpdates.forEach(update => {
      console.log(`   ✅ ${update.title} (${update.model})`);
      console.log(`      ${update.newBlobUrl}`);
    });
    
    console.log(`\n🚀 Next steps:`);
    console.log(`   1. Check the updated images at https://fais.world/blog`);
    console.log(`   2. Verify the automated generation system`);
    console.log(`   3. Clean up unnecessary generation scripts`);
  }
}

main().catch(console.error);
