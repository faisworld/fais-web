import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Define types for database rows
interface KnowledgeBaseRow {
  url: string
  content_summary: string
  chunks_processed: number
  embeddings_created: number
  processing_time_seconds: number
  metadata: string | object
  created_at: string
}

interface WebsiteAnalysisRow {
  url: string
  analysis_type: string
  score: number
  issues: string | unknown[]
  recommendations: string | unknown[]
  metadata: string | object
  created_at: string
}

interface SEOAnalysisRow {
  url: string
  current_title: string
  current_description: string
  recommended_title: string
  recommended_description: string
  current_keywords: string | unknown[]
  recommended_keywords: string | unknown[]
  competitor_analysis: string | object
  keyword_gaps: string | unknown[]
  technical_issues: string | unknown[]
  schema_recommendations: string | object
  score: number
  created_at: string
}

interface JobExecutionRow {
  job_type: string
  status: string
  duration_seconds: number
  result_data: string | object
  created_at: string
}

interface OrchestrationLogRow {
  trigger_type: string
  total_jobs: number
  successful_jobs: number
  failed_jobs: number
  total_duration_seconds: number
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'xml'
    const limit = parseInt(searchParams.get('limit') || '1000')

    // Fetch comprehensive knowledge base data
    const [
      knowledgeBaseUpdates,
      websiteAnalysis,
      seoAnalysis,
      jobExecutions,
      orchestrationLogs    ] = await Promise.all([
      db.query(`
        SELECT 
          url,
          content_summary,
          chunks_processed,
          embeddings_created,
          processing_time_seconds,
          metadata,
          created_at
        FROM knowledge_base_updates 
        ORDER BY created_at DESC 
        LIMIT $1
      `, [limit]),
        db.query(`
        SELECT 
          url,
          analysis_type,
          score,
          issues,
          recommendations,
          metadata,
          created_at
        FROM website_analysis_results 
        ORDER BY created_at DESC 
        LIMIT $1
      `, [limit]),
        db.query(`
        SELECT 
          url,
          current_title,
          current_description,
          recommended_title,
          recommended_description,
          current_keywords,
          recommended_keywords,
          competitor_analysis,
          keyword_gaps,
          technical_issues,
          schema_recommendations,
          score,
          created_at
        FROM seo_analysis_results 
        ORDER BY created_at DESC 
        LIMIT $1
      `, [limit]),      db.query(`
        SELECT 
          job_name as job_type,
          status,
          duration_seconds,
          result_data,
          created_at
        FROM job_executions 
        WHERE status = 'completed'
        ORDER BY created_at DESC 
        LIMIT $1
      `, [limit]),

      db.query(`
        SELECT 
          status as trigger_type,
          total_jobs,
          completed_jobs as successful_jobs,
          failed_jobs,
          duration_seconds as total_duration_seconds,
          created_at
        FROM orchestration_logs 
        ORDER BY created_at DESC 
        LIMIT 100
      `)
    ])

