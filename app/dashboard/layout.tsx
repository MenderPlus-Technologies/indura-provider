'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/layouts/header";
import { Sidebar } from "../components/layouts/sidebar";
import { useAuth } from "../contexts/auth-context";
import { useInactivityLogout } from "../hooks/use-inactivity-logout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, requiresPasswordChange, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle inactivity logout after 5 minutes
  useInactivityLogout(
    () => {
      signOut();
      router.replace('/');
    },
    { timeoutMs: 5 * 60 * 1000 } // 5 minutes
  );

  useEffect(() => {
    // Check authentication and password change requirement
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const requiresChange = localStorage.getItem('requiresPasswordChange') === 'true';
      
      // Redirect to sign-in if not authenticated
      if (!token || !isAuthenticated) {
        router.replace('/');
        return;
      }

      // Redirect to change password if required
      if (requiresChange || requiresPasswordChange) {
        router.replace('/auth/change-password');
        return;
      }

      // Legacy check for backward compatibility
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true' && !token) {
        router.replace('/');
      }
    }
  }, [router, isAuthenticated, requiresPasswordChange]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
}
