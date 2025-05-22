"use client"

import { useState } from "react" // Removed useEffect since it's not used
import Link from "next/link"
import Image from "next/image"
import { getBlobImage } from "@/utils/media-utils"
// Removed Head import since it's not used
import { blogPosts } from "./blog-data" // Removed BlogPost import since it's not used

export default function BlogPage() {
  const [filter, setFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // Filter posts based on category and search query
  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = filter === "all" || post.category === filter
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Get featured posts
  const featuredPosts = blogPosts.filter(post => post.featured)

  // Prepare JSON-LD structured data for the blog
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "AI & Blockchain Blog | Fantastic AI Studio",
    "description": "Stay informed with the latest insights, trends, and innovations in AI and blockchain technologies.",
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
        "url": getBlobImage(post.coverImage) || "https://fais.world/placeholder.svg"
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

      <main className="w-full bg-white text-gray-800"> {/* Removed pt-20 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20"> {/* Changed pt-20 pb-12 to py-20 */}
          {/* Hero Section */}
          <section className="text-center mb-16">
            {/* Updated H1 classes */}
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-neutral-900">
              AI & Blockchain Blog
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Stay informed with the latest insights, trends, and innovations in{" "}
              <span className="font-semibold text-blue-600">{"{ai}"}</span> and{" "}
              <span className="font-semibold text-blue-600">[blockchain]</span> technologies.
            </p>
          </section>        {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 lowercase">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map(post => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group block overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
                  >                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={getBlobImage(post.coverImage) || "/placeholder.svg"} 
                        alt={`${post.title} - Featured ${post.category === "ai" ? "AI" : "Blockchain"} article by ${post.author || "Fantastic AI Studio"}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-600 text-white rounded-full mb-3">
                          {post.category === "ai" ? "Artificial Intelligence" : "Blockchain"}
                        </span>                      <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>                      <div className="flex items-center text-gray-300 text-sm">
                          <span>{post.date}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {post.readTime}
                          </span>
                          {post.author && (
                            <>
                              <span className="mx-2">•</span>
                              <span className="flex items-center">
                                {post.authorImage && (
                                  <div className="w-4 h-4 rounded-full overflow-hidden mr-1">
                                    <Image 
                                      src={getBlobImage(post.authorImage) || "/placeholder.svg"} 
                                      alt={post.author || "Author"}
                                      width={16}
                                      height={16}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                {post.author}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Filters and Search */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md lowercase transition-colors ${filter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("ai")}
                  className={`px-4 py-2 rounded-md lowercase transition-colors ${filter === "ai" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  AI
                </button>
                <button 
                  onClick={() => setFilter("blockchain")}
                  className={`px-4 py-2 rounded-md lowercase transition-colors ${filter === "blockchain" ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  Blockchain
                </button>
              </div>
              <div className="w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full md:w-64 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </section>        {/* Blog Post Grid */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 lowercase">Recent Articles</h2>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">                      <div className="relative h-48 overflow-hidden">                      <Image 
                          src={getBlobImage(post.coverImage) || "/placeholder.svg"} 
                          alt={`${post.title} - ${post.category === "ai" ? "AI" : "Blockchain"} article by ${post.author || "Fantastic AI Studio"}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${post.category === "ai" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {post.category === "ai" ? "AI" : "Blockchain"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">                      <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">{post.title}</h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        </div>
                        <div className="mt-auto">                        {post.author && (
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2">
                                {post.authorImage && (
                                  <Image 
                                    src={getBlobImage(post.authorImage) || "/placeholder.svg"} 
                                    alt={post.author || "Author"}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-sm text-gray-700">{post.author}</span>
                            </div>
                          )}                        <div className="flex items-center text-gray-500 text-xs">
                            <span>{post.date}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-600 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </section>        {/* Newsletter Signup */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-10 rounded-lg shadow-sm border border-gray-200 text-center">
              <h2 className="text-3xl font-bold mb-4 lowercase text-gray-800">stay updated</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-600">
                Subscribe to our newsletter for the latest insights on AI and blockchain technologies, delivered directly to your inbox.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-black text-white hover:bg-neutral-700 transition-colors duration-300 rounded-md lowercase font-semibold">
                  Subscribe
                </button>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Share our blog with your network</p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-gray-500 hover:text-blue-600" aria-label="Share on Twitter">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-800" aria-label="Share on LinkedIn">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-500" aria-label="Share on Facebook">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Topic Breakdown */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 lowercase">Explore Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Topics */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-xl border border-blue-200">
                <h3 className="text-xl font-bold mb-4 text-blue-800">Artificial Intelligence</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=large-language-models" className="text-blue-700 hover:text-blue-900 transition-colors">
                      Large Language Models
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=machine-learning" className="text-blue-700 hover:text-blue-900 transition-colors">
                      Machine Learning
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=computer-vision" className="text-blue-700 hover:text-blue-900 transition-colors">
                      Computer Vision
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=generative-ai" className="text-blue-700 hover:text-blue-900 transition-colors">
                      Generative AI
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=ethics" className="text-blue-700 hover:text-blue-900 transition-colors">
                      AI Ethics
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Blockchain Topics */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-8 rounded-xl border border-yellow-200">
                <h3 className="text-xl font-bold mb-4 text-yellow-800">Blockchain Technology</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=cryptocurrency" className="text-yellow-700 hover:text-yellow-900 transition-colors">
                      Cryptocurrency
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=defi" className="text-yellow-700 hover:text-yellow-900 transition-colors">
                      Decentralized Finance (DeFi)
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=nfts" className="text-yellow-700 hover:text-yellow-900 transition-colors">
                      NFTs
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=smart-contracts" className="text-yellow-700 hover:text-yellow-900 transition-colors">
                      Smart Contracts
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    <Link href="/blog?topic=dao" className="text-yellow-700 hover:text-yellow-900 transition-colors">
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
