/**
 * Duplicate Article Detection System
 * Prevents generation of similar or duplicate articles
 */

import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

/**
 * Calculate similarity between two texts using Jaccard similarity
 */
function calculateSimilarity(text1, text2) {
  const normalize = (text) => {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(word => word.length > 2); // Remove short words
  };

  const words1 = new Set(normalize(text1));
  const words2 = new Set(normalize(text2));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Extract key phrases from text for better comparison
 */
function extractKeyPhrases(text) {
  const phrases = [];
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
  
  // Extract 2-3 word phrases
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i].length > 2 && words[i + 1].length > 2) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
      
      if (i < words.length - 2 && words[i + 2].length > 2) {
        phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }
  }
  
  return phrases;
}

/**
 * Check if article is duplicate or too similar to existing articles
 */
async function checkForDuplicates(newTitle, newContent, similarityThreshold = 0.7) {
  try {
    // Read existing blog data
    const blogDataPath = path.join(process.cwd(), 'app', 'blog', 'blog-data.ts');
    const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
    
    // Extract existing titles from blog data
    const titleMatches = blogDataContent.match(/title: "(.*?)"/g) || [];
    const existingTitles = titleMatches.map(match => 
      match.replace(/title: "/, '').replace(/"$/, '')
    );
    
    // Check title similarity
    for (const existingTitle of existingTitles) {
      const titleSimilarity = calculateSimilarity(newTitle, existingTitle);
      
      if (titleSimilarity > similarityThreshold) {
        return {
          isDuplicate: true,
          reason: 'Similar title exists',
          similarTitle: existingTitle,
          similarity: titleSimilarity
        };
      }
    }
    
    // Check content similarity by reading markdown files
    const contentDir = path.join(process.cwd(), 'app', 'blog', 'content');
    
    if (fs.existsSync(contentDir)) {
      const markdownFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
      
      for (const file of markdownFiles) {
        const filePath = path.join(contentDir, file);
        const existingContent = fs.readFileSync(filePath, 'utf8');
        
        // Extract content after frontmatter
        const contentMatch = existingContent.match(/^---[\s\S]*?---\n([\s\S]*)$/);
        const existingArticleContent = contentMatch ? contentMatch[1] : existingContent;
        
        const contentSimilarity = calculateSimilarity(newContent, existingArticleContent);
        
        if (contentSimilarity > similarityThreshold) {
          return {
            isDuplicate: true,
            reason: 'Similar content exists',
            similarFile: file,
            similarity: contentSimilarity
          };
        }
        
        // Check key phrases similarity
        const newPhrases = extractKeyPhrases(newContent);
        const existingPhrases = extractKeyPhrases(existingArticleContent);
        
        const commonPhrases = newPhrases.filter(phrase => 
          existingPhrases.some(existingPhrase => 
            calculateSimilarity(phrase, existingPhrase) > 0.8
          )
        );
        
        const phraseOverlap = commonPhrases.length / Math.max(newPhrases.length, 1);
        
        if (phraseOverlap > 0.5 && commonPhrases.length > 3) {
          return {
            isDuplicate: true,
            reason: 'Similar key phrases found',
            similarFile: file,
            phraseOverlap: phraseOverlap,
            commonPhrases: commonPhrases.slice(0, 5)
          };
        }
      }
    }
    
    return {
      isDuplicate: false,
      reason: 'Content is unique'
    };
    
  } catch (error) {
    console.error('Error checking for duplicates:', error);
    return {
      isDuplicate: false,
      reason: 'Error during duplicate check - proceeding with generation'
    };
  }
}

/**
 * Generate content hash for quick duplicate detection
 */
function generateContentHash(title, content) {
  const normalizedContent = `${title}\n${content}`
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return createHash('sha256').update(normalizedContent).digest('hex');
}

/**
 * Store content hash to prevent future duplicates
 */
async function storeContentHash(title, content) {
  try {
    const hash = generateContentHash(title, content);
    const hashFile = path.join(process.cwd(), 'scripts', 'content-hashes.json');
    
    let hashes = {};
    if (fs.existsSync(hashFile)) {
      hashes = JSON.parse(fs.readFileSync(hashFile, 'utf8'));
    }
    
    hashes[hash] = {
      title,
      timestamp: new Date().toISOString(),
      hash
    };
    
    fs.writeFileSync(hashFile, JSON.stringify(hashes, null, 2));
    
    // Clean old hashes (keep only last 100)
    const hashEntries = Object.entries(hashes);
    if (hashEntries.length > 100) {
      const sortedHashes = hashEntries.sort((a, b) => 
        new Date(b[1].timestamp) - new Date(a[1].timestamp)
      );
      
      const recentHashes = Object.fromEntries(sortedHashes.slice(0, 100));
      fs.writeFileSync(hashFile, JSON.stringify(recentHashes, null, 2));
    }
    
  } catch (error) {
    console.error('Error storing content hash:', error);
  }
}

/**
 * Check if content hash already exists
 */
async function checkContentHash(title, content) {
  try {
    const hash = generateContentHash(title, content);
    const hashFile = path.join(process.cwd(), 'scripts', 'content-hashes.json');
    
    if (!fs.existsSync(hashFile)) {
      return { exists: false };
    }
    
    const hashes = JSON.parse(fs.readFileSync(hashFile, 'utf8'));
    
    if (hashes[hash]) {
      return {
        exists: true,
        existingTitle: hashes[hash].title,
        timestamp: hashes[hash].timestamp
      };
    }
    
    return { exists: false };
    
  } catch (error) {
    console.error('Error checking content hash:', error);
    return { exists: false };
  }
}

export { 
  checkForDuplicates, 
  calculateSimilarity, 
  extractKeyPhrases,
  generateContentHash,
  storeContentHash,
  checkContentHash
};
