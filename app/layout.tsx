import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/ui/Header"
import Footer from "@/components/ui/Footer"
import DynamicBreadcrumbs from "@/components/ui/DynamicBreadcrumbs"
import MissingImageFixer from "@/components/ui/MissingImageFixer"

const inter = Inter({ subsets: ["latin"] })

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
        url: "/vibrant-ai-workspace.png",
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
        url: "/vibrant-ai-workspace.png",
        alt: "Fantastic AI Studio Twitter Image",
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
      </body>
    </html>
  )
}
