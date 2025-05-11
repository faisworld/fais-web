"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { getBlobImage } from "@/utils/image-utils"

interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: "ai" | "blockchain" | "technology" | "business"
  coverImage: string
  featured?: boolean
  author?: string
  authorImage?: string
  content?: string
}

export default function OptimismLayer2Page() {
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  // Current blog post data
  const post: BlogPost = {
    id: "31",
    slug: "how-optimism-layer-2-can-transform-your-business",
    title: "How Optimism Layer 2 Can Transform Your Business",
    excerpt: "Discover how Optimism's Layer 2 solution can help your business reduce costs, improve scalability, and increase transaction speeds on Ethereum.",
    date: "May 11, 2025",
    readTime: "7 min read",
    category: "blockchain",
    coverImage: "blog-optimism-layer2",
    author: "Eugene Lukyanov",
    authorImage: "author-eugene",
    content: `
    <h1>How Optimism Layer 2 Can Transform Your Business</h1>

    <p><strong>Optimism Layer 2</strong> is a cutting-edge solution designed to enhance Ethereum's capabilities. For businesses, it offers reduced transaction costs, improved scalability, and faster transaction times—essential improvements for any company working in finance, e-commerce, online gaming, or beyond.</p>

    <h2>Key Benefits</h2>

    <ul>
      <li><strong>Cost Reduction:</strong> By using Layer 2 technology, Optimism processes transactions off-chain and bundles them into batches before submitting them to the Ethereum blockchain, significantly reducing gas fees.</li>
      <li><strong>Scalability:</strong> Whether you're running a financial services platform or a high-volume e-commerce site, Optimism allows your business to scale without worrying about Ethereum's congestion or high fees.</li>
      <li><strong>Speed:</strong> Optimism speeds up transaction processing, making it ideal for businesses that need real-time operations like online gaming or payment platforms.</li>
      <li><strong>Developer Efficiency:</strong> Optimism is fully compatible with Ethereum smart contracts, allowing your developers to migrate or build new applications with ease.</li>
    </ul>

    <h2>Why Businesses Should Care</h2>

    <p>Optimism Layer 2 helps your business minimize operational costs, streamline developer efforts, and improve the overall customer experience. It's ideal for businesses looking to implement blockchain solutions without breaking the bank.</p>

    <p>One of the most significant advantages of Optimism Layer 2 is its focus on eco-friendliness. By processing transactions off-chain, this Layer 2 solution reduces the energy consumption associated with Ethereum's proof-of-work mechanism. For businesses concerned with their carbon footprint and sustainability goals, adopting Optimism not only boosts operational efficiency but also helps meet green standards.</p>

    <p>Optimism is particularly attractive to industries like online gaming and decentralized finance (DeFi), where real-time processing and cost efficiency are paramount. Online gaming platforms, for example, need instant transactions and low fees to maintain user engagement. DeFi applications, on the other hand, require the ability to handle large volumes of transactions without delay or prohibitive costs. Optimism's ability to handle both ensures that these industries can continue to grow without being hindered by Ethereum's scalability challenges.</p>

    <h2>Real-World Use Cases and Growing Ecosystem</h2>

    <p>As of now, Optimism supports over 170 decentralized applications (dApps), ranging from decentralized exchanges (DEXs) like Uniswap to financial platforms such as Aave. This ecosystem is growing rapidly, although still trailing competitors like Polygon and Arbitrum in terms of sheer volume. However, Optimism's ease of use makes it more accessible for Ethereum users, as existing Ethereum addresses and wallets like MetaMask can be seamlessly integrated into the Optimism network.</p>

    <p>The technology behind Optimism, called <strong>optimistic rollups</strong>, bundles transactions and assumes them to be valid, with periodic checks to ensure accuracy. This model, combined with its EVM-equivalence (compatibility with Ethereum's infrastructure), makes Optimism an appealing choice for developers looking to build on Ethereum without the high costs and slow speeds associated with Layer 1.</p>

    <h2>The Future of Optimism: Governance and Sustainability</h2>

    <p>Optimism is not just a technical solution but also has a strong governance model. It's governed by two groups: the <strong>Token House</strong>, which oversees network upgrades and decisions, and the <strong>Citizens' House</strong>, responsible for allocating funds to public goods. This decentralized governance structure ensures that the network remains adaptable and fair, providing long-term sustainability.</p>

    <p>Want to learn more? Explore how Optimism Layer 2 can work for your business by visiting our <a href="/blockchain-services">Blockchain Services page</a>.</p>
    `
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    // Related posts - in a real implementation, fetch these from API
    setRelatedPosts([
      {
        id: "28",
        slug: "blockchain-for-supply-chain",
        title: "Implementing Blockchain Solutions for Modern Supply Chains",
        excerpt: "How distributed ledger technology is revolutionizing transparency and efficiency in global supply networks.",
        date: "May 5, 2025",
        readTime: "6 min read",
        category: "blockchain",
        coverImage: "blog-blockchain-supply"
      },
      {
        id: "29",
        slug: "enterprise-ethereum-solutions",
        title: "Enterprise Ethereum Solutions in 2025",
        excerpt: "How major corporations are implementing Ethereum-based solutions for business processes and innovation.",
        date: "April 22, 2025",
        readTime: "7 min read",
        category: "blockchain",
        coverImage: "blog-enterprise-ethereum"
      },
      {
        id: "30",
        slug: "nft-business-applications",
        title: "Beyond Art: Business Applications of NFTs",
        excerpt: "Exploring how businesses are leveraging NFT technology for authentication, loyalty programs, and more.",
        date: "April 15, 2025",
        readTime: "5 min read",
        category: "blockchain",
        coverImage: "blog-nft-business"
      }
    ])

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-10"></div>
          <div className="h-80 bg-gray-200 rounded mb-10"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-center mb-6">
          <div className="mr-4">
            <Image 
              src={getBlobImage(post.authorImage || "default-author")}
              alt={post.author || "Author"}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">{post.author}</p>
            <p className="text-gray-500">{post.date} · {post.readTime}</p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[400px] mb-10 rounded-lg overflow-hidden">
        <Image
          src={getBlobImage(post.coverImage)}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Blog content */}
      <article className="prose lg:prose-xl mx-auto mb-16" dangerouslySetInnerHTML={{ __html: post.content || "" }}></article>

      {/* Related posts */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedPosts.map((relatedPost) => (
            <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="group">
              <div className="mb-4 aspect-video relative overflow-hidden rounded-lg">
                <Image
                  src={getBlobImage(relatedPost.coverImage)}
                  alt={relatedPost.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">{relatedPost.title}</h3>
              <p className="text-sm text-gray-500">{relatedPost.date} · {relatedPost.readTime}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-blue-50 p-8 rounded-xl mt-16">
        <h3 className="text-xl font-bold mb-4">Ready to leverage blockchain for your business?</h3>
        <p className="mb-6">Explore our blockchain services to see how we can help your business implement scalable, cost-effective solutions.</p>
        <Link href="/blockchain-services" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Explore Blockchain Services
        </Link>
      </div>
    </div>
  )
}
