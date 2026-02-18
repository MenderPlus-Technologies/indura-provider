'use client';

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { useGetProviderRecentActivitiesQuery } from "@/app/store/apiSlice";
import { getStatusBadgeStyles, getStatusDotColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString("en-NG", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

const parseAmount = (raw: string): number => {
  if (!raw) return 0;
  const numeric = Number(raw.replace(/[^\d.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

export const RecentActivities = () => {
  const { data, isLoading, isError } = useGetProviderRecentActivitiesQuery({
    limit: 10,
    offset: 0,
    period: "monthly",
  });

  const rows = data?.activities ?? [];

  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [methodFilters, setMethodFilters] = useState<string[]>([]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(row.status);
      const matchesMethod =
        methodFilters.length === 0 || methodFilters.includes(row.method);
      return matchesStatus && matchesMethod;
    });
  }, [rows, statusFilters, methodFilters]);

  const activeFilterCount = statusFilters.length + methodFilters.length;

  return (
    <Card className="flex flex-col gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700 w-full">
      <CardContent className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700 items-center">
        <div className="flex flex-col items-start justify-end gap-2 flex-1">
          <div className="font-semibold text-[#475467] dark:text-gray-400 text-xs">
            RECENT ACTIVITIES
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-solid border-gray-200 dark:border-gray-600 cursor-pointer"
            >
              <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span className="font-semibold text-[#344054] dark:text-white text-sm">
                Filter
              </span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-[#009688]/10 text-[#009688] text-[10px] font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-[#475467] dark:text-gray-400">
              Filter by status
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("Pending")}
              onCheckedChange={(checked) =>
                setStatusFilters((prev) =>
                  checked ? [...prev, "Pending"] : prev.filter((s) => s !== "Pending")
                )
              }
            >
              Pending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilters.includes("Settled")}
              onCheckedChange={(checked) =>
                setStatusFilters((prev) =>
                  checked ? [...prev, "Settled"] : prev.filter((s) => s !== "Settled")
                )
              }
            >
              Settled
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-gray-500">
              Filter by method
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={methodFilters.includes("wallet")}
              onCheckedChange={(checked) =>
                setMethodFilters((prev) =>
                  checked
                    ? [...prev, "wallet"]
                    : prev.filter((m) => m !== "wallet")
                )
              }
            >
              Wallet
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={activeFilterCount === 0}
              onCheckedChange={() => {
                setStatusFilters([]);
                setMethodFilters([]);
              }}
            >
              Clear filters
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-solid border-gray-200 dark:border-gray-700 overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading recent activities...</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-red-500">Failed to load recent activities</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">No recent activities</span>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="flex items-center justify-center py-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No activities match the selected filters
            </span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-solid border-gray-200 dark:border-gray-700">
                <th className="w-12 h-10 px-4 py-2 text-left">
                  <Checkbox className="w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">Payer</span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                    Email Address
                  </span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
                    Time and Date
                  </span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">Method</span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">Status</span>
                </th>
                <th className="px-4 py-2 text-left">
                  <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">Amount</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const amountNumber = parseAmount(row.amount);

                return (
                  <tr
                    key={row.id}
                    className="border-b border-solid border-gray-200 dark:border-gray-700"
                  >
                    <td className="h-12 px-4 py-2">
                      <Checkbox className="w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                    </td>
                    <td className="h-12 px-4 py-2">
                      <span className="font-semibold text-[#344054] dark:text-white text-sm">
                        {row.payer}
                      </span>
                    </td>
                    <td className="h-12 px-4 py-2">
                      <span className="font-semibold text-[#009688] dark:text-teal-400 text-sm">
                        {row.email}
                      </span>
                    </td>
                    <td className="h-12 px-4 py-2">
                      <span className="font-semibold text-[#344054] dark:text-white text-sm">
                        {formatDateTime(row.datetime)}
                      </span>
                    </td>
                    <td className="h-12 px-4 py-2">
                      <span className="font-semibold text-[#344054] dark:text-white text-sm">
                        {row.method}
                      </span>
                    </td>
                    <td className="h-12 px-4 py-2">
                      <Badge
                        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full border border-solid ${getStatusBadgeStyles(
                          row.status
                        )}`}
                      >
                        <div
                          className={`w-1 h-1 rounded-sm ${getStatusDotColor(
                            row.status
                          )}`}
                        />
                        <span className="font-medium text-xs text-[#344054] dark:text-white">
                          {row.status}
                        </span>
                      </Badge>
                    </td>
                    <td className="h-12 px-4 py-2">
                      <span className="font-semibold text-[#344054] dark:text-white text-sm">
                        {amountNumber ? formatNaira(amountNumber) : row.amount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};
