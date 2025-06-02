# RAG Knowledge Base System Architecture

This document outlines the architecture and components of the Retrieval Augmented Generation (RAG) system implemented for the Fantastic AI Studio website.

## Overview

The RAG system enhances the O3 assistant by providing it with relevant information from the FAIS website, including blog articles. When users ask questions, the system retrieves context from a vector database and uses this context to generate more accurate, up-to-date answers.

## Components

### 1. Knowledge Base Storage

- **Database**: Neon Serverless Postgres with pgvector extension
- **Table Schema**:

  ```sql
  CREATE TABLE knowledge_base_chunks (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    chunk_text TEXT NOT NULL,
    embedding VECTOR(1536) NOT NULL, -- Dimension for text-embedding-ada-002
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

- **Index**:

  ```sql
  CREATE INDEX knowledge_base_chunks_embedding_idx 
  ON knowledge_base_chunks 
  USING HNSW (embedding vector_l2_ops);
  ```

### 2. Knowledge Base Update Process

#### General Website Update

- **Script**: `scripts/update-rag-knowledge-base.mjs`
- **Function**: Parses `public/sitemap.xml`, crawls all URLs, chunks the content, generates embeddings using OpenAI's `text-embedding-ada-002`, and stores in the database.
- **Execution**: Runs after article generation or can be run manually.

#### Blog-Specific Update

- **Script**: `scripts/update-blog-knowledge-base.mjs`
- **Function**: Updates the knowledge base with specific blog articles identified by their slugs.
- **Integration**: Called from `automated-article-generation.mjs` with the slugs of newly generated articles.

### 3. RAG Query API

- **Endpoint**: `app/api/rag-query/route.ts`
- **Framework**: Vercel AI SDK with OpenAI
- **Process**:
  1. Receives a user query with optional parameters (topK, filterBlogOnly, minRelevanceScore)
  2. Generates an embedding for the query
  3. Performs hybrid search (vector + keyword) in the vector database
  4. Retrieves relevant context chunks with metadata
  5. Formats context with source attribution
  6. Sends the query with enhanced context to the LLM
  7. Streams the response back to the client

### 4. Vector Store Search Utility

- **File**: `utils/rag-pipeline/vector-store-search.ts`
- **Functions**:
  - `generateEmbedding()`: Creates embeddings for text using OpenAI
  - `searchVectorStore()`: Searches the vector database using similarity with filtering options
  - `hybridSearch()`: Combines vector similarity with keyword matching for better results
  - `queryVectorStore()`: Integrates embedding generation and appropriate search method
  - `extractMetadataFromUrl()`: Extracts source type and title from URLs for better attribution

### 5. Demo Interface

- **Page**: `app/rag-demo/page.tsx`
- **Features**:
  - Chat interface that uses the RAG query API
  - Controls for search parameters (topK, filtering by blog posts)
  - Example questions for easy testing
  - Clear chat functionality
  - Response attribution to sources

## Workflow

1. **Content Creation**:
   - When new blog articles are generated, their slugs are captured
   - The RAG knowledge base is updated with the new content

2. **Knowledge Retrieval**:
   - User asks a question through the O3 assistant
   - System generates an embedding for the query
   - Hybrid search is performed (vector similarity + keyword matching)
   - Relevant chunks are retrieved with metadata
   - Context is formatted with source attribution

3. **Answer Generation**:
   - Retrieved chunks provide context to the LLM
   - LLM generates an answer based on this context, referencing sources
   - Answer is streamed back to the user

## Environment Configuration

Required environment variables:

- `DATABASE_URL` or `DATABASE_URL_UNPOOLED`: Neon database connection string
- `OPENAI_API_KEY`: OpenAI API key for embeddings and LLM
- `NEXT_PUBLIC_SITE_URL`: Base URL of the website (for crawling)

## Maintenance and Updates

- The knowledge base is automatically updated after new articles are generated
- For manual updates, run: `node scripts/update-rag-knowledge-base.mjs`
- For updating specific blog articles, run: `node scripts/update-blog-knowledge-base.mjs [slug1] [slug2] ...`

## Advanced Features

The RAG system includes several advanced features:

1. **Hybrid Search**:
   - Combines vector similarity with keyword matching
   - Better handles complex queries with specific terms
   - Falls back to pure vector search for simple queries

2. **Metadata Filtering**:
   - Can filter search results by content type (e.g., blog posts only)
   - Relevance score filtering to ensure quality matches
   - URL pattern filtering for targeted searches

3. **Source Attribution**:
   - Extracts and includes source metadata in context
   - LLM references sources in responses
   - Helps users understand where information comes from

4. **Chunking Strategy**:
   - Current implementation uses fixed-size chunks with overlap
   - Future improvement: semantic chunking based on content structure

## Future Enhancements

Potential improvements:

- More sophisticated text chunking strategies (e.g., semantic chunking)
- Support for additional content types (PDF, documents)
- Advanced metadata filtering based on topics or categories
- Improved search with full-text indexing for hybrid search
- Integration with reranking models for better context selection
- Hybrid search combining vector search with keyword search
- Metadata filtering (e.g., by content type, date, etc.)
- Source attribution in responses
- User feedback loop to improve retrieval quality
