import type React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'Admin | Fantastic AI Studio',
  description: 'Admin area for Fantastic AI Studio',
  robots: {
    index: false,
    follow: false
  }
}

// This layout checks for authentication in server component
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // For development or preview - bypass authentication check
  const isDevOrPreview = 
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview'
    
  // In development, we'll always render the admin content
  if (isDevOrPreview) {
    return (
      <div className="admin-layout min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }
  
  // In production, check authentication
  const session = await getServerSession(authOptions)
  
  // Check if we're on login page using path from headers
  const headersList = await headers();
  const path = headersList.get('x-pathname') || '';
  const isLoginPage = path.includes('/admin/login');

  if (!session && !isLoginPage) {
    // Not authenticated, redirect to login page
    redirect('/admin/login');
    return null;
  }

  // Check if user has admin role
  if (session?.user?.role !== 'admin' && !isLoginPage) {
    // Not an admin user, redirect to login page
    redirect('/admin/login');
    return null;
  }

  // User is authenticated and has admin role
  return (
    <div className="admin-layout min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
