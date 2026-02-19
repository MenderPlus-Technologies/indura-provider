'use client';

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Calendar,
  Download,
  ChevronDown,
  ArrowUp,
  PanelLeft,
  Coins,
  BarChart3,
  ShoppingBag,
} from "lucide-react";
import { RecentActivities } from "./recentActivities";
import { IncomeChart } from "./income-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useGetProviderDashboardStatsQuery } from "@/app/store/apiSlice";
import { MetricCard as MetricCardType } from "@/app/types";
import { MetricCard } from "./metric-card";


export const DashboardScreen = () => {
  const { data: statsData, isLoading, isError, refetch } = useGetProviderDashboardStatsQuery();
  const [chartPeriod, setChartPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");

  // Map API data to metric cards format with dummy data fallbacks
  const metricCardsData: MetricCardType[] = useMemo(() => {
    if (!statsData) {
      // Return dummy data while loading or on error
      return [
        {
          title: "Wallet Balance",
          value: "₦0",
          change: "+0%",
          changeType: "success",
          icon: Coins,
          footer: "+₦0",
          footerText: "from last month",
        },
        {
          title: "Todays Payouts",
          value: "₦0",
          change: "+0%",
          changeType: "success",
          icon: BarChart3,
          footer: "+₦0",
          footerText: "from last month",
        },
        {
          title: "Pending Requests",
          value: "0",
          change: "+0%",
          changeType: "success",
          icon: ShoppingBag,
          footer: "+0",
          footerText: "from last month",
        },
        {
          title: "Failed/Refunded",
          value: "0",
          change: "-0%",
          changeType: "error",
          icon: ShoppingBag,
          footer: "-₦0",
          footerText: "from last month",
        },
      ];
    }

    const {
      income,
      activeSubscribers,
      transactionsSummary,
      periodComparison,
      walletBalance,
      pendingPayouts,
      failedRefundedCount,
      failedRefundedAmount,
    } = statsData ?? {};

    // Safely handle missing or malformed transactionsSummary
    const summaryArray = Array.isArray(transactionsSummary) ? transactionsSummary : [];
    
    // Find successful and failed/refunded transactions (with safe defaults)
    const successfulTransactions =
      summaryArray.find((t) => t._id === 'successful') || { count: 0, totalAmount: 0 };
    const failedTransactions =
      summaryArray.find((t) => t._id === 'failed' || t._id === 'refunded') || {
        count: 0,
        totalAmount: 0,
      };
    
    // Format wallet balance (preferred) with fallback to income
    const formattedWalletBalance = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format((walletBalance ?? income) ?? 0);

    // Format today's payouts (using successful transactions totalAmount)
    const formattedPayouts = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(successfulTransactions.totalAmount);

    const formatPct = (n?: number) => {
      const v = typeof n === 'number' && Number.isFinite(n) ? n : 0;
      const sign = v > 0 ? '+' : '';
      return `${sign}${v}%`;
    };

    const formatMoney = (n?: number) =>
      new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(typeof n === 'number' && Number.isFinite(n) ? n : 0);

    return [
      {
        title: "Wallet Balance",
        value: formattedWalletBalance,
        change: formatPct(periodComparison?.incomeChange),
        changeType: (periodComparison?.incomeChange ?? 0) >= 0 ? "success" : "error",
        icon: Coins,
        footer: formatMoney(periodComparison?.incomeChangeAmount),
        footerText: "from last month",
      },
      {
        title: "Todays Payouts",
        value: formattedPayouts,
        change: formatPct(periodComparison?.payoutsChange),
        changeType: (periodComparison?.payoutsChange ?? 0) >= 0 ? "success" : "error",
        icon: BarChart3,
        footer: `+${periodComparison?.payoutsChangeCount ?? successfulTransactions.count ?? 0}`,
        footerText: "transactions",
      },
      {
        title: "Active Subscribers",
        value: (activeSubscribers ?? 0).toString(),
        change: formatPct(periodComparison?.subscribersChange),
        changeType: (periodComparison?.subscribersChange ?? 0) >= 0 ? "success" : "error",
        icon: ShoppingBag,
        footer: `+${periodComparison?.subscribersChangeCount ?? 0}`,
        footerText: "from last month",
      },
      {
        title: "Failed/Refunded",
        value: String(failedRefundedCount ?? failedTransactions.count ?? 0),
        change: "-0%",
        changeType: "error",
        icon: ShoppingBag,
        footer: `-${formatMoney(failedRefundedAmount ?? failedTransactions.totalAmount ?? 0)}`,
        footerText: "from last month",
      },
    ];
  }, [statsData]);

  // Format income for display
  const formattedOverallIncome = useMemo(() => {
    if (!statsData) return "₦83,125"; // Dummy fallback
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(statsData.income);
  }, [statsData]);

  return (
    <div className="flex flex-col w-full">
      <div className="h-18 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 px-4 sm:px-6 py-4 border-b border-solid border-gray-200 dark:border-gray-800 w-full shrink-0">
        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer"
        >
          <PanelLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-[#344054] dark:text-white text-sm">Overview</span>
        </Button>

        <div className="inline-flex items-start gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading}
            className="h-8 w-8 sm:h-10 sm:w-10 p-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 text-gray-700 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          <Button
            variant="outline"
            className="h-auto inline-flex items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 cursor-pointer flex-1 sm:flex-initial"
          >
            <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            <span className="font-semibold text-[#344054] dark:text-white text-xs sm:text-sm">Monthly</span>
            <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </Button>

          <Button className="h-auto inline-flex items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-[#009688] hover:bg-[#008577] rounded-lg text-white cursor-pointer">
            <Download className="h-4 w-4" />
            <span className="font-semibold text-xs sm:text-sm hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 sm:gap-6 p-4 sm:p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 lg:mt-0 w-full">
          {metricCardsData.map((card, index) => (
            <MetricCard key={index} data={card} />
          ))}
        </div>
        
        <Card className="flex-1 flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
          <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800 p-0">
            <div className="flex justify-between items-center p-4 border-b border-solid border-[#dfe1e6] dark:border-gray-700 w-full">
              <div className="flex flex-col items-start justify-end gap-2 flex-1">
                <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
                  OVERALL INCOME
                </div>

                <div className="flex items-center gap-2 w-full">
                  <div className="font-semibold text-[#344054] dark:text-white text-2xl">
                    {formattedOverallIncome}
                  </div>

                  <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                    <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-600 dark:text-green-400 text-xs">
                      7.7%
                    </span>
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-700 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-600 shadow-shadow-xsmall cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                    <span className="font-semibold text-[#344054] dark:text-white text-sm capitalize">
                      {chartPeriod}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setChartPeriod("daily")}>Daily</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartPeriod("weekly")}>Weekly</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartPeriod("monthly")}>Monthly</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-[10px] overflow-hidden bg-greyscale-0 dark:bg-gray-700 border border-solid border-[#dfe1e6] dark:border-gray-600 cursor-pointer"
                  >
                        <span className="font-semibold text-[#344054] dark:text-white text-xs sm:text-sm">
                      All Service
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Service</DropdownMenuItem>
                  <DropdownMenuItem>Service 1</DropdownMenuItem>
                  <DropdownMenuItem>Service 2</DropdownMenuItem>    
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="inline-flex items-baseline gap-2 sm:gap-3">
                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#009688] rounded-sm" />
                  <div className="font-normal text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    This period
                  </div>
                </div>

                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-sm" />
                  <div className="font-normal text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                    Last period
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex flex-col items-start gap-4 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
            <IncomeChart period={chartPeriod} />
          </div>
        </Card>
        
        <RecentActivities />
      </div>
    </div>
  );
};