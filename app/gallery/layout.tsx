import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI & Blockchain Project Gallery | Fantastic AI Studio Portfolio",
  description: "Explore our visual portfolio of AI and blockchain projects. View screenshots, demos, and case studies of our successful implementations including DeFi platforms, AI applications, Web3 games, and enterprise solutions.",
  keywords: [
    // Core Gallery Keywords
    'AI project gallery', 'blockchain project portfolio', 'AI development showcase', 'blockchain development gallery',
    'enterprise AI portfolio', 'DeFi project gallery', 'Web3 project showcase', 'AI application screenshots',
    
    // Project Types
    'AI project case studies', 'blockchain project demos', 'smart contract portfolio', 'NFT marketplace gallery',
    'DEX development showcase', 'Layer 2 project gallery', 'machine learning project portfolio',
    'predictive analytics showcase', 'chatbot development gallery', 'AI automation portfolio',
    
    // Visual Content Keywords
    'AI project screenshots', 'blockchain app demos', 'DeFi platform gallery', 'Web3 game screenshots',
    'enterprise AI visuals', 'technology project portfolio', 'development work showcase',
    'AI blockchain project images', 'software development gallery', 'tech innovation showcase',
    
    // Industry Solutions
    'fintech project gallery', 'healthcare AI showcase', 'supply chain blockchain portfolio',
    'e-commerce AI gallery', 'trading platform showcase', 'enterprise automation portfolio',
    'business intelligence gallery', 'data visualization portfolio', 'API development showcase',
    
    // Geographic Keywords
    'AI project portfolio USA', 'blockchain gallery UK', 'enterprise portfolio Germany',
    'European AI showcase', 'North American blockchain gallery', 'international project portfolio',
    
    // Technology Stack
    'React project gallery', 'Next.js portfolio', 'Python AI showcase', 'Solidity project gallery',
    'TensorFlow project portfolio', 'blockchain development showcase', 'full-stack development gallery'
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
    title: 'AI & Blockchain Project Gallery | Fantastic AI Studio',
    description: 'Explore our visual portfolio of successful AI and blockchain projects. View demos, screenshots, and case studies of enterprise solutions.',
    url: 'https://fais.world/gallery',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://fais.world/og-gallery.jpg',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Project Gallery and Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI & Blockchain Project Gallery | Fantastic AI Studio',
    description: 'Visual portfolio of our AI and blockchain development projects. Explore demos, screenshots, and case studies.',
    images: ['https://fais.world/twitter-gallery.jpg'],
    creator: '@FantasticAI',
    site: '@FantasticAI',
  },
  alternates: {
    canonical: 'https://fais.world/gallery',
    languages: {
      'en-US': 'https://fais.world/gallery',
      'en-GB': 'https://fais.world/en-gb/gallery',
      'de-DE': 'https://fais.world/de/gallery',
    },
  },
  other: {
    'geo.region': 'US-CA',
    'geo.placename': 'San Francisco',
    'geo.position': '37.7749;-122.4194',
    'ICBM': '37.7749, -122.4194',
    'DC.title': 'AI & Blockchain Project Gallery - Fantastic AI Studio',
    'DC.creator': 'Fantastic AI Studio',
    'DC.subject': 'AI blockchain project portfolio gallery showcase development',
    'DC.description': 'Visual portfolio and gallery of AI and blockchain development projects including demos, screenshots, and case studies',
    'DC.publisher': 'Fantastic AI Studio',
    'DC.contributor': 'Fantastic AI Studio Development Team',
    'DC.date': new Date().toISOString(),
    'DC.type': 'Portfolio',
    'DC.format': 'text/html',
    'DC.identifier': 'https://fais.world/gallery',
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
    'apple-mobile-web-app-title': 'FAIS Gallery',
  },
};

export default function GalleryLayout({
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
            "@type": "ImageGallery",
            "name": "AI & Blockchain Project Gallery",
            "description": "Visual portfolio of AI and blockchain development projects by Fantastic AI Studio",
            "url": "https://fais.world/gallery",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Project Portfolio",
              "description": "Collection of AI and blockchain project demonstrations",
              "itemListElement": [
                {
                  "@type": "CreativeWork",
                  "position": 1,
                  "name": "AI Application Portfolio",
                  "description": "Screenshots and demos of custom AI applications and machine learning solutions"
                },
                {
                  "@type": "CreativeWork",
                  "position": 2,
                  "name": "Blockchain Project Showcase", 
                  "description": "Visual demonstrations of DeFi platforms, smart contracts, and Web3 applications"
                },
                {
                  "@type": "CreativeWork",
                  "position": 3,
                  "name": "Enterprise Solution Gallery",
                  "description": "Case studies and visuals of enterprise AI and blockchain implementations"
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
                  "name": "Gallery",
                  "item": "https://fais.world/gallery"
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
