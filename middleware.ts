// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Ensure Kvitka Poloniny page uses the (standalone) route group
  if (request.nextUrl.pathname === '/kvitka-poloniny') {
    // Just pass through - the route groups will handle it
    return NextResponse.next()
  }
  
  // For all other routes, ensure DOCTYPE is present
  if (request.nextUrl.pathname !== '/_next' && !request.nextUrl.pathname.startsWith('/_next/') && !request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    
    // Set a header to indicate that we should use correct doctype
    // This will be processed by a script in the layout
    response.headers.set('X-Use-Correct-DOCTYPE', 'true')
    
    return response
  }
  
  return NextResponse.next()
}

// Match all paths with exceptions
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/kvitka-poloniny',
    '/kvitka-poloniny/:path*',
  ],
}
