'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SubscriptionsScreen } from "../../components/subscriptions/subscriptions-screen";
import { useProvider } from "@/app/contexts/provider-context";

export default function SubscriptionsPage() {
  const router = useRouter();
  const { supportsSubscriptions } = useProvider();

  useEffect(() => {
    if (!supportsSubscriptions) {
      // Redirect to dashboard if provider doesn't support subscriptions
      router.replace('/dashboard');
    }
  }, [supportsSubscriptions, router]);

  // Don't render anything if not supported (will redirect)
  if (!supportsSubscriptions) {
    return null;
  }

  return <SubscriptionsScreen />;
}
