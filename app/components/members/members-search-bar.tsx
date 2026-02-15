'use client';

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, Download, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface MembersSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  isRefreshing?: boolean;
}

export const MembersSearchBar = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onDownload,
  isRefreshing = false,
}: MembersSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center my-2 justify-between gap-2 sm:gap-0 px-2 w-full">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 font-normal text-gray-900 dark:text-white text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
            >
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                All Customers
              </span>
              <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Customers</DropdownMenuItem>
            <DropdownMenuItem>Active Customers</DropdownMenuItem>
            <DropdownMenuItem>Inactive Customers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 text-gray-700 dark:text-gray-300 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
        {onDownload && (
          <Button
            variant="outline"
            size="icon"
            onClick={onDownload}
            className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
          >
            <Download className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>
        )}
      </div>
    </div>
  );
};
