// Rename this file from page.server.tsx to page.tsx

import ContactPageClient from "./page.client";

// Metadata export with updated properties
export const metadata = {
    title: "Contact",
    description: "Get in touch with us",
    metadataBase: new URL("http://localhost:3000"), // Replace with your production URL
};

// Render the client component directly
export default function ContactPage() {
    return <ContactPageClient />;
}