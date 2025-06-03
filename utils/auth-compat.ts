import { NextRequest } from 'next/server';
import { verifyAdminRequest } from './admin-auth';

/**
 * Compatibility function that replaces the old checkAdminAuth with the new verifyAdminRequest
 * This allows existing code to continue working with the new host-based authentication system
 * and internal API key support for automated scripts
 */
export async function checkAdminAuth(req?: Request | NextRequest) {
  // If no request is provided, assume we're called from a Next.js API route
  if (!req) {
    // In production, check if we have an internal API key environment variable
    const internalApiKey = process.env.INTERNAL_API_KEY;
    
    if (process.env.NODE_ENV === 'development' || internalApiKey) {
      return {
        isAuthenticated: true,
        message: process.env.NODE_ENV === 'development' 
          ? 'Development environment' 
          : 'Internal API key available'
      };
    } else {
      return {
        isAuthenticated: false,
        message: 'No request provided and no internal API key configured'
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
