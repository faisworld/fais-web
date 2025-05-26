import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from './admin-auth';

/**
 * Compatibility function that replaces the old checkAdminAuth with the new verifyAdminRequest
 * This allows existing code to continue working with the new host-based authentication system
 */
export async function checkAdminAuth(req?: Request | NextRequest) {
  // If no request is provided, assume we're called from a Next.js API route
  // and should only allow localhost
  if (!req) {
    // In a host-based auth system, no request means we can't check the host
    // So we just check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      return {
        isAuthenticated: true,
        message: 'Development environment'
      };
    } else {
      return {
        isAuthenticated: false,
        message: 'No request provided in production'
      };
    }
  }
  
  // Convert to NextRequest if it's a standard Request
  const nextReq = req instanceof NextRequest ? req : new NextRequest(req.url, {
    headers: req.headers,
    method: req.method
  });
  
  // Use the new verifyAdminRequest function
  const result = await verifyAdminRequest(nextReq);
  
  // Map the result to match the old format
  return {
    isAuthenticated: result.success,
    message: result.message
  };
}
