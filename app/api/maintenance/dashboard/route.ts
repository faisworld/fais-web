import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const include = searchParams.get('include')
    
    // Get dashboard statistics
    const stats = await maintenanceDB.getDashboardStats()
    
    // Get latest analysis results
    const analysisResults = await maintenanceDB.getLatestAnalysisResults(5)
    
    let seoAnalyses = []
    
    // If requesting SEO data specifically
    if (include === 'seo') {
      const seoResult = await db.query(
        `SELECT id, url, score, created_at 
         FROM seo_analysis_results 
         ORDER BY created_at DESC 
         LIMIT 20`
      )
      seoAnalyses = seoResult.rows
    }
    
    return NextResponse.json({
      success: true,
      stats,
      analysisResults,
      seoAnalyses,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting dashboard data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}