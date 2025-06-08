// Types for structured data components
export interface Review {
  rating: number
  author: string
  text: string
  datePublished: string
}

export interface AggregateRating {
  ratingValue: number
  reviewCount: number
  bestRating?: number
  worstRating?: number
}

export interface Service {
  "@type": "Service"
  name: string
  description: string
  provider: {
    "@type": "Organization"
    name: string
    url: string
  }
  areaServed: string
  serviceType: string
}

export interface FAQStructuredData {
  "@context": "https://schema.org"
  "@type": "FAQPage"
  mainEntity: Array<{
    "@type": "Question"
    name: string
    acceptedAnswer: {
      "@type": "Answer"
      text: string
    }
  }>
}

export interface ContactPoint {
  "@type": "ContactPoint"
  telephone: string
  contactType: string
  email: string
  availableLanguage?: string[]
}

export interface OrganizationSchema {
  "@context": "https://schema.org"
  "@type": "Organization"
  name: string
  alternateName?: string
  url: string
  logo: string
  description: string
  foundingDate?: string
  founder?: {
    "@type": "Person"
    name: string
  }
  address: {
    "@type": "PostalAddress"
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint: ContactPoint
  sameAs?: string[]
  serviceArea?: {
    "@type": "Place"
    name: string
  }
}

export interface ArticleSchema {
  "@context": "https://schema.org"
  "@type": "Article"
  headline: string
  description: string
  image: string
  author: {
    "@type": "Person" | "Organization"
    name: string
  }
  publisher: {
    "@type": "Organization"
    name: string
    logo: {
      "@type": "ImageObject"
      url: string
    }
  }
  datePublished: string
  dateModified: string
  url: string
  keywords?: string
  articleSection?: string
  wordCount?: number
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org"
  "@type": "BreadcrumbList"
  itemListElement: Array<{
    "@type": "ListItem"
    position: number
    name: string
    item: string
  }>
}

export interface LocalBusinessSchema {
  "@context": "https://schema.org"
  "@type": "LocalBusiness"
  name: string
  image: string
  "@id": string
  url: string
  telephone: string
  address: {
    "@type": "PostalAddress"
    streetAddress: string
    addressLocality: string
    addressRegion: string
    postalCode: string
    addressCountry: string
  }
  geo: {
    "@type": "GeoCoordinates"
    latitude: number
    longitude: number
  }
  openingHoursSpecification: Array<{
    "@type": "OpeningHoursSpecification"
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
  sameAs: string[]
}

export interface WebsiteSchema {
  "@context": "https://schema.org"
  "@type": "WebSite"
  name: string
  url: string
  description: string
  publisher: {
    "@type": "Organization"
    name: string
  }
  potentialAction?: {
    "@type": "SearchAction"
    target: string
    "query-input": string
  }
}

export interface SoftwareApplicationSchema {
  "@context": "https://schema.org"
  "@type": "SoftwareApplication"
  name: string
  operatingSystem: string
  applicationCategory: string
  aggregateRating?: AggregateRating
  offers: {
    "@type": "Offer"
    price: string
    priceCurrency: string
  }
}

export interface ProfessionalServiceSchema {
  "@context": "https://schema.org"
  "@type": "ProfessionalService"
  name: string
  description: string
  provider: {
    "@type": "Organization"
    name: string
  }
  areaServed: string[]
  serviceType: string
  url: string
}
