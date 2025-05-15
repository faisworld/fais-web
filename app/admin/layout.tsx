import type React from "react"
import Link from "next/link"
import { FiLayers, FiImage, FiCpu, FiHome } from "react-icons/fi"

export const metadata = {
  title: "Admin | Fantastic AI Studio",
  description: "Admin area for Fantastic AI Studio",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <Link href="/admin" className="text-xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Admin Dashboard
            </span>
          </Link>
          <nav>
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
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">{children}</main>
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Admin Panel • Fantastic AI Studio • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
