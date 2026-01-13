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
            <div className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
              OVERALL INCOME
            </div>
            <div className="flex items-center gap-2 w-full">
              <div className="font-semibold text-gray-900 text-2xl">
                $83,125
              </div>
              <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid bg-green-50 border-green-200">
                <ArrowUp className="h-4 w-4 text-green-600" />
                <span className="font-semibold text-green-600 text-xs">
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
                <span className="font-semibold text-gray-900 text-sm">
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
