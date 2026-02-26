'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, PanelLeft, Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ChatbotPanel } from "../chatbot/chatbot-panel";
import { useTheme } from "@/app/contexts/theme-context";
import Image from "next/image";
import { useGetProviderNotificationsHistoryQuery } from "@/app/store/apiSlice";

const getPageTitle = (pathname: string): string => {
  if (pathname === '/dashboard') {
    return 'Dashboard';
  }
  if (pathname === '/dashboard/members') {
    return 'Customers';
  }
  if (pathname === '/dashboard/transactions') {
    return 'Transactions';
  }
  if (pathname === '/dashboard/settings') {
    return 'Settings';
  }
  if (pathname === '/dashboard/notifications') {
    return 'Notifications';
  }
  if (pathname === '/dashboard/help') {
    return 'Help Center';
  }
  return 'Dashboard';
};

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps = {}) => {
  const pathname = usePathname();
  const router = useRouter();
  const title = getPageTitle(pathname);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { data: notificationsData } = useGetProviderNotificationsHistoryQuery({
    page: 1,
    limit: 10,
  });
  const hasNewNotifications =
    (notificationsData?.notifications?.length ?? 0) > 0;

  return (
    <>
      <header className="h-18 flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-gray-900 border-b border-solid border-gray-200 dark:border-gray-800 w-full shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-semibold text-[#344054] dark:text-white text-lg sm:text-xl lg:text-2xl">{title}</h1>
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

          <Button
            onClick={() => setIsChatbotOpen(true)}
            className="h-8 w-8 sm:h-10 sm:w-10 p-2 bg-[#009688] hover:bg-[#008577] text-white rounded-lg cursor-pointer"
          >
            <Image
              src="/mendy-ai.svg"
              alt="Mendy AI"
              width={20}
              height={20}
              className="h-4 w-4 sm:h-5 sm:w-5"
            />
          </Button>

          <div className="hidden sm:flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/dashboard/notifications")}
              className="relative h-8 w-8 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <Bell className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              {hasNewNotifications && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#009688] border-2 border-white" />
              )}
            </Button>
          </div>

        </div>
      </header>

      <ChatbotPanel isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
};
