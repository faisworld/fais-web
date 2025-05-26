import { NextRequest } from 'next/server';

/**
 * Admin authentication utility using host restriction
 * This approach restricts admin functionality to localhost:3000 only
 */

/**
 * Verifies if the request is coming from localhost, which is required for admin access
 */
export async function verifyAdminRequest(req: NextRequest) {
  const host = req.headers.get('host');
  
  // Allow localhost:3000 in all environments
  if (host !== 'localhost:3000') {
    return {
      success: false,
      message: 'Unauthorized: Admin endpoints are only accessible from localhost'
    };
  }
  
  return {
    success: true,
    message: 'Authorized'
  };
}