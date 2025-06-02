// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Add pathname to headers for use in server components
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  
  // Ensure Kvitka Poloniny page uses the (standalone) route group
  if (request.nextUrl.pathname === '/kvitka-poloniny') {
    return response
  }
  
  // Check for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  
  // For all other routes, ensure DOCTYPE is present
  if (request.nextUrl.pathname !== '/_next' && !request.nextUrl.pathname.startsWith('/_next/') && !request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-Use-Correct-DOCTYPE', 'true')
  }
  
  // Restrict access to admin routes based on host
  if (isAdminRoute) {
    const host = request.headers.get('host');

    // On production site: Return not-found page for admin routes
    if (host === 'fais.world' || host?.endsWith('.fais.world')) {
      return NextResponse.rewrite(new URL('/non-existent-path-to-trigger-not-found', request.url));
    }

    // Allow only localhost:3000 in all environments
    if (host !== 'localhost:3000') {
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/kvitka-poloniny',
    '/kvitka-poloniny/:path*',
    '/admin/:path*',
  ],
}
