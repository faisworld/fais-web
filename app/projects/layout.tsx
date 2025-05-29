import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI & Blockchain Projects Portfolio | Fantastic AI Studio - Enterprise Solutions",
  description: "Explore our successful AI and blockchain projects including DeFi DEX platforms, Web3 games, Layer 2 solutions, NFT marketplaces, smart contract audits, and AI-powered applications for enterprise clients in USA, UK, and Germany.",
  keywords: [
    // Core Business Keywords
    'AI blockchain projects', 'artificial intelligence development', 'blockchain development portfolio',
    'enterprise AI solutions', 'DeFi development', 'Web3 game development', 'smart contract development',
    'NFT marketplace development', 'cryptocurrency exchange development', 'blockchain consulting services',
    
    // Technical Implementation Keywords
    'DEX development uniswap', 'Layer 2 blockchain solutions', 'Optimism OP stack development',
    'cross-chain bridge development', 'smart contract auditing', 'solidity development',
    'ethereum development', 'polygon development', 'BSC development',
    
    // AI & ML Keywords
    'machine learning projects', 'LLM integration', 'AI chatbot development', 'neural network implementation',
    'natural language processing', 'computer vision projects', 'AI automation solutions',
    'predictive analytics', 'AI model deployment', 'MLOps implementation',
    
    // Industry-Specific Keywords
    'fintech blockchain solutions', 'gaming blockchain integration', 'supply chain blockchain',
    'healthcare AI solutions', 'real estate blockchain', 'logistics AI optimization',
    'e-commerce AI integration', 'trading bot development', 'yield farming protocols',
    
    // Geographic Keywords
    'AI development company USA', 'blockchain developers UK', 'enterprise AI Germany',
    'European blockchain development', 'North American AI solutions', 'international tech consulting',
    
    // Project Types
    'custom dApp development', 'tokenomics design', 'governance token creation',
    'staking platform development', 'lending protocol development', 'AMM development',
    'payment gateway blockchain', 'wallet integration services', 'KYC AML solutions'
  ],
  authors: [{ name: 'Fantastic AI Studio' }],
  creator: 'Fantastic AI Studio',
  publisher: 'Fantastic AI Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'AI & Blockchain Projects Portfolio | Fantastic AI Studio',
    description: 'Discover our proven track record in AI and blockchain development. View completed projects including DeFi platforms, Web3 games, Layer 2 solutions, and enterprise AI applications.',
    url: 'https://fais.world/projects',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://fais.world/og-projects.jpg',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - AI and Blockchain Projects Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Blockchain Projects Portfolio | Fantastic AI Studio',
    description: 'Explore our successful AI and blockchain projects. Enterprise-grade solutions for DeFi, Web3 gaming, and AI automation.',
    images: ['https://fais.world/twitter-projects.jpg'],
    creator: '@FantasticAI',
    site: '@FantasticAI',
  },
  alternates: {
    canonical: 'https://fais.world/projects',
    languages: {
      'en-US': 'https://fais.world/projects',
      'en-GB': 'https://fais.world/en-gb/projects',
      'de-DE': 'https://fais.world/de/projects',
    },
  },
  other: {
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    'DC.title': 'AI & Blockchain Projects Portfolio - Fantastic AI Studio',
    'DC.creator': 'Fantastic AI Studio',
    'DC.subject': 'AI blockchain development projects portfolio enterprise solutions',
    'DC.description': 'Portfolio of successful AI and blockchain development projects including DeFi, Web3 gaming, and enterprise solutions',
    'DC.publisher': 'Fantastic AI Studio',
    'DC.contributor': 'Fantastic AI Studio Development Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Portfolio',
    'DC.format': 'text/html',
    'DC.identifier': 'https://fais.world/projects',
    'DC.source': 'https://fais.world',
    'DC.language': 'en',
    'DC.coverage': 'Worldwide',
    'DC.rights': 'Copyright Fantastic AI Studio',
    'rating': 'general',
    'revisit-after': '7 days',
    'distribution': 'global',
    'target': 'all',
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'FAIS Projects',
  },
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AI & Blockchain Projects Portfolio",
            "description": "Portfolio of successful AI and blockchain development projects by Fantastic AI Studio",
            "url": "https://fais.world/projects",
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": 6,
              "itemListElement": [
                {
                  "@type": "SoftwareApplication",
                  "position": 1,
                  "name": "Feemaker.io - Non-Custodial Payment System",
                  "description": "Advanced non-custodial payment system with MetaMask and Telegram wallet integration",
                  "url": "https://feemaker.io",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "position": 2,
                  "name": "Dopple AI - AI Gaming Platform",
                  "description": "AI-driven gaming platform that personalizes the gaming experience",
                  "url": "https://beta.dopple.ai",
                  "applicationCategory": "GameApplication",
                  "operatingSystem": "Web"
                },
                {
                  "@type": "SoftwareApplication",
                  "position": 3,
                  "name": "Degen Kombat - Blockchain Game",
                  "description": "Action-packed blockchain game combining gaming with decentralized finance",
                  "url": "https://degenkombat.com",
                  "applicationCategory": "GameApplication",
                  "operatingSystem": "Web"
                },
                {
                  "@type": "SoftwareApplication",
                  "position": 4,
                  "name": "Heroes of Mavia - Strategic Blockchain Game",
                  "description": "Strategic base-building game powered by blockchain technology",
                  "url": "https://www.mavia.com",
                  "applicationCategory": "GameApplication",
                  "operatingSystem": "Web"
                },
                {
                  "@type": "SoftwareApplication",
                  "position": 5,
                  "name": "WagyuSwap - Multichain DEX",
                  "description": "Decentralized exchange platform with multichain support",
                  "url": "https://wagyuswap.app",
                  "applicationCategory": "FinanceApplication",
                  "operatingSystem": "Web"
                },
                {
                  "@type": "Service",
                  "position": 6,
                  "name": "Layer 2 Launch Services",
                  "description": "Comprehensive Layer 2 blockchain launch services using OP Stack",
                  "provider": {
                    "@type": "Organization",
                    "name": "Fantastic AI Studio",
                    "url": "https://fais.world"
                  },
                  "serviceType": "Blockchain Development"
                }
              ]
            },
            "provider": {
              "@type": "Organization",
              "name": "Fantastic AI Studio",
              "url": "https://fais.world",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fais.world/logo.png"
              },
              "sameAs": [
                "https://twitter.com/FantasticAI",
                "https://linkedin.com/company/fantastic-ai-studio",
                "https://github.com/fantastic-ai-studio"
              ]
            },
            "inLanguage": "en-US",
            "datePublished": "2024-01-01",
            "dateModified": new Date().toISOString(),
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://fais.world"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Projects",
                  "item": "https://fais.world/projects"
                }
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}
