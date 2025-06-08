import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Leading Enterprise AI & Blockchain Development Company",
  description: "Learn about Fantastic AI Studio, a pioneering technology company transforming businesses through AI and blockchain innovation. Founded by industry experts, serving Fortune 500 clients across USA, UK, Germany since 2023.",
  keywords: [
    // Primary keywords
    "about Fantastic AI Studio", "AI blockchain company", "enterprise technology company", "AI development team",
    // Company-specific
    "AI company history", "blockchain development expertise", "technology innovation leaders", "digital transformation experts",
    // Team and expertise
    "AI engineering team", "blockchain developers", "machine learning experts", "enterprise consultants",
    // Location and clients
    "Fortune 500 AI company", "USA UK Germany AI services", "enterprise AI consultancy", "technology leadership team",
    // Company values
    "AI innovation company", "blockchain technology pioneers", "enterprise digital solutions", "technology transformation experts"
  ].join(", "),  openGraph: {
    title: "About Us | Leading Enterprise AI & Blockchain Development Company",
    description: "Discover the story behind Fantastic AI Studio, a pioneering technology company transforming businesses through AI and blockchain innovation since 2023.",
    url: "https://fais.world/about",
    type: "website",
    images: [
      {
        url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/about-fais-team-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png",
        width: 1200,
        height: 630,
        alt: "About Fantastic AI Studio - Our Team and Mission",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Leading Enterprise AI & Blockchain Development Company",
    description: "Discover the story behind Fantastic AI Studio, a pioneering technology company transforming businesses through AI and blockchain innovation.",
    images: [
      {
        url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/about-fais-team-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png",
        width: 1200,
        height: 630,
        alt: "About Fantastic AI Studio - Our Team and Mission"
      }
    ]
  },
  alternates: {
    canonical: "https://fais.world/about"
  },
  other: {
    "article:section": "About",
    "article:tag": "Company, Team, Mission, AI Development, Blockchain"
  }
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
