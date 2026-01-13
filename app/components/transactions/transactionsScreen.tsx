'use client';

import { Card } from "@/components/ui/card";
import { TransactionsHeader } from "./transactions-header";
import { OverallIncomeCard } from "./overall-income-card";
import { TransactionsTable } from "./transactions-table";
import { TransactionsPagination } from "./transactions-pagination";

export const TransactionsScreen = () => {
  return (
    <div className="flex flex-col w-full items-start bg-white relative">
      <TransactionsHeader />

      <div className="mt-4 px-6 gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] flex flex-col gap-2 items-center border border-[#DFE1E6] p-1 rounded-2xl">
          <OverallIncomeCard />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <div>
              <TransactionsTable />
            </div>
            <TransactionsPagination />
          </Card>
        </div>
      </div>
    </div>
  );
};
