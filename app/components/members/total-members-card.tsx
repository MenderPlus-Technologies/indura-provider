'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp } from "lucide-react";
import { MembersSearchBar } from "./members-search-bar";

interface TotalMembersCardProps {
  totalCustomers?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh?: () => void;
  onDownload?: () => void;
  isRefreshing?: boolean;
}

export const TotalMembersCard = ({ 
  totalCustomers = 0,
  searchQuery,
  onSearchChange,
  onRefresh,
  onDownload,
  isRefreshing,
}: TotalMembersCardProps) => {
  return (
    <Card className="flex flex-col gap-1 p-1 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden p-0">
        <div className="flex justify-between items-center p-4 border-b border-solid border-[#dfe1e6] dark:border-gray-700 w-full">
          <div className="flex flex-col items-start justify-end gap-2 flex-1">
            <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
              TOTAL CUSTOMERS
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="font-semibold text-[#344054] dark:text-white text-xl sm:text-2xl">
                {totalCustomers.toLocaleString()}
              </div>
              <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-600 dark:text-green-400 text-xs">
                  +788
                </span>
              </Badge>
            </div>
          </div>
        </div>

        <MembersSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onRefresh={onRefresh}
          onDownload={onDownload}
          isRefreshing={isRefreshing}
        />
      </CardContent>
    </Card>
  );
};
