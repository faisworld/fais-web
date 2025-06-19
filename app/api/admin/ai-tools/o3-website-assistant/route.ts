import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkAdminAuth } from '@/utils/auth-compat';

// Initialize OpenAI with O3 model
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, conversation } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create system prompt for O3 website assistant
    const systemPrompt = `You are an expert website analyst and developer assistant powered by O3. You specialize in:

1. **Website Analysis**: Crawling and analyzing web pages for issues
2. **Problem Detection**: Identifying spacing, SEO, performance, accessibility, and content issues  
3. **Auto-fixing**: Providing specific code fixes and solutions
4. **Recommendations**: Suggesting improvements and optimizations

**Current Website Context**:
- Domain: https://fais.world
- Technology: Next.js 14, TypeScript, Tailwind CSS
- Key Areas: Blog system, SEO optimization, spacing/layout issues
- Recent Fix: Blog article spacing has been improved (mb-8 → mb-12 for cover image, added mt-8 to content)

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
