import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI & Blockchain Services | Enterprise Solutions | Fantastic AI Studio",
  description: "Professional AI and blockchain development services for enterprises. Custom solutions including machine learning, smart contracts, DeFi platforms, NFT marketplaces, and enterprise AI automation in USA, UK, and Germany.",
  keywords: [
    // Core Service Keywords
    'AI development services', 'blockchain development services', 'artificial intelligence consulting',
    'enterprise AI solutions', 'machine learning development', 'deep learning services',
    'custom AI development', 'blockchain consulting services', 'smart contract development',
    
    // Technical AI Services
    'predictive analytics development', 'natural language processing services', 'computer vision development',
    'chatbot development services', 'AI automation solutions', 'machine learning model deployment',
    'neural network development', 'MLOps implementation', 'AI integration services',
    'data science consulting', 'AI strategy consulting', 'AI model optimization',
    
    // Blockchain Services
    'DeFi development services', 'NFT marketplace development', 'cryptocurrency development',
    'smart contract auditing', 'blockchain integration services', 'Web3 development',
    'decentralized application development', 'tokenization services', 'DAO development',
    'cross-chain bridge development', 'Layer 2 solutions', 'blockchain security audits',
    
    // Industry Solutions
    'fintech AI solutions', 'healthcare AI development', 'supply chain blockchain',
    'real estate blockchain solutions', 'logistics AI optimization', 'e-commerce AI',
    'trading bot development', 'risk management AI', 'fraud detection AI',
    'recommendation engine development', 'personalization AI', 'voice AI development',
    
    // Enterprise Services
    'enterprise blockchain solutions', 'AI transformation consulting', 'digital transformation AI',
    'business process automation', 'intelligent document processing', 'workflow automation',
    'API development services', 'cloud AI deployment', 'scalable AI architecture',
    
    // Geographic Keywords
    'AI development company USA', 'blockchain services UK', 'enterprise AI Germany',
    'European AI development', 'North American blockchain services', 'international AI consulting',
    
    // Technology Stack
    'Python AI development', 'TensorFlow services', 'PyTorch development', 'Solidity development',
    'Ethereum development services', 'React blockchain apps', 'Node.js API development',
    'AWS AI services', 'Google Cloud AI', 'Azure AI development'
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
    title: 'Professional AI & Blockchain Services | Fantastic AI Studio',
    description: 'Transform your business with custom AI and blockchain solutions. Expert development services for machine learning, smart contracts, DeFi, and enterprise automation.',
    url: 'https://fais.world/services',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://fais.world/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Professional AI and Blockchain Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Blockchain Development Services | Fantastic AI Studio',
    description: 'Professional AI and blockchain development services. Custom enterprise solutions for machine learning, smart contracts, and business automation.',
    images: ['https://fais.world/twitter-services.jpg'],
    creator: '@FantasticAI',
    site: '@FantasticAI',
  },
  alternates: {
    canonical: 'https://fais.world/services',
    languages: {
      'en-US': 'https://fais.world/services',
      'en-GB': 'https://fais.world/en-gb/services',
      'de-DE': 'https://fais.world/de/services',
    },
  },
  other: {
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    'DC.title': 'AI & Blockchain Development Services - Fantastic AI Studio',
    'DC.creator': 'Fantastic AI Studio',
    'DC.subject': 'AI blockchain development services enterprise consulting automation',
    'DC.description': 'Professional AI and blockchain development services for enterprise clients including machine learning, smart contracts, and business automation',
    'DC.publisher': 'Fantastic AI Studio',
    'DC.contributor': 'Fantastic AI Studio Development Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Service',
    'DC.format': 'text/html',
    'DC.identifier': 'https://fais.world/services',
    'DC.source': 'https://fais.world',
    'DC.language': 'en',
    'DC.coverage': 'Worldwide',
    'DC.rights': 'Copyright Fantastic AI Studio',
    'rating': 'general',
    'revisit-after': '3 days',
    'distribution': 'global',
    'target': 'all',
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'FAIS Services',
  },
};

export default function ServicesLayout({
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
            "@type": "Service",
            "name": "AI & Blockchain Development Services",
            "description": "Professional AI and blockchain development services for enterprise clients",
            "url": "https://fais.world/services",
            "provider": {
              "@type": "Organization",
              "name": "Fantastic AI Studio",
              "url": "https://fais.world",
              "logo": {
                "@type": "ImageObject",
                "url": "https://fais.world/logo.png"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX",
                "contactType": "Customer Service",
                "availableLanguage": ["English", "German"]
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "San Francisco",
                "addressRegion": "CA",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://twitter.com/FantasticAI",
                "https://linkedin.com/company/fantastic-ai-studio",
                "https://github.com/fantastic-ai-studio"
              ]
            },
            "serviceType": "Technology Consulting",
            "areaServed": [
              {
                "@type": "Country",
                "name": "United States"
              },
              {
                "@type": "Country", 
                "name": "United Kingdom"
              },
              {
                "@type": "Country",
                "name": "Germany"
              }
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI & Blockchain Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Development Services",
                    "description": "Custom artificial intelligence solutions including machine learning, predictive analytics, and automation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Blockchain Development Services", 
                    "description": "Smart contracts, DeFi platforms, NFT marketplaces, and Web3 applications"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Enterprise Consulting",
                    "description": "Strategic AI and blockchain consulting for digital transformation"
                  }
                }
              ]            },
            "inLanguage": "en-US",
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
                  "name": "Services",
                  "item": "https://fais.world/services"
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
