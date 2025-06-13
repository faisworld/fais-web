#!/usr/bin/env node

/**
 * Script to ensure article images are properly organized in Vercel Blob storage
 * This script will:
 * 1. Check current blob storage organization
 * 2. Identify images that should be in article-images folder
 * 3. Move misplaced article images to the correct location
 * 4. Update any references if needed
 */

import { list } from '@vercel/blob';
import 'dotenv/config';

async function main() {
  try {
    console.log('🔍 Checking Vercel Blob storage organization...');
    
    // List all blobs
    const { blobs } = await list();
    console.log(`📁 Found ${blobs.length} total files in blob storage`);
    
    // Analyze current structure
    const folderStructure = {};
    const articleImages = [];
    const otherImages = [];
    
    for (const blob of blobs) {
      const path = blob.pathname;
      const folder = path.split('/')[0];
      
      // Count files per folder
      if (!folderStructure[folder]) {
        folderStructure[folder] = 0;
      }
      folderStructure[folder]++;
      
      // Check if this looks like an article image
      const isArticleImage = (
        path.includes('stability-ai-sdxl') ||
        path.includes('google-imagen') ||
        path.includes('img-') ||
        path.includes('blog-') ||
        path.includes('article-')
      );
      
      if (isArticleImage) {
        articleImages.push(blob);
      } else {
        otherImages.push(blob);
      }
    }
    
    console.log('\n📊 Current folder structure:');
    Object.entries(folderStructure).forEach(([folder, count]) => {
      console.log(`  ${folder}: ${count} files`);
    });
    
    console.log(`\n🖼️  Identified ${articleImages.length} potential article images`);
    console.log(`📸 Identified ${otherImages.length} other images`);
    
    // Check which article images are NOT in the correct folder
    const misplacedArticleImages = articleImages.filter(blob => 
      !blob.pathname.startsWith('images/article-images/')
    );
    
    console.log(`\n🔄 Found ${misplacedArticleImages.length} article images that need to be moved`);
    
    if (misplacedArticleImages.length === 0) {
      console.log('✅ All article images are already in the correct location!');
      return;
    }
    
    // Show what needs to be moved
    console.log('\n📋 Files that will be moved:');
    misplacedArticleImages.forEach((blob, index) => {
      const currentPath = blob.pathname;
      const filename = currentPath.split('/').pop();
      let newPath;
      
      // Determine the correct new path based on the filename
      if (filename.includes('stability-ai-sdxl')) {
        newPath = `images/article-images/stability-ai-sdxl/${filename}`;
      } else if (filename.includes('google-imagen')) {
        newPath = `images/article-images/google-imagen-4/${filename}`;
      } else if (filename.includes('img-')) {
        // Generic article image
        newPath = `images/article-images/generated/${filename}`;
      } else {
        newPath = `images/article-images/misc/${filename}`;
      }
      
      console.log(`  ${index + 1}. ${currentPath} → ${newPath}`);
    });
    
    // Ask for confirmation (in a real script, you might want to add readline for this)
    console.log('\n⚠️  This is a DRY RUN. To actually move files, uncomment the movement code below.');
    
    // Uncomment the following section to actually perform the moves:
    /*
    console.log('\n🚀 Moving files...');
    let moved = 0;
    let errors = 0;
    
    for (const blob of misplacedArticleImages) {
      try {
        const currentPath = blob.pathname;
        const filename = currentPath.split('/').pop();
        let newPath;
        
        if (filename.includes('stability-ai-sdxl')) {
          newPath = `images/article-images/stability-ai-sdxl/${filename}`;
        } else if (filename.includes('google-imagen')) {
          newPath = `images/article-images/google-imagen-4/${filename}`;
        } else if (filename.includes('img-')) {
          newPath = `images/article-images/generated/${filename}`;
        } else {
          newPath = `images/article-images/misc/${filename}`;
        }
        
        console.log(`Moving ${currentPath} to ${newPath}...`);
        
        // Copy to new location
        const copyResult = await copy(blob.url, newPath, { access: 'public' });
        
        // Delete original (only if copy succeeded)
        if (copyResult.url) {
          await del(blob.url);
          moved++;
          console.log(`✅ Moved successfully`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to move ${blob.pathname}:`, error.message);
        errors++;
      }
    }
    
    console.log(`\n🎉 Movement complete! Moved: ${moved}, Errors: ${errors}`);
    */
    
    // Show final folder structure that WOULD exist
    console.log('\n📁 Expected folder structure after organization:');
    console.log('  images/');
    console.log('    └── article-images/');
    console.log('        ├── stability-ai-sdxl/     (SDXL model images)');
    console.log('        ├── google-imagen-4/       (Imagen model images)');
    console.log('        ├── generated/             (Generic article images)');
    console.log('        └── misc/                  (Other article images)');
    console.log('  videos/                          (Video files)');
    console.log('  carousel/                        (Carousel media)');
    console.log('  [other folders as they exist]');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
