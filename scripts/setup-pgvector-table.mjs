// scripts/setup-pgvector-table.mjs
import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';

const { Pool } = pg;

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// Use either DATABASE_URL or DATABASE_URL_UNPOOLED from your .env.local
const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('Database URL not found in environment variables.');
  process.exit(1);
}

// Create a connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Connected to Neon database.');
    
    // Create pgvector extension if it doesn't exist
    console.log('Creating pgvector extension...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('pgvector extension created or already exists.');
    
    // Create knowledge_base_chunks table
    console.log('Creating knowledge_base_chunks table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_base_chunks (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        chunk_text TEXT NOT NULL,
        embedding VECTOR(1536) NOT NULL, -- Dimension for text-embedding-ada-002
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('knowledge_base_chunks table created or already exists.');
    
    // Create HNSW index for efficient similarity search
    console.log('Creating HNSW index for vector similarity search...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS knowledge_base_chunks_embedding_idx 
      ON knowledge_base_chunks 
      USING HNSW (embedding vector_l2_ops);
    `);
    console.log('HNSW index created or already exists.');
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
