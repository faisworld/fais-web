import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

/**
 * Admin authentication utility using NextAuth
 */

export interface AdminAuthResult {
  isAuthenticated: boolean;
  user?: { 
    id: string;
    email?: string;
    name?: string;
    role: string;
  };
  error?: string;
}

/**
 * Checks if the current session belongs to an authenticated admin user
 * Uses NextAuth session to verify authentication and admin role
 * Bypasses authentication in development mode
 */
export async function checkAdminAuth(): Promise<AdminAuthResult> {
  // For development or preview - bypass authentication 
  // This allows testing without auth in development and Vercel Preview
  const isDevOrPreview = 
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview';
    
  if (isDevOrPreview) {
    console.log('Development/Preview mode: Authentication bypassed');
    return { 
      isAuthenticated: true, 
      user: { id: 'dev-admin', role: 'admin' }
    };
  }
  
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        isAuthenticated: false,
        error: 'No active session found'
      };
    }

    // Check if user has admin role
    if (session.user.role !== 'admin') {
      return {
        isAuthenticated: false,
        error: 'Insufficient permissions - admin role required'
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name!,
        role: session.user.role
      }
    };
  } catch (error) {
    console.error('Admin auth check failed:', error);
    return {
      isAuthenticated: false,
      error: 'Authentication check failed'
    };
  }
}

/**
 * Checks admin authentication for client-side components
 * This should be used in API routes or server components
 */
export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || session.user.role !== 'admin') {
    return null;
  }
  
  return session;
}
