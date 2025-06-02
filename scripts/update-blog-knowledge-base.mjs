// scripts/update-blog-knowledge-base.mjs
/**
 * This script updates the RAG knowledge base with new blog content.
 * It's designed to be called after new blog articles are generated.
 */

import fs from 'fs/promises';
import OpenAI from 'openai';
import pg from 'pg';
import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fetch from 'node-fetch';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

const { Pool } = pg;

// --- Configuration ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL = 'text-embedding-ada-002';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fais.world';

// Database Configuration
const DATABASE_URL = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is not set.');
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL or DATABASE_URL_UNPOOLED environment variable is not set.');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const pool = new Pool({ connectionString: DATABASE_URL });

/**
 * Fetches content from a specific blog URL.
 * @param {string} url The URL of the blog post.
 * @returns {Promise<string|null>} The text content of the page, or null if an error occurs.
 */
async function fetchBlogContent(url) {
  console.log(`Crawling blog post: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching ${url}: ${response.statusText}`);
      return null;
    }
    const htmlContent = await response.text();
    
    // More sophisticated HTML parsing and text extraction
    const textContent = extractTextFromHtml(htmlContent);
    
    return textContent;
  } catch (error) {
    console.error(`Error fetching blog content for ${url}:`, error);
    return null;
  }
}

/**
 * Extracts relevant text content from HTML, focusing on main content and removing boilerplate
 * @param {string} html The HTML content to process
 * @returns {string} The extracted text content
 */
function extractTextFromHtml(html) {
  // Remove script and style elements first (they never contain useful text)
  let processedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  processedHtml = processedHtml.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  
  // For blog posts, try to extract blog-specific content first
  const blogContentRegexes = [
    /<article\b[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*?class="[^"]*?\b(?:blog-post|post-content|article-content|blog-content)\b[^"]*?"[^>]*>([\s\S]*?)<\/div>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
  ];
  
  let mainContent = '';
  for (const regex of blogContentRegexes) {
    const match = processedHtml.match(regex);
    if (match && match[1]) {
      mainContent = match[1];
      break;
    }
  }
  
  // If no blog content container found, use the body
  if (!mainContent) {
    const bodyMatch = processedHtml.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    mainContent = bodyMatch ? bodyMatch[1] : processedHtml;
  }
  
  // Try to extract blog title for better context
  let title = '';
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }
  
  // Remove remaining HTML tags
  const noHtml = mainContent.replace(/<[^>]+>/g, ' ');
  
  // Process whitespace and normalize
  let cleanedText = noHtml
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s\s+/g, ' ');
  
  // Split by lines and remove empty lines
  const lines = cleanedText.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  // If we found a title, add it at the beginning for better context
  if (title) {
    return `Title: ${title}\n\n${lines.join('\n')}`;
  }
  
  return lines.join('\n');
}

/**
 * Chunks text into smaller pieces with improved semantic awareness.
 * @param {string} text The text to chunk.
 * @param {Object} options Configuration options
 * @param {number} options.maxChunkSize The maximum size of each chunk
 * @param {number} options.overlap The overlap between chunks
 * @param {boolean} options.respectParagraphs Whether to try to respect paragraph boundaries
 * @returns {string[]} Array of text chunks.
 */
function chunkText(text, options = {}) {
  const {
    maxChunkSize = 1000,
    overlap = 100,
    respectParagraphs = true
  } = options;
  
  if (!text) return [];
  
  // If we're respecting paragraphs, split by double newlines first
  if (respectParagraphs) {
    // Split text into paragraphs (separated by double newlines)
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).map(p => p.trim());
    
    const chunks = [];
    let currentChunk = '';
    
    // Combine paragraphs into chunks
    for (const paragraph of paragraphs) {
      // If adding this paragraph would exceed max size and we already have content,
      // finalize the current chunk and start a new one
      if (currentChunk && (currentChunk.length + paragraph.length > maxChunkSize)) {
        chunks.push(currentChunk);
        
        // Start new chunk with overlap from the end of the previous chunk
        const overlapText = currentChunk.length > overlap 
          ? currentChunk.slice(-overlap) 
          : currentChunk;
        currentChunk = overlapText + ' ' + paragraph;
      } else {
        // Add separator if needed
        if (currentChunk) currentChunk += '\n\n';
        currentChunk += paragraph;
        
        // If the current chunk is already too big, force a split
        if (currentChunk.length > maxChunkSize) {
          // Recursive call to handle this large chunk
          const subChunks = chunkTextBySize(currentChunk, maxChunkSize, overlap);
          chunks.push(...subChunks.slice(0, -1));
          currentChunk = subChunks[subChunks.length - 1];
        }
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  } else {
    // Fall back to simple size-based chunking
    return chunkTextBySize(text, maxChunkSize, overlap);
  }
}

/**
 * Helper function to chunk text purely by size without considering semantics.
 * @param {string} text The text to chunk.
 * @param {number} chunkSize The approximate size of each chunk.
 * @param {number} overlap The overlap between chunks.
 * @returns {string[]} Array of text chunks.
 */
function chunkTextBySize(text, chunkSize = 1000, overlap = 100) {
  if (!text) return [];
  
  const chunks = [];
  let i = 0;
  
  while (i < text.length) {
    const end = Math.min(i + chunkSize, text.length);
    
    // Try to find a sentence or paragraph boundary near the end of the chunk
    let adjustedEnd = end;
    
    // Look for sentence endings (.!?) followed by a space or newline, or paragraph breaks
    if (end < text.length) {
      // Search backwards from the end for a good breakpoint
      for (let j = end; j > Math.max(i + chunkSize * 0.7, i + 100); j--) {
        // Good breakpoints in descending order of preference:
        // 1. Paragraph break
        if (j < text.length - 1 && text.substring(j, j + 2) === '\n\n') {
          adjustedEnd = j + 2;
          break;
        }
        // 2. Sentence end + space/newline
        if (j < text.length - 1 && /[.!?][\s\n]/.test(text.substring(j, j + 2))) {
          adjustedEnd = j + 2;
          break;
        }
      }
    }
    
    chunks.push(text.substring(i, adjustedEnd).trim());
    i += adjustedEnd - i - overlap; // Move forward accounting for overlap
    
    if (adjustedEnd === text.length) break;
  }
  
  return chunks;
}

/**
 * Generates embeddings for text chunks using OpenAI.
 * @param {string[]} chunks Array of text chunks.
 * @returns {Promise<Array<{ chunk: string, embedding: number[] }>>} Array of objects with chunks and their embeddings.
 */
async function generateEmbeddings(chunks) {
  if (!chunks || chunks.length === 0) return [];
  console.log(`Generating embeddings for ${chunks.length} chunks...`);
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: chunks,
    });
    return response.data.map((embeddingData, index) => ({
      chunk: chunks[index],
      embedding: embeddingData.embedding,
    }));
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return [];
  }
}

