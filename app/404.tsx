import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Custom404() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Menu Bar */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Link href="/">
          <a className="text-blue-500 hover:underline">Return to Home</a>
        </Link>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
