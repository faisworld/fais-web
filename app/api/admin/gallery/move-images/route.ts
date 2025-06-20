import { NextResponse } from 'next/server';
import { checkAdminAuth } from "@/utils/auth-compat";
import { put } from '@vercel/blob';
import pg from 'pg';

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
  }
];

export async function POST(request: Request) {
  // Check admin authentication
  const authResult = await checkAdminAuth(request);
  if (!authResult.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log('🚀 Starting image movement process...');
    
    // Connect to database
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    await client.connect();
    console.log('✅ Connected to Neon database');    const results: {
      moved: Array<{ old: string; new: string; slug: string }>;
      failed: Array<{ url: string; error: string }>;
      newUrls: Record<string, string>;
    } = {
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
        
        const imageBuffer = await response.arrayBuffer();
        console.log(`📥 Downloaded image (${imageBuffer.byteLength} bytes)`);
        
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Failed to move ${imageInfo.oldUrl}:`, errorMessage);
        results.failed.push({
          url: imageInfo.oldUrl,
          error: errorMessage
        });
      }
    }
    
    await client.end();
    
    return NextResponse.json({
      success: true,
      moved: results.moved.length,
      failed: results.failed.length,
      newUrls: results.newUrls,
      details: results
    });

  } catch (error: unknown) {
    console.error('Error in move-images API:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', message: errorMessage }, { status: 500 });
  }
}
