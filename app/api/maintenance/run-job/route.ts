import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobName, orchestrationId } = body

    if (!jobName) {
      return NextResponse.json({
        success: false,
        error: 'Job name is required',
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }    console.log(`🔧 Running maintenance job: ${jobName}`)
    
    // Create job execution record
    const jobExecutionId = await maintenanceDB.createJobExecution(orchestrationId, jobName)
    
    // Route to appropriate job handler based on jobName
    // Get the current server port from the request URL or environment
    const protocol = request.url.startsWith('https') ? 'https' : 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : `${protocol}://${host}`
      
    let jobResponse
    let jobEndpoint
    
    switch (jobName) {
      case 'automated-article-generation':
        jobEndpoint = `${baseUrl}/api/cron/automated-article-generation`
        console.log(`🔗 Calling endpoint: ${jobEndpoint}`)
        jobResponse = await fetch(jobEndpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
          }
        })
        break
        
      case 'website-crawling-analysis':
        jobEndpoint = `${baseUrl}/api/cron/website-crawling-analysis`
        jobResponse = await fetch(jobEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
          },
          body: JSON.stringify({ orchestrationId })
        })
        break
        
      case 'update-knowledge-base':
        jobEndpoint = `${baseUrl}/api/cron/update-knowledge-base`
        jobResponse = await fetch(jobEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
          },
          body: JSON.stringify({ orchestrationId })
        })
        break
        
      case 'seo-optimization':
        jobEndpoint = `${baseUrl}/api/cron/seo-optimization`
        jobResponse = await fetch(jobEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-internal-api-key': process.env.INTERNAL_API_KEY || ''
          },
          body: JSON.stringify({ orchestrationId })
        })
        break
        
      default:
        await maintenanceDB.failJobExecution(jobExecutionId, `Unknown job name: ${jobName}`)
        return NextResponse.json({
          success: false,
          error: `Unknown job name: ${jobName}`,
          jobExecutionId,
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }
    
    if (!jobResponse) {
      await maintenanceDB.failJobExecution(jobExecutionId, 'Failed to execute job')
      return NextResponse.json({
        success: false,
        error: 'Failed to execute job',
        jobExecutionId,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
    const jobResult = await jobResponse.json()
    const success = jobResponse.ok && jobResult.success !== false
    
    if (success) {
      await maintenanceDB.completeJobExecution(jobExecutionId, jobResult)
    } else {
      await maintenanceDB.failJobExecution(jobExecutionId, jobResult.error || 'Job execution failed')
    }
    
    return NextResponse.json({
      success,
      jobName,
      jobExecutionId,
      result: jobResult,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error running maintenance job:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET() {
  try {    // Get recent job executions
    const jobExecutions = await maintenanceDB.getJobExecutions(undefined, 20)
    
    return NextResponse.json({
      success: true,
      jobExecutions,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error getting job executions:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}