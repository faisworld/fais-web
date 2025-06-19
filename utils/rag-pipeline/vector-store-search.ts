// utils/rag-pipeline/vector-store-search.ts
import { createPool } from '@vercel/postgres';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Embedding model to use
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const EMBEDDING_DIMENSION = 1536; // Dimensionality of text-embedding-ada-002

// Initialize Postgres pool
const poolConfig = {
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
};
const pool = createPool(poolConfig);

/**
 * Generates an embedding for the given text using OpenAI's API
 * @param text - The text to generate an embedding for
 * @returns A vector of floats representing the embedding
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Represents a chunk of text with its URL and optional metadata
 */
export interface TextChunk {
  url: string;
  text: string;
  created_at?: Date;
  distance?: number;
  source_type?: string;
  title?: string;
}

// Search options interface
export interface VectorSearchOptions {
  topK: number;
  includeMetadata?: boolean;
  urlFilter?: string;
  filterBlogOnly?: boolean;
  minRelevanceScore?: number;
  tableName?: 'knowledge_base_chunks' | 'knowledge_base_o3' | 'knowledge_base_client';
}

// Default table names for different purposes
export const KNOWLEDGE_BASE_TABLES = {
  ORIGINAL: 'knowledge_base_chunks',
  O3_INTERNAL: 'knowledge_base_o3', 
  CLIENT_FACING: 'knowledge_base_client'
} as const;

/**
 * Extracts source type (blog, docs, etc.) and title from the URL
 * @param url - The URL to parse
 * @returns Object with source_type and title
 */
