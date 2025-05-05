import type React from "react"
import Link from "next/link"

export const metadata = {
  title: "Admin | Fantastic AI Studio",
  description: "Admin area for Fantastic AI Studio",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/admin/carousel-upload" className="hover:underline">
                  Carousel Upload
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:underline">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:underline">
                  Back to Site
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">{children}</main>
    </div>
  )
}
