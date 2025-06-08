import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const url = searchParams.get('url') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    let sqlQuery = `
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
      WHERE 1=1
    `
    const params: (string | number)[] = []
    let paramIndex = 1

    // Add search filter
    if (query) {
      sqlQuery += ` AND (content ILIKE $${paramIndex} OR title ILIKE $${paramIndex})`
      params.push(`%${query}%`)
      paramIndex++
    }

    // Add URL filter
    if (url) {
      sqlQuery += ` AND url = $${paramIndex}`
      params.push(url)
      paramIndex++
    }

    sqlQuery += ` ORDER BY updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const chunksResult = await db.query(sqlQuery, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM knowledge_base_chunks WHERE 1=1'
    const countParams: string[] = []
    let countParamIndex = 1

    if (query) {
      countQuery += ` AND (content ILIKE $${countParamIndex} OR title ILIKE $${countParamIndex})`
      countParams.push(`%${query}%`)
      countParamIndex++
    }

    if (url) {
      countQuery += ` AND url = $${countParamIndex}`
      countParams.push(url)
      countParamIndex++
    }

    const countResult = await db.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0]?.total || '0')
    const hasMore = offset + limit < total

    return NextResponse.json({
      success: true,
      chunks: chunksResult.rows,
      hasMore,
      total,
      page,
      query,
      url,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
