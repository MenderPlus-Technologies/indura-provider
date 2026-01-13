'use client';

import { RefreshCw } from "lucide-react";

export const TransactionsScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <RefreshCw className="h-16 w-16 text-[#009688] mb-4" />
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Transactions</h2>
      <p className="text-gray-500">
        Transaction management screen coming soon...
      </p>
    </div>
  );
};