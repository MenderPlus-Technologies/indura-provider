'use client';

import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../components/admin/admin-header";
import { AdminSidebar } from "../components/admin/admin-sidebar";
import { useAuth, isAdminRole } from "../contexts/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import { useInactivityLogout } from "../hooks/use-inactivity-logout";

function readStoredUserRole(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = localStorage.getItem('authUser');
    if (!raw) return undefined;
    const data = JSON.parse(raw) as { role?: string };
    return data.role;
  } catch {
    return undefined;
  }
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, requiresPasswordChange, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const effectiveRole =
    typeof window !== 'undefined' ? user?.role ?? readStoredUserRole() : user?.role;
  const isAdminUser = isAdminRole(effectiveRole);

  // Handle inactivity logout after 5 minutes
  useInactivityLogout(
    () => {
      signOut();
      router.replace('/');
    },
    { timeoutMs: 5 * 60 * 1000 } // 5 minutes
  );

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('authToken');
    const role = user?.role ?? readStoredUserRole();

    if (!token) {
      router.replace('/');
      return;
    }
    if (!isAdminRole(role)) {
      router.replace('/dashboard');
      return;
    }
    if (requiresPasswordChange) {
      router.replace('/auth/change-password');
    }
  }, [router, user?.role, requiresPasswordChange]);

  const mayShowAdminShell =
    isAuthenticated && isAdminUser && !requiresPasswordChange;

  if (typeof window !== 'undefined' && !mayShowAdminShell) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader 
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
