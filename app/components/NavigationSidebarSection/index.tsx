'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings, Headphones, ChevronLeft, ChevronRight, Home, RefreshCw, User } from "lucide-react";
import { JSX } from "react";
import Image from "next/image";

const mainMenuItems = [
  { icon: Home, label: "Dashboard", isActive: true },
  { icon: RefreshCw, label: "Transactions", isActive: false },
  { icon: User, label: "Members", isActive: false },
];

const bottomMenuItems = [
  { icon: Settings, label: "Settings" },
  { icon: Headphones, label: "Help Center" },
];

export const NavigationSidebarSection = (): JSX.Element => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`flex flex-col ${isCollapsed ? 'w-20' : 'w-68'} items-start bg-greyscale-0 border-r border-solid border-[#dfe1e6] h-screen transition-all duration-300`}>
      <header className="flex-col items-start gap-2 p-2 flex-[0_0_auto] border-b border-solid border-[#dfe1e6] flex w-full">
        <div className="items-center justify-between p-3 flex-[0_0_auto] flex w-full">
          <div className={`flex gap-2 items-center ${isCollapsed ? 'justify-center w-full' : ''}`}>
            <Image
              className="w-8 h-8"
              alt="Mycaresave logo"
              src="https://res.cloudinary.com/dcxdrsgjs/image/upload/v1762925839/Group_phh0r8.svg"
              width={32}
              height={32}
            />
            {!isCollapsed && (
              <p className="text-[#009688] font-bold text-xl inter">Indura</p>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="w-6 h-6 p-0 bg-greyscale-0 rounded-md border border-solid border-[#dfe1e6] shadow-[0px_0.75px_1.5px_#0d0d120f]"
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
              className="w-6 h-6 p-0 bg-greyscale-0 rounded-md border border-solid border-[#dfe1e6] shadow-[0px_0.75px_1.5px_#0d0d120f]"
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
              <span className="w-fit -mt-px text-[#A4ABB8] whitespace-nowrap inter font-medium text-sm">
                Main Menu
              </span>
            </div>
          )}
          <div className="flex flex-col items-start flex-[0_0_auto] w-full">
            {mainMenuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 flex-[0_0_auto] rounded-lg w-full transition-colors ${
                    item.isActive
                      ? "bg-[#F9F9FB] border border-[#dfe1e6]"
                      : "hover:bg-greyscale-25"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 ${
                      item.isActive ? "text-[#009688]" : "text-[#666D80]"
                    }`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`flex-1 -mt-px font-medium text-base inter text-left ${
                        item.isActive ? "text-[#009688]" : "text-[#666D80]"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-start w-full">
          {bottomMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} px-3 py-2 flex-[0_0_auto] rounded-lg w-full hover:bg-greyscale-25 transition-colors`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 text-[#666D80]" />
                {!isCollapsed && (
                  <span className="flex-1 -mt-px font-medium text-base inter text-[#666D80] text-left">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};