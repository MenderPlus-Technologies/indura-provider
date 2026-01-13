'use client';

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const MembersPagination = () => {
  return (
    <div className="flex items-center justify-between p-4 w-full bg-greyscale-0 rounded-xl border border-solid border-[#dfe1e6]">
      <div className="inline-flex justify-center gap-2 items-center">
        <div className="font-medium text-gray-900 text-sm">
          Page 1 of 34
        </div>
      </div>
      <div className="inline-flex items-start gap-[5px]">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button className="h-8 w-8 p-2.5 bg-[#009688] rounded-lg overflow-hidden shadow-drop-shadow">
          <span className="text-white text-sm font-medium">
            1
          </span>
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
        >
          <span className="text-gray-900 text-sm font-medium">
            2
          </span>
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
        >
          <span className="text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
            3
          </span>
        </Button>
        <div className="flex flex-col w-8 h-8 items-center justify-center gap-2.5 p-2.5 bg-greyscale-0 rounded-lg">
          <span className="flex items-center justify-center text-gray-900 text-xs font-medium">
            ...
          </span>
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
        >
          <span className="text-greyscale-900 text-[length:var(--body-medium-medium-font-size)] tracking-[var(--body-medium-medium-letter-spacing)] leading-[var(--body-medium-medium-line-height)] font-body-medium-medium font-[number:var(--body-medium-medium-font-weight)] [font-style:var(--body-medium-medium-font-style)]">
            34
          </span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2.5 bg-greyscale-0 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_1px_2px_#0d0d120f]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
