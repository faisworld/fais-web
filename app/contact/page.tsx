import ContactPageClient from "./page.client";

// Metadata export with updated properties
export const metadata = {
    title: "Contact",
    description: "Get in touch with us",
    // metadataBase should be the root domain of your website.
    metadataBase: new URL("https://fais.world"), // Replace with your production base URL
};

// Render the client component directly
export default function ContactPage() {
    return <ContactPageClient />;
}