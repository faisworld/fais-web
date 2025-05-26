import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from './admin-auth';

/**
 * Temporary function to help migrate from the old checkAdminAuth to the new verifyAdminRequest
 * This provides backward compatibility for routes that still use the old pattern
 */
export async function checkAdminAuth(req?: Request | NextRequest) {
  // If no request is provided, return unauthorized
  if (!req) {
    return {
      isAuthenticated: false,
      message: 'No request provided'
    };
  }
  
  // Convert to NextRequest if it's a standard Request
  const nextReq = req instanceof NextRequest ? req : new NextRequest(req.url, {
    headers: req.headers,
    method: req.method
  });
  
  // Use the new verifyAdminRequest function
  const result = await verifyAdminRequest(nextReq);
  
  return {
    isAuthenticated: result.success,
    message: result.message
  };
}
