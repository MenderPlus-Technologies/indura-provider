'use client';

import { Button } from "@/components/ui/button";
import { Calendar, Download, ChevronDown, Plus, PanelLeft } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export const TransactionsHeader = () => {
  return (
    <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 border-b border-solid border-[#dfe1e6] w-full">
      <Button
        variant="outline"
        className="h-auto bg-[#F9F9FB] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-solid border-[#dfe1e6]"
      >
        <PanelLeft className="h-4 w-4" />
        <span className="text-greyscale-900">
          Transactions
        </span>
      </Button>

      <div className="inline-flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <Download className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
            >
              <Calendar className="h-4 w-4" />
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                Monthly
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Daily</DropdownMenuItem>
            <DropdownMenuItem>Weekly</DropdownMenuItem>
            <DropdownMenuItem>Monthly</DropdownMenuItem>
            <DropdownMenuItem>Yearly</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-[#009688] rounded-[10px] shadow-shadow-xsmall">
          <Plus className="h-4 w-4 text-greyscale-0" />
          <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-0 text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
            New Request
          </span>
        </Button>
      </div>
    </header>
  );
};
