"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { FiLayers, FiImage, FiCpu, FiHome, FiLogOut } from "react-icons/fi";

export default function AdminClientLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    // This is client-side only and won't be available during SSR
    setIsDevMode(process.env.NODE_ENV === 'development');
  }, []);
  
  // Skip auth check if we're on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated and not in dev mode, redirect to login
  if (status === "unauthenticated" && !isDevMode) {
    router.push("/admin/login");
    return null;
  }

  // If still loading, show a loading state
  if (status === "loading" && !isDevMode) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  // If authenticated or in dev mode, show the layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/admin" className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Admin Dashboard
            </span>
          </Link>
          <nav className="flex-1 ml-8">
            <ul className="flex space-x-6">
              <li className="flex items-center">
                <Link 
                  href="/admin" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <FiLayers className="mr-1.5" size={16} /> 
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link 
                  href="/admin/gallery" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <FiImage className="mr-1.5" size={16} /> 
                  <span>Gallery</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link 
                  href="/admin/carousel" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <FiImage className="mr-1.5" size={16} /> 
                  <span>Carousel</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link 
                  href="/admin/ai-tools" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <FiCpu className="mr-1.5" size={16} /> 
                  <span>AI Tools</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link 
                  href="/" 
                  className="flex items-center text-gray-700 hover:text-blue-600 transition px-2 py-1 rounded-md hover:bg-blue-50"
                >
                  <FiHome className="mr-1.5" size={16} /> 
                  <span>Back to Site</span>
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {isDevMode ? (
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Dev Mode</div>
            ) : (
              <div className="flex items-center">
                {session?.user?.email && (
                  <span className="text-sm text-gray-700 mr-3">{session.user.email}</span>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center text-gray-700 hover:text-red-600 transition px-2 py-1 rounded-md hover:bg-red-50"
                >
                  <FiLogOut className="mr-1.5" size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>
      
      {isDevMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 py-1 px-4 text-center text-sm text-yellow-800">
          Development Mode: Authentication is bypassed
        </div>
      )}
    </div>
  );
}
