import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"], // Regular and Bold
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fais.world'), // Use your real production URL here
  title: "Fantastic AI Studio",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    url: "https://fantastic-ai-studio.com",
    images: "/images/og-image.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fantastic AI Studio",
    description: "Innovative AI and Blockchain Solutions",
    images: "/images/og-image.png",
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

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
  };
}

export function generateThemeColor() {
  return "#ffffff"; // Set to light mode to match your intended background
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        {/* Remove pt-22 from main to allow content like Hero to be under the header */}
        <main> {/* Removed pt-22 */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
