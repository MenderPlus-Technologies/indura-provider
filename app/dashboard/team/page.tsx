'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeamScreen } from "../../components/team/team-screen";
import { useProvider } from "@/app/contexts/provider-context";

export default function TeamPage() {
  const router = useRouter();
  const { supportsTeamManagement } = useProvider();

  useEffect(() => {
    if (!supportsTeamManagement) {
      // Redirect to dashboard if provider doesn't support team management
      router.replace('/dashboard');
    }
  }, [supportsTeamManagement, router]);

  // Don't render anything if not supported (will redirect)
  if (!supportsTeamManagement) {
    return null;
  }

  return <TeamScreen />;
}
