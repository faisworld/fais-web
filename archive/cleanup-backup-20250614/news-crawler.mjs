/**
 * News Crawler for AI and Blockchain Topics
 * Crawls multiple news sources to gather latest AI and blockchain news
 * for automated article generation
 */

import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { config } from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '..', '.env.local') });

// News sources focused on AI and Blockchain
const NEWS_SOURCES = [
  {
    name: 'AI News',
    urls: [
      'https://www.artificialintelligence-news.com/',
      'https://venturebeat.com/ai/',
      'https://techcrunch.com/category/artificial-intelligence/',
      'https://www.theverge.com/ai-artificial-intelligence'
    ]
  },
  {
    name: 'Blockchain News',
    urls: [
      'https://cointelegraph.com/',
      'https://decrypt.co/',
      'https://www.coindesk.com/',
      'https://blockworks.co/'
    ]
  }
];

/**
 * Crawl a webpage for news articles
 */
async function crawlWebpage(url) {
  try {
    console.log(`Crawling: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      console.log(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract article headlines and links
    const articles = [];
    
    // Common selectors for news articles
    const selectors = [
      'article h2 a',
      'article h3 a', 
      '.post-title a',
      '.entry-title a',
      'h2.title a',
      'h3.title a',
      '.headline a',
      '.story-headline a',
      '.article-title a'
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const title = element.textContent?.trim();
        const link = element.href;
        
        if (title && link && title.length > 20) {
          // Filter for AI and blockchain related content
          const lowerTitle = title.toLowerCase();
          const isRelevant = 
            lowerTitle.includes('ai') ||
            lowerTitle.includes('artificial intelligence') ||
            lowerTitle.includes('machine learning') ||
            lowerTitle.includes('blockchain') ||
            lowerTitle.includes('crypto') ||
            lowerTitle.includes('bitcoin') ||
            lowerTitle.includes('ethereum') ||
            lowerTitle.includes('defi') ||
            lowerTitle.includes('smart contract') ||
            lowerTitle.includes('nft') ||
            lowerTitle.includes('web3');

          if (isRelevant) {
            articles.push({
              title: title,
              url: link.startsWith('http') ? link : new URL(link, url).href,
              source: new URL(url).hostname
            });
          }
        }
      });
    }

    return articles.slice(0, 5); // Return top 5 articles per source
  } catch (error) {
    console.error(`Error crawling ${url}:`, error.message);
    return null;
  }
}

/**
 * Get article content from URL
 */
async function getArticleContent(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) return null;

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove unwanted elements
    ['script', 'style', 'nav', 'footer', 'aside', 'form', '.ad', '.advertisement'].forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Extract main content
    let content = '';
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content', 
      '.article-content',
      '.story-body',
      '.content',
      'main'
    ];

    for (const selector of contentSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        content = element.textContent?.trim() || '';
        break;
      }
    }

    // Fallback to paragraphs
    if (!content) {
      const paragraphs = document.querySelectorAll('p');
      content = Array.from(paragraphs)
        .map(p => p.textContent?.trim())
        .filter(text => text && text.length > 50)
        .join('\n\n');
    }

    return content.slice(0, 2000); // Limit content length
  } catch (error) {
    console.error(`Error getting content from ${url}:`, error.message);
    return null;
  }
}

/**
 * Crawl latest news from all sources
 */
async function crawlLatestNews() {
  console.log('🔍 Starting news crawl for latest AI and Blockchain articles...');
  
  const allArticles = [];
  
  for (const source of NEWS_SOURCES) {
    console.log(`\n📰 Crawling ${source.name} sources...`);
    
    for (const url of source.urls) {
      const articles = await crawlWebpage(url);
      if (articles && articles.length > 0) {
        allArticles.push(...articles);
        console.log(`  ✅ Found ${articles.length} relevant articles from ${new URL(url).hostname}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Remove duplicates and sort by relevance
  const uniqueArticles = allArticles.filter((article, index, self) =>
    index === self.findIndex(a => a.title === article.title)
  );

  console.log(`\n📊 Total unique articles found: ${uniqueArticles.length}`);
  
  // Get content for top articles
  const articlesWithContent = [];
  const topArticles = uniqueArticles.slice(0, 10); // Process top 10
  
  for (const article of topArticles) {
    console.log(`📖 Getting content for: ${article.title.slice(0, 60)}...`);
    const content = await getArticleContent(article.url);
    
    if (content && content.length > 200) {
      articlesWithContent.push({
        ...article,
        content: content,
        timestamp: new Date().toISOString()
      });
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (articlesWithContent.length >= 4) break; // We only need 3-4 articles
  }

  console.log(`\n✅ Successfully processed ${articlesWithContent.length} articles with content`);
  return articlesWithContent;
}

/**
 * Generate article topics based on latest news
 */
function generateArticleTopicsFromNews(newsArticles) {
  const topics = [];
  
  // Analyze news articles to generate relevant topics
  newsArticles.forEach(article => {
    const title = article.title.toLowerCase();
    const content = article.content.toLowerCase();
    
    // AI-focused topics
    if (title.includes('ai') || title.includes('artificial intelligence') || 
        title.includes('machine learning') || content.includes('ai ')) {
      topics.push({
        topic: `Latest AI Advancements: ${article.title.split(':')[0]}`,
        keywords: ['AI', 'artificial intelligence', 'machine learning', 'technology', 'innovation'],
        sourceArticle: article,
        category: 'ai'
      });
    }
    
    // Blockchain-focused topics  
    if (title.includes('blockchain') || title.includes('crypto') || 
        title.includes('bitcoin') || title.includes('ethereum') || 
        title.includes('defi') || title.includes('web3')) {
      topics.push({
        topic: `Blockchain Innovation: ${article.title.split(':')[0]}`,
        keywords: ['blockchain', 'cryptocurrency', 'DeFi', 'Web3', 'smart contracts'],
        sourceArticle: article,
        category: 'blockchain'
      });
    }
    
    // Combined AI + Blockchain topics
    if ((title.includes('ai') || content.includes('artificial intelligence')) && 
        (title.includes('blockchain') || content.includes('crypto'))) {
      topics.push({
        topic: `AI and Blockchain Convergence: ${article.title}`,
        keywords: ['AI', 'blockchain', 'technology convergence', 'innovation', 'future tech'],
        sourceArticle: article,
        category: 'technology'
      });
    }
  });
  
  return topics.slice(0, 3); // Return top 3 topics
}

export { crawlLatestNews, generateArticleTopicsFromNews };

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  crawlLatestNews()
    .then(articles => {
      console.log('\n🎯 Latest News Articles:');
      articles.forEach((article, index) => {
        console.log(`\n${index + 1}. ${article.title}`);
        console.log(`   Source: ${article.source}`);
        console.log(`   URL: ${article.url}`);
        console.log(`   Content: ${article.content.slice(0, 200)}...`);
      });
      
      const topics = generateArticleTopicsFromNews(articles);
      console.log('\n📝 Generated Article Topics:');
      topics.forEach((topic, index) => {
        console.log(`\n${index + 1}. ${topic.topic}`);
        console.log(`   Keywords: ${topic.keywords.join(', ')}`);
        console.log(`   Category: ${topic.category}`);
      });
    })
    .catch(error => {
      console.error('Error crawling news:', error);
      process.exit(1);
    });
}
