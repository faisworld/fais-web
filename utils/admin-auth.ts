/**
 * Simple utility for checking admin authentication
 */

export interface AdminAuthResult {
  isAuthenticated: boolean;
  user?: { 
    id: string;
    role: string;
  };
  error?: string;
}

/**
 * Checks if the request is from an authenticated admin user
 * Always returns true in development mode
 */
export async function checkAdminAuth(request: Request): Promise<AdminAuthResult> {
  // For development - always return authenticated
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Authentication bypassed');
    return { 
      isAuthenticated: true, 
      user: { id: 'dev-admin', role: 'admin' }
    };
  }

  // Get the authorization header
  const authHeader = request.headers.get('authorization');
  
  // For production: implement your actual auth logic here
  
  // Simple placeholder implementation
  const isValidToken = authHeader && authHeader.startsWith('Bearer ');
  
  if (!isValidToken) {
    return {
      isAuthenticated: false,
      error: 'Invalid or missing authorization'
    };
  }

  // In a real app, verify token and check if user has admin role
  return {
    isAuthenticated: true,
    user: {
      id: 'admin-user-id',
      role: 'admin'
    }
  };
}
