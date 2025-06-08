// components/structured-data/ServiceStructuredData.tsx
"use client"

import { ProfessionalServiceSchema } from '@/types/structured-data'

interface ServiceStructuredDataProps {
  service: {
    name: string
    description: string
    serviceType: string
    areaServed: string[]
    url: string
  }
}

export default function ServiceStructuredData({ service }: ServiceStructuredDataProps) {
  const structuredData: ProfessionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Fantastic AI Studio"
    },
    areaServed: service.areaServed,
    serviceType: service.serviceType,
    url: `https://fais.world${service.url}`
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
