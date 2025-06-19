#!/usr/bin/env node

/**
 * KNOWLEDGE BASE INSPECTION SCRIPT
 * 
 * This script checks the current state of the Knowledge Base / Vector Store
 * and identifies any issues with content, duplicates, or irrelevant data.
 */

import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

const { Pool } = pg;

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// Database setup
const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Helper function to analyze content
function analyzeContent(text) {
  const hasCodeSymbols = /[{}[\]<>();,.]/.test(text);
  const hasHTMLTags = /<[^>]+>/.test(text);
  const hasElevenLabsContent = /elevenlabs|11labs|fantastic\s*ai|ai\s*studio/i.test(text);
  const hasClientSpecificContent = /client|customer|contact|consultation/i.test(text);
  const isCodeContent = text.includes('import ') || text.includes('export ') || text.includes('function ') || text.includes('const ');
  const wordCount = text.split(/\s+/).length;
  
  return {
    hasCodeSymbols,
    hasHTMLTags,
    hasElevenLabsContent,
    hasClientSpecificContent,
    isCodeContent,
    wordCount,
    quality: wordCount > 10 && !isCodeContent && !hasHTMLTags ? 'good' : 'poor'
  };
}

// Check database connection and structure
async function checkDatabaseStructure() {
  console.log('🔍 Checking Database Structure...');
  console.log('================================');
  
  try {
    const client = await pool.connect();
    
    // Check if table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'knowledge_base_chunks'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ knowledge_base_chunks table does not exist');
      console.log('   Run: node scripts/setup-pgvector-table.mjs');
      return false;
    }
    
    console.log('✅ knowledge_base_chunks table exists');
    
    // Check table structure
    const columns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'knowledge_base_chunks'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Table structure:');
    columns.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type}`);
    });
    
    // Check indexes
    const indexes = await client.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE tablename = 'knowledge_base_chunks';
    `);
    
    console.log('🔗 Indexes:');
    indexes.rows.forEach(idx => {
      console.log(`   ${idx.indexname}`);
    });
    
    client.release();
    return true;
    
  } catch (error) {
    console.error('❌ Database structure check failed:', error.message);
    return false;
  }
}

