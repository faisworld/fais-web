import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Get knowledge base chunks with pagination
    const chunksResult = await db.query(`
      SELECT 
        id,
        url,
        title,
        content,
        chunk_index,
        token_count,
        metadata,
        created_at,
        updated_at
      FROM knowledge_base_chunks 
      ORDER BY updated_at DESC 
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    // Get unique URLs for filtering
    const urlsResult = await db.query(`
      SELECT DISTINCT url 
      FROM knowledge_base_chunks 
      ORDER BY url
    `)

    // Check if there are more results
    const countResult = await db.query('SELECT COUNT(*) as total FROM knowledge_base_chunks')
    const total = parseInt(countResult.rows[0]?.total || '0')
    const hasMore = offset + limit < total

    return NextResponse.json({
      success: true,
      chunks: chunksResult.rows,
      urls: urlsResult.rows.map(row => row.url),
      hasMore,
      total,
      page,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
