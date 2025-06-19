#!/usr/bin/env node

import { config } from 'dotenv';
import pg from 'pg';

config({ path: '.env.local' });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL,
});

async function searchForSatisfactionRate() {
  try {
    console.log('🔍 Searching for satisfaction rate information...');
    const client = await pool.connect();
    
    // Search for satisfaction rate mentions
    const result = await client.query(
      "SELECT chunk_text FROM knowledge_base_o3 WHERE chunk_text ILIKE '%satisfaction%' OR chunk_text ILIKE '%95%' LIMIT 5"
    );
    
    console.log(`Found ${result.rows.length} chunks mentioning satisfaction or 95%:`);
    
    if (result.rows.length === 0) {
      console.log('❌ No chunks found with satisfaction rate information');
      
      // Let's search for any company stats
      const statsResult = await client.query(
        "SELECT chunk_text FROM knowledge_base_o3 WHERE chunk_text ILIKE '%client%' AND chunk_text ILIKE '%rate%' LIMIT 3"
      );
      
      console.log(`\nSearching for general client/rate mentions: ${statsResult.rows.length} found`);
      statsResult.rows.forEach((row, i) => {
        console.log(`\n${i+1}. ${row.chunk_text.substring(0, 150)}...`);
      });
    } else {
      result.rows.forEach((row, i) => {
        console.log(`\n${i+1}. ${row.chunk_text.substring(0, 200)}...`);
      });
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

searchForSatisfactionRate();
