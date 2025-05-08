'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip protection for login and other public pages
    const publicPaths = ['/auth/login', '/auth/error', '/auth/access'];
    const isPublicPath = publicPaths.includes(pathname);

    if (!isLoading && !isAuthenticated && !isPublicPath) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div className="flex flex-column align-items-center justify-content-center">
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // For public paths, always render the children
  const publicPaths = ['/auth/login', '/auth/error', '/auth/access'];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    return <>{children}</>;
  }

  // For protected paths, only render if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
