import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'

function isValidCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const internalApiKey = process.env.INTERNAL_API_KEY
  
  if (!internalApiKey) {
    console.error('INTERNAL_API_KEY environment variable is not set')
    return false
  }
  
  return authHeader === `Bearer ${internalApiKey}`
}

export async function POST(request: NextRequest) {
  const orchestrationName = 'automated-maintenance-orchestration'
  console.log(`🎼 Starting ${orchestrationName}...`)
  
  // Validate cron request
  if (!isValidCronRequest(request)) {
    console.error('❌ Unauthorized orchestration request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Create orchestration record
  const orchestrationId = await maintenanceDB.createOrchestration()
  console.log(`📝 Created orchestration ${orchestrationId}`)

  const results = []
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'

  try {    // 1. Generate articles first
    console.log('🚀 Step 1: Generating articles...')
    const articleResponse = await fetch(`${baseUrl}/api/cron/automated-article-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
      }
    })
    
    const articleResult = await articleResponse.json()
    results.push({
      job: 'automated-article-generation',
      success: articleResponse.ok,
      result: articleResult,
      timestamp: new Date().toISOString()
    })    // Wait a bit between jobs
    await new Promise(resolve => setTimeout(resolve, 5000))    // 2. Crawl website for fresh content
    console.log('🕷️ Step 2: Crawling website...')
    const crawlResponse = await fetch(`${baseUrl}/api/cron/website-crawling-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
      },
      body: JSON.stringify({ orchestrationId })
    })
    
    const crawlResult = await crawlResponse.json()
    results.push({
      job: 'website-crawling-analysis',
      success: crawlResponse.ok,
      result: crawlResult,
      timestamp: new Date().toISOString()
    })

    // Wait a bit between jobs
    await new Promise(resolve => setTimeout(resolve, 5000))    // 3. Update knowledge base with fresh data
    console.log('📚 Step 3: Updating knowledge base...')
    const kbResponse = await fetch(`${baseUrl}/api/cron/update-knowledge-base`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
      },
      body: JSON.stringify({ orchestrationId })
    })
    
    const kbResult = await kbResponse.json()
    results.push({
      job: 'update-knowledge-base',
      success: kbResponse.ok,
      result: kbResult,
      timestamp: new Date().toISOString()
    })

    // Wait a bit between jobs
    await new Promise(resolve => setTimeout(resolve, 5000))    // 4. Run SEO optimization
    console.log('🔍 Step 4: Running SEO optimization...')
    const seoResponse = await fetch(`${baseUrl}/api/cron/seo-optimization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
      },
      body: JSON.stringify({ orchestrationId })
    })
    
    const seoResult = await seoResponse.json()
    results.push({
      job: 'seo-optimization',
      success: seoResponse.ok,
      result: seoResult,
      timestamp: new Date().toISOString()
    })    // Update orchestration with completion status
    const successCount = results.filter(r => r.success).length
    const totalJobs = results.length
    const overallSuccess = successCount === totalJobs;
    
    await maintenanceDB.updateOrchestration(orchestrationId, {
      status: overallSuccess ? 'completed' : 'failed',
      end_time: new Date(),
      total_jobs: totalJobs,
      completed_jobs: successCount,
      failed_jobs: totalJobs - successCount,
      error_message: overallSuccess ? undefined : `${totalJobs - successCount} jobs failed`
    })

    console.log(`✅ Orchestration completed: ${successCount}/${totalJobs} jobs successful`)

    return NextResponse.json({
      success: overallSuccess,
      orchestrationId,
      message: `Orchestration completed: ${successCount}/${totalJobs} jobs successful`,
      results,
      summary: {
        totalJobs,
        successfulJobs: successCount,
        failedJobs: totalJobs - successCount
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error in orchestration:', error)
      await maintenanceDB.updateOrchestration(orchestrationId, {
      status: 'failed',
      end_time: new Date(),
      error_message: `Orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    })

    return NextResponse.json({
      success: false,
      orchestrationId,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
