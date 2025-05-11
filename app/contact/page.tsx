import ContactClientPage from "./page.client";
import type { Metadata } from "next";

// Enhanced metadata export with detailed SEO properties
export const metadata: Metadata = {
    title: "Contact Us | Fantastic AI Studio",
    description: "Get in touch with our AI and blockchain experts. Contact Fantastic AI Studio for consultation, support, or partnership opportunities in digital transformation solutions.",
    keywords: "contact us, AI consulting, blockchain support, technology consultation, digital transformation services",
    openGraph: {
        title: "Contact Fantastic AI Studio | AI & Blockchain Solutions",
        description: "Reach out to our team for AI and blockchain expertise. Schedule a consultation or discuss your project requirements with our specialists.",
        type: "website",
        url: "https://fais.world/contact",
    },
    alternates: {
        canonical: "https://fais.world/contact"
    },
    robots: {
        index: true,
        follow: true,
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