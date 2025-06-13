import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { blogPosts } from "../blog-data";
import { AuthorImage, BlogCoverImage, RelatedPostImage } from "../components/client-images";
import { getMarkdownPost } from "@/utils/markdown";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/structured-data";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params: routeParams }: Props): Promise<Metadata> {
  const { slug } = await routeParams;
  const post = blogPosts.find((post) => post.slug === slug);
  
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
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
      creator: "@FantasticAI",
      site: "@FantasticAI"
    }
  };
}

export default async function BlogPost({ params: routeParams }: Props) { // Make component async and await params
  const { slug } = await routeParams; // Await params before use
  const post = blogPosts.find((post) => post.slug === slug);
  
  if (!post) {
    notFound();
  }
  
  // Try to get markdown content for dynamically generated posts
  const markdownPost = await getMarkdownPost(slug);    return (
    <>
      <ArticleStructuredData
        article={{
          title: post.title,
          description: post.excerpt,
          image: post.coverImage,
          author: post.author || "Fantastic AI Studio",
          publishedDate: new Date(post.date).toISOString(),
          modifiedDate: new Date(post.date).toISOString(),
          url: `https://fais.world/blog/${post.slug}`,
          category: post.category,
          keywords: [post.category, "AI", "technology", "blockchain", "business"].join(", ")
        }}
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://fais.world" },
          { name: "Blog", url: "https://fais.world/blog" },
          { name: post.title, url: `https://fais.world/blog/${post.slug}` }
        ]}
      />
      <div className="container mx-auto px-4 pt-20 pb-8 max-w-4xl"> {/* Changed py-8 to pt-20 pb-8 */}
      {/* Back link */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-gray-800 hover:text-black mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all articles
      </Link>        {/* Blog header */}
      <header className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-8">
          {post.author && post.authorImage && (
            <div className="flex items-center mr-4">
              <AuthorImage 
                authorImage={post.authorImage}
                author={post.author}
              />
              <span>{post.author}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
        </div>      </header>      {/* Cover image */}
      <div className="relative aspect-video w-full mb-32 rounded-lg overflow-hidden">
        <BlogCoverImage
          src={post.coverImage}
          alt={post.title}
        />        <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
          {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
        </div>
      </div>      {/* Blog content */}
      <div className="enhanced-blog-content pb-8 mt-24">{/* Render markdown content for all posts */}        {markdownPost && (          <div 
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-gray-800 prose-strong:text-gray-900 prose-headings:mb-8 prose-p:mb-6 prose-headings:mt-12 prose-h1:mt-16 prose-h2:mt-14 prose-h3:mt-12 prose-headings:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: markdownPost.htmlContent }}
          />
        )}
        
        {/* Fallback for posts without markdown files */}
        {!markdownPost && (
          <div className="text-center py-8">
            <p className="text-gray-600">Content for this article is being prepared. Please check back soon.</p>
          </div>
        )}
      </div>{/* Related posts */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold mb-4">Continue Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(() => {
            // First try posts from same category
            const sameCategory = blogPosts.filter(relatedPost => 
              relatedPost.slug !== slug && 
              relatedPost.category === post.category
            ).slice(0, 2);
            
            // Then add posts from other categories if needed
            const otherCategories = blogPosts.filter(relatedPost => 
              relatedPost.slug !== slug && 
              relatedPost.category !== post.category
            ).slice(0, 2 - sameCategory.length);
            
            const relatedPosts = [...sameCategory, ...otherCategories];
            
            // If we have related posts, display them
            if (relatedPosts.length > 0) {
              return relatedPosts.map(relatedPost => (
                <Link 
                  href={`/blog/${relatedPost.slug}`} 
                  key={relatedPost.id}
                  className="group block"
                >
                  <div className="relative aspect-video w-full mb-3 rounded-lg overflow-hidden">
                    <RelatedPostImage
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                    />
                  </div>
                  <h4 className="font-medium text-lg group-hover:text-gray-900 transition">{relatedPost.title}</h4>
                  <p className="text-sm text-gray-600">{relatedPost.readTime}</p>
                </Link>
              ));
            } else {
              // Fallback if no related posts available
              return (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-600">No related articles available at this time.</p>                  <Link href="/blog" className="inline-block mt-4 text-gray-800 hover:text-black">
                    View all blog posts
                  </Link>
                </div>
              );            }
          })()}
        </div>
      </div>
    </div>
    </>
  );
}
