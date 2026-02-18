"use client";

import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { useGetProviderIncomeChartQuery } from "@/app/store/apiSlice";

type IncomeChartProps = {
  period: "daily" | "weekly" | "monthly";
};

const formatDisplayDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="flex flex-col w-40 items-start gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center justify-center font-semibold text-gray-900 dark:text-white text-xs uppercase tracking-wide">
          NET INCOME
        </div>

        <div className="flex flex-col items-start gap-1 w-full">
          <div className="flex justify-between w-full items-center">
            <div className="flex items-center justify-center font-semibold text-[#009688] dark:text-teal-400 text-xs">
              ₦{data.thisPeriod.toLocaleString()}
            </div>

            <div className="flex items-center justify-center font-normal text-gray-500 dark:text-gray-400 text-xs">
              {data.date}
            </div>
          </div>

          <div className="flex justify-between w-full items-center">
            <div className="flex items-center justify-center font-semibold text-yellow-500 dark:text-yellow-400 text-xs">
              ₦{data.lastPeriod.toLocaleString()}
            </div>

            <div className="flex items-center justify-center font-normal text-gray-500 dark:text-gray-400 text-xs">
              {data.date}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const IncomeChart = ({ period }: IncomeChartProps) => {
  const { data, isLoading, isError } = useGetProviderIncomeChartQuery({ period });

  const chartData =
    data?.dataPoints?.map((p) => ({
      ...p,
      dateLabel: formatDisplayDate(p.date),
    })) ?? [];

  const hasData = chartData.length > 0;

  // Derive dynamic Y-axis tick values from real data
  const yMax = hasData
    ? Math.max(
        ...chartData.map((p: any) => Math.max(p.thisPeriod ?? 0, p.lastPeriod ?? 0))
      )
    : 0;

  const tickCount = 4;
  const baseStep = yMax > 0 ? Math.ceil(yMax / tickCount) : 1_000;
  const step = baseStep || 1_000;
  const yTicks = Array.from({ length: tickCount }, (_, i) => step * (tickCount - i));

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-start gap-2 sm:gap-6 w-full">
        <div className="hidden sm:inline-flex flex-col h-[180px] items-start justify-between">
          {yTicks.map((value, index) => (
            <div
              key={index}
              className="flex items-center justify-center font-normal text-gray-500 dark:text-gray-400 text-sm"
            >
              {formatNaira(value)}
            </div>
          ))}
        </div>

        <div className="flex h-[180px] items-start justify-between flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient id="colorThisPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#009688" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#009688" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLastPeriod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9800" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#FF9800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#dfe1e6"
                className="dark:stroke-gray-700"
                vertical={true}
                horizontal={false}
              />
              <XAxis
                dataKey="dateLabel"
                axisLine={false}
                tickLine={false}
                tick={false}
                domain={["dataMin", "dataMax"]}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={false}
                domain={[0, yMax || "auto"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="thisPeriod"
                stroke="none"
                fill="url(#colorThisPeriod)"
              />
              <Area
                type="monotone"
                dataKey="lastPeriod"
                stroke="none"
                fill="url(#colorLastPeriod)"
              />
              <Line
                type="monotone"
                dataKey="thisPeriod"
                stroke="#009688"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#009688", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="lastPeriod"
                stroke="#FF9800"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: "#FF9800", stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Date range labels under chart */}
      {hasData && data && (
        <div className="flex items-center justify-between pl-0 sm:pl-[58px] pr-0 py-0 w-full px-4 sm:px-0">
          <div className="flex items-center justify-center font-normal text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            {formatDisplayDate(data.startDate)}
          </div>

          <div className="flex items-center justify-center font-normal text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
            {formatDisplayDate(data.endDate)}
          </div>
        </div>
      )}

      {!isLoading && !isError && !hasData && (
        <div className="flex items-center justify-center py-4">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            No income data for this period
          </span>
        </div>
      )}
    </div>
  );
};
