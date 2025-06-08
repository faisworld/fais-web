// Enhanced Knowledge Base API for ElevenLabs Integration
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import ContentScraper, { type CompanyKnowledgeBase } from '@/lib/content-scraper'

interface DatabaseContent {
  knowledgeBaseUpdates: Array<{
    url: string
    content_summary: string
    chunks_processed: number
    metadata: any
    created_at: string
  }>
  seoAnalysis: Array<{
    url: string
    recommended_title: string
    recommended_description: string
    recommended_keywords: any
    score: number
    created_at: string
  }>
  websiteAnalysis: Array<{
    url: string
    analysis_type: string
    score: number
    recommendations: any
    created_at: string
  }>
}

export async function GET() {
  try {
    // Initialize content scraper
    const scraper = new ContentScraper()
    
    // Get comprehensive knowledge base content
    const [companyKnowledgeBase, dbContent] = await Promise.all([
      scraper.getCompanyKnowledgeBase(),
      getExistingDatabaseContent()
    ])

    // Generate plain text content that ElevenLabs can easily read and understand
    const content = generateComprehensiveKnowledgeBaseContent(
      companyKnowledgeBase,
      dbContent
    )

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=1800', // Cache for 30 minutes
      },
    })

  } catch (error) {
    console.error('Error generating ElevenLabs knowledge base:', error)
    return new NextResponse('Failed to load knowledge base content', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }
}

async function getExistingDatabaseContent(): Promise<DatabaseContent> {
  try {
    const [knowledgeBaseUpdates, seoAnalysis, websiteAnalysis] = await Promise.all([
      db.query(`
        SELECT 
          url,
          content_summary,
          chunks_processed,
          metadata,
          created_at
        FROM knowledge_base_updates 
        WHERE content_summary IS NOT NULL 
        ORDER BY chunks_processed DESC, created_at DESC 
        LIMIT 50
      `),
      db.query(`
        SELECT 
          url,
          recommended_title,
          recommended_description,
          recommended_keywords,
          score,
          created_at
        FROM seo_analysis_results 
        WHERE score > 60
        ORDER BY score DESC, created_at DESC 
        LIMIT 30
      `),
      db.query(`
        SELECT 
          url,
          analysis_type,
          score,
          recommendations,
          created_at
        FROM website_analysis_results 
        WHERE score > 70
        ORDER BY score DESC, created_at DESC 
        LIMIT 20
      `)
    ])

    return {
      knowledgeBaseUpdates: knowledgeBaseUpdates.rows || [],
      seoAnalysis: seoAnalysis.rows || [],
      websiteAnalysis: websiteAnalysis.rows || []
    }
  } catch (error) {
    console.warn('Database content not available:', error)
    return {
      knowledgeBaseUpdates: [],
      seoAnalysis: [],
      websiteAnalysis: []
    }
  }
}

