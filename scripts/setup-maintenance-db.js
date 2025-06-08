import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupMaintenanceDatabase() {
  let client;
  
  try {
    client = await pool.connect();
    console.log('🔗 Connected to database');
    
    // Read and execute the SQL script
    const sqlPath = path.join(__dirname, 'setup-maintenance-database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL statements and execute them one by one
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        await client.query(statement);
      }
    }
    
    console.log('✅ Maintenance database setup complete');
      // Test the setup by getting table info
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('orchestration_logs', 'job_executions', 'website_analysis_results', 'seo_analysis_results', 'knowledge_base_updates')
      ORDER BY table_name
    `);
    
    console.log('📊 Created tables:', result.rows.map(row => row.table_name));
    
  } catch (error) {
    console.error('❌ Error setting up maintenance database:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the setup
setupMaintenanceDatabase().catch(console.error);
