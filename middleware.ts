// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Add pathname to headers for use in server components
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  
  // Ensure Kvitka Poloniny page uses the (standalone) route group
  if (request.nextUrl.pathname === '/kvitka-poloniny') {
    return response
  }
  
  // Check for admin routes that need authentication in production
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = request.nextUrl.pathname === '/admin/login'
  
  // CRITICAL FIX: Always allow direct access to login route
  if (isLoginRoute) {
    // Never redirect the login page to itself!
    return response
  }

  // For development or preview - bypass authentication
  const isDevOrPreview = 
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview';

  // Only enforce authentication for production admin routes
  if (isAdminRoute && !isDevOrPreview) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    
    // If no token or user is not an admin, redirect to login
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // For all other routes, ensure DOCTYPE is present
  if (request.nextUrl.pathname !== '/_next' && !request.nextUrl.pathname.startsWith('/_next/') && !request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-Use-Correct-DOCTYPE', 'true')
  }
  
  return response
}

// Match all paths with exceptions
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/kvitka-poloniny',
    '/kvitka-poloniny/:path*',
  ],
}
