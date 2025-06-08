// Website Content Scraper for Knowledge Base
import fs from 'fs/promises'
import path from 'path'

export interface PageContent {
  url: string
  title: string
  description: string
  content: string
  headings: string[]
  links: string[]
  lastModified: string
}

export interface CompanyKnowledgeBase {
  companyInfo: CompanyInfo
  services: ServiceInfo[]
  websiteContent: PageContent[]
  blogPosts: BlogPost[]
  faqs: FAQ[]
  technicalSpecs: TechnicalInfo[]
}

export interface CompanyInfo {
  name: string
  website: string
  mission: string
  vision: string
  establishedYear: number
  headquarters: string[]
  targetMarkets: string[]
  clientSatisfactionRate: string
  keyAchievements: string[]
  companyValues: string[]
}

export interface ServiceInfo {
  name: string
  category: string
  description: string
  features: string[]
  benefits: string[]
  targetClients: string[]
  pricing: string
  deliveryTime: string
}

export interface BlogPost {
  title: string
  slug: string
  excerpt: string
  content: string
  publishedDate: string
  tags: string[]
  author: string
}

export interface FAQ {
  question: string
  answer: string
  category: string
}

export interface TechnicalInfo {
  technology: string
  description: string
  applications: string[]
  advantages: string[]
}

