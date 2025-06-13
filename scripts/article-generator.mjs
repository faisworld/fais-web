/**
 * Article generator utility that interfaces with the article generation API
 * ESM version
 */

import fetch from 'node-fetch';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Local fetch wrapper for accessing the article generation API
async function generateArticle(topic, keywords = [], tone = 'informative', wordCount = 800, includeImage = true) {
  if (!topic) {
    throw new Error('Topic is required for article generation');
  }

  console.log(`🤖 Generating article on: "${topic}" with keywords: ${keywords.join(', ')}`);
  
  try {    
    // Determine the API URL based on environment
    let apiUrl;
    if (process.env.INTERNAL_API_BASE_URL) {
      apiUrl = process.env.INTERNAL_API_BASE_URL;
    } else if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
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
    
    console.log(`📡 Making request to: ${articleApiEndpoint}`);
    console.log(`🖼️  Image generation: ${includeImage ? 'Enabled' : 'Disabled'}`);
    
    // Call the internal API
    const response = await fetch(articleApiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        topic,
        keywords,
        tone,
        wordCount,
        includeImage,
        id: uniqueId
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API responded with status ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log(`✅ Article generated successfully`);
    console.log(`   Title: "${result.title}"`);
    console.log(`   Content length: ${result.content.length} characters`);
    console.log(`   Image URL: ${result.imageUrl || 'No image generated'}`);
    
    // Only save to blog data if this is a complete generation (not preliminary)
    if (includeImage) {
      const saved = await saveArticleToBlogData(result, uniqueId);
      if (saved) {
        console.log(`💾 Article saved to blog data successfully`);
      } else {
        console.log(`⚠️  Article not saved - may be duplicate`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error generating article:', error.message);
    throw error;
  }
}

/**
 * Save the generated article to the blog-data.ts file with enhanced duplicate detection
 */
async function saveArticleToBlogData(articleData, uniqueId) {
  try {
    // Read the current blog-data.ts file first to check for duplicates
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Enhanced duplicate checking
    const slug = articleData.slug;
    const title = articleData.title.toLowerCase();
    const titleWords = title.split(' ').filter(word => word.length > 3);
    
    // Check if an article with this slug exists
    if (blogDataContent.includes(`slug: "${slug}"`)) {
      console.log(`⚠️  Article with slug "${slug}" already exists. Skipping save.`);
      return false;
    }
    
    // Check for similar titles using key words
    const existingTitles = blogDataContent.match(/title: "(.*?)"/g) || [];
    for (const titleMatch of existingTitles) {
      const existingTitle = titleMatch.replace(/title: "/, '').replace(/"$/, '').toLowerCase();
      
      // Count common words
      const existingWords = existingTitle.split(' ').filter(word => word.length > 3);
      const commonWords = titleWords.filter(word => existingWords.includes(word));
      
      // If more than 50% of words are common, consider it similar
      if (commonWords.length > titleWords.length * 0.5 && commonWords.length > 2) {
        console.log(`⚠️  Similar article title exists: "${existingTitle.slice(0, 60)}..."`);
        console.log(`   Common words: ${commonWords.join(', ')}`);
        return false;
      }
    }
    
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
    
    // Enhanced category determination based on content analysis
    const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'neural', 'gpt', 'llm', 'deep learning', 'nlp', 'computer vision'];
    const blockchainKeywords = ['blockchain', 'crypto', 'ethereum', 'bitcoin', 'defi', 'token', 'nft', 'smart contract', 'web3', 'dapp'];
    
    const content = (articleData.content + ' ' + articleData.title).toLowerCase();
    
    // Count keyword occurrences
    const aiCount = aiKeywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    const blockchainCount = blockchainKeywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword, 'gi');
      const matches = content.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    let category = 'technology'; // default
    if (aiCount > blockchainCount && aiCount > 0) {
      category = 'ai';
    } else if (blockchainCount > aiCount && blockchainCount > 0) {
      category = 'blockchain';
    } else if (aiCount > 0 && blockchainCount > 0) {
      // Both present - use the one with higher count
      category = aiCount >= blockchainCount ? 'ai' : 'blockchain';
    }
    
    // Create the blog post object
    const blogPost = {
      id: uniqueId,
      slug: articleData.slug,
      title: articleData.title,
      excerpt: generateExcerpt(articleData.content),
      date: formattedDate,
      readTime,
      category,
      coverImage: articleData.imageUrl || `https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/placeholder-${category}.jpg`,
      featured: Math.random() > 0.85, // Reduce chance of featuring posts
      author: "Fantastic AI",
      authorImage: "author-fantastic"
    };
    
    console.log(`📝 Prepared blog post:`);
    console.log(`   ID: ${blogPost.id}`);
    console.log(`   Slug: ${blogPost.slug}`);
    console.log(`   Category: ${blogPost.category} (AI: ${aiCount}, Blockchain: ${blockchainCount})`);
    console.log(`   Read time: ${blogPost.readTime}`);
    console.log(`   Featured: ${blogPost.featured}`);

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
      
      // Replace the array content - add to beginning for newest first
      const currentArray = blogPostsArrayMatch[1].trim();
      const newArray = currentArray ? blogPostString + currentArray : blogPostString.trim();
      const updatedBlogData = blogDataContent.replace(
        /export const blogPosts: BlogPost\[\] = \[([\s\S]*?)\];/, 
        `export const blogPosts: BlogPost[] = [${newArray}];`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(blogDataPath, updatedBlogData, 'utf8');
      console.log(`✅ Article "${blogPost.title}" saved to blog-data.ts`);
      
      // Also save the full content to a markdown file for the blog
      const contentDir = path.join(process.cwd(), 'app', 'blog', 'content');
      if (!fs.existsSync(contentDir)) {
        fs.mkdirSync(contentDir, { recursive: true });
      }
      
      const contentFilePath = path.join(contentDir, `${blogPost.slug}.md`);
      const markdownContent = `---
title: "${articleData.title}"
excerpt: "${blogPost.excerpt}"
date: "${blogPost.date}"
category: "${blogPost.category}"  
author: "${blogPost.author}"
image: "${blogPost.coverImage}"
keywords: ${JSON.stringify(generateKeywords(articleData.content, category))}
---

${articleData.content}`;
      
      fs.writeFileSync(contentFilePath, markdownContent, 'utf8');
      console.log(`📄 Full article content saved to ${contentFilePath}`);
      
      return true;
    } else {
      throw new Error('Could not find blogPosts array in blog-data.ts');
    }
  } catch (error) {
    console.error('❌ Error saving article to blog data:', error.message);
    throw error;
  }
}

/**
 * Generate a better excerpt from article content
 */
function generateExcerpt(content) {
  // Remove markdown formatting
  const cleanContent = content
    .replace(/^#+\s+/gm, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .trim();
  
  // Get first meaningful paragraph
  const paragraphs = cleanContent.split('\n\n').filter(p => p.trim().length > 50);
  
  if (paragraphs.length > 0) {
    const firstParagraph = paragraphs[0].trim();
    // Truncate to ~150 characters at word boundary
    if (firstParagraph.length > 150) {
      const truncated = firstParagraph.substring(0, 150);
      const lastSpace = truncated.lastIndexOf(' ');
      return truncated.substring(0, lastSpace) + '...';
    }
    return firstParagraph;
  }
  
  // Fallback to first 150 characters
  return cleanContent.substring(0, 150).trim() + '...';
}

/**
 * Generate keywords based on content and category
 */
function generateKeywords(content, category) {
  const commonKeywords = {
    ai: ['AI', 'artificial intelligence', 'machine learning', 'technology', 'innovation'],
    blockchain: ['blockchain', 'cryptocurrency', 'DeFi', 'smart contracts', 'decentralization'],
    technology: ['technology', 'innovation', 'digital transformation', 'future tech']
  };
  
  const baseKeywords = commonKeywords[category] || commonKeywords.technology;
  
  // Extract additional keywords from content
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const wordFreq = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  // Get most frequent words
  const frequentWords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
    return [...baseKeywords, ...frequentWords].slice(0, 6);
}

export { generateArticle };
