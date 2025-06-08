const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixRunningOrchestrations() {
  let client;
  
  try {
    client = await pool.connect();
    console.log('🔗 Connected to database');
    
    // Find all orchestrations that are still "running" but should be completed
    const runningOrchestrations = await client.query(`
      SELECT id, start_time 
      FROM orchestration_logs 
      WHERE status = 'running' 
      AND start_time < NOW() - INTERVAL '1 hour'
    `);
    
    console.log(`Found ${runningOrchestrations.rows.length} orchestrations to fix`);
    
    // Update each running orchestration to completed status
    for (const orchestration of runningOrchestrations.rows) {
      console.log(`Fixing orchestration ${orchestration.id}`);
      
      // Calculate duration
      const duration = await client.query(`
        SELECT EXTRACT(EPOCH FROM (NOW() - start_time))::integer as duration_seconds
        FROM orchestration_logs 
        WHERE id = $1
      `, [orchestration.id]);
      
      const durationSeconds = duration.rows[0]?.duration_seconds || 0;
      
      // Get job counts for this orchestration
      const jobCounts = await client.query(`
        SELECT 
          COUNT(*) as total_jobs,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_jobs,
          COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_jobs
        FROM job_executions 
        WHERE orchestration_id = $1
      `, [orchestration.id]);
      
      const { total_jobs, completed_jobs, failed_jobs } = jobCounts.rows[0] || { total_jobs: 0, completed_jobs: 0, failed_jobs: 0 };
      
      // Update orchestration to completed
      await client.query(`
        UPDATE orchestration_logs 
        SET 
          status = 'completed',
          end_time = NOW(),
          duration_seconds = $1,
          total_jobs = $2,
          completed_jobs = $3,
          failed_jobs = $4,
          updated_at = NOW()
        WHERE id = $5
      `, [durationSeconds, total_jobs, completed_jobs, failed_jobs, orchestration.id]);
      
      console.log(`✅ Fixed orchestration ${orchestration.id}: ${total_jobs} total jobs, ${completed_jobs} completed, ${failed_jobs} failed`);
    }
    
    console.log('✅ All running orchestrations have been fixed');
    
  } catch (error) {
    console.error('❌ Error fixing orchestrations:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// Run the fix
fixRunningOrchestrations().catch(console.error);
