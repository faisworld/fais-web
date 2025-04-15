// Rename this file from page.server.tsx to page.tsx

import ContactPageClient from "./page.client";

// Metadata export with updated properties
export const metadata = {
    title: "Contact",
    description: "Get in touch with us",
    metadataBase: new URL("http://localhost:3000"), // Replace with your production URL
    themeColor: "#0078d4",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1", // Use string format for viewport
};

// Render the client component directly
export default function ContactPage() {
    return <ContactPageClient />;
}