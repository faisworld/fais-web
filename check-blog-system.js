#!/usr/bin/env node

/**
 * Blog System Diagnostic Script
 * Checks the status of the automatic blog posting system
 */

console.log('🔍 Blog System Diagnostics\n');

// Check 1: Static Blog Data
console.log('📄 Checking Static Blog Data...');
try {
  const blogData = require('./app/blog/blog-data.ts');
  console.log(`✅ Blog data file exists`);
  console.log(`📊 Number of posts: ${blogData.blogPosts?.length || 0}`);
  
  if (blogData.blogPosts?.length > 0) {
    console.log('📝 Recent posts:');
    blogData.blogPosts.slice(0, 3).forEach(post => {
      console.log(`   - ${post.title} (${post.date})`);
    });
  }
} catch (error) {
  console.log(`❌ Error loading blog data: ${error.message}`);
}

// Check 2: Cron Job Configuration
console.log('\n⏰ Checking Cron Job Configuration...');
try {
  const vercelConfig = require('./vercel.json');
  const cronJobs = vercelConfig.crons || [];
  const articleCron = cronJobs.find(job => job.path?.includes('automated-article-generation'));
  
  if (articleCron) {
    console.log(`✅ Cron job configured: ${articleCron.schedule}`);
    console.log(`📍 Endpoint: ${articleCron.path}`);
  } else {
    console.log('❌ No article generation cron job found');
  }
} catch (error) {
  console.log(`❌ Error checking cron config: ${error.message}`);
}

// Check 3: Environment Variables
console.log('\n🔐 Checking Environment Variables...');
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'INTERNAL_API_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'REPLICATE_API_TOKEN'
];

requiredEnvVars.forEach(varName => {
  const isSet = process.env[varName] ? '✅' : '❌';
  const value = process.env[varName] ? '[SET]' : '[MISSING]';
  console.log(`${isSet} ${varName}: ${value}`);
});

// Check 4: Test API Endpoint Locally
console.log('\n🌐 Testing API Endpoints...');

async function testEndpoints() {
  const baseUrl = 'http://localhost:3000';
  const endpoints = [
    '/api/admin/ai-tools/generate-article',
    '/api/cron/automated-article-generation'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.INTERNAL_API_KEY || 'test-key'}`
        },
        body: JSON.stringify({
          topic: 'Test article generation',
          keywords: ['test', 'automation']
        })
      });
      
      console.log(`${response.ok ? '✅' : '❌'} ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

// Check 5: Production URL Test
async function testProduction() {
  console.log('\n🚀 Testing Production Blog...');
  try {
    const response = await fetch('https://fais.world/blog');
    const html = await response.text();
    
    if (html.includes('No articles found')) {
      console.log('❌ Production blog shows "No articles found"');
    } else if (html.includes('Recent Articles')) {
      console.log('✅ Production blog appears to have content');
    } else {
      console.log('⚠️ Unclear blog status');
    }
  } catch (error) {
    console.log(`❌ Error checking production: ${error.message}`);
  }
}

// Run all checks
if (typeof window === 'undefined') {
  // Node.js environment
  Promise.all([
    testEndpoints().catch(console.error),
    testProduction().catch(console.error)
  ]).then(() => {
    console.log('\n📋 Summary:');
    console.log('- Check the missing environment variables in Vercel dashboard');
    console.log('- Verify cron job is running (check Vercel Functions tab)');
    console.log('- Test article generation manually via admin panel');
    console.log('- Check blog page rendering issue (fixed with loading skeleton)');
  });
}
