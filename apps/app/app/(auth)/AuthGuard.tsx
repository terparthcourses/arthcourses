"use client"

// React
import { ReactNode, useEffect } from 'react';

// Next.js Hooks
import { useRouter, usePathname } from 'next/navigation';

// Custom Hooks
import { useSession } from '@/lib/hooks/useSession';

// Lucide Icons 
import { LoaderCircle } from 'lucide-react';

type AuthGuardProps = {
  children: ReactNode; // The protected content to render
  allowedRoles?: string[]; // List of roles that can access this page
  authRequired?: boolean; // Whether authentication is required
  guestOnly?: boolean; // Whether only guests (unauthenticated users) can access
  redirectTo?: string; // Redirect path if access is denied
};

export function AuthGuard({
  children,
  allowedRoles = [],
  authRequired = false,
  guestOnly = false,
  redirectTo = '/',
}: AuthGuardProps) {
  const { user, loading } = useSession()

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait until authentication state is resolved

    const isAuthenticated = !!user; // Check if user is logged in
    const hasRequiredRole = allowedRoles.length === 0 || (user && allowedRoles.includes(user.role || "")); // Check if user has a valid role

    // Case 1: Authentication required but user not authenticated
    if (authRequired && !isAuthenticated) {
      sessionStorage.setItem('redirectAfterLogin', pathname); // Store attempted path for redirect after login
      router.push(redirectTo); // Redirect to the specified route
      return;
    }

    // Case 2: Guest-only routes (e.g., sign-in, sign-up) but user is authenticated
    if (guestOnly && isAuthenticated) {
      router.push(redirectTo); // Redirect authenticated users away from guest-only pages
      return;
    }

    // Case 3: Role-based authorization - user is authenticated but lacks required role
    if (isAuthenticated && allowedRoles.length > 0 && !hasRequiredRole) {
      router.push(redirectTo); // Redirect to the specified page if the role is not allowed
      return;
    }
  }, [user, loading, router, pathname, authRequired, guestOnly, allowedRoles, redirectTo]);

  // Show a loading indicator while authentication status is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // Render the protected content if authorization checks pass
  return <>{children}</>;
}