"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminHeaderProps {
  title?: string;
}

export const AdminHeader = ({ title = "Admin Dashboard" }: AdminHeaderProps) => {
  const pathname = usePathname();
  
  // Check if current path is login page
  const isLoginPage = pathname === "/admin/login";
  
  // Don't show the header on login page
  if (isLoginPage) return null;
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/gallery" 
              className="text-gray-600 hover:text-gray-900"
            >
              Gallery
            </Link>
            <Link
              href="/admin/carousel"
              className="text-gray-600 hover:text-gray-900"
            >
              Carousel
            </Link>
            <Link
              href="/admin/ai-tools"
              className="text-gray-600 hover:text-gray-900"
            >
              AI Tools
            </Link>
          </nav>
          
          {/* Localhost only - no logout needed */}
          <span className="text-sm text-gray-500">Localhost Admin</span>
        </div>
      </div>
    </header>
  );
};
