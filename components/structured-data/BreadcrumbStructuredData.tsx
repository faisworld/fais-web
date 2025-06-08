// components/structured-data/BreadcrumbStructuredData.tsx
"use client"

import { BreadcrumbSchema } from '@/types/structured-data'

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbStructuredDataProps {
  breadcrumbs: BreadcrumbItem[]
}

export default function BreadcrumbStructuredData({ breadcrumbs }: BreadcrumbStructuredDataProps) {
  const structuredData: BreadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://fais.world${item.url}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
