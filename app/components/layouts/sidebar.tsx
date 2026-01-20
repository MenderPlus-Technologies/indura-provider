'use client';

import { getMainMenuItems, bottomMenuItems } from "@/app/constants/navigation";
import { SidebarProps } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useProvider } from "@/app/contexts/provider-context";


export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}: SidebarProps & { isMobileMenuOpen?: boolean; setIsMobileMenuOpen?: (value: boolean) => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { supportsSubscriptions, supportsTeamManagement } = useProvider();
  const mainMenuItems = getMainMenuItems(supportsSubscriptions, supportsTeamManagement);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
    }
    router.push('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}

      <aside
        className={`flex flex-col ${
          isCollapsed ? "w-20" : "w-68"
        } items-start bg-white dark:bg-gray-900 border-r border-solid border-gray-200 dark:border-gray-800 h-screen transition-all duration-300 shrink-0
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
      <header className="flex-col items-start gap-2 p-2 flex-[0_0_auto] border-b border-solid border-gray-200 dark:border-gray-800 flex w-full">
        <div className="items-center justify-between p-3 flex-[0_0_auto] flex w-full">
          <div
            className={`flex gap-2 items-center ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <Image
              className="w-8 h-8"
              alt="Indura logo"
              src="https://res.cloudinary.com/dcxdrsgjs/image/upload/v1762925839/Group_phh0r8.svg"
              width={32}
              height={32}
            />
            {!isCollapsed && (
              <p className="text-[#009688] dark:text-teal-400 font-bold text-xl">Indura</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Close Button */}
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen?.(false)}
                className="lg:hidden w-6 h-6 p-0 cursor-pointer text-gray-700 dark:text-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            {/* Desktop Collapse Button */}
            {!isCollapsed && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex w-6 h-6 p-0 bg-white dark:bg-gray-800 cursor-pointer rounded-md border border-solid border-gray-200 dark:border-gray-700"
              >
                <ChevronLeft className="w-3 h-3 text-gray-700 dark:text-gray-300" />
              </Button>
            )}
          </div>
        </div>
        {isCollapsed && (
          <div className="flex justify-center w-full pb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="w-6 h-6 p-0 bg-white dark:bg-gray-800 rounded-md border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              <ChevronRight className="w-3 h-3 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        )}
      </header>

      <nav className="flex flex-col items-center gap-4 p-4 flex-1 w-full overflow-hidden">
        <div className="flex flex-col items-start gap-1 w-full flex-[0_0_auto]">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 py-1 w-full flex-[0_0_auto]">
              <span className="w-fit -mt-px text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium text-sm">
                Main Menu
              </span>
            </div>
          )}
          <div className="flex flex-col gap-2 items-start flex-[0_0_auto] w-full">
            {mainMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-2"
                  } px-3 py-2 flex-[0_0_auto] rounded-lg w-full transition-colors ${
                    isActive
                      ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-[#009688] dark:text-teal-400" : "text-gray-600 dark:text-gray-400"
                    }`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`flex-1 -mt-px font-medium text-base text-left ${
                        isActive ? "text-[#009688] dark:text-teal-400" : "text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex flex-col items-start w-full">
          {bottomMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center cursor-pointer ${
                  isCollapsed ? "justify-center" : "gap-2"
                } px-3 py-2 flex-[0_0_auto] rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  isActive
                    ? "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    : ""
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#009688] dark:text-teal-400" : "text-gray-600 dark:text-gray-400"}`} />
                {!isCollapsed && (
                  <span className={`flex-1 -mt-px font-medium text-base text-left ${
                    isActive ? "text-[#009688] dark:text-teal-400" : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center cursor-pointer ${
              isCollapsed ? "justify-center" : "gap-2"
            } px-3 py-2 flex-[0_0_auto] rounded-lg w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors mt-2`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {!isCollapsed && (
              <span className="flex-1 -mt-px font-medium text-base text-left text-gray-600 dark:text-gray-400">
                Logout
              </span>
            )}
          </button>
        </div>
      </nav>
    </aside>
    </>
  );
};
