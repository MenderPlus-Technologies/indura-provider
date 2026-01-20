'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../components/layouts/header";
import { Sidebar } from "../components/layouts/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (isLoggedIn !== 'true') {
        router.replace('/');
      }
    }
  }, [router]);

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
