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

/**
 * Blog posts array - currently empty
 * To generate new articles, use the admin article generation tool at:
 * /admin/ai-tools/article-generation
 * 
 * This will create articles with proper AI-generated images that are relevant
 * to the content and automatically upload them to the blob storage.
 */
export const blogPosts: BlogPost[] = [{
    id: "swtx4g9l",
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "Decentralized Finance (DeFi): Latest Developments and Innovations",
    excerpt: "Explore the latest developments and innovations in Decentralized Finance (DeFi), including Layer 2 solutions, cross-chain interoperability, and emerging trends that are revolutionizing the financial landscape.",
    date: "May 29, 2025",
    readTime: "4 min read",
    category: "blockchain",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "bia54hp2",
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities",
    title: "The Convergence of AI and Blockchain: Unlocking New Opportunities",
    excerpt: "Discover how the convergence of AI and blockchain technologies is creating unprecedented opportunities across industries, from automated smart contracts to enhanced data security.",
    date: "May 29, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "dzwpccn5",
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    title: "How Blockchain Is Revolutionizing Supply Chain Management",
    excerpt: "Learn how blockchain technology is transforming supply chain management through enhanced transparency, traceability, and efficiency in global logistics and manufacturing.",
    date: "May 29, 2025",
    readTime: "4 min read",
    category: "blockchain",
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "4ttgyyd3",
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "Recent Advancements in AI and Machine Learning",
    excerpt: "Stay up-to-date with the latest breakthroughs in artificial intelligence and machine learning, including neural networks, deep learning applications, and emerging AI technologies.",
    date: "May 29, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2552&q=80",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "j10k9ag6",
    slug: "the-future-of-quantum-computing-in-ai",
    title: "The Future of Quantum Computing in AI",
    excerpt: "Explore the exciting intersection of quantum computing and artificial intelligence, and how these revolutionary technologies will reshape computing capabilities and problem-solving approaches.",
    date: "May 29, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  }];