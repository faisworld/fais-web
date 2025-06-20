#!/usr/bin/env node

/**
 * Fix Gallery Images - SEO Names & Dimensions
 * - Updates image names to SEO-friendly format
 * - Fetches and stores proper width/height using Sharp
 * - Updates NeonDB table structure if needed
 */

import { Client } from '@neondatabase/serverless';
import sharp from 'sharp';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import { config } from 'dotenv';
config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

// SEO-friendly name mapping for gallery images
const SEO_NAME_MAPPING = {
  // AI & Tech Images
  'ai-neural-network': 'fais-ai-neural-network-technology',
  'blockchain-network': 'fais-blockchain-distributed-network',
  'machine-learning': 'fais-machine-learning-algorithms',
  'artificial-intelligence': 'fais-artificial-intelligence-solutions',
  'deep-learning': 'fais-deep-learning-neural-networks',
  'data-science': 'fais-data-science-analytics',
  'computer-vision': 'fais-computer-vision-technology',
  'natural-language': 'fais-natural-language-processing',
  
  // Business & Enterprise Images
  'enterprise-solutions': 'fais-enterprise-ai-solutions',
  'business-automation': 'fais-business-process-automation',
  'digital-transformation': 'fais-digital-transformation-services',
  'corporate-ai': 'fais-corporate-ai-implementation',
  'fortune-500': 'fais-fortune-500-trusted-partner',
  'enterprise-consulting': 'fais-enterprise-consulting-services',
  
  // Development & Programming Images
  'software-development': 'fais-custom-software-development',
  'web-development': 'fais-web-application-development',
  'mobile-app': 'fais-mobile-app-development',
  'api-integration': 'fais-api-integration-services',
  'cloud-solutions': 'fais-cloud-computing-solutions',
  'devops': 'fais-devops-automation-services',
  
  // Blockchain Specific Images
  'smart-contracts': 'fais-smart-contracts-development',
  'defi-platform': 'fais-defi-platform-development',
  'cryptocurrency': 'fais-cryptocurrency-solutions',
  'web3-development': 'fais-web3-application-development',
  'nft-marketplace': 'fais-nft-marketplace-development',
  
  // Geographic/Location Images
  'usa-operations': 'fais-usa-ai-development-services',
  'uk-operations': 'fais-uk-blockchain-development',
  'germany-operations': 'fais-germany-enterprise-ai',
  'global-reach': 'fais-global-ai-blockchain-services',
  
  // Team & People Images
  'team-collaboration': 'fais-expert-development-team',
  'expert-developers': 'fais-senior-ai-developers',
  'consulting-team': 'fais-ai-consulting-experts',
  'project-management': 'fais-agile-project-management'
};

// Function to generate SEO name from image content/title
function generateSEOName(originalName, title, index) {
  // Clean the original name
  let cleanName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase();

  // If we have a title, use it
  if (title && title !== 'Untitled') {
    cleanName = title
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
  }

  // Check if it matches any of our predefined mappings
  for (const [key, value] of Object.entries(SEO_NAME_MAPPING)) {
    if (cleanName.includes(key) || title?.toLowerCase().includes(key)) {
      return value;
    }
  }

  // Ensure it starts with 'fais-' for branding
  if (!cleanName.startsWith('fais-')) {
    cleanName = `fais-${cleanName}`;
  }

  // Add index if it's generic
  if (cleanName === 'fais-' || cleanName === 'fais-image') {
    cleanName = `fais-gallery-image-${index}`;
  }

  return cleanName;
}

// Function to fetch image dimensions using Sharp
async function getImageDimensions(imageUrl) {
  try {
    console.log(`📏 Fetching dimensions for: ${imageUrl}`);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const metadata = await sharp(Buffer.from(buffer)).metadata();
    
    return {
      width: metadata.width || null,
      height: metadata.height || null,
      format: metadata.format || null
    };
  } catch (error) {
    console.warn(`⚠️ Could not get dimensions for ${imageUrl}:`, error.message);
    return { width: null, height: null, format: null };
  }
}

