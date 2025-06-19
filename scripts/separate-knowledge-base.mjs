#!/usr/bin/env node

/**
 * KNOWLEDGE BASE CLEANUP AND SEPARATION SCRIPT
 * 
 * This script cleans up the knowledge base and creates separate databases:
 * 1. knowledge_base_o3 - For internal O3 assistant (all content)
 * 2. knowledge_base_client - For client-facing ElevenLabs (filtered content)
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

// Content classification function
function classifyContent(url, chunkText) {
  const classification = {
    isClientFacing: true,
    isInternal: true,
    isProblematic: false,
    category: 'general',
    quality: 'good'
  };
  
  // URL-based classification
  if (url.includes('/admin/')) {
    classification.isClientFacing = false;
    classification.category = 'admin';
  }
  
  if (url.includes('/api/')) {
    classification.isClientFacing = false;
    classification.category = 'api';
  }
  
  if (url.includes('/kvitka-poloniny/')) {
    classification.isClientFacing = false;
    classification.category = 'kvitka';
  }
  
  // Content-based classification
  const hasCodeSymbols = /[{}[\]();]/.test(chunkText) && chunkText.split(/[{}[\]();]/).length > 3;
  const hasHTMLTags = /<[^>]+>/.test(chunkText);
  const hasImports = /import\s+.*from|export\s+/i.test(chunkText);
  const isCodeContent = hasImports || (hasCodeSymbols && chunkText.includes('function'));
  
  if (isCodeContent || hasHTMLTags) {
    classification.isProblematic = true;
    classification.quality = 'poor';
    classification.isClientFacing = false;
  }
  
  // Business content classification
  if (url.includes('/blog/') || url.includes('/services/') || url.includes('/about/')) {
    classification.category = 'business';
  }
  
  if (url.includes('/contact/') || url.includes('/gallery/')) {
    classification.category = 'public';
  }
  
  // Content quality check
  const wordCount = chunkText.split(/\s+/).length;
  if (wordCount < 10) {
    classification.quality = 'poor';
    classification.isClientFacing = false;
  }
  
  return classification;
}

// Create new tables
async function createSeparatedTables() {
  console.log('🔧 Creating Separated Knowledge Base Tables...');
  console.log('=============================================');
  
  const client = await pool.connect();
  
  try {
    // Create O3 table (internal use - all content)
    console.log('📊 Creating knowledge_base_o3 table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base_o3 (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding VECTOR(1536) NOT NULL,
        category TEXT DEFAULT 'general',
        quality TEXT DEFAULT 'good',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        original_id INTEGER
      );
    `);
    
    // Create client table (customer-facing - filtered content)
    console.log('👥 Creating knowledge_base_client table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base_client (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding VECTOR(1536) NOT NULL,
        category TEXT DEFAULT 'business',
        quality TEXT DEFAULT 'good',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        original_id INTEGER
      );
    `);
    
    // Create indexes
    console.log('🔗 Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_base_o3_embedding_idx 
      ON knowledge_base_o3 
      USING HNSW (embedding vector_l2_ops);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_base_client_embedding_idx 
      ON knowledge_base_client 
      USING HNSW (embedding vector_l2_ops);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_base_o3_category_idx 
      ON knowledge_base_o3 (category);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_base_client_category_idx 
      ON knowledge_base_client (category);
    `);
    
    console.log('✅ Tables and indexes created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Migrate and classify content
async function migrateAndClassifyContent() {
  console.log('\n📦 Migrating and Classifying Content...');
  console.log('======================================');
  
  const client = await pool.connect();
  
  try {
    // Get all content from original table
    const allContent = await client.query(`
      SELECT id, url, chunk_text, embedding 
      FROM knowledge_base_chunks 
      ORDER BY id
    `);
    
    console.log(`📊 Processing ${allContent.rows.length} chunks...`);
    
    let o3Count = 0;
    let clientCount = 0;
    let problematicCount = 0;
    
    for (const row of allContent.rows) {
      const classification = classifyContent(row.url, row.chunk_text);
      
      // Always add to O3 database (internal use)
      if (classification.isInternal) {
        await client.query(`
          INSERT INTO knowledge_base_o3 
          (url, chunk_text, embedding, category, quality, original_id)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          row.url,
          row.chunk_text,
          row.embedding,
          classification.category,
          classification.quality,
          row.id
        ]);
        o3Count++;
      }
      
      // Add to client database only if appropriate
      if (classification.isClientFacing && !classification.isProblematic) {
        await client.query(`
          INSERT INTO knowledge_base_client 
          (url, chunk_text, embedding, category, quality, original_id)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          row.url,
          row.chunk_text,
          row.embedding,
          classification.category,
          classification.quality,
          row.id
        ]);
        clientCount++;
      }
      
      if (classification.isProblematic) {
        problematicCount++;
      }
    }
    
    console.log(`✅ Migration complete!`);
    console.log(`   📊 O3 database: ${o3Count} chunks`);
    console.log(`   👥 Client database: ${clientCount} chunks`);
    console.log(`   ⚠️  Problematic (excluded from client): ${problematicCount} chunks`);
    
  } catch (error) {
    console.error('❌ Error migrating content:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Generate content statistics
async function generateStatistics() {
  console.log('\n📈 Generating Content Statistics...');
  console.log('==================================');
  
  const client = await pool.connect();
  
  try {
    // O3 database statistics
    const o3Stats = await client.query(`
      SELECT 
        category,
        quality,
        COUNT(*) as count
      FROM knowledge_base_o3 
      GROUP BY category, quality
      ORDER BY category, quality
    `);
    
    console.log('📊 O3 Database (Internal Use):');
    o3Stats.rows.forEach(row => {
      console.log(`   ${row.category} (${row.quality}): ${row.count} chunks`);
    });
    
    // Client database statistics
    const clientStats = await client.query(`
      SELECT 
        category,
        quality,
        COUNT(*) as count
      FROM knowledge_base_client 
      GROUP BY category, quality
      ORDER BY category, quality
    `);
    
    console.log('\n👥 Client Database (Customer-Facing):');
    clientStats.rows.forEach(row => {
      console.log(`   ${row.category} (${row.quality}): ${row.count} chunks`);
    });
    
    // URL distribution in client database
    const urlStats = await client.query(`
      SELECT 
        url,
        COUNT(*) as count
      FROM knowledge_base_client 
      GROUP BY url
      ORDER BY count DESC
      LIMIT 10
    `);
    
    console.log('\n🔗 Top URLs in Client Database:');
    urlStats.rows.forEach(row => {
      console.log(`   ${row.count}x ${row.url}`);
    });
    
  } catch (error) {
    console.error('❌ Error generating statistics:', error.message);
  } finally {
    client.release();
  }
}

// Create backup of original table
async function backupOriginalTable() {
  console.log('\n💾 Creating Backup of Original Table...');
  console.log('======================================');
  
  const client = await pool.connect();
    try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').replace(/[-T]/g, '').substring(0, 14);
    const backupTableName = `knowledge_base_chunks_backup_${timestamp}`;
    
    await client.query(`
      CREATE TABLE ${backupTableName} AS 
      SELECT * FROM knowledge_base_chunks;
    `);
    
    const count = await client.query(`SELECT COUNT(*) FROM ${backupTableName}`);
    console.log(`✅ Backup created: ${backupTableName}`);
    console.log(`   📊 Backed up ${count.rows[0].count} chunks`);
    
    return backupTableName;
    
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Update API endpoints configuration
function updateAPIEndpointsInfo() {
  console.log('\n🔧 API Endpoints Configuration Info...');
  console.log('=====================================');
  
  console.log('📋 Updated API Endpoints:');
  console.log('   • O3 Assistant: Use knowledge_base_o3 table');
  console.log('   • ElevenLabs: Use knowledge_base_client table');
  console.log('   • Original: knowledge_base_chunks (backed up)');
  
  console.log('\n🔧 Required Code Updates:');
  console.log('   1. Update utils/rag-pipeline/vector-store-search.ts');
  console.log('   2. Add table parameter to search functions');
  console.log('   3. Update RAG query API to use knowledge_base_o3');
  console.log('   4. Create new ElevenLabs vector search endpoint');
  
  console.log('\n📝 Environment Variables:');
  console.log('   No changes needed - same DATABASE_URL');
}

// Main execution
async function main() {
  console.log('🧠 KNOWLEDGE BASE CLEANUP AND SEPARATION');
  console.log('========================================');
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Database: ${DATABASE_URL ? 'Connected' : 'Not configured'}\n`);
  
  try {
    // Create backup first
    const backupName = await backupOriginalTable();
    
    // Create new separated tables
    await createSeparatedTables();
    
    // Migrate and classify content
    await migrateAndClassifyContent();
    
    // Generate statistics
    await generateStatistics();
    
    // Show configuration info
    updateAPIEndpointsInfo();
    
    console.log('\n✅ Knowledge Base separation complete!');
    console.log('\n📞 Next Steps:');
    console.log('   1. Update vector search utilities to support table selection');
    console.log('   2. Update O3 assistant to use knowledge_base_o3');
    console.log('   3. Update ElevenLabs integration if needed');
    console.log('   4. Test both systems with new separated data');
    console.log(`   5. Original data backed up as: ${backupName}`);
    
  } catch (error) {
    console.error('💥 Separation failed:', error.message);
    console.error('   The original table remains untouched');
  } finally {
    await pool.end();
  }
}

// Run the separation
main();
