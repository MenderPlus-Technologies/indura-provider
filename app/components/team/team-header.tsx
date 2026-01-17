'use client';

import { Button } from "@/components/ui/button";
import { PanelLeft, UserPlus } from "lucide-react";

interface TeamHeaderProps {
  onInviteUser?: () => void;
}

export const TeamHeader = ({ onInviteUser }: TeamHeaderProps) => {
  return (
    <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
      <Button
        variant="outline"
        className="h-auto bg-[#F9F9FB] dark:bg-gray-800 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
      >
        <PanelLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        <span className="text-greyscale-900 dark:text-white text-sm">
          Team Management
        </span>
      </Button>

      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          onClick={onInviteUser}
          className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-[#009688] hover:bg-[#008577] rounded-[10px] shadow-shadow-xsmall cursor-pointer flex-shrink-0"
        >
          <UserPlus className="h-4 w-4 text-white" />
          <span className="font-semibold text-white text-xs sm:text-sm">
            Invite User
          </span>
        </Button>
      </div>
    </header>
  );
};
