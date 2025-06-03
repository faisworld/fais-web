const blogImageData = [
  {
    slug: "decentralized-finance-defi-latest-developments-and-innovations",
    title: "Decentralized Finance (DeFi): Latest Developments and Innovations",
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537152438-img-google-imagen-4-Professional--high-quality-b-j0nA8x5hYVqZgTEm6M7nHfG3tK9bS.png"
  },
  {
    slug: "the-convergence-of-ai-and-blockchain-unlocking-new-opportunities", 
    title: "The Convergence of AI and Blockchain: Unlocking New Opportunities",
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537201562-img-google-imagen-4-Professional--high-quality-b-x7pN2y8hMVqZgTEm6M9fHfG3tK7bS.png"
  },
  {
    slug: "how-blockchain-is-revolutionizing-supply-chain-management",
    title: "How Blockchain Is Revolutionizing Supply Chain Management", 
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537264789-img-google-imagen-4-Professional--high-quality-b-m9pQ3z5hXVqZgTEm6L8kHfG3tN6cS.png"
  },
  {
    slug: "recent-advancements-in-ai-and-machine-learning",
    title: "Recent Advancements in AI and Machine Learning",
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537318923-img-google-imagen-4-Professional--high-quality-b-k4rL7w8hQVqZgTEm6P5mHfG3tX2dS.png"
  },  {
    slug: "the-future-of-quantum-computing-in-ai",
    title: "The Future of Quantum Computing in AI",
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/article-images/google-imagen-4/1748537372156-img-google-imagen-4-Professional--high-quality-b-h8tM9v5hWVqZgTEm6R3nHfG3tY4eS.png"
  },
  {
    slug: "latest-advancements-in-large-language-models",
    title: "Latest Advancements in Large Language Models", 
    imageUrl: "https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/article-images/stability-ai-sdxl/e01e3be4-5e49-4d94-a14c-7cb385636ff7.png"
  }
];

console.log("Blog Image URLs for updating:");
blogImageData.forEach(item => {
  console.log(`${item.slug}: ${item.imageUrl}`);
});

module.exports = { blogImageData };
