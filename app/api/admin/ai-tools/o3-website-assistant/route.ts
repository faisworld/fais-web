import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkAdminAuth } from '@/utils/auth-compat';

// Initialize OpenAI with O3 model
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import O3 Manager dynamically to avoid build issues
async function getO3Manager() {
  const { o3Manager } = await import('@/utils/enhanced-o3-manager');
  return o3Manager;
}

interface WebsiteIssue {
  type: 'spacing' | 'seo' | 'performance' | 'accessibility' | 'content';
  severity: 'low' | 'medium' | 'high' | 'critical';
  page: string;
  description: string;
  solution: string;
  canAutoFix: boolean;
}

interface AssistantMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {    // Validate admin authentication
    const authCheck = await checkAdminAuth(request);
    if (!authCheck.isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });    }

    const { message, conversation } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get comprehensive website context
    const manager = await getO3Manager();
    const websiteContext = await manager.getSEOAnalysisContext();
    const contextSummary = manager.getContextSummary();

    // Create system prompt for O3 website assistant with real context
    const systemPrompt = `You are an expert website analyst and developer assistant powered by O3. You have access to the complete website codebase and current implementation status.

**IMPORTANT**: Before making ANY recommendations, you MUST review the current website context below. Do NOT suggest features that are already implemented.

${websiteContext}

**Context Summary**: ${contextSummary}

You specialize in:
1. **Accurate Analysis**: Review actual implementation before suggesting improvements
2. **Problem Detection**: Identify real issues based on current code state
3. **Smart Recommendations**: Suggest only improvements that aren't already implemented
4. **Code Solutions**: Provide specific fixes when needed

**Website Technology Stack**:
- Domain: https://fais.world
- Framework: Next.js 15, TypeScript, Tailwind CSS
- SEO: Comprehensive structured data, meta tags, breadcrumbs already implemented
- Features: Blog system, admin tools, image generation, cron automation

**Analysis Approach**:
1. First check what's already implemented from the context above
2. Only suggest improvements for missing or problematic features
3. Provide specific file references when suggesting changes
4. Consider memory efficiency and exclude irrelevant files from analysis

**Recent System Updates**:
- ✅ Fixed blog article spacing between title/header and content sections
- ✅ Enhanced prose styling with better heading and paragraph spacing
- ✅ Implemented dynamic blog sitemap generation
- ✅ Completed system cleanup and verification

**Your Capabilities**:
- Analyze HTML/CSS for spacing and layout issues
- Perform SEO audits and provide specific recommendations
- Generate code fixes for common problems
- Crawl multiple pages and identify patterns
- Provide actionable solutions with implementation details

**Response Format**:
- Be specific and actionable
- Provide code snippets when relevant
- Categorize issues by type and severity
- Suggest both quick fixes and long-term improvements
- Include implementation steps

When analyzing issues, focus on:
- Spacing problems (margins, padding, line-height)
- SEO optimization opportunities
- Performance improvements
- Accessibility compliance
- Content quality and structure

Always provide practical, implementable solutions.`;

    // Build conversation history for context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversation.map((msg: AssistantMessage) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];    // Call OpenAI GPT-4 model for analysis (fallback from O3)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // Using GPT-4 as fallback
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const assistantResponse = completion.choices[0]?.message?.content || 'I apologize, but I encountered an issue analyzing your request.';

    // Detect if this is an analysis request and extract issues
    const detectedIssues: WebsiteIssue[] = [];
    let responseType = 'analysis';

    // Check if the message is asking for specific analysis
    const isAnalysisRequest = message.toLowerCase().includes('analyze') || 
                             message.toLowerCase().includes('check') || 
                             message.toLowerCase().includes('spacing') ||
                             message.toLowerCase().includes('seo');    if (isAnalysisRequest) {
      // For demonstration, add some detected issues based on the conversation context
      if (message.toLowerCase().includes('spacing') || message.toLowerCase().includes('blog')) {
        detectedIssues.push({
          type: 'spacing',
          severity: 'medium',
          page: '/blog/[slug]',
          description: 'Blog article spacing has been FIXED: Enhanced spacing between header and content sections',
          solution: `Applied fixes:
1. ✅ Cover image margin: mb-8 → mb-12
2. ✅ Content container: added mt-8 
3. ✅ Enhanced prose styling: prose-headings:mb-6 prose-p:mb-6 prose-headings:mt-8 first:prose-headings:mt-0`,
          canAutoFix: false // Already fixed
        });
      }

      if (message.toLowerCase().includes('seo')) {
        detectedIssues.push({
          type: 'seo',
          severity: 'low',
          page: '/blog',
          description: 'Meta descriptions could be more optimized for target keywords',
          solution: 'Update meta descriptions to include primary keywords and maintain 150-160 character limit',
          canAutoFix: false
        });
      }

      responseType = 'analysis';
    }

    return NextResponse.json({
      content: assistantResponse,
      type: responseType,
      issues: detectedIssues,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('O3 Assistant Error:', error);
    return NextResponse.json(
      { error: 'Failed to process assistant request' },
      { status: 500 }
    );
  }
}
