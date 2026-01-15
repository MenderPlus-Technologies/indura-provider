'use client';

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export const MembersSearchBar = () => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center my-2 justify-between gap-2 sm:gap-0 px-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
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
          <DropdownMenuContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <DropdownMenuItem className="text-gray-900 dark:text-white">All Customers</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-white">Active Customers</DropdownMenuItem>
            <DropdownMenuItem className="text-gray-900 dark:text-white">Inactive Customers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <ArrowUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};