// Analyze content quality and identify issues
async function analyzeKnowledgeBase() {
  console.log('\n📊 Analyzing Knowledge Base Content...');
  console.log('=====================================');
  
  try {
    const client = await pool.connect();
    
    // Get total count
    const totalCount = await client.query('SELECT COUNT(*) FROM knowledge_base_chunks');
    console.log(`📈 Total chunks: ${totalCount.rows[0].count}`);
    
    // Get unique URLs
    const urlCount = await client.query('SELECT COUNT(DISTINCT url) FROM knowledge_base_chunks');
    console.log(`🔗 Unique URLs: ${urlCount.rows[0].count}`);
    
    // Sample content for analysis
    const sampleContent = await client.query(`
      SELECT url, chunk_text, created_at 
      FROM knowledge_base_chunks 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    
    console.log('\n🔍 Content Quality Analysis:');
    console.log('============================');
    
    let codeChunks = 0;
    let htmlChunks = 0;
    let goodQualityChunks = 0;
    let elevenLabsChunks = 0;
    let clientSpecificChunks = 0;
    let urlStats = {};
    
    sampleContent.rows.forEach(row => {
      const analysis = analyzeContent(row.chunk_text);
      
      if (analysis.isCodeContent) codeChunks++;
      if (analysis.hasHTMLTags) htmlChunks++;
      if (analysis.quality === 'good') goodQualityChunks++;
      if (analysis.hasElevenLabsContent) elevenLabsChunks++;
      if (analysis.hasClientSpecificContent) clientSpecificChunks++;
      
      // URL statistics
      if (!urlStats[row.url]) {
        urlStats[row.url] = 0;
      }
      urlStats[row.url]++;
    });
    
    console.log(`✅ Good quality chunks: ${goodQualityChunks}/50 (${Math.round(goodQualityChunks/50*100)}%)`);
    console.log(`⚠️  Code-related chunks: ${codeChunks}/50 (${Math.round(codeChunks/50*100)}%)`);
    console.log(`⚠️  HTML-containing chunks: ${htmlChunks}/50 (${Math.round(htmlChunks/50*100)}%)`);
    console.log(`🎯 ElevenLabs relevant: ${elevenLabsChunks}/50 (${Math.round(elevenLabsChunks/50*100)}%)`);
    console.log(`👥 Client-specific content: ${clientSpecificChunks}/50 (${Math.round(clientSpecificChunks/50*100)}%)`);
    
    console.log('\n📄 Most Common URLs in Sample:');
    const sortedUrls = Object.entries(urlStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
    
    sortedUrls.forEach(([url, count]) => {
      console.log(`   ${count}x ${url}`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Content analysis failed:', error.message);
  }
}

// Check for specific problematic content
async function checkProblematicContent() {
  console.log('\n🚨 Checking for Problematic Content...');
  console.log('=====================================');
  
  try {
    const client = await pool.connect();
    
    // Check for code chunks
    const codeChunks = await client.query(`
      SELECT COUNT(*) 
      FROM knowledge_base_chunks 
      WHERE chunk_text LIKE '%import %' 
         OR chunk_text LIKE '%export %' 
         OR chunk_text LIKE '%function %'
         OR chunk_text LIKE '%const %'
         OR chunk_text LIKE '%<div%'
         OR chunk_text LIKE '%{%'
    `);
    
    console.log(`🔧 Code-related chunks: ${codeChunks.rows[0].count}`);
    
    // Check for admin-only content
    const adminChunks = await client.query(`
      SELECT COUNT(*) 
      FROM knowledge_base_chunks 
      WHERE url LIKE '%/admin/%'
    `);
    
    console.log(`🔒 Admin page chunks: ${adminChunks.rows[0].count}`);
    
    // Check for irrelevant 11Labs content
    const irrelevantContent = await client.query(`
      SELECT COUNT(*) 
      FROM knowledge_base_chunks 
      WHERE chunk_text ILIKE '%elevenlabs%' 
        AND url NOT LIKE '%elevenlabs%'
        AND chunk_text NOT ILIKE '%fantastic ai%'
    `);
    
    console.log(`🚫 Potentially irrelevant 11Labs content: ${irrelevantContent.rows[0].count}`);
    
    // Sample problematic content
    const problemSample = await client.query(`
      SELECT url, LEFT(chunk_text, 200) as sample 
      FROM knowledge_base_chunks 
      WHERE chunk_text LIKE '%import %' 
         OR chunk_text LIKE '%<div%'
         OR chunk_text LIKE '%{%'
      LIMIT 5
    `);
    
    if (problemSample.rows.length > 0) {
      console.log('\n📝 Sample Problematic Content:');
      problemSample.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.url}`);
        console.log(`      "${row.sample}..."`);
      });
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Problematic content check failed:', error.message);
  }
}

// Check separation between O3 and ElevenLabs content
async function checkContentSeparation() {
  console.log('\n🔄 Checking Content Separation...');
  console.log('=================================');
  
  console.log('📋 Current Knowledge Base Status:');
  console.log('   • Single unified database (knowledge_base_chunks)');
  console.log('   • Contains all website content');
  console.log('   • Used by both O3 assistant and ElevenLabs');
  
  console.log('\n💡 ElevenLabs Knowledge Base:');
  console.log('   • Separate endpoint: /api/knowledge-base/elevenlabs');
  console.log('   • Curated content specifically for client interactions');
  console.log('   • Does not use vector database - uses static content');
  
  console.log('\n⚠️  Potential Issues:');
  console.log('   • O3 assistant may access admin/internal content');
  console.log('   • Code snippets and technical docs mixed with client info');
  console.log('   • No filtering for client-appropriate content');
  
  console.log('\n🎯 Recommendations:');
  console.log('   1. Create separate knowledge_base_o3 table for internal use');
  console.log('   2. Create knowledge_base_client table for customer-facing content');
  console.log('   3. Implement content filtering based on URL patterns');
  console.log('   4. Add content classification tags');
}

// Main execution
async function main() {
  console.log('🧠 KNOWLEDGE BASE INSPECTION');
  console.log('============================');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Database: ${DATABASE_URL ? 'Connected' : 'Not configured'}\n`);
  
  try {
    const structureOk = await checkDatabaseStructure();
    
    if (structureOk) {
      await analyzeKnowledgeBase();
      await checkProblematicContent();
      await checkContentSeparation();
    }
    
    console.log('\n✅ Knowledge Base inspection complete!');
    console.log('\n📞 Next Steps:');
    console.log('   1. Review the analysis above');
    console.log('   2. Consider implementing content separation');
    console.log('   3. Clean up problematic content if needed');
    console.log('   4. Set up separate databases for O3 vs ElevenLabs if required');
    
  } catch (error) {
    console.error('💥 Inspection failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the inspection
main();
