'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, ArrowRight } from "lucide-react";
import { MetricCard as MetricCardType } from "@/app/types";
interface MetricCardProps {
  data: MetricCardType;
}

export const MetricCard = ({ data }: MetricCardProps) => {
  const { title, value, change, changeType, icon: Icon, footer, footerText } = data;

  return (
    <Card className="flex flex-col gap-1 p-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700">
      <CardContent className="flex items-center gap-4 p-4 rounded-xl overflow-hidden border border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex flex-col items-start justify-end gap-2 flex-1">
          <div className="font-semibold text-[#475467] dark:text-gray-400 text-xs">{title}</div>

          <div className="flex items-center gap-2 w-full">
            <div className="font-semibold text-[#344054] dark:text-white text-xl">{value}</div>

            <Badge
              className={`inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid ${
                changeType === "success"
                  ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
              }`}
            >
              {changeType === "success" ? (
                <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <span
                className={`font-semibold text-xs ${
                  changeType === "success" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {change}
              </span>
            </Badge>
          </div>
        </div>

        <div className="flex w-10 h-10 items-center justify-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border border-solid border-gray-200 dark:border-gray-600">
          <Icon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
        </div>
      </CardContent>

      <div className="flex gap-2 px-3 py-2 w-full rounded-xl items-center">
        <div className="font-semibold text-[#344054] dark:text-white text-sm">{footer}</div>
        <div className="flex-1 font-normal text-gray-500 dark:text-gray-400 text-sm">{footerText}</div>
        <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </div>
    </Card>
  );
};