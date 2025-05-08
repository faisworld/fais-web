import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import DynamicBreadcrumbs from "@/components/ui/DynamicBreadcrumbs"
import MissingImageFixer from "@/components/ui/MissingImageFixer"

const inter = Inter({ subsets: ["latin"] })

// Define OG image URL using Blob storage
const ogImageUrl =
  "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/vibrant-ai-workspace-og-image-7yTGHJKLmnOP.png"

// Define Twitter/OG image URL using Blob storage
const twitterImageUrl =
  "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/twitter-card-image-fais-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png"

export const metadata: Metadata = {
  metadataBase: new URL("https://fais.world"), // Use your real production URL here
  title: "Fantastic AI Studio",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    url: "https://fais.world",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    images: [
      {
        url: twitterImageUrl,
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio - Innovative AI and Blockchain Solutions",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: { capable: true, title: "Fantastic AI Studio" },
  description: "Innovative AI and Blockchain Solutions",
  keywords: "AI, Blockchain, Technology, Innovation",
  authors: [{ name: "Fantastic AI Studio" }],
  creator: "Eugene Lukyanov",
  publisher: "fantasticai.studio",
  applicationName: "Fantastic AI Studio",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        <DynamicBreadcrumbs darkBg={false} />
        <main>{children}</main>
        <Footer />
        <MissingImageFixer />

      <div>
        <elevenlabs-convai agent-id="GkOKedIUAelQwYORYU3j"></elevenlabs-convai>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
    
    </div>
        <script src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3" async></script>
      </body>
    </html>
  )
}
