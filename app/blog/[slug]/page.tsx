"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getBlobImage } from "@/utils/image-utils"
import { BlogPost } from "../page"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    // In a real implementation, fetch the post data based on slug
    // For now, simulate with static data
    const fetchPost = async () => {
      setLoading(true)
      try {
        // This would be replaced with an API call in production
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Dummy post data - in production, fetch from API
        const dummyPost: BlogPost = {
          id: "1",
          slug: params.slug,
          title: "The State of Large Language Models in 2025",
          excerpt: "Exploring how LLMs have evolved and their impact across industries including healthcare, finance, and education.",
          date: "May 8, 2025", 
          readTime: "8 min read",
          category: "ai",
          coverImage: "blog-ai-llm",
          featured: true,
          author: "Sarah Johnson",
          authorImage: "author-sarah",
          content: `
            <h2>Introduction to Large Language Models in 2025</h2>
            <p>Large Language Models (LLMs) have come a long way since their inception. In 2025, they've become sophisticated tools that are transforming industries and driving innovation across sectors.</p>
            
            <h2>Key Developments</h2>
            <p>The latest generation of LLMs has shown remarkable improvements in several key areas:</p>
            <ul>
              <li>Enhanced contextual understanding with significantly reduced hallucinations</li>
              <li>Specialized domain expertise in fields like medicine, law, and engineering</li>
              <li>Improved reasoning capabilities that approach human-like problem-solving</li>
              <li>Efficient operation on consumer hardware, bringing AI capabilities to more users</li>
            </ul>

            <h2>Industry Applications</h2>
            <p>Across industries, LLMs are changing how work gets done:</p>
            <h3>Healthcare</h3>
            <p>Medical professionals now use specialized LLMs to assist with diagnosis, treatment planning, and medical research, leading to faster breakthroughs and more personalized care.</p>
            
            <h3>Finance</h3>
            <p>Financial institutions leverage LLMs for fraud detection, market analysis, and customer service, enhancing security while reducing operational costs.</p>
            
            <h3>Education</h3>
            <p>Educational systems now incorporate LLMs to create personalized learning experiences, adapting to each student's pace and learning style.</p>
            
            <h2>Ethical Considerations</h2>
            <p>As LLMs become more integrated into daily life, ethical considerations remain paramount. Issues of bias, transparency, and accessibility continue to drive development practices in the field.</p>
            
            <h2>The Future Outlook</h2>
            <p>Looking ahead, we anticipate further integration of LLMs with specialized knowledge graphs, multimodal capabilities, and more robust security measures to protect against misuse.</p>
            
            <h2>Conclusion</h2>
            <p>Large Language Models have evolved from experimental technology to essential tools driving digital transformation. Their continued development promises to reshape how we work, learn, and interact with information.</p>
          `
        }
        setPost(dummyPost)
        
        // Set related posts (in production, these would be fetched based on category/tags)
        setRelatedPosts([
          {
            id: "3",
            slug: "multimodal-ai-applications",
            title: "Multimodal AI Applications in Creative Industries",
            excerpt: "From text-to-image to text-to-video, how multimodal AI is transforming content creation and design workflows.",
            date: "May 3, 2025",
            readTime: "10 min read",
            category: "ai",
            coverImage: "blog-ai-multimodal",
            author: "Emma Watson",
            authorImage: "author-emma"
          },
          {
            id: "5",
            slug: "ai-governance-frameworks",
            title: "Emerging AI Governance Frameworks for Enterprise",
            excerpt: "Best practices for implementing responsible AI systems within corporate environments in compliance with regulations.",
            date: "April 26, 2025",
            readTime: "9 min read",
            category: "ai",
            coverImage: "blog-ai-governance",
            author: "Priya Sharma",
            authorImage: "author-priya"
          }
        ])
      } catch (error) {
        console.error("Error fetching post:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [params.slug])

  // Prepare structured data for the blog post
  const postStructuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": getBlobImage(post.coverImage) || "https://fais.world/placeholder.svg",
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Person",
      "name": post.author || "Fantastic AI Studio Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Fantastic AI Studio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/logo-fais.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fais.world/blog/${post.slug}`
    },
    "keywords": post.category === "ai" 
      ? "artificial intelligence, AI, machine learning, large language models" 
      : "blockchain, cryptocurrency, web3, decentralized finance"
  } : null;

  if (loading) {
    return (
      <div className="w-full bg-white text-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-12"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="w-full bg-white text-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-6">Post Not Found</h1>
          <p className="mb-6">The blog post you're looking for could not be found.</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Add structured data for SEO */}
      {postStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(postStructuredData) }}
        />
      )}

      <main className="w-full bg-white text-gray-800 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-8">
            <div className="mb-4">
              <Link 
                href="/blog"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </Link>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center mb-6">
              {post.authorImage && (
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image 
                    src={getBlobImage(post.authorImage) || "/placeholder.svg"} 
                    alt={post.author || "Author"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{post.author}</p>
                <div className="flex items-center text-gray-500 text-sm">
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
            
            <div className="mb-8">
              <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${post.category === "ai" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                {post.category === "ai" ? "Artificial Intelligence" : "Blockchain"}
              </span>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
            <Image 
              src={getBlobImage(post.coverImage) || "/placeholder.svg"} 
              alt={post.title} 
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          </article>
          
          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8 mt-8">
            <div className="flex flex-wrap items-center justify-between">
              {/* Tags */}
              <div className="mb-4">
                <h3 className="text-sm text-gray-500 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  <Link 
                    href={`/blog?category=${post.category}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {post.category === "ai" ? "Artificial Intelligence" : "Blockchain"}
                  </Link>
                  <Link 
                    href="/blog?topic=technology"
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Technology
                  </Link>
                  <Link 
                    href="/blog?topic=innovation"
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Innovation
                  </Link>
                </div>
              </div>
              
              {/* Share Links */}
              <div className="mb-4">
                <h3 className="text-sm text-gray-500 mb-2">Share:</h3>
                <div className="flex space-x-3">
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://fais.world/blog/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-500"
                    aria-label="Share on Twitter"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://fais.world/blog/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-700"
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                    </svg>
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://fais.world/blog/${post.slug}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600"
                    aria-label="Share on Facebook"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </footer>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    href={`/blog/${relatedPost.slug}`} 
                    key={relatedPost.id}
                    className="group"
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={getBlobImage(relatedPost.coverImage) || "/placeholder.svg"} 
                          alt={relatedPost.title} 
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold tracking-wider uppercase rounded-full ${relatedPost.category === "ai" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}>
                            {relatedPost.category === "ai" ? "AI" : "Blockchain"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 mb-2">{relatedPost.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{relatedPost.excerpt}</p>
                        <div className="mt-auto text-sm text-gray-500">
                          {relatedPost.date} • {relatedPost.readTime}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  )
}
