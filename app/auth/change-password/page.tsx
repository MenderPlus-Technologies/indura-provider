'use client';

import { Suspense } from 'react';
import { ChangePasswordScreen } from '@/app/components/auth/change-password-screen';

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center" />}>
      <ChangePasswordScreen />
    </Suspense>
  );
}
