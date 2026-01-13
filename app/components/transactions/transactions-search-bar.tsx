'use client';

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ArrowUpDown, Filter } from "lucide-react";

export const TransactionsSearchBar = () => {
  return (
    <div className="flex items-center my-2 justify-between px-2 w-full">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-4 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-900 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)] placeholder:text-greyscale-500 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <ArrowUpDown className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