    // Compile knowledge base export data
    const knowledgeBaseData = {
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRecords: {
          knowledgeBaseUpdates: knowledgeBaseUpdates.rows.length,
          websiteAnalysis: websiteAnalysis.rows.length,
          seoAnalysis: seoAnalysis.rows.length,
          jobExecutions: jobExecutions.rows.length,
          orchestrationLogs: orchestrationLogs.rows.length
        },
        exportFormat: format,
        dataSource: 'Fantastic AI Studio Maintenance Database',
        description: 'Comprehensive knowledge base export for AI model training and integration'
      },      websiteContent: {
        knowledgeBaseUpdates: knowledgeBaseUpdates.rows.map((row: KnowledgeBaseRow) => ({
          url: row.url,
          contentSummary: row.content_summary,
          chunksProcessed: row.chunks_processed,
          embeddingsCreated: row.embeddings_created,
          processingTime: row.processing_time_seconds,
          metadata: typeof row.metadata === 'object' ? row.metadata : JSON.parse(row.metadata || '{}'),
          processedAt: row.created_at
        })),
        analysisResults: websiteAnalysis.rows.map((row: WebsiteAnalysisRow) => ({
          url: row.url,
          analysisType: row.analysis_type,
          score: row.score,
          issues: Array.isArray(row.issues) ? row.issues : JSON.parse(row.issues || '[]'),
          recommendations: Array.isArray(row.recommendations) ? row.recommendations : JSON.parse(row.recommendations || '[]'),
          metadata: typeof row.metadata === 'object' ? row.metadata : JSON.parse(row.metadata || '{}'),
          analyzedAt: row.created_at
        }))
      },      seoOptimization: {
        analyses: seoAnalysis.rows.map((row: SEOAnalysisRow) => ({
          url: row.url,
          currentTitle: row.current_title,
          currentDescription: row.current_description,
          recommendedTitle: row.recommended_title,
          recommendedDescription: row.recommended_description,
          currentKeywords: Array.isArray(row.current_keywords) ? row.current_keywords : JSON.parse(row.current_keywords || '[]'),
          recommendedKeywords: Array.isArray(row.recommended_keywords) ? row.recommended_keywords : JSON.parse(row.recommended_keywords || '[]'),
          competitorAnalysis: typeof row.competitor_analysis === 'object' ? row.competitor_analysis : JSON.parse(row.competitor_analysis || '{}'),
          keywordGaps: Array.isArray(row.keyword_gaps) ? row.keyword_gaps : JSON.parse(row.keyword_gaps || '[]'),
          technicalIssues: Array.isArray(row.technical_issues) ? row.technical_issues : JSON.parse(row.technical_issues || '[]'),
          schemaRecommendations: typeof row.schema_recommendations === 'object' ? row.schema_recommendations : JSON.parse(row.schema_recommendations || '{}'),
          score: row.score,
          analyzedAt: row.created_at
        }))
      },      automationMetrics: {
        jobExecutions: jobExecutions.rows.map((row: JobExecutionRow) => ({
          jobType: row.job_type,
          status: row.status,
          duration: row.duration_seconds,
          resultData: typeof row.result_data === 'object' ? row.result_data : JSON.parse(row.result_data || '{}'),
          executedAt: row.created_at
        })),
        orchestrationHistory: orchestrationLogs.rows.map((row: OrchestrationLogRow) => ({
          triggerType: row.trigger_type,
          totalJobs: row.total_jobs,
          successfulJobs: row.successful_jobs,
          failedJobs: row.failed_jobs,
          totalDuration: row.total_duration_seconds,
          executedAt: row.created_at
        }))
      },
      aiTrainingContext: {
        companyInfo: {
          name: 'Fantastic AI Studio',
          website: 'https://fais.world',
          services: [
            'Enterprise AI Development',
            'Blockchain Solutions',
            'Smart Contract Development',
            'DeFi Platform Development',
            'Custom AI Solutions',
            'Machine Learning Models',
            'AI Consulting Services'
          ],
          targetMarkets: ['USA', 'UK', 'Germany', 'Spain'],
          clientSatisfactionRate: '95%',
          targetClients: 'Fortune 500 companies'
        },        keyInsights: {
          popularContent: knowledgeBaseUpdates.rows
            .filter((row: KnowledgeBaseRow) => row.chunks_processed > 10)
            .map((row: KnowledgeBaseRow) => ({
              url: row.url,
              summary: row.content_summary,
              relevanceScore: row.chunks_processed
            })),
          seoPerformance: seoAnalysis.rows
            .filter((row: SEOAnalysisRow) => row.score > 70)
            .map((row: SEOAnalysisRow) => ({
              url: row.url,
              score: row.score,
              keyOptimizations: Array.isArray(row.recommended_keywords) ? row.recommended_keywords : JSON.parse(row.recommended_keywords || '[]')
            })),
          technicalHealth: websiteAnalysis.rows
            .map((row: WebsiteAnalysisRow) => ({
              url: row.url,
              score: row.score,
              criticalIssues: Array.isArray(row.issues) ? row.issues.length : JSON.parse(row.issues || '[]').length
            }))
        }
      }
    }

    if (format === 'xml') {
      // Convert to XML format for 11Labs or other XML-consuming services
      const xml = convertToXML(knowledgeBaseData)
      
      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Content-Disposition': `attachment; filename="fais-knowledge-base-${new Date().toISOString().split('T')[0]}.xml"`
        }
      })
    } else {
      // Return JSON format
      return NextResponse.json(knowledgeBaseData, {
        headers: {
          'Content-Disposition': `attachment; filename="fais-knowledge-base-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

  } catch (error) {
    console.error('Error generating knowledge base export:', error)
    return NextResponse.json(
      { error: 'Failed to generate knowledge base export' },
      { status: 500 }
    )
  }
}

function convertToXML(data: Record<string, unknown>): string {
  function objectToXML(obj: unknown, rootName: string = 'root', indent: string = ''): string {
    if (obj === null || obj === undefined) {
      return `${indent}<${rootName}></${rootName}>`
    }
    
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return `${indent}<${rootName}>${escapeXML(String(obj))}</${rootName}>`
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return `${indent}<${rootName}></${rootName}>`
      }
        return obj.map((item) => 
        objectToXML(item, `${rootName}_item`, indent)
      ).join('\n')
    }
    
    if (typeof obj === 'object') {
      const xmlContent = Object.entries(obj)
        .map(([key, value]) => 
          objectToXML(value, sanitizeXMLName(key), indent + '  ')
        )
        .join('\n')
      
      return `${indent}<${rootName}>\n${xmlContent}\n${indent}</${rootName}>`
    }
    
    return `${indent}<${rootName}></${rootName}>`
  }
  
  function escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }
  
  function sanitizeXMLName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .replace(/^[0-9]/, '_$&')
  }
  
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
  const xmlContent = objectToXML(data, 'FantasticAIStudioKnowledgeBase')
  
  return xmlHeader + xmlContent
}
