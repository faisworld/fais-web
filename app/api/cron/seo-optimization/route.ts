import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs/promises'
import path from 'path'
import { maintenanceDB, WebsiteAnalysis } from '@/lib/maintenance-db'

// Database connection is already initialized as maintenanceDB

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

interface SEOOptimization {
  timestamp: string
  websiteUrl: string
  optimizations: {
    metaTags: Array<{
      page: string
      currentTitle?: string
      optimizedTitle: string
      currentDescription?: string
      optimizedDescription: string
      keywords: string[]
      priority: 'high' | 'medium' | 'low'
    }>
    contentOptimizations: Array<{
      page: string
      section: string
      currentContent: string
      optimizedContent: string
      seoImpact: string
      implementation: string
    }>
    technicalSEO: Array<{
      issue: string
      description: string
      solution: string
      implementation: string
      impact: 'high' | 'medium' | 'low'
    }>
    schemaMarkup: Array<{
      page: string
      schemaType: string
      markup: object
      implementation: string
    }>
  }
  competitorAnalysis: {
    competitors: string[]
    keywordGaps: string[]
    contentGaps: string[]
    opportunities: string[]
  }
  actionPlan: Array<{
    task: string
    priority: number
    estimatedImpact: string
    timeToImplement: string
    dependencies: string[]
  }>
}

// Cron job authentication
function isValidCronRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (!cronSecret) {
    console.error('CRON_SECRET environment variable is not set')
    return false
  }
  
  return authHeader === `Bearer ${cronSecret}`
}

async function getLatestAnalysis(): Promise<WebsiteAnalysis | null> {
  try {
    // Using the existing maintenanceDB instead of Supabase
    // For now, return null and let the SEO optimization work without previous analysis
    // This can be enhanced later to query the actual website_analysis table through maintenanceDB
    console.log('Using existing database connection for analysis data')
    return null
  } catch (error) {
    console.error('Error getting latest analysis:', error)
    return null
  }
}

async function generateSEOOptimizations(analysisData: WebsiteAnalysis | null): Promise<SEOOptimization> {
  const seoPrompt = `
You are an expert SEO consultant with 10+ years of experience in technical SEO, content optimization, and competitive analysis. 

Based on the latest website analysis data, create comprehensive SEO optimizations:

ANALYSIS DATA:
Website: ${analysisData?.url || 'https://fais.world'}
Analysis Score: ${analysisData?.score || 'N/A'}
Analysis Type: ${analysisData?.analysis_type || 'general'}
Issues Found: ${JSON.stringify(analysisData?.issues || [])}
Current Recommendations: ${JSON.stringify(analysisData?.recommendations || [])}
Raw Analysis: ${analysisData?.raw_analysis || 'No analysis available'}
Metadata: ${JSON.stringify(analysisData?.metadata || {})}

BUSINESS CONTEXT:
- Company: Fantastic AI Studio (fAis)
- Industry: Enterprise AI & Blockchain Development
- Target Markets: USA, UK, Germany, Spain
- Target Clients: Fortune 500 companies
- Services: Custom AI solutions, smart contracts, DeFi platforms, enterprise blockchain
- Current Satisfaction Rate: 95% client satisfaction

COMPETITOR KEYWORDS TO TARGET:
- "enterprise AI development"
- "blockchain development company"
- "Fortune 500 AI solutions"
- "custom AI solutions"
- "enterprise blockchain consulting"
- "AI digital transformation"
- "smart contracts development"
- "DeFi platform development"

Please provide detailed SEO optimizations in the following JSON format:

{
  "optimizations": {
    "metaTags": [
      {
        "page": "/",
        "currentTitle": "Current title if known",
        "optimizedTitle": "SEO-optimized title under 60 characters",
        "currentDescription": "Current description if known",
        "optimizedDescription": "SEO-optimized description under 160 characters",
        "keywords": ["keyword1", "keyword2", "keyword3"],
        "priority": "high|medium|low"
      }
    ],
    "contentOptimizations": [
      {
        "page": "/services",
        "section": "Hero section",
        "currentContent": "Current content excerpt",
        "optimizedContent": "SEO-optimized content with target keywords",
        "seoImpact": "Expected SEO improvement",
        "implementation": "Specific implementation instructions"
      }
    ],
    "technicalSEO": [
      {
        "issue": "Page load speed",
        "description": "Detailed description of the issue",
        "solution": "Technical solution",
        "implementation": "Step-by-step implementation guide",
        "impact": "high|medium|low"
      }
    ],
    "schemaMarkup": [
      {
        "page": "/",
        "schemaType": "Organization",
        "markup": {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Fantastic AI Studio"
        },
        "implementation": "How to implement this schema"
      }
    ]
  },
  "competitorAnalysis": {
    "competitors": ["competitor1.com", "competitor2.com"],
    "keywordGaps": ["keyword gap 1", "keyword gap 2"],
    "contentGaps": ["content gap 1", "content gap 2"],
    "opportunities": ["opportunity 1", "opportunity 2"]
  },
  "actionPlan": [
    {
      "task": "Optimize homepage title tag",
      "priority": 1,
      "estimatedImpact": "15% increase in organic CTR",
      "timeToImplement": "1 hour",
      "dependencies": ["content review"]
    }
  ]
}

Focus on:
1. High-impact, low-effort optimizations first
2. Enterprise-focused keyword targeting
3. Technical SEO improvements
4. Local SEO for target markets (USA, UK, Germany)
5. Conversion optimization
6. Schema markup for better SERP features
7. Content gaps that competitors are ranking for

Provide specific, actionable recommendations with implementation details.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert SEO consultant specializing in enterprise B2B websites, technical SEO, and competitive analysis. Provide detailed, actionable SEO strategies with specific implementation steps. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: seoPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })

    let seoContent = response.choices[0]?.message?.content?.trim() || '{}'
    
    // Clean up the response to ensure it's valid JSON
    if (seoContent.startsWith('```json')) {
      seoContent = seoContent.replace(/^```json\s*/, '')
    }
    if (seoContent.endsWith('```')) {
      seoContent = seoContent.replace(/\s*```$/, '')
    }
    
    const seoOptimizations = JSON.parse(seoContent)
      // Add metadata
    return {
      timestamp: new Date().toISOString(),
      websiteUrl: analysisData?.url || 'https://fais.world',
      ...seoOptimizations
    }
    
  } catch (error) {
    console.error('Error generating SEO optimizations:', error)
    throw new Error('Failed to generate SEO optimizations')
  }
}

async function saveSEOOptimizations(seoOptimizations: SEOOptimization): Promise<void> {  try {
    // Save to local file as backup (database integration can be added later if needed)
    const seoDir = path.join(process.cwd(), 'seo-reports')
    await fs.mkdir(seoDir, { recursive: true })
    
    const filename = `seo-optimizations-${new Date().toISOString().split('T')[0]}.json`
    const filepath = path.join(seoDir, filename)
    
    await fs.writeFile(filepath, JSON.stringify(seoOptimizations, null, 2))
    
    console.log('SEO optimizations saved successfully to local file')
    
  } catch (error) {
    console.error('Error saving SEO optimizations:', error)
    throw error
  }
}

async function generateImplementationPlan(seoOptimizations: SEOOptimization): Promise<string> {
  const planPrompt = `
Based on the following SEO optimizations, create a detailed implementation plan for the development team:

SEO OPTIMIZATIONS:
${JSON.stringify(seoOptimizations, null, 2)}

Create a markdown document with:
1. Priority-based task list
2. Code changes required
3. Content updates needed
4. Technical implementations
5. Timeline estimates
6. Success metrics

Focus on actionable steps that can be implemented immediately.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a technical project manager specializing in SEO implementations. Create detailed, actionable implementation plans for development teams.'
        },
        {
          role: 'user',
          content: planPrompt
        }
      ],
      temperature: 0.2,
      max_tokens: 3000
    })

    const implementationPlan = response.choices[0]?.message?.content || ''
    
    // Save implementation plan
    const plansDir = path.join(process.cwd(), 'implementation-plans')
    await fs.mkdir(plansDir, { recursive: true })
    
    const planFilename = `seo-implementation-plan-${new Date().toISOString().split('T')[0]}.md`
    const planFilepath = path.join(plansDir, planFilename)
    
    await fs.writeFile(planFilepath, implementationPlan)
    
    return implementationPlan
    
  } catch (error) {
    console.error('Error generating implementation plan:', error)
    return 'Failed to generate implementation plan'
  }
}

