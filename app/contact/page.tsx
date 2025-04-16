// Rename this file from page.server.tsx to page.tsx

import ContactPageClient from "./page.client";

// Metadata export with updated properties
export const metadata = {
    title: "Contact",
    description: "Get in touch with us",
    metadataBase: new URL("http://localhost:3000"), // Replace with your production URL
};

export function generateViewport() {
    return {
        width: "device-width",
        initialScale: 1,
        maximumScale: 1,
    };
}

export function generateThemeColor() {
    return "#000000"; // Set to black for consistent theme
}

// Render the client component directly
export default function ContactPage() {
    return <ContactPageClient />;
}