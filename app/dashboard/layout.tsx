'use client';

import { useState } from "react";
import { Header } from "../components/layouts/header";
import { Sidebar } from "../components/layouts/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
