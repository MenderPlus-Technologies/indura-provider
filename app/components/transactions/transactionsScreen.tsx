'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { TransactionsHeader } from "./transactions-header";
import { OverallIncomeCard } from "./overall-income-card";
import { TransactionsTable } from "./transactions-table";
import { TransactionsPagination } from "./transactions-pagination";
import { NewRequestModal } from "./new-request-modal";
import { tableData, type Transaction } from "./transaction-utils";

export const TransactionsScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(tableData);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);

  const handleNewRequestSuccess = (newTransaction: Transaction) => {
    // Add new transaction to the beginning of the list
    setTransactions(prev => [newTransaction, ...prev]);
    console.log('New transaction request created:', newTransaction);
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <TransactionsHeader onNewRequest={() => setIsNewRequestModalOpen(true)} />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <OverallIncomeCard />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <div className="overflow-x-auto">
              <TransactionsTable transactions={transactions} />
            </div>
            <TransactionsPagination />
          </Card>
        </div>
      </div>

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSuccess={handleNewRequestSuccess}
      />
    </div>
  );
};
