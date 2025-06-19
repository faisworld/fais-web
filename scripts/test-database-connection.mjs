#!/usr/bin/env node

import { config } from 'dotenv';
import pg from 'pg';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
});

async function testDatabase() {
  try {
    console.log('🔍 Testing Database Connection...');
    const client = await pool.connect();
    
    console.log('✅ Database connected');
    
    // Check if knowledge_base_o3 exists and has data
    const count = await client.query('SELECT COUNT(*) FROM knowledge_base_o3');
    console.log('📊 knowledge_base_o3 rows:', count.rows[0].count);
    
    // Search for satisfaction rate
    const search = await client.query("SELECT chunk_text FROM knowledge_base_o3 WHERE chunk_text ILIKE '%95%' LIMIT 3");
    console.log('🔍 Found chunks mentioning 95%:', search.rows.length);
    
    if (search.rows.length > 0) {
      console.log('📄 Sample content:', search.rows[0].chunk_text.substring(0, 200));
    }
    
    // Test a simple search
    const simpleSearch = await client.query("SELECT chunk_text FROM knowledge_base_o3 WHERE chunk_text ILIKE '%enterprise%' LIMIT 2");
    console.log('🏢 Found chunks mentioning enterprise:', simpleSearch.rows.length);
    
    client.release();
    await pool.end();
    
    console.log('✅ Database test complete');
    
  } catch (error) {
    console.error('❌ Database Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testDatabase();
