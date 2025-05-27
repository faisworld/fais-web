// filepath: c:\Users\solar\Projects\fais-web\app\services\page.metadata.ts
import { getBlobImage } from '@/utils/media-utils';

// Services page metadata
export const metadata = {
  title: "AI & Blockchain Services | Fantastic AI Studio",
  description: "Discover our comprehensive suite of AI and blockchain services designed to empower your business with innovation, efficiency, and security.",
  keywords: [
    "AI services",
    "blockchain solutions",
    "machine learning",
    "smart contracts",
    "predictive analytics",
    "NLP",
    "computer vision",
    "decentralized applications",
    "tokenization",
    "enterprise AI",
    "Fantastic AI Studio"
  ],
  openGraph: {
    title: "AI & Blockchain Services | Fantastic AI Studio",
    description: "Explore our professional AI and blockchain solutions tailored to your business needs.",
    url: "https://fais.world/services",    images: [
      {
        url: getBlobImage('services-og-image'),
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Services"
      }
    ]
  }
};
