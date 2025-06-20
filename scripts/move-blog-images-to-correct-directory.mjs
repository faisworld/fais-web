#!/usr/bin/env node

import { config } from 'dotenv';
import { put } from '@vercel/blob';
import pg from 'pg';
import fetch from 'node-fetch';

// Load environment variables
config({ path: '.env.local' });

const { Client } = pg;

// Images to move from root images/ to images/article-images/
const imagesToMove = [
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/premium-smart-contracts-in-real-estate-black-forest-labs-flux-dev-1749818072350.jpg",
    newPath: "images/article-images/premium-smart-contracts-in-real-estate-black-forest-labs-flux-dev-1749818072350.jpg",
    articleSlug: "smart-contracts-in-real-estate",
    title: "Smart Contracts in Real Estate - Premium AI Generated Image",
    altTag: "Smart contracts in real estate technology blockchain innovation"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/premium-nft-marketplaces-and-digital-ownership-black-forest-labs-flux-dev-1749818064139.jpg",
    newPath: "images/article-images/premium-nft-marketplaces-and-digital-ownership-black-forest-labs-flux-dev-1749818064139.jpg",
    articleSlug: "nft-marketplaces-and-digital-ownership",
    title: "NFT Marketplaces and Digital Ownership - Premium AI Generated Image",
    altTag: "NFT marketplaces digital ownership blockchain technology"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/premium-decentralized-finance-defi-latest-developments-black-forest-labs-flux-dev-1749818081164.jpg",
    newPath: "images/article-images/premium-decentralized-finance-defi-latest-developments-black-forest-labs-flux-dev-1749818081164.jpg",
    articleSlug: "decentralized-finance-defi-latest-developments",
    title: "Decentralized Finance DeFi Latest Developments - Premium AI Generated Image",
    altTag: "Decentralized finance DeFi latest developments blockchain technology"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/20d56314-2eb0-4f86-a329-ce1465cd3448.png",
    newPath: "images/article-images/20d56314-2eb0-4f86-a329-ce1465cd3448.png",
    articleSlug: "ai-technology-article",
    title: "AI Technology Article - Generated Image",
    altTag: "AI technology innovation artificial intelligence"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/fb2f5d05-1b08-4fd0-9b15-c97349595dcb.jpg",
    newPath: "images/article-images/fb2f5d05-1b08-4fd0-9b15-c97349595dcb.jpg",
    articleSlug: "blockchain-article",
    title: "Blockchain Technology Article - Generated Image",
    altTag: "Blockchain technology innovation cryptocurrency"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/64105c30-5d8f-4ca9-8116-047fe47c4ff3.jpg",
    newPath: "images/article-images/64105c30-5d8f-4ca9-8116-047fe47c4ff3.jpg",
    articleSlug: "tech-article",
    title: "Technology Article - Generated Image",
    altTag: "Technology innovation digital transformation"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/ai-and-blockchain-tech-bIndr0M9oDzkK6KwqdhGnB81k2JNeJ.webp",
    newPath: "images/article-images/ai-and-blockchain-tech-premium.webp",
    articleSlug: "ai-and-blockchain-convergence",
    title: "AI and Blockchain Technology Convergence - Premium Image",
    altTag: "AI and blockchain technology convergence innovation"
  },
  {
    oldUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blockchain_and_ai_blog_top_banner2-SpfKgjKIsUgBCCc9XpyN7BQdkGQZ4Z.webp",
    newPath: "images/article-images/blockchain-and-ai-blog-banner-premium.webp",
    articleSlug: "blockchain-ai-banner",
    title: "Blockchain and AI Blog Banner - Premium Image",
    altTag: "Blockchain and AI technology blog banner"
  }
];

