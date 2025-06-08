import { streamText, type CoreMessage } from 'ai'; // Using CoreMessage type
import { openai } from '@ai-sdk/openai'; // Correct import for openai
import { queryVectorStore, VectorSearchOptions } from '@/utils/rag-pipeline/vector-store-search';
import { getRAGConfig, getProviderOptions } from '@/lib/ai-config';

export const runtime = 'edge'; // Optional: Use Vercel Edge Functions

// Interface for the expected request payload
interface RAGQueryRequest {
  query: string;
  topK?: number;
  filterBlogOnly?: boolean;
  minRelevanceScore?: number;
}

// Format chunks for context inclusion with better source attribution
function formatChunksForContext(chunks: ReturnType<typeof queryVectorStore> extends Promise<infer T> ? T : never) {
  if (!chunks || chunks.length === 0) {
    return "No specific information found in our knowledge base.";
  }

  return chunks.map(chunk => {
    // Create a readable source reference
    let sourceInfo = chunk.url;
    if (chunk.title) {
      sourceInfo = `${chunk.title} (${chunk.url})`;
    }
    
    // Format with clear attribution
    return `Source: ${sourceInfo}
Type: ${chunk.source_type || 'General Content'}
Relevance: ${chunk.distance ? (1 / (1 + chunk.distance)).toFixed(2) : 'Unknown'}
Content:
${chunk.text}`;
  }).join('\n\n---\n\n');
}

export async function POST(req: Request) {
  try {
    // Parse request with additional options
    const { query, topK = 3, filterBlogOnly = false, minRelevanceScore } = await req.json() as RAGQueryRequest;

    if (!query) {
      return new Response('Query is required', { status: 400 });
    }
    
    // Configure search options
    const searchOptions: VectorSearchOptions = { 
      topK, 
      filterBlogOnly,
      minRelevanceScore
    };
    
    // 1. Search the vector store for relevant chunks based on the query with enhanced options
    let context;
    try {
      const relevantChunks = await queryVectorStore(query, searchOptions);
      context = formatChunksForContext(relevantChunks);
    } catch (error) {
      console.error('Error retrieving context from vector store:', error);
      context = "Unable to retrieve relevant context. Answering with general knowledge.";
    }

    const promptContent = `You are O3, an AI assistant for Fantastic AI Studio (FAIS), a company that specializes in AI and blockchain services.
Answer the user's question based on the following retrieved context.
If the context doesn't contain relevant information to answer the question, say so and provide a general response based on your knowledge.
Be helpful, accurate, and concise.

When referencing information from the context, mention the source when relevant.
For example: "According to the FAIS blog post on AI trends..."

Context:
${context}

Question: ${query}

Answer:`;

    // streamText expects an array of messages conforming to CoreMessage
    const messages: CoreMessage[] = [{ role: 'user', content: promptContent }];    // Get AI model configuration for RAG queries
    const aiConfig = getRAGConfig();
    const providerOptions = getProviderOptions(aiConfig);
    
    const result = await streamText({
      model: openai(aiConfig.model),
      messages: messages,
      // Configure reasoning effort based on use case
      ...(providerOptions && { providerOptions })
    });

    return result.toDataStreamResponse(); // Correct method to get a Response

  } catch (error: unknown) { // Catch error as unknown for type safety
    console.error('Error in RAG query API:', error);
    if (error instanceof Error) {
      // Check if it's a Vercel AI SDK specific error by checking for a name or statusCode property
      const aiError = error as Error & { name?: string; statusCode?: number };
      if (aiError.name === 'AIError' || aiError.statusCode) {
        return new Response(aiError.message, { status: aiError.statusCode || 500 });
      }
      return new Response(error.message, { status: 500 });
    }
    return new Response('Internal Server Error', { status: 500 });
  }
}
