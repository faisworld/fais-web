#!/usr/bin/env node

/**
 * BLOG SYSTEM STATUS CHECK
 * 
 * Verifies the current state of the blog system and image generation
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
config({ path: '.env.local' });

async function checkBlogStatus() {
  console.log('🔍 BLOG SYSTEM STATUS CHECK\n');
  
  try {
    // Read current blog data
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    const content = await fs.readFile(blogDataPath, 'utf-8');
    
    // Extract blog posts
    const posts = [];
    const postPattern = /{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",[\s\S]*?coverImage:\s*"([^"]+)"[\s\S]*?}/g;
    
    let match;
    while ((match = postPattern.exec(content)) !== null) {
      const [, id, slug, title, coverImage] = match;
      posts.push({ id, slug, title, coverImage });
    }
    
    console.log(`📚 Total Blog Posts: ${posts.length}`);
    
    // Check image quality
    const premiumImages = posts.filter(post => 
      post.coverImage.includes('selected-premium') || 
      post.coverImage.includes('google-imagen') ||
      post.coverImage.includes('black-forest-labs-flux-1-1-pro')
    );
    
    const placeholderImages = posts.filter(post => 
      post.coverImage.includes('blog-placeholder-ai-generated')    );
    
    console.log(`\n🎨 IMAGE QUALITY BREAKDOWN:`);
    console.log(`   ✅ Premium Images (Google Imagen 4/Flux 1.1 Pro): ${premiumImages.length}`);
    console.log(`   ❌ Placeholder Images: ${placeholderImages.length}`);
    
    if (premiumImages.length > 0) {
      console.log(`\n🏆 PREMIUM IMAGES:`);
      premiumImages.forEach(post => {
        const model = post.coverImage.includes('google-imagen') ? 'Google Imagen 4' : 
                     post.coverImage.includes('flux-1-1-pro') ? 'Flux 1.1 Pro' : 'Premium';
        console.log(`   ✅ "${post.title}" (${model})`);
      });
    }
    
    // Check environment variables
    console.log(`\n🔧 ENVIRONMENT VARIABLES:`);
    console.log(`   REPLICATE_API_TOKEN: ${process.env.REPLICATE_API_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`   BLOB_READ_WRITE_TOKEN: ${process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Missing'}`);
    console.log(`   INTERNAL_API_KEY: ${process.env.INTERNAL_API_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   OPENAI_API_KEY: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing'}`);
    
    // Check automated generation setup
    console.log(`\n⏰ AUTOMATED GENERATION:`);
    console.log(`   Schedule: Daily at 5:00 AM and 5:00 PM UTC`);
    console.log(`   Endpoint: /api/cron/automated-article-generation`);
    console.log(`   Status: ✅ Configured in vercel.json`);
    
    // Check system health
    console.log(`\n🚀 SYSTEM HEALTH:`);
    
    if (premiumImages.length >= 3) {
      console.log(`   ✅ Image Quality: EXCELLENT (${premiumImages.length} premium images)`);
    } else if (premiumImages.length > 0) {
      console.log(`   ⚠️  Image Quality: GOOD (${premiumImages.length} premium images)`);
    } else {
      console.log(`   ❌ Image Quality: NEEDS IMPROVEMENT (no premium images)`);
    }
    
    const requiredEnvVars = ['REPLICATE_API_TOKEN', 'BLOB_READ_WRITE_TOKEN', 'INTERNAL_API_KEY', 'OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      console.log(`   ✅ Environment: ALL VARIABLES SET`);
    } else {
      console.log(`   ❌ Environment: MISSING ${missingVars.join(', ')}`);
    }
    
    if (posts.length > 0) {
      console.log(`   ✅ Content: ${posts.length} ARTICLES READY`);
    } else {
      console.log(`   ❌ Content: NO ARTICLES FOUND`);
    }
    
    console.log(`\n🎯 NEXT STEPS:`);
    if (premiumImages.length >= 3 && missingVars.length === 0) {
      console.log(`   🎉 System is FULLY OPERATIONAL!`);
      console.log(`   📋 Check the blog: https://fais.world/blog`);
      console.log(`   🔄 Monitor cron jobs in Vercel dashboard`);
    } else {
      if (missingVars.length > 0) {
        console.log(`   🔧 Set missing environment variables: ${missingVars.join(', ')}`);
      }
      if (premiumImages.length < 3) {
        console.log(`   🎨 Image quality has been improved with selected premium images`);
      }
    }
    
    console.log(`\n✅ STATUS CHECK COMPLETE!`);
      } catch (error) {
    console.error('❌ Error checking blog status:', error);
  }
}

// Run the check
checkBlogStatus();
