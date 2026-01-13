'use client';

import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  RefreshCw,
  Calendar,
  Download,
  ChevronDown,
} from "lucide-react";
import { MetricCards } from "./metric-cards";
import { RecentActivities } from "./recentActivities";


export const DashboardScreen = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="h-18 flex justify-between items-center px-6 py-4 border-b border-solid border-gray-200 w-full shrink-0">
        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-solid border-gray-200"
        >
          <LayoutGrid className="h-4 w-4" />
          <span className="font-semibold text-gray-900 text-sm">Overview</span>
        </Button>

        <div className="inline-flex items-start gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 p-2 bg-white rounded-lg border border-solid border-gray-200"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="h-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-solid border-gray-200"
          >
            <Calendar className="h-4 w-4" />
            <span className="font-semibold text-gray-900 text-sm">Monthly</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          <Button className="h-auto inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#009688] rounded-lg text-white">
            <Download className="h-4 w-4" />
            <span className="font-semibold text-sm">Download</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 p-6 w-full">
        <MetricCards />
        <RecentActivities />
      </div>
    </div>
  );
};