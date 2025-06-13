# Enhanced Automated Article Generation System

## Overview

This document describes the enhanced automated article generation system that addresses all the key requirements:

1. **Prevents duplicate articles** through advanced content similarity detection
2. **Manual generation on localhost** vs **automated on production**
3. **Simultaneous image generation** stored in Vercel Blobstore
4. **Knowledge base updates** for O3 LLM assistant
5. **Web crawling for latest AI/blockchain news** to generate timely articles
6. **AI and blockchain focused keywords** with intelligent categorization

## System Architecture

### Core Components

#### 1. News Crawler (`scripts/news-crawler.mjs`)
- **Purpose**: Crawls latest AI and blockchain news from multiple sources
- **Sources**: TechCrunch, VentureBeat, Cointelegraph, Decrypt, CoinDesk, etc.
- **Features**:
  - Intelligent content filtering for AI/blockchain relevance
  - Rate limiting to avoid being blocked
  - Content extraction and summarization
  - Topic generation based on trending news

#### 2. Duplicate Detection (`scripts/duplicate-detection.mjs`)
- **Purpose**: Prevents generation of similar or duplicate articles
- **Features**:
  - Jaccard similarity calculation for content comparison
  - Key phrase extraction and matching
  - Content hash storage for future reference
  - Configurable similarity thresholds (default: 65%)

#### 3. Enhanced Article Generator (`scripts/article-generator.mjs`)
- **Purpose**: Generates high-quality articles with images
- **Features**:
  - Advanced content analysis for category detection
  - Smart excerpt generation
  - Keyword extraction from content
  - Simultaneous image generation using Google Imagen 4
  - Enhanced duplicate checking before saving

#### 4. Automated Generation Script (`scripts/automated-article-generation.mjs`)
- **Purpose**: Orchestrates the entire automated generation process
- **Features**:
  - News crawling integration
  - Fallback to predefined topics if news unavailable
  - Duplicate prevention workflow
  - Knowledge base updates
  - Production environment detection

### API Endpoints

#### 1. Production Cron Job (`/api/cron/automated-article-generation`)
- **Purpose**: Automated article generation for production
- **Authentication**: Internal API key required
- **Features**:
  - Forces production environment settings
  - Extended timeout for news crawling (10 minutes)
  - Detailed execution statistics
  - Error handling and reporting

#### 2. Manual Generation (`/api/admin/manual-article-generation`)
- **Purpose**: Manual article generation for localhost testing
- **Authentication**: Admin panel authentication
- **Features**:
  - Custom topic specification
  - Parameter control (tone, word count, etc.)
  - Automated generation testing mode
  - Immediate feedback and results

## Workflow

### Automated Production Workflow

1. **Trigger**: Cron job (every 12 hours)
2. **News Crawling**: Fetch latest AI/blockchain news (3-4 articles)
3. **Topic Generation**: Create article topics based on news
4. **Duplicate Check**: Verify content uniqueness
5. **Article Generation**: Create article with GPT-4o + image with Imagen 4
6. **Content Storage**: Save to blog data and Vercel Blobstore
7. **Knowledge Base Update**: Update RAG system for O3 assistant
8. **Sitemap Update**: Refresh SEO sitemaps

### Manual Development Workflow

1. **Admin Access**: Login to localhost admin panel
2. **Topic Selection**: Choose custom topic or test automated mode
3. **Parameter Setting**: Configure tone, word count, keywords
4. **Generation**: Execute with immediate feedback
5. **Review**: Check generated content and images
6. **Save**: Optional save to blog system

## Key Features

### 1. Duplicate Prevention
- **Content Similarity**: Uses Jaccard similarity algorithm
- **Title Matching**: Checks for similar titles using key words
- **Hash Storage**: Stores content hashes for quick future checks
- **Phrase Analysis**: Extracts and compares key phrases
- **Configurable Thresholds**: Adjustable similarity limits

### 2. News Integration
- **Multiple Sources**: Covers major AI and blockchain news sites
- **Content Filtering**: Only processes relevant articles
- **Topic Generation**: Creates article ideas from trending news
- **Fallback System**: Uses predefined topics if news unavailable
- **Rate Limiting**: Respects site policies and avoids blocking

### 3. Image Generation
- **Simultaneous Creation**: Images generated during article creation
- **High Quality**: Uses Google Imagen 4 for best results
- **Professional Prompts**: Enhanced prompts for corporate-style images
- **Blobstore Storage**: Direct upload to Vercel Blob Storage
- **Fallback Handling**: Graceful degradation if image generation fails

