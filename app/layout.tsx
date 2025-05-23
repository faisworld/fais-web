import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import DynamicBreadcrumbs from '@/components/ui/DynamicBreadcrumbs'
import MissingImageFixer from '@/components/ui/MissingImageFixer'
import ConditionalWidgetWrapper from '@/components/ui/ConditionalWidgetWrapper'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Providers } from './providers'



const inter = Inter({ subsets: ['latin'] })

// Define Twitter/OG image URL using Blob storage
const twitterImageUrl =
  'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/twitter-card-image-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png'

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'), // Use your real production URL here
  title: 'Fantastic AI Studio | Leading AI & Blockchain Solutions',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Fantastic AI Studio | Advanced AI & Blockchain Development',
    description: 'Transform your business with cutting-edge AI and blockchain solutions. Custom development, enterprise implementation, and innovative digital transformation services.',
    url: 'https://fais.world',
    siteName: 'Fantastic AI Studio',
    locale: 'en_US',
    type: 'website',
    // Use direct URLs instead of getBlobImage to avoid unnecessary preloading
    images: [
      {
        url: 'https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/Logo_white_fais-e1734783482439-0gYn1yvp1J0Oud09HvWZK7ePuLfaC4.png', 
        width: 100,
        height: 36,
        alt: 'Fantastic AI Studio Logo',
      }
    ],
  },  twitter: {
    card: 'summary_large_image',
    title: 'Fantastic AI Studio | Advanced AI & Blockchain Development',
    description: 'Transform your business with cutting-edge AI and blockchain solutions. Custom development, enterprise implementation, and digital transformation.',
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
  },  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: { capable: true, title: 'Fantastic AI Studio' },
  description: 'Industry-leading AI & Blockchain solutions for digital transformation. Custom AI development, blockchain implementation, and innovative technology solutions.',
  keywords: 'AI solutions, Blockchain technology, AI development, Enterprise blockchain, Digital transformation, Smart contracts, Machine learning, Data analytics, AI consulting, Blockchain consulting, Tech innovation, AI blockchain integration',
  authors: [{ name: 'Fantastic AI Studio' }],
  creator: 'Eugene Lukyanov',
  publisher: 'fantasticai.studio',
  applicationName: 'Fantastic AI Studio',
  category: 'Technology',
  other: {
    'google-site-verification': 'verification-code-here', // Replace with actual code when available
    'msvalidate.01': 'microsoft-verification-code-here', // Replace with actual code when available
  },
}



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={inter.className}><body>
        <Providers>
          <Header />
          <DynamicBreadcrumbs darkBg={false} />
          <main>{children}</main>
          <Footer />        <MissingImageFixer />

        {/* ElevenLabs Convai Widget - Client-only component with conditional rendering */}
        <ConditionalWidgetWrapper agentId='GkOKedIUAelQwYORYU3j' />
        
        {/* WidgetBot Crate Script */}
        <script src='https://cdn.jsdelivr.net/npm/@widgetbot/crate@3' async></script>
        <SpeedInsights />
        </Providers>
      </body></html>
  )
}
