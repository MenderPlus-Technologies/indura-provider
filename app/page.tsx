'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInScreen } from './components/auth/sign-in-screen';
import { useAuth } from './contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, requiresPasswordChange, user } = useAuth();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const requiresChange = localStorage.getItem('requiresPasswordChange') === 'true';
      
      if (token && isAuthenticated) {
        // Redirect to change password if required
        if (requiresChange || requiresPasswordChange) {
          router.replace('/auth/change-password');
        } else {
          // Get user role for role-based redirect
          let userRole: string | undefined;
          if (user?.role) {
            userRole = user.role;
          } else {
            // Fallback: read from localStorage
            const userStr = localStorage.getItem('authUser');
            if (userStr) {
              try {
                const parsedUser = JSON.parse(userStr);
                userRole = parsedUser?.role;
              } catch (error) {
                console.error('Failed to parse user data:', error);
              }
            }
          }

          // Role-based redirect
          if (userRole === 'admin') {
            router.replace('/admin-dashboard');
          } else {
            router.replace('/dashboard');
          }
        }
      } else {
        // Legacy check for backward compatibility
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true' && token) {
          router.replace('/dashboard');
        }
      }
    }
  }, [router, isAuthenticated, requiresPasswordChange, user]);

  return <SignInScreen />;
}
