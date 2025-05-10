import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import DynamicBreadcrumbs from "@/components/ui/DynamicBreadcrumbs"
import MissingImageFixer from "@/components/ui/MissingImageFixer"
import ElevenLabsWidgetWrapper from "@/components/ui/ElevenLabsWidgetWrapper"

const inter = Inter({ subsets: ["latin"] })

// Define OG image URL using Blob storage
const ogImageUrl =
  "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/vibrant-ai-workspace-og-image-7yTGHJKLmnOP.png"

// Define Twitter/OG image URL using Blob storage
const twitterImageUrl =
  "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/twitter-card-image-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png"

export const metadata: Metadata = {
  metadataBase: new URL("https://fais.world"), // Use your real production URL here
  title: "Fantastic AI Studio | Leading AI & Blockchain Solutions",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Fantastic AI Studio | Advanced AI & Blockchain Development",
    description: "Transform your business with cutting-edge AI and blockchain solutions. Custom development, enterprise implementation, and innovative digital transformation services.",
    url: "https://fais.world",
    siteName: "Fantastic AI Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Open Graph Image",
      },
    ],
  },  twitter: {
    card: "summary_large_image",
    title: "Fantastic AI Studio | Advanced AI & Blockchain Development",
    description: "Transform your business with cutting-edge AI and blockchain solutions. Custom development, enterprise implementation, and digital transformation.",
    creator: "@fantasticaistudio",
    site: "@fantasticaistudio",
    images: [
      {
        url: twitterImageUrl,
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio - Innovative AI and Blockchain Solutions",
      },
    ],
  },  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: { capable: true, title: "Fantastic AI Studio" },
  description: "Industry-leading AI & Blockchain solutions for digital transformation. Custom AI development, blockchain implementation, and innovative technology solutions.",
  keywords: "AI solutions, Blockchain technology, AI development, Enterprise blockchain, Digital transformation, Smart contracts, Machine learning, Data analytics, AI consulting, Blockchain consulting, Tech innovation, AI blockchain integration",
  authors: [{ name: "Fantastic AI Studio" }],
  creator: "Eugene Lukyanov",
  publisher: "fantasticai.studio",
  applicationName: "Fantastic AI Studio",
  category: "Technology",
  other: {
    "google-site-verification": "verification-code-here", // Replace with actual code when available
    "msvalidate.01": "microsoft-verification-code-here", // Replace with actual code when available
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        <DynamicBreadcrumbs darkBg={false} />        <main>{children}</main>
        <Footer />
        <MissingImageFixer />

        {/* ElevenLabs Convai Widget - Client-only component */}
        <ElevenLabsWidgetWrapper agentId="GkOKedIUAelQwYORYU3j" />
        
        {/* WidgetBot Crate Script */}
        <script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async></script>
      </body>
    </html>
  )
}