// Function to check and update table structure
async function ensureTableStructure(client) {
  console.log('🔍 Checking images table structure...');

  // Check existing columns
  const columnsResult = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'images' AND table_schema = 'public'
    ORDER BY ordinal_position
  `);

  const existingColumns = columnsResult.rows.map(row => row.column_name);
  console.log('📋 Existing columns:', existingColumns);

  const columnsToAdd = [];

  // Check for width column
  if (!existingColumns.includes('width')) {
    columnsToAdd.push('ADD COLUMN width INTEGER');
  }

  // Check for height column
  if (!existingColumns.includes('height')) {
    columnsToAdd.push('ADD COLUMN height INTEGER');
  }

  // Check for seo_name column
  if (!existingColumns.includes('seo_name')) {
    columnsToAdd.push('ADD COLUMN seo_name VARCHAR(255)');
  }

  // Check for format column
  if (!existingColumns.includes('format')) {
    columnsToAdd.push('ADD COLUMN format VARCHAR(10)');
  }

  // Add missing columns
  if (columnsToAdd.length > 0) {
    console.log('🔧 Adding missing columns...');
    for (const columnSQL of columnsToAdd) {
      try {
        await client.query(`ALTER TABLE images ${columnSQL}`);
        console.log(`✅ Added column: ${columnSQL}`);
      } catch (error) {
        console.warn(`⚠️ Could not add column ${columnSQL}:`, error.message);
      }
    }
  } else {
    console.log('✅ Table structure is up to date');
  }
}

// Function to update image with SEO name and dimensions
async function updateImageRecord(client, image, seoName, dimensions) {
  try {
    const updateSQL = `
      UPDATE images 
      SET seo_name = $1, width = $2, height = $3, format = $4
      WHERE id = $5
    `;
    
    await client.query(updateSQL, [
      seoName,
      dimensions.width,
      dimensions.height,
      dimensions.format,
      image.id
    ]);

    console.log(`✅ Updated image ${image.id}: ${seoName} (${dimensions.width}x${dimensions.height})`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update image ${image.id}:`, error.message);
    return false;
  }
}

// Main function
async function fixGalleryImages() {
  console.log('🚀 Starting Gallery Images Fix...\n');

  let client = null;
  
  try {
    // Connect to database
    client = new Client({ connectionString: DATABASE_URL });
    await client.connect();
    console.log('✅ Connected to NeonDB');

    // Check table structure
    await ensureTableStructure(client);

    // Fetch all images
    console.log('\n📋 Fetching all images from database...');
    const result = await client.query(`
      SELECT id, url, title, uploaded_at, 
             COALESCE(seo_name, '') as seo_name,
             COALESCE(width, 0) as width,
             COALESCE(height, 0) as height
      FROM images 
      ORDER BY uploaded_at DESC
    `);

    const images = result.rows;
    console.log(`📊 Found ${images.length} images in database`);

    if (images.length === 0) {
      console.log('ℹ️ No images found in database');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each image
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log(`\n🖼️ Processing image ${i + 1}/${images.length}: ${image.url}`);

      // Skip if already has good SEO name and dimensions
      if (image.seo_name && image.width && image.height) {
        console.log(`⏭️ Skipping - already has SEO name and dimensions`);
        skippedCount++;
        continue;
      }

      // Generate SEO name
      const originalName = image.url.split('/').pop() || `image-${image.id}`;
      const seoName = generateSEOName(originalName, image.title, i + 1);

      // Get dimensions
      const dimensions = await getImageDimensions(image.url);

      // Update database
      const success = await updateImageRecord(client, image, seoName, dimensions);
      if (success) {
        updatedCount++;
      }

      // Add delay to avoid overwhelming the API
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`\n🎉 Gallery Images Fix completed!`);
    console.log(`✅ Updated: ${updatedCount} images`);
    console.log(`⏭️ Skipped: ${skippedCount} images`);
    console.log(`📊 Total: ${images.length} images processed`);

    // Generate a summary report
    const reportSQL = `
      SELECT 
        COUNT(*) as total_images,
        COUNT(CASE WHEN seo_name IS NOT NULL AND seo_name != '' THEN 1 END) as with_seo_names,
        COUNT(CASE WHEN width IS NOT NULL AND width > 0 THEN 1 END) as with_width,
        COUNT(CASE WHEN height IS NOT NULL AND height > 0 THEN 1 END) as with_height
      FROM images
    `;
    
    const reportResult = await client.query(reportSQL);
    const stats = reportResult.rows[0];

    console.log(`\n📈 Database Statistics:`);
    console.log(`- Total images: ${stats.total_images}`);
    console.log(`- With SEO names: ${stats.with_seo_names}`);
    console.log(`- With width: ${stats.with_width}`);
    console.log(`- With height: ${stats.with_height}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    if (client) {
      await client.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run the script
fixGalleryImages().catch(console.error);
