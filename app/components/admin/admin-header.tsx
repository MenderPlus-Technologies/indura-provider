'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Bell, ChevronDown, MoreHorizontal, PanelLeft, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/contexts/theme-context";
import Image from "next/image";

const getPageTitle = (pathname: string): string => {
  if (pathname === '/admin-dashboard') {
    return 'Admin Dashboard';
  }
  if (pathname === '/admin-dashboard/applications') {
    return 'Provider Applications';
  }
  if (pathname === '/admin-dashboard/users') {
    return 'User Management';
  }
  if (pathname === '/admin-dashboard/forum') {
    return 'Forum Moderation';
  }
  if (pathname === '/admin-dashboard/campaigns') {
    return 'Campaigns';
  }
  if (pathname === '/admin-dashboard/stats') {
    return 'Statistics';
  }
  return 'Admin Dashboard';
};

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export const AdminHeader = ({ onMenuClick }: AdminHeaderProps = {}) => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-18 flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border-b border-solid border-gray-200 dark:border-gray-800 w-full shrink-0">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-semibold text-gray-600 dark:text-white text-lg sm:text-xl lg:text-2xl inter">{title}</h1>
      </div>

      <div className="inline-flex items-center gap-2 sm:gap-3">
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
          )}
        </Button>

        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <Mail className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        </div>

        <div className="hidden sm:block w-px h-6.25 bg-gray-200 dark:bg-gray-700" />

        <Button
          variant="outline"
          className="hidden md:inline-flex items-center gap-2 px-2 py-1 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
          <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="hidden lg:flex h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </header>
  );
};
