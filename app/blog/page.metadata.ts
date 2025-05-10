import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI & Blockchain Blog | Fantastic AI Studio",
  description: "Explore the latest insights, trends, and innovations in AI and blockchain technologies with expert articles from Fantastic AI Studio's team.",
  keywords: [
    "AI blog", 
    "blockchain blog", 
    "artificial intelligence articles", 
    "blockchain technology insights", 
    "tech innovation blog", 
    "AI trends", 
    "blockchain applications", 
    "digital transformation articles"
  ],
  openGraph: {
    title: "AI & Blockchain Blog | Fantastic AI Studio",
    description: "Explore the latest insights and innovations in AI and blockchain technologies. Expert articles on large language models, decentralized finance, multimodal AI, and more.",
    url: "https://fais.world/blog",
    type: "website",
    images: [
      {
        url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-og-image-fais-1200x630.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio Blog - AI and Blockchain Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI & Blockchain Blog | Fantastic AI Studio",
    description: "Explore the latest insights and innovations in AI and blockchain technologies from our expert team.",
    images: ["https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-twitter-card-fais.png"],
  },
  alternates: {
    canonical: "https://fais.world/blog",
  },
};
