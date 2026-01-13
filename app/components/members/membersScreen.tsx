'use client';

import { Card } from "@/components/ui/card";
import { MembersHeader } from "./members-header";
import { TotalMembersCard } from "./total-members-card";
import { MembersTable } from "./members-table";
import { MembersPagination } from "./members-pagination";

export const MembersScreen = () => {
  return (
    <div className="flex flex-col w-full items-start bg-white relative">
      <MembersHeader />

      <div className="mt-4 px-6 gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] flex flex-col gap-2 items-center border border-[#DFE1E6] p-1 rounded-2xl">
          <TotalMembersCard />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <div>
              <MembersTable />
            </div>
            <MembersPagination />
          </Card>
        </div>
      </div>
    </div>
  );
};
