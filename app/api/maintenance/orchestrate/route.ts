import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orchestrationName = 'manual-orchestration' } = body

    console.log(`🎼 Starting orchestration: ${orchestrationName}`)
      // Create orchestration record
    const orchestrationId = await maintenanceDB.createOrchestration()
    
    return NextResponse.json({
      success: true,
      orchestrationId,
      message: `Orchestration ${orchestrationName} started`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error starting orchestration:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  try {    // Get recent orchestrations
    const orchestrations = await maintenanceDB.getOrchestrationLogs(10)
    
    return NextResponse.json({
      success: true,
      orchestrations,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting orchestrations:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}