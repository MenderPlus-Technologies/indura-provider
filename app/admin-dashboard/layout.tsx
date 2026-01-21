'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../components/admin/admin-header";
import { AdminSidebar } from "../components/admin/admin-sidebar";
import { useAuth } from "../contexts/auth-context";
import { ToastProvider } from "@/components/ui/toast";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, user, requiresPasswordChange } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication and admin role
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('authUser');
      
      // Redirect to sign-in if not authenticated
      if (!token || !isAuthenticated) {
        router.replace('/');
        return;
      }

      // Check if user has admin role
      let userData: { role?: string } | null = null;
      if (userStr) {
        try {
          userData = JSON.parse(userStr);
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }

      const userRole = user?.role || userData?.role;
      if (userRole !== 'admin') {
        // Redirect non-admin users to provider dashboard
        router.replace('/dashboard');
        return;
      }

      // Redirect to change password if required
      if (requiresPasswordChange) {
        router.replace('/auth/change-password');
        return;
      }
    }
  }, [router, isAuthenticated, user, requiresPasswordChange]);

  // Show loading state while checking auth
  if (typeof window !== 'undefined' && (!isAuthenticated || user?.role !== 'admin')) {
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
