import { streamText, type CoreMessage } from 'ai';
import { openai } from '@ai-sdk/openai';
import { queryVectorStore, VectorSearchOptions, KNOWLEDGE_BASE_TABLES } from '@/utils/rag-pipeline/vector-store-search';
import { getRAGConfig } from '@/lib/ai-config';

export const runtime = 'edge';

// Interface for the expected request payload
interface ElevenLabsQueryRequest {
  query: string;
  topK?: number;
  minRelevanceScore?: number;
}

// Format chunks for context inclusion with client-focused formatting
function formatChunksForClientContext(chunks: ReturnType<typeof queryVectorStore> extends Promise<infer T> ? T : never) {
  if (!chunks || chunks.length === 0) {
    return "No specific information found in our knowledge base about your inquiry.";
  }
  return chunks.map(chunk => {
    // Clean up URLs for client presentation
    const sourceReference = chunk.url.replace('https://fais.world', '').replace(/^\//, '');
    
    // Format content for client consumption
    return `From our ${sourceReference}:
${chunk.text}`;
  }).join('\n\n');
}

export async function POST(req: Request) {
  try {
    // Parse request with client-specific options
    const { query, topK = 3, minRelevanceScore } = await req.json() as ElevenLabsQueryRequest;

    if (!query) {
      return new Response('Query is required', { status: 400 });
    }
    
    // Configure search options for client-facing content only
    const searchOptions: VectorSearchOptions = { 
      topK, 
      tableName: KNOWLEDGE_BASE_TABLES.CLIENT_FACING,
    };
    
    if (minRelevanceScore !== undefined) {
      searchOptions.minRelevanceScore = minRelevanceScore;
    }

    // Search the client-facing knowledge base
    const chunks = await queryVectorStore(query, searchOptions);
    const context = formatChunksForClientContext(chunks);    // Get AI configuration
    const ragConfig = getRAGConfig();

    // Create messages for the LLM with client-focused system prompt
    const messages: CoreMessage[] = [
      {
        role: 'system',
        content: `You are a professional AI assistant for Fantastic AI Studio. Your role is to help potential clients understand our services and capabilities.

Key Guidelines:
- Be professional, helpful, and knowledgeable
- Focus on business benefits and outcomes
- Highlight our expertise in AI and blockchain development
- Mention our 95% client satisfaction rate when relevant
- Direct complex inquiries to contact our team
- Never mention internal processes or technical implementation details
- Always be consultative and solution-focused

Company Information:
- Fantastic AI Studio specializes in enterprise AI development and blockchain solutions
- We serve Fortune 500 companies and large enterprises
- Primary markets: USA, UK, Germany, Spain
- Services: Enterprise AI Development, Blockchain Solutions, Smart Contracts, DeFi Platforms, AI Consulting

Use the following context to answer the user's question accurately and professionally:

${context}`
      },
      {
        role: 'user',
        content: query
      }
    ];

    // Stream the response
    const result = await streamText({
      model: openai(ragConfig.model),
      messages
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error('ElevenLabs RAG query error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
