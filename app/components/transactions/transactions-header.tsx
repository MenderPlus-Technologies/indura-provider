'use client';

import { Button } from "@/components/ui/button";
import { Calendar, Download, ChevronDown, Plus, PanelLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface TransactionsHeaderProps {
  onNewRequest?: () => void;
}

export const TransactionsHeader = ({ onNewRequest }: TransactionsHeaderProps) => {
  return (
    <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
      <Button
        variant="outline"
        className="h-auto bg-[#F9F9FB] dark:bg-gray-800 inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
      >
        <PanelLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        <span className="text-greyscale-900 dark:text-white text-sm">
          Transactions
        </span>
      </Button>

      <div className="inline-flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer flex-1 sm:flex-initial"
            >
              <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                Monthly
              </span>
              <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem className="text-gray-900 dark:text-white">Daily</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-white">Weekly</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-white">Monthly</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-white">Yearly</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onNewRequest}
          className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-[#009688] hover:bg-[#008577] rounded-[10px] shadow-shadow-xsmall cursor-pointer flex-1 sm:flex-initial"
        >
          <Plus className="h-4 w-4 text-greyscale-0" />
          <span className="font-semibold text-white text-xs sm:text-sm">
            New Request
          </span>
        </Button>
      </div>
    </header>
  );
};
