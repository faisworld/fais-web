import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
      <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
      <p className="text-xl mb-8">The blog post you&apos;re looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/blog" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
        Return to Blog
      </Link>
    </div>
  );
}