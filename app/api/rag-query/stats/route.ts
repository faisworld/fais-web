import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    // Get knowledge base statistics
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT url) as total_urls,
        AVG(token_count)::integer as average_token_count,
        MAX(updated_at) as last_updated
      FROM knowledge_base_chunks
    `)

    const stats = statsResult.rows[0]

    return NextResponse.json({
      success: true,
      stats: {
        totalChunks: parseInt(stats?.total_chunks || '0'),
        totalUrls: parseInt(stats?.total_urls || '0'),
        averageTokenCount: parseInt(stats?.average_token_count || '0'),
        lastUpdated: stats?.last_updated || null
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching knowledge base stats:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
