import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'
import fs from 'fs/promises'
import path from 'path'

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
  const jobName = 'update-knowledge-base'
  console.log(`🎯 Starting ${jobName} cron job...`)
  
  // Validate cron request
  if (!isValidCronRequest(request)) {
    console.error('❌ Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get orchestration ID from request body if this is part of an orchestrated run
  const body = await request.json().catch(() => ({}))
  const orchestrationId = body.orchestrationId || null
  
  // Create job execution record
  const jobExecutionId = await maintenanceDB.createJobExecution(orchestrationId, jobName)
    try {
    console.log('📚 Starting knowledge base update process...')
    
    // Step 1: Collect recent website content
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://fais.me'
    
    console.log('📖 Collecting recent blog posts and content...')
    
    // Get recent blog content
    const blogPostsPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts')
    const blogData = await fs.readFile(blogPostsPath, 'utf-8')
    
    // Extract blog post information
    const blogPosts = []
    try {
      // Simple extraction of blog post titles and slugs
      const titleMatches = blogData.match(/title:\s*['"`]([^'"`]+)['"`]/g) || []
      const slugMatches = blogData.match(/slug:\s*['"`]([^'"`]+)['"`]/g) || []
      
      for (let i = 0; i < Math.min(titleMatches.length, slugMatches.length); i++) {
        const title = titleMatches[i].replace(/title:\s*['"`]([^'"`]+)['"`]/, '$1')
        const slug = slugMatches[i].replace(/slug:\s*['"`]([^'"`]+)['"`]/, '$1')
        blogPosts.push({ title, slug, url: `${baseUrl}/blog/${slug}` })
      }
    } catch (parseError) {
      console.warn('⚠️ Could not parse blog data:', parseError)
    }
    
    // Step 2: Collect service pages content
    const servicePages = [
      { title: 'AI Services', url: `${baseUrl}/ai-services` },
      { title: 'Blockchain Services', url: `${baseUrl}/blockchain-services` },
      { title: 'Projects', url: `${baseUrl}/projects` },
      { title: 'About', url: `${baseUrl}/about` }
    ]
    
    // Step 3: Process and update knowledge base entries
    const allContent = [...blogPosts, ...servicePages]
    const processedEntries = []
    
    for (const content of allContent) {
      try {
        // Simulate knowledge base processing
        const entry = {
          title: content.title,
          url: content.url,
          processed: true,
          timestamp: new Date().toISOString(),
          contentType: content.url.includes('/blog/') ? 'blog' : 'service',
          status: 'updated'
        }
        processedEntries.push(entry)
        
        // Add small delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (entryError) {
        console.warn(`⚠️ Could not process ${content.title}:`, entryError)
        processedEntries.push({
          title: content.title,
          url: content.url,
          processed: false,
          error: entryError instanceof Error ? entryError.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      }
    }
      // Calculate summary statistics
    const summary = {
      totalEntriesProcessed: processedEntries.length,
      newEntriesAdded: processedEntries.filter(e => e.processed && 'contentType' in e && e.contentType === 'blog').length,
      entriesUpdated: processedEntries.filter(e => e.processed && 'status' in e && e.status === 'updated').length,
      embeddingsProcessed: processedEntries.filter(e => e.processed).length,
      averageReadabilityScore: 85.2, // Mock score
      totalVectorCount: processedEntries.length * 384, // Mock embedding dimensions
      avgSimilarityScore: 0.76,
      avgContentLength: 1250,
      errors: processedEntries.filter(e => !e.processed).length
    }
    
    console.log(`🎉 ${jobName} completed successfully:`, summary)
    
    // Mark job as completed
    await maintenanceDB.completeJobExecution(jobExecutionId, summary)
    
    return NextResponse.json({
      success: true,
      message: 'Knowledge base update completed (mock mode)',
      summary,
      jobExecutionId
    })
    
  } catch (error) {
    console.error(`❌ Error in ${jobName}:`, error)
    
    // Mark job as failed
    await maintenanceDB.failJobExecution(jobExecutionId, error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error',
        jobExecutionId
      },
      { status: 500 }
    )
  }
}
