import { NextRequest, NextResponse } from 'next/server'
import { maintenanceDB } from '@/lib/maintenance-db'
import * as cheerio from 'cheerio'

// Inline crawl function to avoid tool execution issues
async function crawlWebsite(url: string, query?: string): Promise<string> {
  console.log(`Crawling ${url} for query: "${query || 'general content'}"`);
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'CronCrawler/1.0' } });
    if (!response.ok) {
      return `Error fetching ${url}: ${response.status} ${response.statusText}`;
    }
    const htmlContent = await response.text();
    const $ = cheerio.load(htmlContent);

    $('script, style, nav, footer, aside, form').remove();

    let extractedText = $('article, main, body').text();

    if (!extractedText.trim()) {
        $('p, h1, h2, h3, h4, h5, h6, li, a, span, div').each((i, elem) => {
            const elementText = $(elem).text().trim();
            if (elementText.length > 20) {
                 extractedText += elementText + '\n';
            }
        });
    }
    
    extractedText = extractedText.replace(/\s\s+/g, ' ').trim();
    extractedText = extractedText.replace(/\n\s*\n/g, '\n').trim();

    if (query) {
      const queryLower = query.toLowerCase();
      const sentences = extractedText.split(/[.\n]/);
      let relevantText = sentences.filter(sentence => sentence.toLowerCase().includes(queryLower)).join('. ');
      if (!relevantText) {
        relevantText = "Query not found in the main content. ";
      }
      return `Content from ${url} (related to "${query}"): ${relevantText.substring(0, 2000)}...`;
    }

    return `Content from ${url}: ${extractedText.substring(0, 4000)}...`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return `Failed to crawl ${url}: ${error.message}`;
    }
    return `Failed to crawl ${url}: An unknown error occurred`;
  }
}

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
  const jobName = 'website-crawling-analysis'
  console.log(`🕷️ Starting ${jobName} cron job...`)
  
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
    console.log('🚀 Starting website crawling and analysis...')

    // Define the pages to crawl
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://fais.me'
    
    const pagesToCrawl = [
      `${baseUrl}`,
      `${baseUrl}/about`,
      `${baseUrl}/services`,
      `${baseUrl}/blog`,
      `${baseUrl}/contact`,
      `${baseUrl}/ai-services`,
      `${baseUrl}/blockchain-services`,
      `${baseUrl}/projects`
    ]

    const crawlResults = []

    // Crawl each page
    for (const url of pagesToCrawl) {
      try {        console.log(`🔍 Crawling: ${url}`)
        const result = await crawlWebsite(url, 'general content')

        crawlResults.push({
          url,
          success: true,
          content: result,
          metadata: { crawled_at: new Date().toISOString() },
          timestamp: new Date().toISOString()
        })

        // Wait between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 2000))

      } catch (error) {
        console.error(`❌ Error crawling ${url}:`, error)
        crawlResults.push({
          url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        })
      }
    }

    // Save crawl results to database
    const websiteAnalysis = {
      timestamp: new Date().toISOString(),
      websiteUrl: baseUrl,
      pages: crawlResults,
      summary: {
        totalPages: pagesToCrawl.length,
        successfulCrawls: crawlResults.filter(r => r.success).length,
        failedCrawls: crawlResults.filter(r => !r.success).length
      }
    }    // Store the analysis results
    const analysisScore = Math.round((websiteAnalysis.summary.successfulCrawls / websiteAnalysis.summary.totalPages) * 100);
    const issues = crawlResults.filter(r => !r.success).map(r => ({ url: r.url, error: r.error }));
    const recommendations = issues.length > 0 ? [{ action: 'Review failed crawls and fix accessibility issues' }] : [];
    
    await maintenanceDB.saveWebsiteAnalysis(
      jobExecutionId,
      baseUrl,
      'crawling',
      analysisScore,
      issues,
      recommendations,
      JSON.stringify(websiteAnalysis),
      { orchestrationId }
    )    // Update job execution with success
    await maintenanceDB.updateJobExecution(jobExecutionId, {
      status: 'completed',
      end_time: new Date(),
      result_data: websiteAnalysis
    })

    console.log(`✅ Website crawling completed: ${websiteAnalysis.summary.successfulCrawls}/${websiteAnalysis.summary.totalPages} pages successful`)

    return NextResponse.json({
      success: true,
      jobExecutionId,
      message: `Website crawling completed successfully`,
      analysis: websiteAnalysis,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error(`❌ Error in ${jobName}:`, error)
      // Update job execution with failure
    await maintenanceDB.updateJobExecution(jobExecutionId, {
      status: 'failed',
      end_time: new Date(),
      error_message: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json({
      success: false,
      jobExecutionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