function extractMetadataFromUrl(url: string): { source_type: string; title: string } {  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    let source_type = 'general';
    let title = url;
    
    if (pathParts.length > 0) {
      // Identify content type from URL path
      if (pathParts[0] === 'blog') {
        source_type = 'blog';
        // Convert slug to title: "my-blog-post" -> "My Blog Post"
        if (pathParts.length > 1) {
          title = pathParts[1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      } else if (pathParts[0] === 'docs' || pathParts[0] === 'documentation') {
        source_type = 'documentation';
        title = pathParts.slice(1).join(' - ');
      } else if (pathParts[0] === 'services') {
        source_type = 'services';
        title = 'FAIS Services';
      } else if (pathParts[0] === 'about') {
        source_type = 'about';
        title = 'About FAIS';
      }
    }
    
    return { source_type, title };
  } catch (error) {
    return { source_type: 'unknown', title: url };
  }
}

/**
 * Searches the vector store for chunks similar to the query embedding
 * @param queryEmbedding - The embedding vector for the query
 * @param options - Search options like topK (number of results)
 * @returns Array of text chunks sorted by similarity
 */
export async function searchVectorStore(
  queryEmbedding: number[],
  options: VectorSearchOptions = { topK: 3 }
): Promise<TextChunk[]> {
  try {
    if (!queryEmbedding || queryEmbedding.length !== EMBEDDING_DIMENSION) {
      throw new Error(`Invalid embedding: expected ${EMBEDDING_DIMENSION} dimensions`);
    }    // Convert embedding to the format expected by pgvector: '[1,2,3,...]'
    const embeddingString = `[${queryEmbedding.join(',')}]`;
    
    // Determine which table to use
    const tableName = options.tableName || KNOWLEDGE_BASE_TABLES.O3_INTERNAL;
    
    // Build the query with optional filters
    let query = `
      SELECT url, chunk_text as text, created_at,
      embedding <-> $1::vector as distance
      FROM ${tableName}
      WHERE 1=1
    `;
    
    const queryParams: (string | number)[] = [embeddingString];
    let paramIndex = 2;
    
    // Add URL filter if specified
    if (options.urlFilter) {
      query += ` AND url LIKE $${paramIndex}`;
      queryParams.push(`%${options.urlFilter}%`);
      paramIndex++;
    }
    
    // Add blog filter if specified
    if (options.filterBlogOnly) {
      query += ` AND url LIKE $${paramIndex}`;
      queryParams.push('%/blog/%');
      paramIndex++;
    }
    
    // Complete the query
    query += `
      ORDER BY distance
      LIMIT $${paramIndex}
    `;
    queryParams.push(options.topK);
    
    // Execute the query
    const { rows } = await pool.query(query, queryParams);
    
    // Process results
    const results = rows.map(row => {
      const metadata = extractMetadataFromUrl(row.url);
      return {
        url: row.url,
        text: row.text,
        created_at: row.created_at,
        distance: row.distance,
        source_type: metadata.source_type,
        title: metadata.title
      };
    });
    
    // Optional filtering by relevance score if specified
    if (options.minRelevanceScore !== undefined) {      // Convert distance to a 0-1 similarity score (1 being most similar)
      // This is a simplified conversion that works for L2 distance
      return results.filter(chunk => {
        const similarityScore = 1 / (1 + (chunk.distance || 0));
        return similarityScore >= (options.minRelevanceScore || 0);
      });
    }
    
    return results;
  } catch (error) {
    console.error('Error searching vector store:', error);
    throw error;
  }
}

/**
 * Performs a hybrid search combining vector similarity with keyword matching
 * @param searchQuery - The user query
 * @param queryEmbedding - The embedding of the query
 * @param options - Search options
 * @returns Array of text chunks sorted by combined relevance
 */
export async function hybridSearch(
  searchQuery: string,
  queryEmbedding: number[],
  options: VectorSearchOptions = { topK: 5 }
): Promise<TextChunk[]> {
  try {
    // Extract keywords from the query (simple approach)
    const keywords = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3) // Only consider words longer than 3 chars
      .map(word => word.replace(/[^\w]/g, '')); // Remove non-word chars
    
    if (keywords.length === 0) {
      // Fall back to vector search if no good keywords
      return searchVectorStore(queryEmbedding, options);
    }
      // Convert embedding to the format expected by pgvector
    const embeddingString = `[${queryEmbedding.join(',')}]`;
    
    // Determine which table to use
    const tableName = options.tableName || KNOWLEDGE_BASE_TABLES.O3_INTERNAL;    // Build a query that combines vector similarity with keyword matching
    let queryText = `
      SELECT url, chunk_text as text, created_at,
      (embedding <-> $1::vector) as distance,
    `;
    
    // Add a text search score for each keyword
    if (keywords.length > 0) {
      queryText += `(`;
      for (let i = 0; i < keywords.length; i++) {
        if (i > 0) queryText += ` + `;
        queryText += `(CASE WHEN chunk_text ILIKE $${i + 2} THEN 0.2 ELSE 0 END)`;
      }
      queryText += `) as keyword_score`;
    } else {
      queryText += `0 as keyword_score`;
    }
    
    queryText += `
      FROM ${tableName}
      WHERE 1=1
    `;
      const queryParams: (string | number)[] = [embeddingString];
    keywords.forEach(keyword => {
      queryParams.push(`%${keyword}%`);
    });
      // Add filters
    let paramIndex = keywords.length + 2;
    
    if (options.urlFilter) {
      queryText += ` AND url LIKE $${paramIndex}`;
      queryParams.push(`%${options.urlFilter}%`);
      paramIndex++;
    }
    
    if (options.filterBlogOnly) {
      queryText += ` AND url LIKE $${paramIndex}`;
      queryParams.push('%/blog/%');
      paramIndex++;
    }    // Order by combined score (vector similarity and keyword matches)
    queryText += `
      ORDER BY ((embedding <-> $1::vector) - keyword_score)
      LIMIT $${paramIndex}
    `;
    queryParams.push(options.topK);
    
    // Execute the query
    const { rows } = await pool.query(queryText, queryParams);
    
    // Process results
    return rows.map(row => {
      const metadata = extractMetadataFromUrl(row.url);
      return {
        url: row.url,
        text: row.text,
        created_at: row.created_at,
        distance: row.distance,
        source_type: metadata.source_type,
        title: metadata.title
      };
    });
  } catch (error) {
    console.error('Error in hybrid search:', error);
    // Fall back to regular vector search
    return searchVectorStore(queryEmbedding, options);
  }
}

/**
 * Utility function to generate embedding for a query and search in one step
 * @param query - The user query to search for
 * @param options - Search options like topK
 * @returns Array of text chunks sorted by similarity
 */
export async function queryVectorStore(
  query: string,
  options: VectorSearchOptions = { topK: 3 }
): Promise<TextChunk[]> {
  const embedding = await generateEmbedding(query);
  
  // Use hybrid search if we have a more complex query
  if (query.split(' ').length > 2) {
    return hybridSearch(query, embedding, options);
  }
  
  // Otherwise use standard vector search
  return searchVectorStore(embedding, options);
}
