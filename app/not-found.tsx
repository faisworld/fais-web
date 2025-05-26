'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-default)] text-[var(--primary-text-color)]">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-[var(--heading-color)]">
          404 - Page Not Found
        </h1>
        <p className="text-lg mb-6 text-[var(--secondary-text-color)]">
          Oops! The page you are looking for does not exist.
        </p>
        <Link 
          href="/" 
          className="text-[var(--link-color)] hover:text-[var(--link-hover-color)] underline"
        >
          Return to Home
        </Link>
      </main>
    </div>
  );
}
