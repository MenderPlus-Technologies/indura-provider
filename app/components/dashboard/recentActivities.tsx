'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter } from "lucide-react";
import { getStatusBadgeStyles, getStatusDotColor } from "@/lib/utils";
import { tableData } from "@/app/constants/mockData";

export const RecentActivities = () => {
  return (
    <Card className="flex flex-col gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700 w-full">
      <CardContent className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700 items-center">
        <div className="flex flex-col items-start justify-end gap-2 flex-1">
          <div className="font-semibold text-gray-500 dark:text-gray-400 text-xs">
            RECENT ACTIVITIES
          </div>
        </div>

        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-solid border-gray-200 dark:border-gray-600 cursor-pointer"
        >
          <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">Filter</span>
        </Button>
      </CardContent>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-solid border-gray-200 dark:border-gray-700 overflow-x-auto">
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
            {tableData.map((row, index) => (
              <tr key={index} className="border-b border-solid border-gray-200 dark:border-gray-700">
                <td className="h-12 px-4 py-2">
                  <Checkbox className="w-4 h-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" />
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {row.payer}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-[#009688] dark:text-teal-400 text-sm">
                    {row.email}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {row.datetime}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
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
                    <span className="font-medium text-xs text-gray-900 dark:text-white">{row.status}</span>
                  </Badge>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {row.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
