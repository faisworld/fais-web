import ContactClientPage from "./page.client";
import type { Metadata } from "next";

// Enhanced metadata export with detailed SEO properties
export const metadata: Metadata = {
    title: "Contact Fantastic AI Studio | Get Free AI & Blockchain Consultation",
    description: "Contact Fantastic AI Studio for enterprise AI and blockchain development services. Free consultation available. Serving Fortune 500 clients across USA, UK, Germany. Expert AI and blockchain developers ready to transform your business.",
    keywords: [
        // Primary keywords
        "contact Fantastic AI Studio", "AI consultation", "blockchain consultation", "enterprise AI contact",
        // Service-specific
        "AI development consultation", "blockchain development contact", "enterprise technology consultation", "digital transformation contact",
        // Action-oriented
        "free AI consultation", "blockchain project consultation", "enterprise AI quote", "custom AI development contact",
        // Location-based
        "AI consulting USA", "blockchain services UK", "enterprise AI Germany", "Fortune 500 AI contact",
        // Business-focused
        "enterprise AI partnership", "blockchain development inquiry", "technology transformation consultation", "AI blockchain experts contact"
    ].join(", "),
    openGraph: {
        title: "Contact Fantastic AI Studio | Get Free AI & Blockchain Consultation",
        description: "Ready to transform your business with AI and blockchain? Contact our expert team for a free consultation. Trusted by Fortune 500 companies worldwide.",
        type: "website",
        url: "https://fais.world/contact",
        images: [
            {
                url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/contact-fais-consultation-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png",
                width: 1200,
                height: 630,
                alt: "Contact Fantastic AI Studio - Free Consultation",
                type: "image/png"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Fantastic AI Studio | Get Free AI & Blockchain Consultation",
        description: "Ready to transform your business with AI and blockchain? Contact our expert team for a free consultation.",
        images: [
            {
                url: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/contact-fais-consultation-1200x630-NqvcixzlHRVD1xlXsWGkAvjM9YPJgQ.png",
                width: 1200,
                height: 630,
                alt: "Contact Fantastic AI Studio - Free Consultation"
            }
        ]
    },
    alternates: {
        canonical: "https://fais.world/contact"
    },
    robots: {
        index: true,
        follow: true,
    },
    other: {
        "article:section": "Contact",
        "article:tag": "Contact, Consultation, AI Services, Blockchain Services"
    },
    // metadataBase should be the root domain of your website.
    metadataBase: new URL("https://fais.world"),
};

// Render the client component directly
export default function ContactPage() {
    return (
        <div>
            <ContactClientPage />
        </div>
    );
}