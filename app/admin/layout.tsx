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
  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
