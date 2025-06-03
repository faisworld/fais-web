/**
 * Article generator utility that interfaces with the article generation API
 * ESM version
 */

import fetch from 'node-fetch';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Local fetch wrapper for accessing the article generation API
async function generateArticle(topic, keywords = [], tone = 'informative', wordCount = 800) {
  if (!topic) {
    throw new Error('Topic is required for article generation');
  }

  console.log(`Generating article on: "${topic}" with keywords: ${keywords.join(', ')}`);
  try {    
    // Determine the API URL based on environment
    let apiUrl;
    if (process.env.INTERNAL_API_BASE_URL) {
      apiUrl = process.env.INTERNAL_API_BASE_URL;
    } else if (process.env.NODE_ENV === 'production') {
      apiUrl = 'https://fais.world';
    } else {
      apiUrl = 'http://localhost:3000';
    }
    
    const articleApiEndpoint = `${apiUrl}/api/admin/ai-tools/generate-article`;

    // Generate a timestamp-based ID for this article
    const timestamp = Date.now();
    const uniqueId = createHash('md5').update(`${topic}-${timestamp}`).digest('hex').substring(0, 8);
    
    // Prepare headers with authentication
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add internal API key if available (for production automated scripts)
    const internalApiKey = process.env.INTERNAL_API_KEY;
    if (internalApiKey) {
      headers['Authorization'] = `Bearer ${internalApiKey}`;
    }
    
    console.log(`Making request to: ${articleApiEndpoint}`);
    
    // Call the internal API
    const response = await fetch(articleApiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        topic,
        keywords,
        tone,
        wordCount,
        includeImage: true,
        id: uniqueId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`Article generated successfully. Title: "${result.title}"`);
    
    // Save the article to the blog-data.ts file
    await saveArticleToBlogData(result, uniqueId);
    
    return result;
  } catch (error) {
    console.error('Error generating article:', error);
    throw error;
  }
}

/**
 * Save the generated article to the blog-data.ts file
 */
async function saveArticleToBlogData(articleData, uniqueId) {
  try {
    // Calculate read time based on word count (avg reading speed of 200-250 words per minute)
    const wordCount = articleData.content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMinutes} min read`;
    
    // Format the current date
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    // Determine category based on content analysis
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt', 'llm'];
    const blockchainKeywords = ['blockchain', 'crypto', 'ethereum', 'bitcoin', 'defi', 'token', 'nft'];
    
    const content = articleData.content.toLowerCase();
    const isAI = aiKeywords.some(keyword => content.includes(keyword));
    const isBlockchain = blockchainKeywords.some(keyword => content.includes(keyword));
    
    let category = 'technology'; // default
    if (isAI && !isBlockchain) category = 'ai';
    else if (isBlockchain && !isAI) category = 'blockchain';
    else if (isAI && isBlockchain) {
      // If both, check which has more mentions
      const aiCount = aiKeywords.reduce((count, keyword) => {
        const regex = new RegExp(keyword, 'g');
        const matches = content.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
      
      const blockchainCount = blockchainKeywords.reduce((count, keyword) => {
        const regex = new RegExp(keyword, 'g');
        const matches = content.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);
      
      category = aiCount > blockchainCount ? 'ai' : 'blockchain';
    }
    
    // Create the blog post object
    const blogPost = {
      id: uniqueId,
      slug: articleData.slug,
      title: articleData.title,
      excerpt: articleData.content.split('\n\n')[0].replace(/[#*]/g, '').trim().substring(0, 150) + '...',
      date: formattedDate,
      readTime,
      category,
      coverImage: articleData.imageUrl,
      featured: Math.random() > 0.7, // Randomly feature some posts
      author: "Fantastic AI",
      authorImage: "author-fantastic"
    };
    
    // Read the current blog-data.ts file
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Find the blogPosts array
    const blogPostsArrayMatch = blogDataContent.match(/export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/);
    
    if (blogPostsArrayMatch) {
      // Convert the blog post to a string representation
      const blogPostString = `
  {
    id: "${blogPost.id}",
    slug: "${blogPost.slug}",
    title: "${blogPost.title.replace(/"/g, '\\"')}",
    excerpt: "${blogPost.excerpt.replace(/"/g, '\\"')}",
    date: "${blogPost.date}",
    readTime: "${blogPost.readTime}",
    category: "${blogPost.category}",
    coverImage: "${blogPost.coverImage}",
    featured: ${blogPost.featured},
    author: "${blogPost.author}",
    authorImage: "${blogPost.authorImage}"
  },`;
      
      // Replace the array content
      const currentArray = blogPostsArrayMatch[1].trim();
      const newArray = currentArray ? currentArray + blogPostString : blogPostString.trim();
      const updatedBlogData = blogDataContent.replace(
        /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/, 
        `export const blogPosts: BlogPost[] = [${newArray}];`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(blogDataPath, updatedBlogData, 'utf8');
      console.log(`Article "${blogPost.title}" saved to blog-data.ts`);
      
      // Also save the full content to a markdown file for the blog
      const contentDir = path.join(process.cwd(), 'app', 'blog', 'content');
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }
      
      const contentFilePath = path.join(contentDir, `${blogPost.slug}.md`);
      fs.writeFileSync(contentFilePath, articleData.content, 'utf8');
      console.log(`Full article content saved to ${contentFilePath}`);
      
      return true;
    } else {
      throw new Error('Could not find blogPosts array in blog-data.ts');
    }
  } catch (error) {
    console.error('Error saving article to blog data:', error);
    throw error;
  }
}

export { generateArticle };
