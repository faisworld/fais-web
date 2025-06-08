import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@neondatabase/serverless'

export async function GET(request: NextRequest) {
  try {
    const client = new Client(process.env.DATABASE_URL!)
    await client.connect()
    
    // Check what tables exist
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    await client.end()
    
    return NextResponse.json({
      success: true,
      tables: result.rows.map(row => row.table_name),
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
