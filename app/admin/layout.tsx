import type React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Fantastic AI Studio',
  description: 'Admin area for Fantastic AI Studio',
  robots: {
    index: false,
    follow: false
  }
}

// This layout is simplified for localhost usage only
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In production, block access to admin panel
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">Admin panel is only available in development mode.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
