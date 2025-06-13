"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getBlobImage } from "@/utils/media-utils"
import { blogPosts } from "./blog-data"

export default function BlogPage() {
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isClient, setIsClient] = useState(false)
  
  // Prevent hydration mismatch layout shifts
  useEffect(() => {
    setIsClient(true)
  }, [])
  // Filter posts based on category and search query, then sort by date (newest first)
  const filteredPosts = blogPosts
    .filter(post => {
      const matchesCategory = filter === "all" || post.category === filter
      const matchesSearch = searchQuery === "" || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime() // Newest first
    })

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured)

  // Prepare JSON-LD structured data for the blog
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "AI & Blockchain Blog | Fantastic AI Studio",
    "description": "Stay informed with the latest insights and innovations in AI and blockchain.",
    "url": "https://fais.world/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Fantastic AI Studio",
      "logo": {
        "@type": "ImageObject",
        "url": getBlobImage("logo") 
      }
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://fais.world/blog/${post.slug}`
      },
      "author": {
        "@type": "Person",
        "name": post.author || "Fantastic AI Studio Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Fantastic AI Studio",
        "logo": {
          "@type": "ImageObject",
          "url": getBlobImage("logo")
        }
      },
      "image": {
        "@type": "ImageObject",
        "url": post.coverImage.startsWith('http') ? post.coverImage : getBlobImage(post.coverImage) || "https://fais.world/placeholder.svg"
      },
      "keywords": post.category === "ai" ? "artificial intelligence, AI, machine learning" : "blockchain, cryptocurrency, web3"
    }))
  };

  return (
    <>
      {/* Add Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogStructuredData) }}
      />

      <main className="w-full bg-white text-gray-800">
        {/* Fixed max-width container to prevent width changes during layout */}
        <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-20">
          
          {/* Hero Section */}
          <section className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 opacity-50 rounded-2xl"></div>
            <div className="relative py-12 px-4 rounded-2xl border border-gray-100 shadow-sm">              <div className="inline-block mb-6 px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                Insights & Ideas
              </div>              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
                AI & Blockchain Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                Stay informed with the latest insights, trends, and innovations in{" "}                <span className="font-semibold text-gray-800">{"{ai}"}</span> and{" "}
                <span className="font-semibold text-gray-800">[blockchain]</span> technologies.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">                <a href="#featured" className="btn btn-primary px-6 py-3 rounded-md transition-colors shadow-sm hover:shadow-md">
                  Featured Articles
                </a>
              </div>
            </div>
          </section>
          
          {/* Featured Posts Section */}
          {isClient && featuredPosts.length > 0 && (
            <section className="mb-16" id="featured">
              <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group block overflow-hidden rounded-xl border border-gray-200 hover:border-gray-400 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image 
                        src={post.coverImage.startsWith("http") ? post.coverImage : getBlobImage(post.coverImage) || "/placeholder.svg"} 
                        alt={`${post.title} article`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={true}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Filters and Search */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-gray-800 text-white" : "bg-white border"}`}
                >
                  All
                </button>                <button 
                  onClick={() => setFilter("ai")}
                  className={`px-4 py-2 rounded-md ${filter === "ai" ? "bg-gray-800 text-white" : "bg-white border"}`}
                >
                  AI
                </button>
                <button 
                  onClick={() => setFilter("blockchain")}
                  className={`px-4 py-2 rounded-md ${filter === "blockchain" ? "bg-gray-800 text-white" : "bg-white border"}`}
                >
                  Blockchain
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  id="search-input"
                  name="search-input"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </section>          {/* Blog Post Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Recent Articles</h2>
            {!isClient ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Loading skeleton */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm h-96 animate-pulse">
                    <div className="h-56 bg-gray-200 rounded-t-xl"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group block transition duration-300"
                  >
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg h-full flex flex-col">
                      <div className="relative h-56 overflow-hidden">
                        <Image 
                          src={post.coverImage.startsWith('http') ? post.coverImage : getBlobImage(post.coverImage) || "/placeholder.svg"} 
                          alt={`${post.title} - ${post.category === "ai" ? "AI" : "Blockchain"} article by ${post.author || "Fantastic AI Studio"}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3">                          <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${post.category === "ai" ? "bg-gray-800 text-white" : "bg-gray-600 text-white"}`}>
                            {post.category === "ai" ? "AI" : "Blockchain"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 mb-3">{post.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          {post.author && (
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-3 ring-2 ring-gray-100">
                                {post.authorImage && (
                                  <Image 
                                    src={post.authorImage?.startsWith('http') ? post.authorImage : getBlobImage(post.authorImage) || "/placeholder.svg"} 
                                    alt={post.author || "Author"}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{post.author}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-500 text-xs">
                            <span className="font-medium">{post.date}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime}
                            </span>
                            <div className="ml-auto">                              <span className="inline-flex items-center text-gray-800 group-hover:text-black transition-colors">
                                Read article
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-medium">No articles found</h3>
              </div>
            )}
          </section>

          {/* Newsletter Signup */}
          <section className="mb-16" id="newsletter">
            <div className="bg-gradient-to-r from-gray-50 to-gray-50 p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">Subscribe to our newsletter for the latest insights on AI and blockchain.</p>
              <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  id="newsletter-email"
                  name="newsletter-email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800">Subscribe</button>
              </form>
            </div>
          </section>

          {/* Topic Breakdown */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Explore Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">              {/* AI Topics */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Artificial Intelligence</h3>
                </div>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=large-language-models" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Large Language Models
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=machine-learning" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Machine Learning
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=computer-vision" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Computer Vision
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=generative-ai" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Generative AI
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=ethics" className="text-gray-700 hover:text-gray-900 transition-colors">
                      AI Ethics
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Blockchain Topics */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Blockchain Technology</h3>
                </div>
                <ul className="space-y-3 pl-2">
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=cryptocurrency" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Cryptocurrency
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=defi" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Decentralized Finance (DeFi)
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=nfts" className="text-gray-700 hover:text-gray-900 transition-colors">
                      NFTs
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=smart-contracts" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Smart Contracts
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                    <Link href="/blog?topic=dao" className="text-gray-700 hover:text-gray-900 transition-colors">
                      Decentralized Autonomous Organizations
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
