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
    <Card className="flex flex-col gap-1 p-1 bg-gray-50 rounded-2xl overflow-hidden border border-solid border-gray-200 w-full">
      <CardContent className="flex gap-4 p-4 bg-white rounded-xl overflow-hidden border border-solid border-gray-200 items-center">
        <div className="flex flex-col items-start justify-end gap-2 flex-1">
          <div className="font-semibold text-gray-500 text-xs">
            RECENT ACTIVITIES
          </div>
        </div>

        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-solid border-gray-200"
        >
          <Filter className="h-4 w-4" />
          <span className="font-semibold text-gray-900 text-sm">Filter</span>
        </Button>
      </CardContent>

      <div className="bg-white rounded-xl border border-solid border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-solid border-gray-200">
              <th className="w-12 h-10 px-4 py-2 text-left">
                <Checkbox className="w-4 h-4" />
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">Payer</span>
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">
                  Email Address
                </span>
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">
                  Time and Date
                </span>
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">Method</span>
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">Status</span>
              </th>
              <th className="px-4 py-2 text-left">
                <span className="font-medium text-gray-500 text-xs">Amount</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="border-b border-solid border-gray-200">
                <td className="h-12 px-4 py-2">
                  <Checkbox className="w-4 h-4" />
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {row.payer}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-[#009688] text-sm">
                    {row.email}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 text-sm">
                    {row.datetime}
                  </span>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 text-sm">
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
                    <span className="font-medium text-xs">{row.status}</span>
                  </Badge>
                </td>
                <td className="h-12 px-4 py-2">
                  <span className="font-semibold text-gray-900 text-sm">
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