### 4. Knowledge Base Integration
- **O3 LLM Updates**: Automatic knowledge base refresh
- **Blog Content Indexing**: New articles added to RAG system
- **General Website Crawling**: Comprehensive site content update
- **Vector Embeddings**: OpenAI embeddings for semantic search

### 5. Environment Separation
- **Production Mode**: Automated generation with internal API key
- **Development Mode**: Manual generation with admin authentication
- **URL Detection**: Automatic API endpoint selection
- **Configuration**: Environment-specific settings

## Installation and Setup

### Dependencies
```bash
npm install jsdom node-fetch
```

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key
INTERNAL_API_KEY=your_internal_api_key_for_cron
DATABASE_URL=your_neon_postgres_url
NEXT_PUBLIC_SITE_URL=https://fais.world
```

### File Structure
```
scripts/
├── news-crawler.mjs              # News crawling functionality
├── duplicate-detection.mjs       # Duplicate prevention system
├── article-generator.mjs         # Enhanced article generation
├── automated-article-generation.mjs  # Main automation script
├── test-article-system.mjs       # Testing script
└── content-hashes.json          # Duplicate detection cache

app/api/
├── cron/automated-article-generation/  # Production cron endpoint
└── admin/manual-article-generation/    # Development endpoint
```

## Usage

### Production Deployment
1. Set up cron job or use Vercel Cron
2. Configure internal API key authentication
3. Monitor execution logs
4. Check generated articles in admin panel

### Development Testing
1. Start localhost server (`npm run dev`)
2. Access admin panel
3. Use manual generation endpoint
4. Test automated mode with news crawling

### Testing
```bash
# Run comprehensive system test
node scripts/test-article-system.mjs

# Test news crawler only
node scripts/news-crawler.mjs

# Test automated generation
node scripts/automated-article-generation.mjs
```

## Configuration

### News Sources
Modify `NEWS_SOURCES` in `news-crawler.mjs` to add/remove news sites:
```javascript
const NEWS_SOURCES = [
  {
    name: 'AI News',
    urls: ['https://www.artificialintelligence-news.com/', ...]
  }
];
```

### Similarity Thresholds
Adjust duplicate detection sensitivity in automated generation:
```javascript
const duplicateCheck = await checkForDuplicates(
  title, 
  content,
  0.65 // Threshold: 0.5 = loose, 0.8 = strict
);
```

### Fallback Topics
Update fallback topics for when news crawling fails:
```javascript
const FALLBACK_TOPICS = [
  "Latest advancements in large language models and AI reasoning",
  // Add more topics...
];
```

## Monitoring and Maintenance

### Success Metrics
- Articles generated per run
- Duplicate articles prevented
- News sources successfully crawled
- Image generation success rate
- Knowledge base update completion

### Error Handling
- Network timeout handling for news crawling
- Graceful degradation when APIs fail
- Comprehensive logging for debugging
- Automatic cleanup of temporary files

### Performance Optimization
- Rate limiting for external API calls
- Efficient duplicate detection algorithms
- Optimized content processing
- Minimal database queries

## Troubleshooting

### Common Issues

1. **News Crawling Fails**
   - Check network connectivity
   - Verify news source URLs are accessible
   - Review rate limiting settings

2. **Duplicate Articles Generated**
   - Lower similarity threshold
   - Check content hash storage
   - Verify duplicate detection is running

3. **Image Generation Fails**
   - Check OpenAI API key and quota
   - Verify Vercel Blob Storage configuration
   - Review image generation prompts

4. **Knowledge Base Not Updating**
   - Check database connection
   - Verify RAG update scripts
   - Review OpenAI embedding API status

### Logs and Debugging
- Enable detailed logging in development
- Monitor cron job execution logs
- Check admin panel for generation history
- Review browser network tab for API calls

## Future Enhancements

1. **Advanced News Analysis**: AI-powered content analysis and trending topic detection
2. **Multi-language Support**: Generate articles in multiple languages
3. **Social Media Integration**: Share generated articles automatically
4. **Analytics Dashboard**: Detailed metrics and performance tracking
5. **Custom AI Models**: Fine-tuned models for specific content types
6. **Advanced Image Prompts**: Dynamic prompt generation based on content analysis

## Conclusion

This enhanced automated article generation system provides a robust, scalable solution for creating high-quality, unique content while maintaining separation between manual and automated processes. The integration of news crawling, duplicate detection, and simultaneous image generation ensures consistent, valuable content for the O3 LLM assistant and website visitors.
