'use client';

import { Suspense } from 'react';
import { ResetPasswordScreen } from '@/app/components/auth/reset-password-screen';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center" />
      }
    >
      <ResetPasswordScreen />
    </Suspense>
  );
}
