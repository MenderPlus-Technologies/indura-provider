'use client';

import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Calendar,
  Download,
  ChevronDown,
  ArrowUp,
  PanelLeft,
} from "lucide-react";
import { MetricCards } from "./metric-cards";
import { RecentActivities } from "./recentActivities";
import { IncomeChart } from "./income-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";


export const DashboardScreen = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="h-18 flex justify-between items-center px-6 py-4 border-b border-solid border-gray-200 w-full shrink-0">
        <Button
          variant="outline"
          className="h-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-solid border-gray-200"
        >
                           <PanelLeft className="h-4 w-4" />

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
        
        <Card className="flex-1 flex flex-col gap-1 p-1 bg-greyscale-25 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
          <CardContent className="flex flex-col items-start justify-center w-full rounded-xl overflow-hidden border border-solid border-[#dfe1e6] bg-greyscale-0 p-0">
            <div className="flex justify-between items-center p-4 border-b border-solid border-[#dfe1e6] w-full">
              <div className="flex flex-col items-start justify-end gap-2 flex-1">
                <div className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
                  OVERALL INCOME
                </div>

                <div className="flex items-center gap-2 w-full">
                  <div className="font-semibold text-gray-900 text-2xl">
                    $83,125
                  </div>

                  <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-full border border-solid bg-green-50 border-green-200">
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-600 text-xs">
                      7.7%
                    </span>
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 rounded-[10px] border border-solid border-[#dfe1e6] shadow-shadow-xsmall"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold text-gray-900 text-sm">
                      Monthly
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Daily</DropdownMenuItem>
                  <DropdownMenuItem>Weekly</DropdownMenuItem>
                  <DropdownMenuItem>Monthly</DropdownMenuItem>
                  <DropdownMenuItem>Yearly</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between p-4 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-auto inline-flex h-10 items-center justify-center gap-2 px-4 py-2 rounded-[10px] overflow-hidden bg-greyscale-0 border border-solid border-[#dfe1e6]"
                  >
                    <span className="font-semibold text-gray-900 text-sm">
                      All Service
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All Service</DropdownMenuItem>
                  <DropdownMenuItem>Service 1</DropdownMenuItem>
                  <DropdownMenuItem>Service 2</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="inline-flex items-baseline gap-3">
                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-[#009688] rounded-sm" />
                  <div className="font-normal text-gray-500 text-sm">
                    This period
                  </div>
                </div>

                <div className="inline-flex justify-end gap-1.5 items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-sm" />
                  <div className="font-normal text-gray-500 text-sm">
                    Last period
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <div className="flex flex-col items-start gap-4 p-4 w-full bg-greyscale-0 rounded-xl border border-solid border-[#dfe1e6]">
            <IncomeChart />

            <div className="flex items-center justify-between pl-[58px] pr-0 py-0 w-full">
              <div className="flex items-center justify-center font-normal text-gray-500 text-sm">
                Dec 01, 2025
              </div>

              <div className="flex items-center justify-center font-normal text-gray-500 text-sm">
                Dec 31, 2025
              </div>
            </div>
          </div>
        </Card>
        
        <RecentActivities />
      </div>
    </div>
  );
};