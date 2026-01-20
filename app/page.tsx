'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignInScreen } from './components/auth/sign-in-screen';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        router.replace('/dashboard');
      }
    }
  }, [router]);

  return <SignInScreen />;
}