export class ContentScraper {
  private baseDir: string
  
  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir
  }

  /**
   * Get comprehensive company knowledge base
   */
  async getCompanyKnowledgeBase(): Promise<CompanyKnowledgeBase> {
    const [
      companyInfo,
      services,
      websiteContent,
      blogPosts,
      faqs,
      technicalSpecs
    ] = await Promise.all([
      this.getCompanyInfo(),
      this.getServicesInfo(),
      this.scrapeWebsiteContent(),
      this.getBlogPosts(),
      this.getFAQs(),
      this.getTechnicalSpecs()
    ])

    return {
      companyInfo,
      services,
      websiteContent,
      blogPosts,
      faqs,
      technicalSpecs
    }
  }

  /**
   * Scrape all website pages for content
   */
  async scrapeWebsiteContent(): Promise<PageContent[]> {
    const pages: PageContent[] = []
    
    // Define all pages to scrape
    const pagePaths = [
      '/app/page.tsx',
      '/app/about/page.tsx',
      '/app/services/page.tsx',
      '/app/ai-services/page.tsx',
      '/app/blockchain-services/page.tsx',
      '/app/projects/page.tsx',
      '/app/contact/page.tsx',
      '/app/gallery/page.tsx',
      '/app/blog/page.tsx',
      '/app/privacy-policy/page.tsx',
      '/app/terms-of-use/page.tsx'
    ]

    for (const pagePath of pagePaths) {
      try {
        const fullPath = path.join(this.baseDir, pagePath)
        const content = await this.extractPageContent(fullPath, pagePath)
        if (content) {
          pages.push(content)
        }
      } catch (error) {
        console.warn(`Failed to scrape ${pagePath}:`, error)
      }
    }

    return pages
  }

  /**
   * Extract content from a React page file
   */
  private async extractPageContent(filePath: string, urlPath: string): Promise<PageContent | null> {
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      
      // Extract text content from JSX
      const textContent = this.extractTextFromJSX(fileContent)
      const headings = this.extractHeadings(fileContent)
      const title = this.extractTitle(fileContent, urlPath)
      const description = this.extractDescription(fileContent)
      
      return {
        url: urlPath.replace('/app', '').replace('/page.tsx', '') || '/',
        title,
        description,
        content: textContent,
        headings,
        links: [],
        lastModified: new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error reading ${filePath}:`, error)
      return null
    }
  }

  /**
   * Extract readable text content from JSX
   */  private extractTextFromJSX(jsx: string): string {
    // Remove imports, exports, and function declarations
    const content = jsx
      .replace(/^import.*$/gm, '')
      .replace(/^export.*$/gm, '')
      .replace(/function\s+\w+\s*\([^)]*\)\s*{/g, '')
      .replace(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/g, '')
    
    // Extract text from JSX elements
    const textMatches = content.match(/>([^<>]+)</g) || []
    const textContent = textMatches
      .map(match => match.replace(/^>|<$/g, '').trim())
      .filter(text => text.length > 0 && !text.match(/^[{}()[\].,;:]+$/))
      .join(' ')
    
    // Extract alt text and aria labels
    const altMatches = content.match(/alt=["']([^"']+)["']/g) || []
    const altText = altMatches
      .map(match => match.replace(/alt=["']|["']/g, ''))
      .join(' ')
    
    return `${textContent} ${altText}`.trim()
  }

  /**
   * Extract headings from JSX
   */
  private extractHeadings(jsx: string): string[] {
    const headingMatches = jsx.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g) || []
    return headingMatches
      .map(match => match.replace(/<[^>]+>/g, '').trim())
      .filter(heading => heading.length > 0)
  }

  /**
   * Extract title from page
   */
  private extractTitle(jsx: string, urlPath: string): string {
    // Look for title in metadata or first h1
    const titleMatch = jsx.match(/<title[^>]*>([^<]+)<\/title>/) || 
                     jsx.match(/<h1[^>]*>([^<]+)<\/h1>/)
    
    if (titleMatch) {
      return titleMatch[1].trim()
    }
    
    // Generate title from URL path
    const pathSegments = urlPath.split('/').filter(Boolean)
    if (pathSegments.length === 0) return 'Fantastic AI Studio - Home'
    
    const lastSegment = pathSegments[pathSegments.length - 1]
    return `${lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace('-', ' ')} - Fantastic AI Studio`
  }

  /**
   * Extract description from page
   */
  private extractDescription(jsx: string): string {
    const descMatch = jsx.match(/description[:=]\s*["']([^"']+)["']/) ||
                     jsx.match(/<meta[^>]*description[^>]*content=["']([^"']+)["']/)
    
    if (descMatch) {
      return descMatch[1].trim()
    }
    
    return 'Fantastic AI Studio - Leading provider of enterprise AI development and blockchain solutions'
  }

  /**
   * Get comprehensive company information
   */
  private async getCompanyInfo(): Promise<CompanyInfo> {
    return {
      name: "Fantastic AI Studio",
      website: "https://fais.world",
      mission: "Leading provider of enterprise AI development, blockchain solutions, and smart contract development",
      vision: "To revolutionize business operations through cutting-edge AI and blockchain technologies",
      establishedYear: 2020,
      headquarters: ["Los Angeles, CA", "London, UK", "Berlin, Germany"],
      targetMarkets: ["USA", "UK", "Germany", "Spain", "Global Enterprise Market"],
      clientSatisfactionRate: "95%",
      keyAchievements: [
        "Successfully delivered 200+ AI projects",
        "Served 50+ Fortune 500 companies",
        "Developed proprietary AI frameworks",
        "Leading blockchain consultancy",
        "Award-winning development team"
      ],
      companyValues: [
        "Innovation Excellence",
        "Client Success Focus",
        "Technical Mastery",
        "Ethical AI Development",
        "Continuous Learning"
      ]
    }
  }

  /**
   * Get detailed services information
   */
  private async getServicesInfo(): Promise<ServiceInfo[]> {
    return [
      {
        name: "Enterprise AI Development",
        category: "Artificial Intelligence",
        description: "Custom AI solutions for enterprise clients including machine learning models, natural language processing, and computer vision applications",
        features: [
          "Custom Machine Learning Models",
          "Natural Language Processing",
          "Computer Vision Systems",
          "Predictive Analytics",
          "AI Strategy Consulting",
          "Model Deployment & Scaling"
        ],
        benefits: [
          "Increased operational efficiency",
          "Data-driven decision making",
          "Automated business processes",
          "Competitive advantage through AI",
          "Scalable AI infrastructure"
        ],
        targetClients: ["Fortune 500 Companies", "Large Enterprises", "Scale-ups"],
        pricing: "Custom quotes based on project scope",
        deliveryTime: "3-12 months depending on complexity"
      },
      {
        name: "Blockchain Solutions",
        category: "Blockchain Technology",
        description: "Comprehensive blockchain development including smart contracts, DeFi platforms, and custom blockchain applications",
        features: [
          "Smart Contract Development",
          "DeFi Platform Creation",
          "Blockchain Architecture",
          "Token Development",
          "Security Audits",
          "Cross-chain Solutions"
        ],
        benefits: [
          "Decentralized operations",
          "Enhanced security",
          "Transparency & trust",
          "Reduced intermediary costs",
          "Global accessibility"
        ],
        targetClients: ["FinTech Companies", "Enterprise Clients", "Crypto Projects"],
        pricing: "Starting from $50,000",
        deliveryTime: "2-8 months"
      },
      {
        name: "Smart Contract Development",
        category: "Blockchain Technology",
        description: "Secure and efficient smart contract development for various blockchain platforms",
        features: [
          "Ethereum Smart Contracts",
          "Solidity Development",
          "Contract Auditing",
          "Gas Optimization",
          "Multi-chain Support",
          "Security Testing"
        ],
        benefits: [
          "Automated execution",
          "Reduced costs",
          "Enhanced security",
          "Transparency",
          "Trustless operations"
        ],
        targetClients: ["DeFi Projects", "Enterprise Blockchain Solutions", "Token Projects"],
        pricing: "Starting from $10,000",
        deliveryTime: "2-6 weeks"
      },
      {
        name: "DeFi Platform Development",
        category: "Decentralized Finance",
        description: "End-to-end DeFi platform development including DEXs, lending protocols, and yield farming platforms",
        features: [
          "Decentralized Exchanges (DEX)",
          "Lending Protocols",
          "Yield Farming Platforms",
          "Liquidity Mining",
          "Cross-chain Bridges",
          "Governance Tokens"
        ],
        benefits: [
          "Financial innovation",
          "Global accessibility",
          "High yield opportunities",
          "Decentralized governance",
          "Composable protocols"
        ],
        targetClients: ["DeFi Startups", "Financial Institutions", "Crypto Investment Firms"],
        pricing: "Starting from $100,000",
        deliveryTime: "4-12 months"
      },
      {
        name: "AI Consulting Services",
        category: "Consulting",
        description: "Strategic AI consulting to help businesses identify opportunities and implement AI solutions",
        features: [
          "AI Strategy Development",
          "Technology Assessment",
          "ROI Analysis",
          "Implementation Planning",
          "Team Training",
          "Ongoing Support"
        ],
        benefits: [
          "Strategic AI roadmap",
          "Risk mitigation",
          "Faster implementation",
          "Knowledge transfer",
          "Competitive insights"
        ],
        targetClients: ["C-Level Executives", "Enterprise IT Teams", "Innovation Departments"],
        pricing: "Starting from $5,000/month",
        deliveryTime: "Ongoing engagement"
      }
    ]
  }

  /**
   * Get blog posts information
   */
  private async getBlogPosts(): Promise<BlogPost[]> {
    return [
      {
        title: "The Future of Enterprise AI: Trends and Predictions for 2024",
        slug: "future-enterprise-ai-2024",
        excerpt: "Exploring the latest trends in enterprise AI development and what businesses can expect in 2024",
        content: "Enterprise AI is rapidly evolving with new breakthrough technologies...",
        publishedDate: "2024-01-15",
        tags: ["AI", "Enterprise", "Trends", "Machine Learning"],
        author: "Fantastic AI Studio Team"
      },
      {
        title: "Smart Contract Security: Best Practices for Developers",
        slug: "smart-contract-security-best-practices",
        excerpt: "Essential security practices for developing secure and efficient smart contracts",
        content: "Smart contract security is paramount in blockchain development...",
        publishedDate: "2024-01-10",
        tags: ["Blockchain", "Smart Contracts", "Security", "Best Practices"],
        author: "Fantastic AI Studio Team"
      },
      {
        title: "DeFi Revolution: How Decentralized Finance is Changing Traditional Banking",
        slug: "defi-revolution-traditional-banking",
        excerpt: "An in-depth look at how DeFi protocols are disrupting traditional financial services",
        content: "Decentralized Finance (DeFi) represents a paradigm shift in financial services...",
        publishedDate: "2024-01-05",
        tags: ["DeFi", "Finance", "Blockchain", "Innovation"],
        author: "Fantastic AI Studio Team"
      }
    ]
  }

  /**
   * Get frequently asked questions
   */
  private async getFAQs(): Promise<FAQ[]> {
    return [
      {
        question: "What makes Fantastic AI Studio different from other AI development companies?",
        answer: "We specialize exclusively in enterprise-grade AI solutions with a focus on Fortune 500 clients. Our 95% client satisfaction rate and comprehensive approach from strategy to deployment sets us apart.",
        category: "Company"
      },
      {
        question: "How long does it typically take to develop a custom AI solution?",
        answer: "Development time varies based on project complexity, typically ranging from 3-12 months. We provide detailed timelines during our initial consultation phase.",
        category: "AI Development"
      },
      {
        question: "Do you provide ongoing support after project completion?",
        answer: "Yes, we offer comprehensive post-deployment support including maintenance, updates, monitoring, and scaling assistance to ensure long-term success.",
        category: "Support"
      },
      {
        question: "What blockchain platforms do you work with?",
        answer: "We develop on multiple blockchain platforms including Ethereum, Polygon, Binance Smart Chain, Solana, and other leading networks based on project requirements.",
        category: "Blockchain"
      },
      {
        question: "Can you help with AI strategy and planning?",
        answer: "Absolutely. Our AI consulting services help businesses identify opportunities, develop strategic roadmaps, and plan implementations for maximum ROI.",
        category: "Consulting"
      }
    ]
  }

  /**
   * Get technical specifications and information
   */
  private async getTechnicalSpecs(): Promise<TechnicalInfo[]> {
    return [
      {
        technology: "Machine Learning Frameworks",
        description: "Advanced ML frameworks for enterprise AI development",
        applications: ["Predictive Analytics", "Natural Language Processing", "Computer Vision", "Recommendation Systems"],
        advantages: ["Scalability", "Performance", "Flexibility", "Enterprise Integration"]
      },
      {
        technology: "Blockchain Platforms",
        description: "Multi-chain blockchain development capabilities",
        applications: ["Smart Contracts", "DeFi Protocols", "NFT Platforms", "Cross-chain Solutions"],
        advantages: ["Security", "Decentralization", "Transparency", "Global Accessibility"]
      },
      {
        technology: "Cloud Infrastructure",
        description: "Enterprise-grade cloud deployment and scaling",
        applications: ["AI Model Hosting", "Blockchain Nodes", "Data Processing", "API Services"],
        advantages: ["Reliability", "Scalability", "Security", "Cost Efficiency"]
      },
      {
        technology: "Security Protocols",
        description: "Comprehensive security measures for AI and blockchain systems",
        applications: ["Smart Contract Audits", "AI Model Protection", "Data Encryption", "Access Control"],
        advantages: ["Risk Mitigation", "Compliance", "Trust", "Data Protection"]
      }
    ]
  }
}

export default ContentScraper
