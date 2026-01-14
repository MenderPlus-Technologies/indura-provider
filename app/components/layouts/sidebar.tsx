'use client';

import { mainMenuItems, bottomMenuItems } from "@/app/constants/navigation";
import { SidebarProps } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


export const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`flex flex-col ${
        isCollapsed ? "w-20" : "w-68"
      } items-start bg-white border-r border-solid border-gray-200 h-screen transition-all duration-300 flex-shrink-0`}
    >
      <header className="flex-col items-start gap-2 p-2 flex-[0_0_auto] border-b border-solid border-gray-200 flex w-full">
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
              <p className="text-[#009688] font-bold text-xl">Indura</p>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="w-6 h-6 p-0 bg-white cursor-pointer rounded-md border border-solid border-gray-200"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center w-full pb-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCollapsed(false)}
              className="w-6 h-6 p-0 bg-white rounded-md border border-solid border-gray-200"
            >
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        )}
      </header>

      <nav className="flex flex-col items-center gap-4 p-4 flex-1 w-full overflow-hidden">
        <div className="flex flex-col items-start gap-1 w-full flex-[0_0_auto]">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 py-1 w-full flex-[0_0_auto]">
              <span className="w-fit -mt-px text-gray-500 whitespace-nowrap font-medium text-sm">
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
                      ? "bg-gray-50 border border-gray-200"
                      : "hover:bg-gray-50"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-[#009688]" : "text-gray-600"
                    }`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`flex-1 -mt-px font-medium text-base text-left ${
                        isActive ? "text-[#009688]" : "text-gray-600"
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
                } px-3 py-2 flex-[0_0_auto] rounded-lg w-full hover:bg-gray-50 transition-colors ${
                  isActive
                    ? "bg-gray-50 border border-gray-200"
                    : ""
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-[#009688]" : "text-gray-600"}`} />
                {!isCollapsed && (
                  <span className={`flex-1 -mt-px font-medium text-base text-left ${
                    isActive ? "text-[#009688]" : "text-gray-600"
                  }`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
