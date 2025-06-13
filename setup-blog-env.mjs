#!/usr/bin/env node

/**
 * Environment Variables Setup Script
 * Generates the required environment variables for the automated blog system
 */

import crypto from 'crypto';

console.log('🔧 FAIS Blog System - Environment Variables Setup\n');

// Generate secure internal API key
const internalApiKey = crypto.randomBytes(32).toString('hex');

console.log('📋 REQUIRED ENVIRONMENT VARIABLES FOR VERCEL:\n');
console.log('Copy these to your Vercel dashboard (https://vercel.com/fais-devs/fais-web/settings/environment-variables):\n');

console.log('1. INTERNAL_API_KEY');
console.log(`   Value: ${internalApiKey}`);
console.log('   Environment: Production, Preview, Development\n');

console.log('2. OPENAI_API_KEY');
console.log('   Value: sk-...your-openai-api-key...');
console.log('   Environment: Production, Preview, Development\n');

console.log('3. BLOB_READ_WRITE_TOKEN');
console.log('   Value: vercel_blob_rw_...your-blob-token...');
console.log('   Environment: Production, Preview, Development\n');

console.log('4. REPLICATE_API_TOKEN (Optional)');
console.log('   Value: r8_...your-replicate-token...');
console.log('   Environment: Production, Preview, Development\n');

console.log('🚀 NEXT STEPS AFTER ADDING ENVIRONMENT VARIABLES:\n');
console.log('1. Add all environment variables to Vercel dashboard');
console.log('2. Redeploy the project (automatic or manual)');
console.log('3. Test the automated article generation:');
console.log('   - Go to: https://fais.world/admin/ai-tools/article-generation');
console.log('   - Generate a test article');
console.log('   - Check if it appears on: https://fais.world/blog\n');

console.log('4. Monitor cron job execution:');
console.log('   - Check Vercel Functions dashboard');
console.log('   - Look for /api/cron/automated-article-generation');
console.log('   - Runs twice daily at 5 AM and 5 PM UTC\n');

console.log('🔍 VERIFICATION:\n');
console.log('Once environment variables are set:');
console.log('- Blog should display existing articles (fixed hydration issue)');
console.log('- Automated system should generate new articles twice daily');
console.log('- Admin panel should work for manual article generation\n');

console.log('💡 TROUBLESHOOTING:\n');
console.log('If articles still don\'t show:');
console.log('1. Check browser console for debug logs');
console.log('2. Verify all environment variables are set');
console.log('3. Test manual article generation first');
console.log('4. Check Vercel function logs for errors\n');

console.log('✅ Ready to fix the blog automatic posting system!');
