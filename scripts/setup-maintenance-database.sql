-- Database schema for the maintenance system
-- Run this script to create all necessary tables for the automated maintenance system

-- Create orchestration_logs table
CREATE TABLE IF NOT EXISTS orchestration_logs (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) NOT NULL DEFAULT 'running',
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER,
  total_jobs INTEGER NOT NULL DEFAULT 0,
  completed_jobs INTEGER NOT NULL DEFAULT 0,
  failed_jobs INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job_executions table
CREATE TABLE IF NOT EXISTS job_executions (
  id SERIAL PRIMARY KEY,
  orchestration_id INTEGER REFERENCES orchestration_logs(id) ON DELETE CASCADE,
  job_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_seconds INTEGER,
  error_message TEXT,
  result_data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create website_analysis table (with _results suffix to match code)
CREATE TABLE IF NOT EXISTS website_analysis_results (
  id SERIAL PRIMARY KEY,
  job_execution_id INTEGER REFERENCES job_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  analysis_type VARCHAR(100) NOT NULL,
  score DECIMAL(5,2),
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  raw_analysis TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create seo_analysis table (with _results suffix to match code)
CREATE TABLE IF NOT EXISTS seo_analysis_results (
  id SERIAL PRIMARY KEY,
  job_execution_id INTEGER REFERENCES job_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  current_title TEXT,
  current_description TEXT,
  current_keywords JSONB DEFAULT '[]',
  recommended_title TEXT,
  recommended_description TEXT,
  recommended_keywords JSONB DEFAULT '[]',
  competitor_analysis JSONB DEFAULT '{}',
  keyword_gaps JSONB DEFAULT '[]',
  technical_issues JSONB DEFAULT '[]',
  schema_recommendations JSONB DEFAULT '{}',
  score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keep legacy tables for backward compatibility
CREATE TABLE IF NOT EXISTS website_analysis (
  id SERIAL PRIMARY KEY,
  job_execution_id INTEGER REFERENCES job_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  analysis_type VARCHAR(100) NOT NULL,
  score DECIMAL(5,2),
  issues JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  raw_analysis TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seo_analysis (
  id SERIAL PRIMARY KEY,
  job_execution_id INTEGER REFERENCES job_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  current_title TEXT,
  current_description TEXT,
  current_keywords JSONB DEFAULT '[]',
  recommended_title TEXT,
  recommended_description TEXT,
  recommended_keywords JSONB DEFAULT '[]',
  competitor_analysis JSONB DEFAULT '{}',
  keyword_gaps JSONB DEFAULT '[]',
  technical_issues JSONB DEFAULT '[]',
  schema_recommendations JSONB DEFAULT '{}',
  score DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge_base_updates table
CREATE TABLE IF NOT EXISTS knowledge_base_updates (
  id SERIAL PRIMARY KEY,
  job_execution_id INTEGER REFERENCES job_executions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  content_hash VARCHAR(64),
  chunks_processed INTEGER DEFAULT 0,
  embeddings_created INTEGER DEFAULT 0,
  processing_time_seconds DECIMAL(8,2),
  content_summary TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orchestration_logs_status ON orchestration_logs(status);
CREATE INDEX IF NOT EXISTS idx_orchestration_logs_created_at ON orchestration_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_job_executions_status ON job_executions(status);
CREATE INDEX IF NOT EXISTS idx_job_executions_orchestration_id ON job_executions(orchestration_id);
CREATE INDEX IF NOT EXISTS idx_job_executions_created_at ON job_executions(created_at);
CREATE INDEX IF NOT EXISTS idx_website_analysis_url ON website_analysis(url);
CREATE INDEX IF NOT EXISTS idx_website_analysis_created_at ON website_analysis(created_at);
CREATE INDEX IF NOT EXISTS idx_website_analysis_results_url ON website_analysis_results(url);
CREATE INDEX IF NOT EXISTS idx_website_analysis_results_created_at ON website_analysis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_url ON seo_analysis(url);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_created_at ON seo_analysis(created_at);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_results_url ON seo_analysis_results(url);
CREATE INDEX IF NOT EXISTS idx_seo_analysis_results_created_at ON seo_analysis_results(created_at);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_updates_url ON knowledge_base_updates(url);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_updates_created_at ON knowledge_base_updates(created_at);

-- Add comments for documentation
COMMENT ON TABLE orchestration_logs IS 'Logs for automated maintenance orchestration runs';
COMMENT ON TABLE job_executions IS 'Individual job execution records within orchestrations';
COMMENT ON TABLE website_analysis IS 'Website analysis results from crawling and analysis jobs';
COMMENT ON TABLE seo_analysis IS 'SEO optimization analysis results';
COMMENT ON TABLE knowledge_base_updates IS 'Knowledge base update tracking and metrics';

-- Display table creation summary
SELECT 
  'Maintenance database schema created successfully' as status,
  COUNT(*) as tables_created
FROM information_schema.tables 
WHERE table_name IN ('orchestration_logs', 'job_executions', 'website_analysis', 'seo_analysis', 'knowledge_base_updates')
  AND table_schema = 'public';