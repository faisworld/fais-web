"use client"

import { useEffect } from 'react'

type WebsiteStructuredDataProps = {
  name: string
  url: string
  description: string
  keywords: string[]
  author: string
  logo: string
  potentialAction?: {
    target: string
    query: string
  }
}

/**
 * Component to add structured JSON-LD data for SEO
 */
export function WebsiteStructuredData({
  name,
  url,
  description,
  keywords,
  author,
  logo,
  potentialAction
}: WebsiteStructuredDataProps) {
  useEffect(() => {
    // Create structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name,
      url,
      description,
      keywords: keywords.join(", "),
      author: {
        "@type": "Organization",
        name: author,
        logo: {
          "@type": "ImageObject",
          url: logo
        }
      },
      ...(potentialAction && {
        potentialAction: {
          "@type": "SearchAction",
          target: potentialAction.target,
          "query-input": potentialAction.query
        }
      })
    }

    // Add the script to the document head
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Clean up on unmount
    return () => {
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach(s => {
        try {
          const data = JSON.parse(s.innerHTML)
          if (data["@type"] === "WebSite") {
            document.head.removeChild(s)
          }
        } catch {
          // Ignore parsing errors
        }
      })
    }
  }, [name, url, description, keywords, author, logo, potentialAction])

  return null
}

type OrganizationStructuredDataProps = {
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  address: {
    streetAddress?: string
    addressLocality?: string
    addressRegion?: string
    postalCode?: string
    addressCountry?: string
  }
  contactPoint?: {
    telephone: string
    contactType: string
    email?: string
    areaServed?: string
    availableLanguage?: string[]
  }
}

/**
 * Component to add Organization structured JSON-LD data for SEO
 */
export function OrganizationStructuredData({
  name,
  url,
  logo,
  description,
  sameAs,
  address,
  contactPoint
}: OrganizationStructuredDataProps) {
  useEffect(() => {
    // Create structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name,
      url,
      logo,
      description,
      sameAs,
      address: {
        "@type": "PostalAddress",
        ...address
      },
      ...(contactPoint && {
        contactPoint: {
          "@type": "ContactPoint",
          ...contactPoint
        }
      })
    }

    // Add the script to the document head
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData)
    document.head.appendChild(script)

    // Clean up on unmount
    return () => {
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach(s => {
        try {
          const data = JSON.parse(s.innerHTML)
          if (data["@type"] === "Organization") {
            document.head.removeChild(s)
          }
        } catch {
          // Ignore parsing errors
        }
      })
    }
  }, [name, url, logo, description, sameAs, address, contactPoint])

  return null
}

export default function StructuredData() {
  return null
}