/**
 * Stores a URL, its text chunks, and their embeddings in the database.
 * @param {string} url The URL of the content.
 * @param {Array<{ chunk: string, embedding: number[] }>} chunkEmbeddings Array of chunks with their embeddings.
 */
async function storeInDatabase(url, chunkEmbeddings) {
  if (!chunkEmbeddings || chunkEmbeddings.length === 0) return;
  const client = await pool.connect();
  try {
    // Delete existing chunks for this URL to avoid duplicates if re-running
    await client.query('DELETE FROM knowledge_base_chunks WHERE url = $1', [url]);
    console.log(`Storing ${chunkEmbeddings.length} chunks for URL: ${url}`);

    for (const { chunk, embedding } of chunkEmbeddings) {
      // pgvector expects embeddings as a string like '[1,2,3,...]'
      const embeddingString = '[' + embedding.join(',') + ']';
      await client.query(
        'INSERT INTO knowledge_base_chunks (url, chunk_text, embedding) VALUES ($1, $2, $3)',
        [url, chunk, embeddingString]
      );
    }
    console.log(`Successfully stored chunks for ${url}.`);
  } catch (error) {
    console.error(`Error storing chunks for ${url} in database:`, error);
  } finally {
    client.release();
  }
}

/**
 * Updates the knowledge base with content from a specific blog URL.
 * @param {string} articleSlug The slug of the article (e.g., "large-language-models-2025").
 * @returns {Promise<boolean>} True if successful, false otherwise.
 */
async function updateBlogKnowledgeBase(articleSlug) {
  const fullUrl = `${BASE_URL}/blog/${articleSlug}`;
  console.log(`Processing blog article: ${fullUrl}`);
  
  const content = await fetchBlogContent(fullUrl);
  if (!content) {
    console.warn(`Could not fetch content for ${fullUrl}`);
    return false;
  }
  const chunks = chunkText(content, {
    maxChunkSize: 1000,
    overlap: 100,
    respectParagraphs: true
  });
  if (chunks.length === 0) {
    console.warn(`No text chunks generated for ${fullUrl}`);
    return false;
  }

  const chunkEmbeddings = await generateEmbeddings(chunks);
  if (chunkEmbeddings.length === 0) {
    console.warn(`Failed to generate embeddings for ${fullUrl}`);
    return false;
  }

  await storeInDatabase(fullUrl, chunkEmbeddings);
  return true;
}

/**
 * Main function to process an array of article slugs and update the knowledge base.
 * @param {string[]} articleSlugs Array of article slugs to process.
 */
async function main(articleSlugs) {
  console.log('Starting blog knowledge base update...');
  if (!articleSlugs || articleSlugs.length === 0) {
    console.log('No article slugs provided. Exiting.');
    return;
  }

  console.log(`Processing ${articleSlugs.length} articles...`);
  let successCount = 0;

  for (const slug of articleSlugs) {
    const success = await updateBlogKnowledgeBase(slug);
    if (success) successCount++;
  }

  console.log(`Blog knowledge base update completed. Successfully processed ${successCount}/${articleSlugs.length} articles.`);
  await pool.end(); // Close the database connection pool
}

// If called directly from command line
if (process.argv.length > 2) {
  // Get article slugs from command line arguments
  const articleSlugs = process.argv.slice(2);
  main(articleSlugs).catch(error => {
    console.error('Unhandled error in main execution:', error);
    pool.end();
    process.exit(1);
  });
} else {
  console.log('No article slugs provided as arguments. Example usage:');
  console.log('node update-blog-knowledge-base.mjs article-slug-1 article-slug-2');
  process.exit(0);
}

// Export for use in other scripts
export { updateBlogKnowledgeBase };
