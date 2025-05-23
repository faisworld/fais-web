// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Add pathname to headers for use in server components
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  
  // Ensure Kvitka Poloniny page uses the (standalone) route group
  if (request.nextUrl.pathname === '/kvitka-poloniny') {
    // Just pass through - the route groups will handle it
    return response
  }
  
  // Check for admin routes that need authentication in production
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isAdminLoginRoute = request.nextUrl.pathname.startsWith('/admin/login')

  // For development or preview - bypass authentication
  const isDevOrPreview = 
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview';

  // Only enforce authentication for production admin routes (except login)
  if (isAdminRoute && !isAdminLoginRoute && !isDevOrPreview) {
    const token = await getToken({ req: request })
    
    // If no token or user is not an admin, redirect to login
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // For all other routes, ensure DOCTYPE is present
  if (request.nextUrl.pathname !== '/_next' && !request.nextUrl.pathname.startsWith('/_next/') && !request.nextUrl.pathname.startsWith('/api/')) {
    // Set a header to indicate that we should use correct doctype
    // This will be processed by a script in the layout
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
