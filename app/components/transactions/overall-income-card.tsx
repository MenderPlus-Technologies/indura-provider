'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, ArrowUp } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { TransactionsSearchBar } from "./transactions-search-bar";

export const OverallIncomeCard = () => {
  return (
    <Card className="flex flex-col gap-1 p-1 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
      <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden p-0">
        <div className="flex justify-between items-center p-4 border-b border-solid border-[#dfe1e6] w-full">
          <div className="flex flex-col items-start justify-end gap-2 flex-1">
            <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
              OVERALL INCOME
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="font-heading-h4 text-black">
                $83,125
              </div>
              <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-[100px] border border-solid bg-alertssuccess-0 border-[#c6ede5]">
                <ArrowUp className="h-4 w-4 text-alertssuccess-100" />
                <span className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-alertssuccess-100 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                  7.7%
                </span>
              </Badge>
            </div>
          </div>

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
        </div>

        <TransactionsSearchBar />
      </CardContent>
    </Card>
  );
};
