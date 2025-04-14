import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"], // Regular and Bold
});

export const metadata: Metadata = {
  title: "Fantastic AI Studio",
  description: "Innovative AI and Blockchain Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <Header />
        {/* Додаємо верхній відступ, щоб контент починався нижче хедера */}
        <main className="pt-24"> {/* Adjust pt-24 (96px) if header height is different */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
