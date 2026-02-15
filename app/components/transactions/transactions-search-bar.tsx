'use client';

import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowUp, ArrowDown, Download, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TransactionsSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onSortChange: (sortBy: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  activeFilterCount: number;
  onDownload?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const TransactionsSearchBar = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onSortChange,
  sortBy,
  sortOrder,
  activeFilterCount,
  onDownload,
  onRefresh,
  isRefreshing = false,
}: TransactionsSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center my-2 justify-between gap-2 sm:gap-2 px-2 w-full">
      <div className="relative w-[300px] ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search by payer, email, or reference..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 font-normal text-gray-900 dark:text-white text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]"
        />
      </div>
      <div className="flex items-center gap-2">
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
       
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer relative"
        >
          <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          {activeFilterCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#009688] text-white text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );
};
