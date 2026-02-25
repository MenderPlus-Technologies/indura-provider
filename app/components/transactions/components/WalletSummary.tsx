import { Card } from "@/components/ui/card";

export const WalletSummary = () => {
  return (
    <div className="w-full mb-4 sm:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        <Card className="p-4 sm:p-5 flex flex-col gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <span className="text-xs font-medium text-[#475467]">Total Wallet Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-[#344054]">₦2,450,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <span className="text-xs font-medium text-[#475467]">Withdrawable Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-[#344054]">₦1,980,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <span className="text-xs font-medium text-[#475467]">Pending Manual Balance</span>
          <span className="text-lg sm:text-xl font-semibold text-[#344054]">₦320,000</span>
        </Card>

        <Card className="p-4 sm:p-5 flex flex-col gap-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <span className="text-xs font-medium text-[#475467]">Pending Payment Links</span>
          <span className="text-lg sm:text-xl font-semibold text-[#344054]">₦150,000</span>
        </Card>
      </div>
    </div>
  );
};

