#!/usr/bin/env node

/**
 * Test Blog System Status
 * Quick script to check the current state of your blog system
 */

import { blogPosts } from '../app/blog/blog-data.js';

console.log('📊 FAIS Blog System Status Report');
console.log('=' .repeat(50));
console.log(`🕐 Timestamp: ${new Date().toISOString()}\n`);

// Basic statistics
console.log('📈 Article Statistics:');
console.log(`   Total Articles: ${blogPosts.length}`);

const categories = blogPosts.reduce((acc, post) => {
  acc[post.category] = (acc[post.category] || 0) + 1;
  return acc;
}, {});

Object.entries(categories).forEach(([category, count]) => {
  console.log(`   ${category.toUpperCase()}: ${count} articles`);
});

// Check for image issues
const articlesWithPlaceholders = blogPosts.filter(post => 
  post.coverImage.includes('blog-placeholder-ai-generated') || 
  post.coverImage === '/placeholder.svg'
);

console.log(`\n🖼️  Image Status:`);
console.log(`   Articles with proper images: ${blogPosts.length - articlesWithPlaceholders.length}`);
console.log(`   Articles with placeholders: ${articlesWithPlaceholders.length}`);

if (articlesWithPlaceholders.length > 0) {
  console.log('\n⚠️  Articles needing images:');
  articlesWithPlaceholders.forEach(post => {
    console.log(`   - "${post.title}" (${post.category})`);
  });
}

// Show recent articles
const sortedPosts = [...blogPosts].sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

console.log(`\n📚 Recent Articles (Latest 3):`);
sortedPosts.slice(0, 3).forEach((post, index) => {
  console.log(`   ${index + 1}. "${post.title}"`);
  console.log(`      Date: ${post.date} | Category: ${post.category}`);
  console.log(`      Image: ${post.coverImage.includes('placeholder') ? '❌ Placeholder' : '✅ Custom'}`);
});

// Cron schedule info
console.log(`\n⏰ Automated Generation Schedule:`);
console.log(`   Schedule: Daily at 5:00 AM and 5:00 PM UTC`);
console.log(`   Next runs: Check Vercel dashboard at https://vercel.com/fais-devs/fais-web`);

console.log(`\n🔗 Quick Links:`);
console.log(`   Blog: https://fais.world/blog`);
console.log(`   Admin: https://fais.world/admin/ai-tools/article-generation`);
console.log(`   Vercel Dashboard: https://vercel.com/fais-devs/fais-web`);

console.log('\n' + '=' .repeat(50));