async function moveImages() {
  console.log('🚀 Starting image movement process...');
  
  // Connect to database
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  console.log('✅ Connected to Neon database');

  const results = {
    moved: [],
    failed: [],
    newUrls: {}
  };

  for (const imageInfo of imagesToMove) {
    try {
      console.log(`\n📁 Processing: ${imageInfo.oldUrl}`);
      
      // 1. Fetch the image from the old URL
      const response = await fetch(imageInfo.oldUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      
      const imageBuffer = await response.buffer();
      console.log(`📥 Downloaded image (${imageBuffer.length} bytes)`);
      
      // 2. Upload to new location
      const uploadResult = await put(imageInfo.newPath, imageBuffer, {
        access: 'public',
        contentType: response.headers.get('content-type') || 'image/jpeg'
      });
      
      console.log(`📤 Uploaded to new location: ${uploadResult.url}`);
      
      // 3. Add to database images table
      const seoName = `fais-${imageInfo.articleSlug}-premium-relocated`;
      await client.query(`
        INSERT INTO images (
          url, title, "alt-tag", seo_name, width, height, format, folder, uploaded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        ON CONFLICT (url) DO UPDATE SET
          title = EXCLUDED.title,
          "alt-tag" = EXCLUDED."alt-tag",
          seo_name = EXCLUDED.seo_name
      `, [
        uploadResult.url,
        imageInfo.title,
        imageInfo.altTag,
        seoName,
        1920, // Default width
        1080, // Default height
        uploadResult.url.split('.').pop(), // Extract format from URL
        'article-images'
      ]);
      
      console.log(`💾 Added to database with SEO name: ${seoName}`);
      
      // Store the new URL for updating blog-data.ts
      results.newUrls[imageInfo.articleSlug] = uploadResult.url;
      results.moved.push({
        old: imageInfo.oldUrl,
        new: uploadResult.url,
        slug: imageInfo.articleSlug
      });
      
    } catch (error) {
      console.error(`❌ Failed to move ${imageInfo.oldUrl}:`, error.message);
      results.failed.push({
        url: imageInfo.oldUrl,
        error: error.message
      });
    }
  }
  
  await client.end();
  
  // Generate summary
  console.log('\n📊 MOVEMENT SUMMARY:');
  console.log(`✅ Successfully moved: ${results.moved.length} images`);
  console.log(`❌ Failed to move: ${results.failed.length} images`);
  
  if (results.moved.length > 0) {
    console.log('\n🔗 NEW URLs FOR BLOG-DATA.TS UPDATE:');
    for (const moved of results.moved) {
      console.log(`${moved.slug}: ${moved.new}`);
    }
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ FAILED MOVES:');
    results.failed.forEach(fail => {
      console.log(`${fail.url}: ${fail.error}`);
    });
  }
  
  return results;
}

// Check for orphaned files in database vs blob storage
async function checkOrphanedFiles() {
  console.log('\n🔍 Checking for orphaned files...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  await client.connect();
  
  // Get all image URLs from database
  const dbResult = await client.query('SELECT id, url, title FROM images ORDER BY uploaded_at DESC');
  const dbImages = dbResult.rows;
  
  console.log(`📊 Found ${dbImages.length} images in database`);
  
  const orphaned = {
    dbOnly: [], // In database but not accessible via URL
    missingFromDb: [] // In blob storage but not in database
  };
  
  // Check if database URLs are accessible
  for (const dbImage of dbImages) {
    try {
      const response = await fetch(dbImage.url, { method: 'HEAD' });
      if (!response.ok) {
        orphaned.dbOnly.push({
          id: dbImage.id,
          url: dbImage.url,
          title: dbImage.title,
          status: response.status
        });
      }
    } catch (error) {
      orphaned.dbOnly.push({
        id: dbImage.id,
        url: dbImage.url,
        title: dbImage.title,
        error: error.message
      });
    }
  }
  
  await client.end();
  
  console.log(`🗑️  Found ${orphaned.dbOnly.length} orphaned database entries`);
  
  if (orphaned.dbOnly.length > 0) {
    console.log('\n🗑️  ORPHANED DATABASE ENTRIES:');
    orphaned.dbOnly.forEach(orphan => {
      console.log(`ID ${orphan.id}: ${orphan.url} (${orphan.status || orphan.error})`);
    });
  }
  
  return orphaned;
}

// Main execution
async function main() {
  try {
    await moveImages();
    await checkOrphanedFiles();
    
    console.log('\n🎉 Process completed!');
    console.log('Next steps:');
    console.log('1. Update blog-data.ts with the new URLs shown above');
    console.log('2. Remove orphaned database entries if needed');
    console.log('3. Test the blog page to ensure images display correctly');
    
  } catch (error) {
    console.error('💥 Process failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
