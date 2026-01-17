'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SubscriptionsPagination = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
      <div className="inline-flex justify-center gap-2 items-center">
        <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
          Page 1 of 1
        </div>
      </div>
      <div className="inline-flex items-start gap-[5px] overflow-x-auto">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button className="h-8 w-8 p-2.5 bg-[#009688] hover:bg-[#008577] rounded-lg overflow-hidden shadow-drop-shadow cursor-pointer">
          <span className="text-white text-sm font-medium">
            1
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
        >
          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};
