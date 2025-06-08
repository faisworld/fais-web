// components/structured-data/WebsiteStructuredData.tsx
"use client"

import { WebsiteSchema } from '@/types/structured-data'

interface WebsiteStructuredDataProps {
  website: {
    name: string
    url: string
    description: string
    searchUrl?: string
  }
}

export default function WebsiteStructuredDataComponent({ website }: WebsiteStructuredDataProps) {
  const structuredData: WebsiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: website.name,
    url: website.url,
    description: website.description,
    publisher: {
      "@type": "Organization",
      name: "Fantastic AI Studio"
    },
    ...(website.searchUrl && {
      potentialAction: {
        "@type": "SearchAction",
        target: website.searchUrl,
        "query-input": "required name=search_term_string"
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
