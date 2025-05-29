import { Metadata } from 'next'

// Enhanced metadata for the blog section - comprehensive SEO optimization
export const metadata: Metadata = {
  title: 'AI & Blockchain Blog | Expert Insights from Fantastic AI Studio | Latest Tech Trends',
  description: 'Explore cutting-edge AI and blockchain insights from industry experts. In-depth articles on machine learning, smart contracts, DeFi, enterprise AI solutions, and emerging technologies. Stay ahead with comprehensive analysis and practical guides.',
  keywords: [
    // Primary blog keywords
    'AI blog articles expert insights',
    'blockchain technology blog',
    'artificial intelligence latest trends',
    'machine learning industry analysis',
    'smart contracts development guides',
    
    // Topic-specific keywords
    'enterprise AI implementation blog',
    'DeFi blockchain analysis',
    'neural networks deep learning',
    'cryptocurrency technology insights',
    'large language models LLM',
    
    // Geographic and industry keywords
    'AI blockchain blog USA UK Germany',
    'fintech AI insights',
    'healthcare blockchain applications',
    'supply chain AI optimization',
    'predictive analytics machine learning',
    
    // Technical content keywords
    'blockchain development tutorials',
    'AI model training guides',
    'smart contract security',
    'enterprise digital transformation',
    'quantum computing AI applications',
    
    // Competitive keywords
    'leading AI blog technology',
    'expert blockchain analysis',
    'Fortune 500 AI insights',
    'professional developer blog'
  ].join(', '),
  openGraph: {
    title: 'AI & Blockchain Blog | Expert Insights from Fantastic AI Studio',
    description: 'Explore cutting-edge AI and blockchain insights from industry experts. Comprehensive analysis, practical guides, and latest trends in enterprise technology.',
    type: 'website',
    url: 'https://fais.world/blog',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    images: [
      {
        url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-og-image-fais-1200x630-VkQz9xJlMnPr8tW2nY6kDvR5sH4bEf.png',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio Blog - Expert AI and Blockchain Technology Insights',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FantasticAIStudio',
    creator: '@YevhenLukyanov',
    title: 'AI & Blockchain Blog | Expert Tech Insights from Fantastic AI Studio',
    description: 'Cutting-edge AI and blockchain insights from industry experts. Latest trends, practical guides, enterprise solutions.',
    images: [
      {
        url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-twitter-card-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png',
        width: 1200,
        height: 630,
        alt: 'Expert AI & Blockchain Blog - Fantastic AI Studio'
      }
    ]
  },
  alternates: {
    canonical: 'https://fais.world/blog',
    languages: {
      'en-US': 'https://fais.world/blog',
      'en-GB': 'https://fais.world/gb/blog',
      'de-DE': 'https://fais.world/de/blog'
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  other: {
    'article:section': 'Technology Blog',
    'article:tag': 'AI, Blockchain, Machine Learning, Enterprise Technology',
    'og:type': 'blog',
    'blog:author': 'Fantastic AI Studio Team'
  }
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Blog-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Fantastic AI Studio Blog',
            headline: 'AI & Blockchain Technology Expert Insights',
            description: 'Expert insights and analysis on artificial intelligence, blockchain technology, and enterprise digital transformation from industry professionals.',
            url: 'https://fais.world/blog',
            publisher: {
              '@type': 'Organization',
              name: 'Fantastic AI Studio',
              url: 'https://fais.world',
              logo: {
                '@type': 'ImageObject',
                url: 'https://fais.world/logo.png'
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': 'https://fais.world/blog'
            },
            blogPost: [
              {
                '@type': 'BlogPosting',
                headline: 'Latest AI and Blockchain Technology Insights',
                description: 'Stay updated with expert analysis and practical guides',
                author: {
                  '@type': 'Organization',
                  name: 'Fantastic AI Studio'
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Fantastic AI Studio'
                }
              }
            ],
            potentialAction: {
              '@type': 'ReadAction',
              target: 'https://fais.world/blog'
            }
          })
        }}
      />
      {children}
    </>
  )
}
