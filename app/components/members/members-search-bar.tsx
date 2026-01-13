'use client';

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export const MembersSearchBar = () => {
  return (
    <div className="flex items-center my-2 justify-between px-2 w-full">
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-4 bg-white rounded-lg border border-solid border-gray-200 font-normal text-gray-900 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-4 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6]"
            >
              <span className="font-semibold text-gray-900 text-sm">
                All Customers
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Customers</DropdownMenuItem>
            <DropdownMenuItem>Active Customers</DropdownMenuItem>
            <DropdownMenuItem>Inactive Customers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
