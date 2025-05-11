// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Ensure Kvitka Poloniny page uses the (standalone) route group
  if (request.nextUrl.pathname === '/kvitka-poloniny') {
    // Just pass through - the route groups will handle it
    return NextResponse.next()
  }
}

// Match only the specific paths we want to handle in middleware
export const config = {
  matcher: [
    '/kvitka-poloniny',
    '/kvitka-poloniny/:path*',
  ],
}
