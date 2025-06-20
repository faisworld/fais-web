import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Database configuration
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function inspectTables() {
  try {
    console.log('🔍 Inspecting database tables...');
    
    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    
    console.log('📊 Available tables:');
    tables.forEach(table => console.log(`  - ${table.table_name}`));
    
    // Check if images table exists and its structure
    if (tables.some(t => t.table_name === 'images')) {
      console.log('\n🖼️ Images table structure:');
      const columns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'images'
        ORDER BY ordinal_position
      `;
      
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ''}`);
      });
        // Sample data
      console.log('\n📝 Sample image records:');
      const sampleImages = await sql`
        SELECT id, url, seo_name, "alt-tag", uploaded_at
        FROM images 
        ORDER BY uploaded_at DESC 
        LIMIT 5
      `;
      
      sampleImages.forEach(img => {
        console.log(`  - ID: ${img.id}, URL: ${img.url?.substring(0, 60)}...`);
        console.log(`    SEO: ${img.seo_name}, Alt: ${img['alt-tag']?.substring(0, 40) || 'N/A'}`);
        console.log(`    Date: ${img.uploaded_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error inspecting database:', error);
  }
}

inspectTables();
