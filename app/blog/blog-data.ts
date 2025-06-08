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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/c5864549-d1d1-4989-a01f-8a8ad575ebc1.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/b6b1e607-2d78-48b9-a829-5b3f802a4b8e.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/b2ffcc0f-5a61-4418-858e-fee51b5a4c67.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/1852f4b2-beae-41e7-83f0-9dde2557a42a.png",
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
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/41de19f1-e94f-444b-900b-92f119a8ce16.png",
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
  },
  {
    id: "357f4917",
    slug: "ai-image-generation-technology-breakthroughs",
    title: "AI image generation technology breakthroughs",
    excerpt: "Artificial Intelligence (AI) has been at the forefront of technological innovation, transforming various industries with its capabilities. One of the ...",
    date: "June 8, 2025",
    readTime: "4 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/blog-placeholder-ai-generated-LSpH7hJk2vXbDcYqRzWnPfG3tS8aFm.png",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },];