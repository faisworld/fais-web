import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      {/* SEO meta tags for 404 page */}
      <title>404 - Page Not Found | Fantastic AI Studio</title>
      <meta name="description" content="The page you're looking for doesn't exist. Explore our AI and blockchain services, projects, and resources." />
      <meta name="robots" content="noindex, follow" />
      
      <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist. It may have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services" className="text-blue-600 hover:text-blue-800 underline">
                Our Services
              </Link>
              <Link href="/projects" className="text-blue-600 hover:text-blue-800 underline">
                Projects
              </Link>
              <Link href="/blog" className="text-blue-600 hover:text-blue-800 underline">
                Blog
              </Link>
              <Link href="/contact" className="text-blue-600 hover:text-blue-800 underline">
                Contact Us
              </Link>
            </div>          </div>
        </div>
      </main>
    </div>
    </>
  );
}
