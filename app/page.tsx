import { Metadata } from 'next'
import HomeCarousel from '@/components/pages/HomeCarousel'
import SolutionsSection from '@/components/pages/SolutionsSection'
import ProjectsSection from '@/components/pages/ProjectsSection'
// import TestimonialsSection from '@/components/pages/TestimonialsSection'
import QuoteSection from '@/components/pages/QuoteSection'
import PreFooterSection from '@/components/pages/PreFooterSection'
import AnalyticsTest from '@/components/ui/AnalyticsTest'

// Enhanced metadata for the home page - CRITICAL SEO FIX
export const metadata: Metadata = {
  title: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company | USA, UK, Germany',
  description: 'Leading enterprise AI & blockchain development company serving numerous clients across USA, UK, Germany and Ukraine. Custom AI solutions, smart contracts, DeFi platforms, enterprise blockchain implementation. 95% client satisfaction rate. Free consultation available.',
  keywords: [
    // Primary high-value keywords
    'enterprise AI development company',
    'blockchain development services',
    'custom AI solutions Fortune 500',
    'smart contracts development',
    'DeFi platform development',
    
    // Geographic targeting keywords
    'AI development company USA',
    'blockchain development UK', 
    'enterprise AI services Germany',
    'AI consulting services Europe',
    'blockchain solutions North America',
    
    // Service-specific long-tail keywords
    'machine learning development enterprise',
    'artificial intelligence consulting',
    'blockchain implementation services',
    'enterprise digital transformation AI',
    'custom machine learning models',
    
    // Industry and niche keywords
    'fintech AI development',
    'healthcare blockchain solutions',
    'supply chain AI optimization',
    'enterprise automation AI',
    'predictive analytics development',
    
    // Competitive and ranking keywords
    '95% client satisfaction AI company',
    'Fortune 500 trusted AI developers',
    'leading blockchain development firm',
    'top AI development company 2025'
  ].join(', '),
  openGraph: {
    title: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company',
    description: 'Transform your business with cutting-edge AI & blockchain solutions. Trusted by Fortune 500 companies worldwide. Custom development, proven results, 95% satisfaction rate.',
    type: 'website',
    url: 'https://fais.world',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    images: [
      {
        url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/twitter-card-image-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development Company',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@FantasticAIStudio',
    creator: '@YevhenLukyanov',
    title: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company',
    description: 'Transform your business with cutting-edge AI & blockchain solutions. Trusted by Fortune 500 companies worldwide.',
    images: [
      {
        url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/twitter-card-image-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png',
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development'
      }
    ]
  },
  alternates: {
    canonical: 'https://fais.world',
    languages: {
      'en-US': 'https://fais.world',
      'en-GB': 'https://fais.world/gb',
      'de-DE': 'https://fais.world/de'
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
    'article:section': 'Homepage',
    'article:tag': 'AI Development, Blockchain Development, Enterprise Solutions',
    'business:contact_data:street_address': 'Enterprise District',
    'business:contact_data:locality': 'Global',
    'business:contact_data:region': 'Worldwide',
    'business:contact_data:country_name': 'USA, UK, Germany'
  }
}

// Define the main Home component
export default function Home() {
  // Service-specific structured data for the home page
  const servicesStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'AI and Blockchain Development',
    provider: {
      '@type': 'Organization',
      name: 'Fantastic AI Studio',
      url: 'https://fais.world'
    },
    areaServed: ['United States', 'United Kingdom', 'Germany'],
    description: 'Enterprise AI and blockchain development services including custom AI solutions, smart contracts, DeFi platforms, and blockchain consulting.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Custom AI Development',
        description: 'Tailored artificial intelligence solutions for enterprise clients',
        category: 'AI Development'
      },
      {
        '@type': 'Offer',
        name: 'Blockchain Development',
        description: 'Smart contracts, DeFi platforms, and blockchain implementation',
        category: 'Blockchain Development'
      },
      {
        '@type': 'Offer',
        name: 'Enterprise Consulting',
        description: 'Strategic AI and blockchain consulting for digital transformation',
        category: 'Consulting'
      }
    ]
  };

  return (
    <>
      {/* Service-specific structured data for home page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesStructuredData) }}
      />

      {/* Desktop: HomeCarousel */}
      <div className='hidden md:block'>
        <HomeCarousel />
      </div>

      {/* Content Area */}
      {/* Desktop: md:mt-[100vh] pushes content below viewport-height carousel */}
      {/* Mobile: No specific top margin here, content flows after Mobile Hero */}
      <div className='bg-white pt-20 md:pt-0 md:mt-[90vh]'> {/* Added pt-20 for mobile, md:pt-0 to reset for desktop */}
        {/* Add id='solutions' to SolutionsSection component for the mobile hero link to work */}
        <SolutionsSection /> 
        
        <ProjectsSection />
        {/* Testimonials section commented out until we have real client feedback */}
        {/* <TestimonialsSection /> */}

        {/* Quote Section */}
        <QuoteSection />

        {/* PreFooterSection */}
        <PreFooterSection />
      </div>

      {/* Analytics Test Component - For Debugging */}
      <AnalyticsTest />
    </>
  )
}
