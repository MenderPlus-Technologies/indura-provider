'use client';

import { Card } from "@/components/ui/card";

interface PaymentSummaryProps {
  title: string;
  description?: string | null;
  amount: number;
  currency: string;
  expiresAt: string;
  status: string;
  isExpiredOrInactive: boolean;
}

export const PaymentSummary = ({
  title,
  description,
  amount,
  currency,
  expiresAt,
  status,
  isExpiredOrInactive,
}: PaymentSummaryProps) => {
  const isNGN = currency === "NGN";
  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: isNGN ? "NGN" : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const expiryDate = new Date(expiresAt);
  const formattedExpiry = expiryDate.toLocaleString();

  return (
    <Card className="w-full border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm bg-white dark:bg-gray-900">
      <div className="p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h1 className="text-lg sm:text-xl font-semibold text-[#111827] dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-[#4B5563] dark:text-gray-300">
              {description}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">
            Amount to pay
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-[#111827] dark:text-white">
            {formattedAmount}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
          <p className="text-xs text-[#6B7280] dark:text-gray-400">
            Expires at:{" "}
            <span className="font-medium text-[#111827] dark:text-gray-100">
              {formattedExpiry}
            </span>
          </p>
          <p className="text-xs text-[#6B7280] dark:text-gray-400">
            Status:{" "}
            <span className="font-medium capitalize">
              {status.toLowerCase()}
            </span>
          </p>
        </div>

        {isExpiredOrInactive && (
          <div className="mt-1 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 px-3 py-2">
            <p className="text-xs font-medium text-red-700 dark:text-red-200">
              Payment link expired or inactive. You can no longer complete
              payment with this link.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

