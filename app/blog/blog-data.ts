export interface BlogPost {
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
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "large-language-models-2025",
    title: "The State of Large Language Models in 2025",
    excerpt: "Exploring how LLMs have evolved and their impact across industries including healthcare, finance, and education.",
    date: "May 8, 2025",
    readTime: "8 min read",
    category: "ai",
    coverImage: "blog-ai-llm",
    featured: true,
    author: "Sarah Johnson",
    authorImage: "author-sarah"
  },
  {
    id: "2",
    slug: "blockchain-for-supply-chain",
    title: "Implementing Blockchain Solutions for Modern Supply Chains",
    excerpt: "How distributed ledger technology is revolutionizing transparency and efficiency in global supply networks.",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "blockchain",
    coverImage: "blog-blockchain-supply",
    author: "Michael Chen",
    authorImage: "author-michael"
  },
  // ... all other blog posts
  {
    id: "13",
    slug: "how-optimism-layer-2-can-transform-your-business",
    title: "How Optimism Layer 2 Can Transform Your Business",
    excerpt: "Discover how Optimism Layer 2 solutions can reduce costs, improve scalability, and speed up transactions for your business on the Ethereum blockchain.",
    date: "May 10, 2025",
    readTime: "7 min read",
    category: "blockchain",
    coverImage: "blog-blockchain-optimism",
    author: "Technical Team",
    authorImage: "author-tech-team"
  }
];