import { db } from './db';

// Database interfaces for the maintenance system
export interface OrchestrationLog {
  id: number;
  status: 'running' | 'completed' | 'failed';
  start_time: Date;
  end_time?: Date;
  duration_seconds?: number;
  total_jobs: number;
  completed_jobs: number;
  failed_jobs: number;
  error_message?: string;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface JobExecution {
  id: number;
  orchestration_id: number;
  job_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time: Date;
  end_time?: Date;
  duration_seconds?: number;
  error_message?: string;
  result_data: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface WebsiteAnalysis {
  id: number;
  job_execution_id: number;
  url: string;
  analysis_type: string;
  score: number;
  issues: Array<Record<string, unknown>>;
  recommendations: Array<Record<string, unknown>>;
  raw_analysis: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface SEOAnalysis {
  id: number;
  job_execution_id: number;
  url: string;
  current_title: string;
  current_description: string;
  current_keywords: string[];
  recommended_title: string;
  recommended_description: string;
  recommended_keywords: string[];
  competitor_analysis: Record<string, unknown>;
  keyword_gaps: Array<Record<string, unknown>>;
  technical_issues: Array<Record<string, unknown>>;
  schema_recommendations: Record<string, unknown>;
  score: number;
  created_at: Date;
}

export interface KnowledgeBaseUpdate {
  id: number;
  job_execution_id: number;
  url: string;
  content_hash: string;
  chunks_processed: number;
  embeddings_created: number;
  processing_time_seconds: number;
  content_summary: string;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface DashboardStats {
  totalOrchestrations: number;
  runningJobs: number;
  completedJobs24h: number;
  failedJobs24h: number;
  avgJobDuration: number;
}

export const maintenanceDB = {
  // Orchestration functions
  async createOrchestration(): Promise<number> {
    const result = await db.query(
      'INSERT INTO orchestration_logs (status, start_time, total_jobs, completed_jobs, failed_jobs, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      ['running', new Date(), 0, 0, 0, JSON.stringify({})]
    );
    return result.rows[0].id;
  },

  async updateOrchestration(
    id: number, 
    data: {
      status?: 'running' | 'completed' | 'failed';
      end_time?: Date;
      duration_seconds?: number;
      total_jobs?: number;
      completed_jobs?: number;
      failed_jobs?: number;
      error_message?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.end_time) {
      updates.push(`end_time = $${paramIndex++}`);
      values.push(data.end_time);
    }
    if (data.duration_seconds !== undefined) {
      updates.push(`duration_seconds = $${paramIndex++}`);
      values.push(data.duration_seconds);
    }
    if (data.total_jobs !== undefined) {
      updates.push(`total_jobs = $${paramIndex++}`);
      values.push(data.total_jobs);
    }
    if (data.completed_jobs !== undefined) {
      updates.push(`completed_jobs = $${paramIndex++}`);
      values.push(data.completed_jobs);
    }
    if (data.failed_jobs !== undefined) {
      updates.push(`failed_jobs = $${paramIndex++}`);
      values.push(data.failed_jobs);
    }
    if (data.error_message) {
      updates.push(`error_message = $${paramIndex++}`);
      values.push(data.error_message);
    }
    if (data.metadata) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(data.metadata));
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    values.push(id);

    if (updates.length > 1) { // More than just updated_at
      const query = `UPDATE orchestration_logs SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      await db.query(query, values);
    }
  },

  // Job execution functions
  async createJobExecution(
    orchestrationId: number,
    jobName: string,
    metadata: Record<string, unknown> = {}
  ): Promise<number> {
    const result = await db.query(
      'INSERT INTO job_executions (orchestration_id, job_name, status, start_time, result_data, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [orchestrationId, jobName, 'running', new Date(), JSON.stringify({}), JSON.stringify(metadata)]
    );
    return result.rows[0].id;
  },

  async updateJobExecution(
    id: number,
    data: {
      status?: 'pending' | 'running' | 'completed' | 'failed';
      end_time?: Date;
      duration_seconds?: number;
      error_message?: string;
      result_data?: Record<string, unknown>;
      metadata?: Record<string, unknown>;
    }
  ): Promise<void> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.status) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.end_time) {
      updates.push(`end_time = $${paramIndex++}`);
      values.push(data.end_time);
    }
    if (data.duration_seconds !== undefined) {
      updates.push(`duration_seconds = $${paramIndex++}`);
      values.push(data.duration_seconds);
    }
    if (data.error_message) {
      updates.push(`error_message = $${paramIndex++}`);
      values.push(data.error_message);
    }
    if (data.result_data) {
      updates.push(`result_data = $${paramIndex++}`);
      values.push(JSON.stringify(data.result_data));
    }
    if (data.metadata) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(data.metadata));
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());

    values.push(id);

    if (updates.length > 1) { // More than just updated_at
      const query = `UPDATE job_executions SET ${updates.join(', ')} WHERE id = $${paramIndex}`;
      await db.query(query, values);
    }
  },

  async completeJobExecution(
    id: number,
    resultData: Record<string, unknown> = {}
  ): Promise<void> {
    const endTime = new Date();
    const startTimeResult = await db.query(
      'SELECT start_time FROM job_executions WHERE id = $1',
      [id]
    );
    const startTime = startTimeResult.rows[0]?.start_time;
    const durationSeconds = startTime ? Math.round((endTime.getTime() - new Date(startTime).getTime()) / 1000) : 0;

    await this.updateJobExecution(id, {
      status: 'completed',
      end_time: endTime,
      duration_seconds: durationSeconds,
      result_data: resultData
    });
  },

  async failJobExecution(
    id: number,
    errorMessage: string
  ): Promise<void> {
    const endTime = new Date();
    const startTimeResult = await db.query(
      'SELECT start_time FROM job_executions WHERE id = $1',
      [id]
    );
    const startTime = startTimeResult.rows[0]?.start_time;
    const durationSeconds = startTime ? Math.round((endTime.getTime() - new Date(startTime).getTime()) / 1000) : 0;

    await this.updateJobExecution(id, {
      status: 'failed',
      end_time: endTime,
      duration_seconds: durationSeconds,
      error_message: errorMessage
    });
  },

  // Analysis storage functions
  async saveWebsiteAnalysis(
    jobExecutionId: number,
    url: string,
    analysisType: string,
    score: number,
    issues: Array<Record<string, unknown>>,
    recommendations: Array<Record<string, unknown>>,
    rawAnalysis: string,
    metadata: Record<string, unknown> = {}
  ): Promise<number> {
    const result = await db.query(
      `INSERT INTO website_analysis 
       (job_execution_id, url, analysis_type, score, issues, recommendations, raw_analysis, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        jobExecutionId,
        url,
        analysisType,
        score,
        JSON.stringify(issues),
        JSON.stringify(recommendations),
        rawAnalysis,
        JSON.stringify(metadata)
      ]
    );
    return result.rows[0].id;
  },

  async saveSEOAnalysis(
    jobExecutionId: number,
    url: string,
    currentTitle: string,
    currentDescription: string,
    currentKeywords: string[],
    recommendedTitle: string,
    recommendedDescription: string,
    recommendedKeywords: string[],
    competitorAnalysis: Record<string, unknown>,
    keywordGaps: Array<Record<string, unknown>>,
    technicalIssues: Array<Record<string, unknown>>,
    schemaRecommendations: Record<string, unknown>,
    score: number
  ): Promise<number> {
    const result = await db.query(
      `INSERT INTO seo_analysis 
       (job_execution_id, url, current_title, current_description, current_keywords, 
        recommended_title, recommended_description, recommended_keywords, 
        competitor_analysis, keyword_gaps, technical_issues, schema_recommendations, score) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        jobExecutionId,
        url,
        currentTitle,
        currentDescription,
        currentKeywords,
        recommendedTitle,
        recommendedDescription,
        recommendedKeywords,
        JSON.stringify(competitorAnalysis),
        JSON.stringify(keywordGaps),
        JSON.stringify(technicalIssues),
        JSON.stringify(schemaRecommendations),
        score
      ]
    );
    return result.rows[0].id;
  },

  async saveKnowledgeBaseUpdate(
    jobExecutionId: number,
    url: string,
    contentHash: string,
    chunksProcessed: number,
    embeddingsCreated: number,
    processingTimeSeconds: number,
    contentSummary: string,
    metadata: Record<string, unknown> = {}
  ): Promise<number> {
    const result = await db.query(
      `INSERT INTO knowledge_base_updates 
       (job_execution_id, url, content_hash, chunks_processed, embeddings_created, 
        processing_time_seconds, content_summary, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        jobExecutionId,
        url,
        contentHash,
        chunksProcessed,
        embeddingsCreated,
        processingTimeSeconds,
        contentSummary,
        JSON.stringify(metadata)
      ]
    );
    return result.rows[0].id;
  },

  // Query functions
  async getOrchestrationLogs(limit: number = 10): Promise<OrchestrationLog[]> {
    const result = await db.query(
      'SELECT * FROM orchestration_logs ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows;
  },

  async getJobExecutions(orchestrationId?: number, limit: number = 20): Promise<JobExecution[]> {
    let query = `SELECT * FROM job_executions`;
    const params: unknown[] = [];

    if (orchestrationId) {
      query += ` WHERE orchestration_id = $1`;
      params.push(orchestrationId);
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);
    return result.rows;
  },

  async getLatestAnalysisResults(limit: number = 10): Promise<Array<Record<string, unknown>>> {
    const result = await db.query(
      `SELECT 'website' as type, url, score, created_at FROM website_analysis 
       UNION ALL 
       SELECT 'seo' as type, url, score, created_at FROM seo_analysis 
       ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const result = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM orchestration_logs) as total_orchestrations,
        (SELECT COUNT(*) FROM job_executions WHERE status = 'running') as running_jobs,
        (SELECT COUNT(*) FROM job_executions WHERE status = 'completed' AND created_at > NOW() - INTERVAL '24 hours') as completed_jobs_24h,
        (SELECT COUNT(*) FROM job_executions WHERE status = 'failed' AND created_at > NOW() - INTERVAL '24 hours') as failed_jobs_24h,
        (SELECT COALESCE(AVG(duration_seconds), 0) FROM job_executions WHERE duration_seconds IS NOT NULL) as avg_job_duration
    `);
    
    const row = result.rows[0];
    return {
      totalOrchestrations: parseInt(row.total_orchestrations) || 0,
      runningJobs: parseInt(row.running_jobs) || 0,
      completedJobs24h: parseInt(row.completed_jobs_24h) || 0,
      failedJobs24h: parseInt(row.failed_jobs_24h) || 0,
      avgJobDuration: parseFloat(row.avg_job_duration) || 0
    };
  }
};
