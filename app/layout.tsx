import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from "@/components/ui/Header";
import Footer from '@/components/ui/Footer'; // Adjust path if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'), // Use your real production URL here
  title: "Fantastic AI Studio",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    url: "https://fais.world",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Open Graph Image"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    images: [
      {
        url: "/images/og-image.png",
        alt: "Fantastic AI Studio Twitter Image"
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: { capable: true, title: "Fantastic AI Studio" },
  description: " Innovative AI and Blockchain Solutions",
  keywords: "AI, Blockchain, Technology, Innovation",
  authors: [{ name: "Fantastic AI Studio" }],
  creator: "Eugene Lukyanov",
  publisher: "fantasticai.studio",
  applicationName: "Fantastic AI Studio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {/* Optional: Add any additional scripts or analytics here */}
      <script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXX');`,
        }}
      />
      {/* End of optional scripts */}
      {children}
    </>
  );
}