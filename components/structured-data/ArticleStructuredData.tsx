// components/structured-data/ArticleStructuredData.tsx
"use client"

import { ArticleSchema } from '@/types/structured-data'

interface ArticleStructuredDataProps {
  article: {
    title: string
    description: string
    image: string
    author: string
    publishedDate: string
    modifiedDate?: string
    url: string
    keywords?: string
    category?: string
    wordCount?: number
  }
}

export default function ArticleStructuredData({ article }: ArticleStructuredDataProps) {
  const structuredData: ArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      "@type": "Organization",
      name: article.author
    },
    publisher: {
      "@type": "Organization",
      name: "Fantastic AI Studio",
      logo: {
        "@type": "ImageObject",
        url: "https://fais.world/logo.png"
      }
    },
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    url: article.url,
    ...(article.keywords && { keywords: article.keywords }),
    ...(article.category && { articleSection: article.category }),
    ...(article.wordCount && { wordCount: article.wordCount })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
