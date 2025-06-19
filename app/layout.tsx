import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import DynamicBreadcrumbs from '@/components/ui/DynamicBreadcrumbs'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from './providers'
import ConditionalElevenLabsWidget from '@/components/ui/ConditionalElevenLabsWidget'



const inter = Inter({ subsets: ['latin'] })

// Define Twitter/OG image URL using Blob storage
const twitterImageUrl =
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/images/6e972845-d283-487c-be43-db051920940c.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'),  title: {
    template: '%s | Fantastic AI Studio',
    default: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company | USA, UK, Germany | Custom Solutions & 95% Client Satisfaction'
  },
  description: 'Leading enterprise AI & blockchain development company serving Fortune 500 clients across USA, UK, Germany and Spain. Custom AI solutions, smart contracts, DeFi platforms, enterprise blockchain implementation. 95% client satisfaction rate. Free consultation available.',
  keywords: [
    // Primary keywords
    'enterprise AI development', 'blockchain development company', 'custom AI solutions', 'smart contracts development',
    // Secondary keywords
    'DeFi platform development', 'enterprise blockchain', 'AI consulting services', 'machine learning development',
    // Location-based keywords
    'AI development USA', 'blockchain company UK', 'enterprise AI Germany', 'Fortune 500 AI solutions',
    // Service-specific keywords
    'enterprise digital transformation', 'blockchain consulting', 'AI software development', 'cryptocurrency development',
    // Industry keywords
    'fintech AI solutions', 'healthcare blockchain', 'supply chain AI', 'enterprise automation'
    ].join(', '),
    authors: [{ name: 'Fantastic AI Studio', url: 'https://fais.world' }],
    creator: 'Yevhen Lukyanov',
    publisher: 'Fantastic AI Studio',
    applicationName: 'Fantastic AI Studio',
    category: 'Technology',
    classification: 'Business',
    icons: { 
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon-16x16.png'
    },
    manifest: '/site.webmanifest',
    openGraph: {
      title: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company',
      description: 'Leading enterprise AI & blockchain development company serving Fortune 500 clients in USA, UK, Germany. Custom AI solutions, smart contracts, DeFi platforms. 95% client satisfaction. Get free consultation.',
      url: 'https://fais.world',
      siteName: 'Fantastic AI Studio',
      locale: 'en_US',
      type: 'website',
      images: [
      {
        url: twitterImageUrl,
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Enterprise AI & Blockchain Development Company',
        type: 'image/png'
      }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Fantastic AI Studio | #1 Enterprise AI & Blockchain Development Company',
      description: 'Leading enterprise AI & blockchain development. Fortune 500 clients. Custom AI solutions, smart contracts, DeFi platforms. 95% client satisfaction. Free consultation.',
      creator: '@fantasticaistudio',
      site: '@fantasticaistudio',
      images: [
      {
        url: twitterImageUrl,
        width: 1200,
        height: 630,
        alt: 'Fantastic AI Studio - Innovative AI and Blockchain Solutions',
      },
      ],
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
      'max-snippet': -1,
      },
    },
    appleWebApp: { 
      capable: true, 
      title: 'Fantastic AI Studio',
      statusBarStyle: 'default'
    },
    formatDetection: {
      telephone: false,
    },
    alternates: {
      canonical: 'https://fais.world',
      languages: {
      'en-US': 'https://fais.world',
      'en-GB': 'https://fais.world/',
      'de-DE': 'https://fais.world/',
      'uk-UA': 'https://fais.world/ua'
      },
    },
    other: {
      'google-site-verification': 'your-google-verification-code', // Replace with actual verification code
    'msvalidate.01': 'your-bing-verification-code', // Replace with actual verification code
    'facebook-domain-verification': 'your-facebook-verification-code', // Replace with actual verification code
  },
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Fantastic AI Studio',
    alternateName: 'fAis',
    url: 'https://fais.world',
    logo: (process.env.NEXT_PUBLIC_LOGO_URL as string) || 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png',
    description: 'Leading enterprise AI & blockchain development company serving Fortune 500 clients across USA, UK, Germany. Custom AI solutions, smart contracts, DeFi platforms.',
    foundingDate: '2023',
    founder: {
      '@type': 'Person',
      name: 'Yevhen Lukyanov'
    },
    areaServed: ['United States', 'United Kingdom', 'Germany', 'Europe', 'North America'],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 51.5074,
        longitude: -0.1278
      },
      geoRadius: '10000000'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English', 'German']
    },
    sameAs: [
      process.env.NEXT_PUBLIC_TWITTER_URL || 'https://x.com/faisworld',
      process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/faistudio/'
    ],
    services: {
      '@type': 'Service',
      description: 'Enterprise AI and Blockchain Development Services',
      areaServed: ['US', 'UK', 'DE'],
      availabilityStarts: '2023-01-01'
    }
  };
  return (
    <html lang='en' className={inter.className}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased"><Providers>
          <Header />
          <DynamicBreadcrumbs darkBg={false} />
          <main className="mt-20">{children}</main>
          <Footer />          {/* React Hot Toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />

          {/* Conditional ElevenLabs Widget - excludes Kvitka-poloniny page */}
          <ConditionalElevenLabsWidget />
            
          {/* WidgetBot Crate Script */}
          <script src='https://cdn.jsdelivr.net/npm/@widgetbot/crate@3' async></script>

          {/* Analytics - SpeedInsights for performance monitoring, Analytics for user tracking */}
          <SpeedInsights />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
