"use client"

import Link from "next/link"
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import Logo from "@/components/ui/Logo"

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  activeSection?: string; // Renamed from currentSection to activeSection for clarity
}

export default function AdminHeader({ breadcrumbs = [], activeSection = "Dashboard" }: AdminHeaderProps) {
  return (
    <div className="admin-header-wrapper">
      {/* Main header with logo */}
      <header className="admin-header bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex">
              <Logo variant="black" className="admin-logo" />
            </Link>
            
            {/* Right side links */}
            <div className="admin-links">
              <Link href="/" className="admin-nav-link">
                Back to Site
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Breadcrumbs and section navigation - aligned with content container */}
      <nav className="admin-nav bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-4 py-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center admin-controls-container">
            {/* Breadcrumbs - now aligned with logo/content */}
            <div className="breadcrumbs flex items-center text-sm mb-2 sm:mb-0">
              <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon className="h-4 w-4 mr-1" />
                <span>Admin</span>
              </Link>
              
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 mx-1 text-gray-400" />
                  {item.href ? (
                    <Link href={item.href} className="text-gray-600 hover:text-gray-900">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Section navigation - highlighting the active section */}
            <div className="admin-section-nav sm:ml-auto space-x-4">
              <Link href="/admin/dashboard" className={`admin-section-link ${activeSection === 'Dashboard' ? 'active' : ''}`}>
                Dashboard
              </Link>
              <Link href="/admin/gallery" className={`admin-section-link ${activeSection === 'Gallery' ? 'active' : ''}`}>
                Gallery
              </Link>
              <Link href="/admin/tools" className={`admin-section-link ${activeSection === 'Tools' ? 'active' : ''}`}>
                AI Tools
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
