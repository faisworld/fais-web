import { NextRequest } from 'next/server';

/**
 * Admin authentication utility using host restriction and internal API key support
 * This approach restricts admin functionality to localhost or authenticated internal API calls
 */

/**
 * Verifies if the request is coming from localhost or has valid internal API key
 */
export async function verifyAdminRequest(req: NextRequest) {
  const host = req.headers.get('host');
  const authHeader = req.headers.get('authorization');
  
  // Check for internal API key first (for automated scripts)
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const internalApiKey = process.env.INTERNAL_API_KEY;
    
    if (internalApiKey && token === internalApiKey) {
      return {
        success: true,
        message: 'Authorized via internal API key'
      };
    }
  }
  
  // Allow any localhost port in development
  if (host && host.startsWith('localhost:')) {
    return {
      success: true,
      message: 'Authorized via localhost'
    };
  }
  
  return {
    success: false,
    message: 'Unauthorized: Admin endpoints require localhost access or valid internal API key'
  };
}