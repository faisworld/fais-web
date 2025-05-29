"use client"

import { useState } from "react" 
import Link from "next/link"
import Image from "next/image"
import { getBlobImage } from "@/utils/media-utils"
import { blogPosts } from "./blog-data"
import "./blog-animations.css"

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
      />      <main className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-white/10 to-gray-300/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-gray-400/10 to-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-20 w-72 h-72 bg-gradient-to-r from-gray-300/10 to-white/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-gradient-to-r from-white/10 to-gray-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          
          {/* Hero Section */}
          <section className="text-center mb-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 via-gray-700/30 to-gray-800/50 opacity-60 rounded-2xl backdrop-blur-sm"></div>
            <div className="relative py-12 px-4 rounded-2xl border border-gray-600/30 shadow-2xl backdrop-blur-md">
              <div className="inline-block mb-6 px-4 py-1.5 bg-gray-700/80 text-gray-200 rounded-full text-sm font-medium backdrop-blur-sm">
                Insights & Ideas
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300">
                AI & Blockchain Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Stay informed with the latest insights, trends, and innovations in{" "}
                <span className="font-semibold text-gray-100">{"{ai}"}</span> and{" "}
                <span className="font-semibold text-gray-100">[blockchain]</span> technologies.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="#featured" className="px-6 py-3 bg-gray-700/80 text-gray-100 rounded-md hover:bg-gray-600/80 transition-all shadow-lg hover:shadow-xl backdrop-blur-sm border border-gray-500/30">
                  Featured Articles
                </a>
                <a href="#newsletter" className="px-6 py-3 border border-gray-500/50 text-gray-200 rounded-md hover:bg-gray-700/50 transition-all backdrop-blur-sm">
                  Subscribe to Newsletter
                </a>
              </div>
            </div>
          </section>
            {/* Empty State */}
          {blogPosts.length === 0 && (
            <section className="mb-16 text-center py-16 px-4 bg-gray-800/50 rounded-xl border border-gray-600/30 backdrop-blur-md">
              <div className="max-w-2xl mx-auto">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-16 w-16 mx-auto mb-6 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
                  />
                </svg>
                <h2 className="text-2xl font-bold mb-4 text-gray-200">No Articles Yet</h2>
                <p className="text-gray-400 mb-8">
                  Our AI article generator is ready to create fresh content about AI and blockchain. 
                  Visit the admin panel to generate new articles with relevant images.
                </p>
                <Link 
                  href="/admin/ai-tools/article-generation" 
                  className="inline-flex items-center px-5 py-3 bg-gray-700/80 text-gray-100 rounded-md hover:bg-gray-600/80 transition-all shadow-lg backdrop-blur-sm border border-gray-500/30"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
                    />
                  </svg>
                  Generate Articles
                </Link>
              </div>
            </section>
          )}
          
          {/* Featured Posts Section */}
          {featuredPosts.length > 0 && (
            <section className="mb-16" id="featured">
              <h2 className="text-2xl font-semibold mb-8 lowercase flex items-center after:content-[''] after:h-px after:flex-1 after:ml-6 after:bg-gray-200">
                Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className={`group block overflow-hidden rounded-xl border border-gray-200 hover:border-blue-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 blog-card-animation ${index === 0 ? 'blog-card-delay-1' : 'blog-card-delay-2'}`}
                  >
                    <div className="relative h-72 overflow-hidden">
                      <Image 
                        src={post.coverImage.startsWith('http') ? post.coverImage : getBlobImage(post.coverImage) || "/placeholder.svg"} 
                        alt={`${post.title} - Featured ${post.category === "ai" ? "AI" : "Blockchain"} article by ${post.author || "Fantastic AI Studio"}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 w-full">
                        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-blue-600 text-white rounded-full mb-3">
                          {post.category === "ai" ? "Artificial Intelligence" : "Blockchain"}
                        </span>
                        <h3 className="text-2xl font-bold text-white mb-3">{post.title}</h3>
                        <div className="flex items-center text-gray-300 text-sm">
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
                                      src={post.authorImage?.startsWith('http') ? post.authorImage : getBlobImage(post.authorImage) || "/placeholder.svg"} 
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
          )}          {/* Filters and Search */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-gray-800/50 p-4 rounded-lg border border-gray-600/30 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-md lowercase transition-all ${filter === "all" ? "bg-gray-600 text-white shadow-md ring-2 ring-gray-500 ring-offset-2 ring-offset-gray-900" : "bg-gray-700/80 border border-gray-500/50 hover:bg-gray-600/80 text-gray-200"}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("ai")}
                  className={`px-4 py-2 rounded-md lowercase transition-all ${filter === "ai" ? "bg-gray-500 text-white shadow-md ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-900" : "bg-gray-700/80 border border-gray-500/50 hover:bg-gray-600/80 text-gray-200"}`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    AI
                  </span>
                </button>
                <button 
                  onClick={() => setFilter("blockchain")}
                  className={`px-4 py-2 rounded-md lowercase transition-all ${filter === "blockchain" ? "bg-gray-500 text-white shadow-md ring-2 ring-gray-400 ring-offset-2 ring-offset-gray-900" : "bg-gray-700/80 border border-gray-500/50 hover:bg-gray-600/80 text-gray-200"}`}
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Blockchain
                  </span>
                </button>
              </div>
              <div className="w-full md:w-auto relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 rounded-md border border-gray-500/50 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-lg backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Blog Post Grid */}
          <section className="mb-16">            <h2 className="text-2xl font-semibold mb-8 lowercase flex items-center after:content-[''] after:h-px after:flex-1 after:ml-6 after:bg-gray-600/50 text-gray-200">
              Recent Articles
            </h2>
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className={`group block transform transition duration-300 hover:-translate-y-1 blog-card-animation blog-card-delay-${Math.min(index + 1, 6)}`}
                  >
                    <div className="bg-gray-800/60 rounded-xl overflow-hidden border border-gray-600/30 hover:border-gray-500/50 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col backdrop-blur-md group-hover:bg-gray-700/70">
                      <div className="relative h-56 overflow-hidden">
                        <Image 
                          src={post.coverImage.startsWith('http') ? post.coverImage : getBlobImage(post.coverImage) || "/placeholder.svg"} 
                          alt={`${post.title} - ${post.category === "ai" ? "AI" : "Blockchain"} article by ${post.author || "Fantastic AI Studio"}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>                        <div className="absolute top-3 right-3">
                          <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${post.category === "ai" ? "bg-gray-700/80 text-gray-200 border border-gray-500/50" : "bg-gray-600/80 text-yellow-300 border border-yellow-500/50"}`}>
                            {post.category === "ai" ? "AI" : "Blockchain"}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-200 group-hover:text-gray-100 transition-colors duration-300 mb-3">{post.title}</h3>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-gray-600/50">
                          {post.author && (
                            <div className="flex items-center mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-700/50 overflow-hidden mr-3 ring-2 ring-gray-600/50">
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
                              <span className="text-sm font-medium text-gray-300">{post.author}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-400 text-xs">
                            <span className="font-medium">{post.date}</span>
                            <span className="mx-2">•</span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.readTime}
                            </span>
                            <div className="ml-auto">
                              <span className="inline-flex items-center text-gray-300 group-hover:text-gray-100 transition-colors">
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
              </div>            ) : (
              <div className="text-center py-16 bg-gray-800/50 rounded-lg border border-gray-600/30 backdrop-blur-md">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-200 mb-2">No articles found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria.</p>
                <button 
                  onClick={() => { setFilter("all"); setSearchQuery(""); }}
                  className="px-4 py-2 bg-gray-700/80 text-gray-100 rounded-md hover:bg-gray-600/80 transition-all shadow-lg backdrop-blur-sm border border-gray-500/30"
                >
                  Reset filters
                </button>
              </div>
            )}
          </section>
            {/* Newsletter Signup */}
          <section className="mb-16" id="newsletter">
            <div className="bg-gradient-to-r from-gray-800/60 via-gray-700/40 to-gray-800/60 p-10 rounded-2xl shadow-2xl border border-gray-600/30 text-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400"></div>
              <h2 className="text-3xl font-bold mb-4 lowercase text-gray-100">stay updated</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
                Subscribe to our newsletter for the latest insights on AI and blockchain technologies, delivered directly to your inbox.
              </p>
              <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 rounded-md border border-gray-500/50 bg-gray-800/50 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent shadow-lg backdrop-blur-sm"
                />
                <button className="px-6 py-3 bg-gray-700/80 text-gray-100 hover:bg-gray-600/80 transition-all duration-300 rounded-md lowercase font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 backdrop-blur-sm border border-gray-500/30">
                  Subscribe
                </button>
              </div>
                <div className="mt-10 pt-6 border-t border-gray-600/50">
                <p className="text-sm text-gray-400 mb-3">Share our blog with your network</p>
                <div className="flex justify-center space-x-6">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" aria-label="Share on Twitter">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" aria-label="Share on LinkedIn">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110" aria-label="Share on Facebook">
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
            <h2 className="text-2xl font-semibold mb-8 lowercase flex items-center after:content-[''] after:h-px after:flex-1 after:ml-6 after:bg-gray-600/50 text-gray-200">Explore Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">              {/* AI Topics */}
              <div className="bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-800/80 p-8 rounded-xl border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md hover:border-gray-500/70">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-gray-600/80 text-gray-200 flex items-center justify-center mr-3 ring-2 ring-gray-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-200">Artificial Intelligence</h3>
                </div>                <ul className="space-y-3 pl-2">
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=large-language-models" className="text-gray-300 hover:text-gray-100 transition-colors">
                      Large Language Models
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=machine-learning" className="text-gray-300 hover:text-gray-100 transition-colors">
                      Machine Learning
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=computer-vision" className="text-gray-300 hover:text-gray-100 transition-colors">
                      Computer Vision
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=generative-ai" className="text-gray-300 hover:text-gray-100 transition-colors">
                      Generative AI
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=ethics" className="text-gray-300 hover:text-gray-100 transition-colors">
                      AI Ethics
                    </Link>
                  </li>
                </ul>
              </div>
                {/* Blockchain Topics */}
              <div className="bg-gradient-to-br from-gray-800/80 via-gray-700/60 to-gray-800/80 p-8 rounded-xl border border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-md hover:border-yellow-500/30">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-yellow-600/80 text-yellow-200 flex items-center justify-center mr-3 ring-2 ring-yellow-500/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-yellow-200">Blockchain Technology</h3>
                </div>                <ul className="space-y-3 pl-2">
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=cryptocurrency" className="text-yellow-300 hover:text-yellow-100 transition-colors">
                      Cryptocurrency
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=defi" className="text-yellow-300 hover:text-yellow-100 transition-colors">
                      Decentralized Finance (DeFi)
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=nfts" className="text-yellow-300 hover:text-yellow-100 transition-colors">
                      NFTs
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=smart-contracts" className="text-yellow-300 hover:text-yellow-100 transition-colors">
                      Smart Contracts
                    </Link>
                  </li>
                  <li className="flex items-center transition-transform hover:translate-x-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                    <Link href="/blog?topic=dao" className="text-yellow-300 hover:text-yellow-100 transition-colors">
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
