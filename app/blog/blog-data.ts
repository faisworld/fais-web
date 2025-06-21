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
export const blogPosts: BlogPost[] = [
  {
    id: "1b7f607b",
    slug: "nft-marketplaces-and-digital-ownership",
    title: "NFT marketplaces and digital ownership",
    excerpt: "Explore the revolutionary world of NFT marketplaces and digital ownership, understanding how blockchain technology is transforming the way we create, buy, sell, and verify digital assets in the modern economy.",
    date: "June 8, 2025",
    readTime: "6 min read",
    category: "blockchain",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/premium-nft-marketplaces-and-digital-ownership-black-forest-labs-flux-dev-1749818064139.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "40e49042",
    slug: "smart-contracts-in-real-estate",
    title: "Smart contracts in real estate",
    excerpt: "In recent years, the real estate industry has witnessed a technological revolution, with blockchain technology and smart contracts at the forefront of...",
    date: "June 8, 2025",
    readTime: "4 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/premium-smart-contracts-in-real-estate-black-forest-labs-flux-dev-1749818072350.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"  },  {
    id: "swtx4g9l",
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "Decentralized Finance (DeFi): Latest Developments and Innovations",
    excerpt: "Explore the latest developments and innovations in Decentralized Finance (DeFi), including Layer 2 solutions, cross-chain interoperability, and emerging trends that are revolutionizing the financial landscape.",
    date: "June 7, 2025",
    readTime: "4 min read",
    category: "blockchain",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/premium-decentralized-finance-defi-latest-developments-black-forest-labs-flux-dev-1749818081164.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "bia54hp2",
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities",
    title: "The Convergence of AI and Blockchain: Unlocking New Opportunities",
    excerpt: "Discover how the convergence of AI and blockchain technologies is creating unprecedented opportunities across industries, from automated smart contracts to enhanced data security.",
    date: "June 6, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750338413120-ai-machine-learning-professional.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "dzwpccn5",
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    title: "How Blockchain Is Revolutionizing Supply Chain Management",
    excerpt: "Learn how blockchain technology is transforming supply chain management through enhanced transparency, traceability, and efficiency in global logistics and manufacturing.",
    date: "June 5, 2025",
    readTime: "4 min read",
    category: "blockchain",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750338412485-supply-chain-blockchain-professional.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "4ttgyyd3",
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "Recent Advancements in AI and Machine Learning",
    excerpt: "Stay up-to-date with the latest breakthroughs in artificial intelligence and machine learning, including neural networks, deep learning applications, and emerging AI technologies.",
    date: "June 4, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750338413120-ai-machine-learning-professional.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "q5r7t2w9",
    slug: "latest-advancements-in-large-language-models-2025",
    title: "Latest Advancements in Large Language Models 2025",
    excerpt: "In recent years, the field of artificial intelligence (AI) has witnessed remarkable advancements, particularly in the domain of large language models. Explore the latest developments shaping the future of AI.",
    date: "June 3, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/30369d5f-2bd3-42b2-b24e-d03a0e269b92.png",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "j10k9ag6",
    slug: "the-future-of-quantum-computing-in-ai",
    title: "The Future of Quantum Computing in AI",
    excerpt: "Explore the exciting intersection of quantum computing and artificial intelligence, and how these revolutionary technologies will reshape computing capabilities and problem-solving approaches.",
    date: "June 2, 2025",
    readTime: "5 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750338411537-quantum-computing-ai-professional.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },{
    id: "357f4917",
    slug: "ai-image-generation-technology-breakthroughs",
    title: "AI Image Generation Technology Breakthroughs",
    excerpt: "Artificial Intelligence (AI) has been at the forefront of technological innovation, transforming various industries with its capabilities. One of the ...",
    date: "June 8, 2025",
    readTime: "4 min read",
    category: "ai",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750343619378-google-imagen-4-1750343619378.jpeg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  },  {
    id: "k8m3n9p1",
    slug: "how-optimism-layer-2-can-transform-your-business",
    title: "How Optimism Layer 2 Can Transform Your Business",
    excerpt: "Discover how Optimism Layer 2 technology can reduce costs, improve scalability, and accelerate your business operations on the Ethereum blockchain.",
    date: "June 1, 2025",
    readTime: "3 min read",
    category: "blockchain",
    coverImage: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/1750338413744-layer2-optimism-blockchain-professional.jpg",
    featured: false,
    author: "Fantastic AI",
    authorImage: "author-fantastic"
  }];