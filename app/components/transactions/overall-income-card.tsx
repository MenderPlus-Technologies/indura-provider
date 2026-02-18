'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ArrowUp } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TransactionsSearchBar } from "./transactions-search-bar";

interface OverallIncomeCardProps {
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

export const OverallIncomeCard = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onSortChange,
  sortBy,
  sortOrder,
  activeFilterCount,
  onDownload,
  onRefresh,
  isRefreshing,
}: OverallIncomeCardProps) => {
  return (
    <Card className="flex flex-col gap-1 p-1 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden p-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-4 border-b border-solid border-[#dfe1e6] dark:border-gray-700 w-full">
          <div className="flex flex-col items-start justify-end gap-2 flex-1">
            <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
              OVERALL INCOME
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="font-semibold text-[#344054] dark:text-white text-xl sm:text-2xl">
                ₦83,125
              </div>
              <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-600 dark:text-green-400 text-xs">
                  7.7%
                </span>
              </Badge>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-700 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-600 shadow-shadow-xsmall cursor-pointer"
              >
                <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                <span className="font-semibold text-[#344054] dark:text-white text-xs sm:text-sm">
                  Monthly
                </span>
                <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Daily</DropdownMenuItem>
              <DropdownMenuItem>Weekly</DropdownMenuItem>
              <DropdownMenuItem>Monthly</DropdownMenuItem>
              <DropdownMenuItem>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TransactionsSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onFilterClick={onFilterClick}
          onSortChange={onSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          activeFilterCount={activeFilterCount}
          onDownload={onDownload}
          onRefresh={onRefresh}
          isRefreshing={isRefreshing}
        />
      </CardContent>
    </Card>
  );
};
