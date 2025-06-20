#!/usr/bin/env node

/**
 * Review SEO Names and Suggest Improvements
 */

import { Client } from '@neondatabase/serverless';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

async function reviewSEONames() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  try {
    // Get images without dimensions (404s or unsupported formats)
    console.log('🚨 Images without dimensions (likely 404 or unsupported formats):');
    const noDimensionsResult = await client.query(`
      SELECT id, url, seo_name, title, width, height
      FROM images 
      WHERE width IS NULL OR height IS NULL
      ORDER BY id DESC
    `);

    noDimensionsResult.rows.forEach(img => {
      const shortUrl = img.url.length > 80 ? img.url.substring(0, 80) + '...' : img.url;
      console.log(`- ID: ${img.id}, SEO: ${img.seo_name}, URL: ${shortUrl}`);
    });

    console.log(`\nTotal images without dimensions: ${noDimensionsResult.rows.length}\n`);

    // Get sample SEO names for review
    console.log('✅ Sample SEO names (most recent with dimensions):');
    const sampleResult = await client.query(`
      SELECT id, url, seo_name, title, width, height
      FROM images 
      WHERE width IS NOT NULL AND height IS NOT NULL
      ORDER BY id DESC
      LIMIT 15
    `);

    sampleResult.rows.forEach(img => {
      console.log(`- ${img.seo_name} (${img.width}x${img.height})`);
    });

    // Suggest improvements for common patterns
    console.log('\n🔧 SEO Name Improvement Suggestions:');
    
    const allWithDimensions = await client.query(`
      SELECT seo_name, COUNT(*) as count
      FROM images 
      WHERE width IS NOT NULL AND height IS NOT NULL
      GROUP BY seo_name
      HAVING COUNT(*) > 1
      ORDER BY count DESC
    `);

    if (allWithDimensions.rows.length > 0) {
      console.log('\n⚠️ Duplicate SEO names found:');
      allWithDimensions.rows.forEach(row => {
        console.log(`- "${row.seo_name}" appears ${row.count} times`);
      });
    }

    // Check for long names that could be shortened
    const longNames = await client.query(`
      SELECT seo_name, LENGTH(seo_name) as length
      FROM images 
      WHERE LENGTH(seo_name) > 80
      ORDER BY length DESC
      LIMIT 10
    `);

    if (longNames.rows.length > 0) {
      console.log('\n📏 Very long SEO names (consider shortening):');
      longNames.rows.forEach(row => {
        console.log(`- ${row.seo_name} (${row.length} chars)`);
      });
    }

    // Stats
    const stats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN width IS NOT NULL THEN 1 END) as with_dimensions,
        AVG(LENGTH(seo_name)) as avg_seo_length,
        MIN(LENGTH(seo_name)) as min_seo_length,
        MAX(LENGTH(seo_name)) as max_seo_length
      FROM images
    `);

    console.log('\n📊 SEO Names Statistics:');
    const stat = stats.rows[0];
    console.log(`- Total images: ${stat.total}`);
    console.log(`- With dimensions: ${stat.with_dimensions}`);
    console.log(`- Average SEO name length: ${Math.round(stat.avg_seo_length)} chars`);
    console.log(`- Min SEO name length: ${stat.min_seo_length} chars`);
    console.log(`- Max SEO name length: ${stat.max_seo_length} chars`);

  } finally {
    await client.end();
  }
}

reviewSEONames().catch(console.error);
