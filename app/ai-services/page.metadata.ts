import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "AI Solutions | Fantastic AI Studio",
  description: "Discover our innovative AI solutions including predictive analytics, NLP, computer vision, and custom machine learning models to transform your business.",
  keywords: [
    "AI services",
    "predictive analytics",
    "natural language processing",
    "NLP",
    "computer vision",
    "machine learning models",
    "AI chatbots",
    "robotic process automation",
    "RPA",
    "recommendation systems",
    "speech recognition",
    "data analytics",
    "AI cybersecurity",
    "Fantastic AI Studio"
  ],
  openGraph: {
    title: "AI Solutions | Fantastic AI Studio",
    description: "Enhance operational efficiency and drive data-driven decision-making with our innovative AI solutions.",
    url: "https://fais.world/ai-services",
    images: [
      {
        url: "/ai-services-hero-placeholder.png",
        width: 1200,
        height: 630,
        alt: "Fantastic AI Studio AI Solutions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Solutions | Fantastic AI Studio",
    description: "Enhance operational efficiency and drive data-driven decision-making with our innovative AI solutions.",
    images: ["/ai-services-hero-placeholder.png"]
  },
  alternates: {
    canonical: "https://fais.world/ai-services"
  }
};

export default metadata;
