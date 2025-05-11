import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlobImage } from "@/utils/image-utils";
import { blogPosts } from "../blog-data";
import OptimismLayer2Content from "../content/how-optimism-layer-2-can-transform-your-business";
import LargeLanguageModelsContent from "../content/large-language-models-2025";
import BlockchainForSupplyChainContent from "../content/blockchain-for-supply-chain"; // Added import

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params: routeParams }: Props): Promise<Metadata> {
  const params = await routeParams; // Await params before use
  const post = blogPosts.find((post) => post.slug === params.slug);
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found."
    };
  }
  
  return {
    title: `${post.title} | Fantastic AI Studio Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author || "Fantastic AI Studio"],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    }
  };
}

export default async function BlogPost({ params: routeParams }: Props) { // Make component async and await params
  const params = await routeParams; // Await params before use
  const { slug } = params;
  const post = blogPosts.find((post) => post.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl"> {/* Changed py-8 to pt-20 pb-8 */}
      {/* Back link */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all articles
      </Link>
      
      {/* Blog header */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray-600 mb-4">
          {post.author && post.authorImage && (
            <div className="flex items-center mr-4">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <Image 
                  src={getBlobImage(post.authorImage)} 
                  alt={post.author}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span>{post.author}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
        </div>
      </header>
      
      {/* Cover image */}
      <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={getBlobImage(post.coverImage)}
          alt={post.title}
          fill
          className="object-cover"
          priority
        /> {/* Added closing tag */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
        </div>
      </div>
      
      {/* Blog content */}
      <div className="enhanced-blog-content pb-8">
        {slug === "how-optimism-layer-2-can-transform-your-business" && <OptimismLayer2Content />} {/* Fixed */}
        {slug === "large-language-models-2025" && <LargeLanguageModelsContent />} {/* Fixed */}
        {slug === "blockchain-for-supply-chain" && <BlockchainForSupplyChainContent />} {/* Added new content */}
      </div>
      
      {/* Related posts */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-4">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts
            .filter(relatedPost => relatedPost.slug !== slug && relatedPost.category === post.category)
            .slice(0, 2)
            .map(relatedPost => (
              <Link 
                href={`/blog/${relatedPost.slug}`} 
                key={relatedPost.id}
                className="group block"
              >
                <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={getBlobImage(relatedPost.coverImage)}
                    alt={relatedPost.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  /> {/* Added closing tag */}
                </div>
                <h4 className="font-medium text-lg group-hover:text-blue-600 transition">{relatedPost.title}</h4>
                <p className="text-sm text-gray-600">{relatedPost.readTime}</p>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
