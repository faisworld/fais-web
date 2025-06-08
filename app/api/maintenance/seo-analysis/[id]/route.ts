import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid analysis ID' },
        { status: 400 }
      )
    }

    const result = await db.query(
      `SELECT * FROM seo_analysis_results WHERE id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'SEO analysis not found' },
        { status: 404 }
      )
    }

    const analysis = result.rows[0]
    
    // Parse JSON fields
    const parsedAnalysis = {
      ...analysis,
      current_keywords: Array.isArray(analysis.current_keywords) 
        ? analysis.current_keywords 
        : JSON.parse(analysis.current_keywords || '[]'),
      recommended_keywords: Array.isArray(analysis.recommended_keywords)
        ? analysis.recommended_keywords
        : JSON.parse(analysis.recommended_keywords || '[]'),
      competitor_analysis: typeof analysis.competitor_analysis === 'object'
        ? analysis.competitor_analysis
        : JSON.parse(analysis.competitor_analysis || '{}'),
      keyword_gaps: Array.isArray(analysis.keyword_gaps)
        ? analysis.keyword_gaps
        : JSON.parse(analysis.keyword_gaps || '[]'),
      technical_issues: Array.isArray(analysis.technical_issues)
        ? analysis.technical_issues
        : JSON.parse(analysis.technical_issues || '[]'),
      schema_recommendations: typeof analysis.schema_recommendations === 'object'
        ? analysis.schema_recommendations
        : JSON.parse(analysis.schema_recommendations || '{}')
    }

    return NextResponse.json(parsedAnalysis)

  } catch (error) {
    console.error('Error fetching SEO analysis:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO analysis' },
      { status: 500 }
    )
  }
}
