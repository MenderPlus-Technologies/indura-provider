'use client';

import { Button } from "@/components/ui/button";
import { Upload, Mail, UserPlus, PanelLeft } from "lucide-react";

export const MembersHeader = () => {
  return (
    <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 border-b border-solid border-[#dfe1e6] w-full">
      <Button
        variant="outline"
        className="h-auto bg-[#F9F9FB] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-solid border-[#dfe1e6]"
      >
        <PanelLeft className="h-4 w-4" />
        <span className="text-greyscale-900">
          Customers
        </span>
      </Button>

      <div className="inline-flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-2 bg-greyscale-0 rounded-lg border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <Upload className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
        >
          <Mail className="h-4 w-4" />
          <span className="font-semibold text-gray-900 text-sm">
            Email Segment
          </span>
        </Button>

        <Button className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-[#009688] rounded-[10px] shadow-shadow-xsmall">
          <UserPlus className="h-4 w-4 text-greyscale-0" />
          <span className="font-semibold text-white text-sm">
            Add Customers
          </span>
        </Button>
      </div>
    </header>
  );
};
