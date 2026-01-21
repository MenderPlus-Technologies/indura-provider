'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInScreen } from './components/auth/sign-in-screen';
import { useAuth } from './contexts/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, requiresPasswordChange } = useAuth();

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
          router.replace('/dashboard');
        }
      } else {
        // Legacy check for backward compatibility
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true' && token) {
          router.replace('/dashboard');
        }
      }
    }
  }, [router, isAuthenticated, requiresPasswordChange]);

  return <SignInScreen />;
}
