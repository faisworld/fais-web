"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider to wrap the entire admin application with authentication
export function AdminAuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Client component that requires authentication - use this inside individual admin pages
export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  
  // Check if we're in development mode - bypass authentication
  const isDevOrPreview = 
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview';

  useEffect(() => {
    // In development, always render the admin content
    if (isDevOrPreview) return;
    
    // In production, check authentication
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    } else if (status === "authenticated" && session?.user?.role !== "admin" && !isLoginPage) {
      // Authenticated but not admin
      router.push("/admin/login");
    }
  }, [session, status, router, isLoginPage, isDevOrPreview]);

  // Show loading or fallback during authentication check
  if (status === "loading") {
    return fallback || <LoadingScreen />;
  }

  // In development, always render the content
  if (isDevOrPreview) {
    return <>{children}</>;
  }

  // On login page, just show the content
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, ensure authenticated admin
  if (status === "authenticated" && session?.user?.role === "admin") {
    return <>{children}</>;
  }

  // Otherwise show fallback
  return fallback || <LoadingScreen />;
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
