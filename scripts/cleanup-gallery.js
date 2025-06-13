// Gallery Cleanup Script - Run with: node scripts/cleanup-gallery.js

import { Client } from '@neondatabase/serverless';
import { config } from 'dotenv';
import readline from 'readline';

config({ path: '.env.local' });

async function cleanupGallery() {
  console.log('🔍 Starting gallery cleanup analysis...');
  
  const client = new Client(process.env.DATABASE_URL);
  await client.connect();

  try {
    // Get all images from database
    const result = await client.query('SELECT id, title, url, uploaded_at FROM images ORDER BY uploaded_at DESC');
    console.log(`📊 Found ${result.rows.length} images in database`);

    const brokenImages = [];
    const workingImages = [];

    // Check each image URL
    for (const image of result.rows) {
      try {
        const response = await fetch(image.url, { method: 'HEAD' });
        
        if (!response.ok) {
          brokenImages.push({
            id: image.id,
            title: image.title,
            url: image.url,
            status: response.status
          });
          console.log(`❌ Broken: ${image.title} (ID: ${image.id}) - HTTP ${response.status}`);
        } else {
          workingImages.push(image);
          console.log(`✅ Working: ${image.title} (ID: ${image.id})`);
        }
      } catch (error) {
        brokenImages.push({
          id: image.id,
          title: image.title,
          url: image.url,
          error: error.message
        });
        console.log(`⚠️  Error checking: ${image.title} (ID: ${image.id}) - ${error.message}`);
      }
    }

    console.log('\n📋 SUMMARY:');
    console.log(`✅ Working images: ${workingImages.length}`);
    console.log(`❌ Broken images: ${brokenImages.length}`);

    if (brokenImages.length > 0) {
      console.log('\n🗑️  BROKEN IMAGES TO CLEANUP:');
      brokenImages.forEach(img => {
        console.log(`  - ID ${img.id}: ${img.title} (${img.status || img.error})`);
      });      // Ask if user wants to delete them
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('\n❓ Delete these broken images from database? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🗑️  Deleting broken images...');
        let deleted = 0;
        
        for (const img of brokenImages) {
          try {
            await client.query('DELETE FROM images WHERE id = $1', [img.id]);
            console.log(`✅ Deleted: ${img.title} (ID: ${img.id})`);
            deleted++;
          } catch (error) {
            console.log(`❌ Failed to delete: ${img.title} (ID: ${img.id}) - ${error.message}`);
          }
        }
        
        console.log(`\n🎉 Cleanup complete! Deleted ${deleted} orphaned images.`);
      } else {
        console.log('\n📝 No changes made. Run script again with "y" to delete broken images.');
      }
    } else {
      console.log('\n🎉 No broken images found! Gallery is clean.');
    }

  } finally {
    await client.end();
  }
}

cleanupGallery().catch(console.error);
