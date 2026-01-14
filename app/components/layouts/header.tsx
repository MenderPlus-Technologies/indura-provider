'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Bell, ChevronDown, MoreHorizontal, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChatbotPanel } from "../chatbot/chatbot-panel";

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
  if (pathname === '/dashboard/help') {
    return 'Help Center';
  }
  return 'Dashboard';
};

export const Header = () => {
  const pathname = usePathname();
  const title = getPageTitle(pathname);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <header className="h-18 flex items-center justify-between px-6 py-4 bg-white border-b border-solid border-gray-200 w-full shrink-0">
        <h1 className="font-semibold text-gray-900 text-2xl">{title}</h1>

        <div className="inline-flex items-center gap-3">
          <Button
            onClick={() => setIsChatbotOpen(true)}
            className="h-10 w-10 p-2 bg-[#009688] hover:bg-[#008577] text-white rounded-lg cursor-pointer"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-white rounded-lg border border-solid border-gray-200"
          >
            <Mail className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-white rounded-lg border border-solid border-gray-200"
          >
            <Bell className="h-4 w-4" />
          </Button>

          <div className="w-px h-6.25 bg-gray-200" />

          <Button
            variant="outline"
            className="h-auto inline-flex items-center gap-2 px-2 py-1 bg-white rounded-lg border border-solid border-gray-200"
          >
            <div className="w-6 h-6 rounded-full bg-gray-300" />
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 p-2 bg-white rounded-lg border border-solid border-gray-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ChatbotPanel isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </>
  );
};
