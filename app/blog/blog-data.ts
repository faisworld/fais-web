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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537152438-img-google-imagen-4-Professional--high-quality-b-j0nA8x5hYVqZgTEm6M7nHfG3tK9bS.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537201562-img-google-imagen-4-Professional--high-quality-b-x7pN2y8hMVqZgTEm6M9fHfG3tK7bS.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537264789-img-google-imagen-4-Professional--high-quality-b-m9pQ3z5hXVqZgTEm6L8kHfG3tN6cS.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537318923-img-google-imagen-4-Professional--high-quality-b-k4rL7w8hQVqZgTEm6P5mHfG3tX2dS.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537372156-img-google-imagen-4-Professional--high-quality-b-h8tM9v5hWVqZgTEm6R3nHfG3tY4eS.png",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },
  {
    id: "f76578b8",
    slug: "latest-advancements-in-large-language-models",
    title: "Latest advancements in large language models",
    excerpt: "In recent years, the field of artificial intelligence (AI) has witnessed remarkable advancements, particularly in the domain of large language models ...",
    date: "June 3, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/e01e3be4-5e49-4d94-a14c-7cb385636ff7.png",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  }
];