export async function POST(request: NextRequest) {
  const jobName = 'seo-optimization'
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
    // Step 1: Get latest website analysis
    console.log('📊 Fetching latest website analysis...')
    const latestAnalysis = await getLatestAnalysis()
    
    if (!latestAnalysis) {
      console.log('⚠️ No recent analysis found, running basic SEO optimization')
    }
    
    // Step 2: Generate SEO optimizations
    console.log('🎯 Generating SEO optimizations...')
    const seoOptimizations = await generateSEOOptimizations(latestAnalysis)
    console.log('✅ SEO optimizations generated')
    
    // Step 3: Save SEO optimizations
    console.log('💾 Saving SEO optimizations...')
    await saveSEOOptimizations(seoOptimizations)
    console.log('✅ SEO optimizations saved')
    
    // Step 4: Generate implementation plan
    console.log('📋 Generating implementation plan...')
    const implementationPlan = await generateImplementationPlan(seoOptimizations)
    console.log('✅ Implementation plan generated')
    
    // Summary of results
    const summary = {
      timestamp: seoOptimizations.timestamp,
      websiteUrl: seoOptimizations.websiteUrl,
      metaTagOptimizations: seoOptimizations.optimizations.metaTags.length,
      contentOptimizations: seoOptimizations.optimizations.contentOptimizations.length,
      technicalSEOIssues: seoOptimizations.optimizations.technicalSEO.length,
      schemaMarkupRecommendations: seoOptimizations.optimizations.schemaMarkup.length,
      actionPlanTasks: seoOptimizations.actionPlan.length,
      competitorsAnalyzed: seoOptimizations.competitorAnalysis.competitors.length
    }
      console.log(`🎉 ${jobName} completed successfully:`, summary)
      // Mark job as completed
    await maintenanceDB.completeJobExecution(jobExecutionId, summary)
    
    return NextResponse.json({
      success: true,
      message: 'SEO optimization analysis completed successfully',
      summary,
      seoOptimizations,
      implementationPlan: implementationPlan.substring(0, 500) + '...', // Truncate for response
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
