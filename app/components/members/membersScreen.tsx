'use client';

import { Card } from "@/components/ui/card";
import { MembersHeader } from "./members-header";
import { TotalMembersCard } from "./total-members-card";
import { MembersTable } from "./members-table";
import { MembersPagination } from "./members-pagination";

export const MembersScreen = () => {
  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <MembersHeader />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <TotalMembersCard />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <div className="overflow-x-auto">
              <MembersTable />
            </div>
            <MembersPagination />
          </Card>
        </div>
      </div>
    </div>
  );
};