function generateComprehensiveKnowledgeBaseContent(
  knowledgeBase: CompanyKnowledgeBase,
  dbContent: DatabaseContent
): string {
  const sections: string[] = []

  // Company Overview and Core Information
  sections.push(`FANTASTIC AI STUDIO - COMPREHENSIVE KNOWLEDGE BASE

=== COMPANY OVERVIEW ===
Company Name: ${knowledgeBase.companyInfo.name}
Website: ${knowledgeBase.companyInfo.website}
Established: ${knowledgeBase.companyInfo.establishedYear}
Headquarters: ${knowledgeBase.companyInfo.headquarters.join(', ')}

Mission: ${knowledgeBase.companyInfo.mission}
Vision: ${knowledgeBase.companyInfo.vision}

Target Markets: ${knowledgeBase.companyInfo.targetMarkets.join(', ')}
Client Satisfaction Rate: ${knowledgeBase.companyInfo.clientSatisfactionRate}

Key Achievements:
${knowledgeBase.companyInfo.keyAchievements.map(achievement => `• ${achievement}`).join('\n')}

Company Values:
${knowledgeBase.companyInfo.companyValues.map(value => `• ${value}`).join('\n')}

=== SERVICES AND CAPABILITIES ===
`)

  // Detailed Services Information
  knowledgeBase.services.forEach((service, index) => {
    sections.push(`Service ${index + 1}: ${service.name}
Category: ${service.category}
Description: ${service.description}

Key Features:
${service.features.map(feature => `• ${feature}`).join('\n')}

Benefits:
${service.benefits.map(benefit => `• ${benefit}`).join('\n')}

Target Clients: ${service.targetClients.join(', ')}
Pricing: ${service.pricing}
Delivery Time: ${service.deliveryTime}

`)
  })

  // Website Content Analysis
  sections.push(`=== WEBSITE CONTENT ANALYSIS ===
`)
  
  knowledgeBase.websiteContent.forEach((page, index) => {
    sections.push(`Page ${index + 1}: ${page.title}
URL: ${page.url}
Description: ${page.description}

Content Summary: ${page.content.substring(0, 500)}${page.content.length > 500 ? '...' : ''}

Key Headings:
${page.headings.map(heading => `• ${heading}`).join('\n')}

Last Updated: ${page.lastModified}

`)
  })

  // Blog Posts and Thought Leadership
  sections.push(`=== BLOG POSTS AND THOUGHT LEADERSHIP ===
`)
  
  knowledgeBase.blogPosts.forEach((post, index) => {
    sections.push(`Blog Post ${index + 1}: ${post.title}
Published: ${post.publishedDate}
Author: ${post.author}
Tags: ${post.tags.join(', ')}

Excerpt: ${post.excerpt}

`)
  })

  // Frequently Asked Questions
  sections.push(`=== FREQUENTLY ASKED QUESTIONS ===
`)
  
  knowledgeBase.faqs.forEach((faq, index) => {
    sections.push(`FAQ ${index + 1} (${faq.category}):
Q: ${faq.question}
A: ${faq.answer}

`)
  })

  // Technical Information
  sections.push(`=== TECHNICAL CAPABILITIES ===
`)
  
  knowledgeBase.technicalSpecs.forEach((tech, index) => {
    sections.push(`Technology ${index + 1}: ${tech.technology}
Description: ${tech.description}

Applications:
${tech.applications.map(app => `• ${app}`).join('\n')}

Advantages:
${tech.advantages.map(advantage => `• ${advantage}`).join('\n')}

`)
  })

  // Database Content Integration (if available)
  if (dbContent.knowledgeBaseUpdates.length > 0) {
    sections.push(`=== WEBSITE PERFORMANCE DATA ===
`)
    
    dbContent.knowledgeBaseUpdates.forEach((update, index) => {
      if (update.content_summary && update.content_summary.trim().length > 0) {
        const metadata = typeof update.metadata === 'string' ? 
          JSON.parse(update.metadata || '{}') : (update.metadata || {})

        sections.push(`Analysis ${index + 1}: ${update.url}
Content Quality: ${update.chunks_processed} content chunks processed
Summary: ${update.content_summary}
${metadata.title ? `Page Title: ${metadata.title}` : ''}
${metadata.description ? `Meta Description: ${metadata.description}` : ''}
Last Updated: ${new Date(update.created_at).toLocaleDateString()}

`)
      }
    })
  }

  // SEO Performance Data (if available)
  if (dbContent.seoAnalysis.length > 0) {
    sections.push(`=== SEO PERFORMANCE INSIGHTS ===
`)
    
    dbContent.seoAnalysis.forEach((analysis, index) => {
      const keywords = Array.isArray(analysis.recommended_keywords) ? 
        analysis.recommended_keywords : 
        JSON.parse(analysis.recommended_keywords || '[]')

      sections.push(`SEO Analysis ${index + 1}: ${analysis.url}
Performance Score: ${analysis.score}/100
Recommended Title: ${analysis.recommended_title || 'N/A'}
Recommended Description: ${analysis.recommended_description || 'N/A'}
Key Keywords: ${keywords.length > 0 ? keywords.join(', ') : 'N/A'}
Last Analyzed: ${new Date(analysis.created_at).toLocaleDateString()}

`)
    })
  }

  // AI Assistant Guidelines and Best Practices
  sections.push(`=== AI ASSISTANT GUIDELINES ===

When responding to inquiries about Fantastic AI Studio, follow these guidelines:

1. COMPANY EXPERTISE EMPHASIS:
   • Highlight our specialization in enterprise AI development and blockchain solutions
   • Mention our focus on Fortune 500 companies and enterprise clients
   • Reference our 95% client satisfaction rate as a quality indicator
   • Emphasize our comprehensive end-to-end development services

2. SERVICE OFFERINGS TO HIGHLIGHT:
   • Enterprise AI Development (Machine Learning, NLP, Computer Vision)
   • Blockchain Solutions (Smart Contracts, DeFi Platforms)
   • AI Consulting and Strategy Development
   • Custom Development Services
   • Post-deployment Support and Maintenance

3. TARGET MARKET INFORMATION:
   • Primary markets: USA, UK, Germany, Spain
   • Client types: Fortune 500 companies, Large enterprises, Scale-ups
   • Industries: Technology, Finance, Healthcare, Manufacturing, Retail

4. COMPETITIVE ADVANTAGES TO MENTION:
   • Experienced team of AI specialists and blockchain developers
   • Proven track record with 200+ successful AI projects
   • Comprehensive approach from strategy to deployment
   • Multi-chain blockchain development capabilities
   • Enterprise-grade security and compliance

5. TECHNICAL CAPABILITIES:
   • Advanced Machine Learning frameworks
   • Multi-blockchain platform support (Ethereum, Polygon, BSC, Solana)
   • Cloud infrastructure expertise
   • Security-first development approach
   • Scalable architecture design

6. COMMUNICATION STYLE:
   • Professional and knowledgeable tone
   • Solution-focused approach
   • Technical expertise balanced with business understanding
   • Confident but not overselling
   • Helpful and consultative

7. CONTACT AND NEXT STEPS:
   • Direct users to https://fais.world for more information
   • Suggest consultation for project-specific discussions
   • Mention custom quotes are available for enterprise projects
   • Emphasize our strategic consultation approach

8. COMPLIANCE AND ETHICS:
   • Emphasize our commitment to ethical AI development
   • Mention security audits and best practices
   • Highlight transparency in development processes
   • Reference ongoing support and maintenance services

`)

  // Footer Information
  sections.push(`---
KNOWLEDGE BASE METADATA:
Last Updated: ${new Date().toISOString()}
Data Sources: 
• Comprehensive company knowledge base
• Website content analysis
• Performance and SEO data
• Technical specifications

Contact Information:
• Website: https://fais.world
• Primary Markets: USA, UK, Germany, Spain
• Specialization: Enterprise AI & Blockchain Development
• Client Focus: Fortune 500 Companies

This knowledge base contains comprehensive information about Fantastic AI Studio's services, capabilities, company information, and technical expertise. Use this information to provide accurate, helpful, and professional responses to user inquiries.
---`)

  return sections.join('')
}
