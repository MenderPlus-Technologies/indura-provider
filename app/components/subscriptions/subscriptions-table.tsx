'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Bell } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  type Subscription,
  getSubscriptionStatusBadgeStyles,
  getSubscriptionStatusDotColor,
  formatDate,
} from "./subscription-utils";

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  onView?: (subscription: Subscription) => void;
  onEdit?: (subscription: Subscription) => void;
  onDelete?: (subscription: Subscription) => void;
  onSendReminder?: (subscription: Subscription) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const SubscriptionsTable = ({ subscriptions, onView, onEdit, onDelete, onSendReminder }: SubscriptionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Customer
            </span>
          </TableHead>
          <TableHead className="w-[180px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Plan
            </span>
          </TableHead>
          <TableHead className="w-[150px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Start Date
            </span>
          </TableHead>
          <TableHead className="w-[150px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              End Date
            </span>
          </TableHead>
          <TableHead className="w-[140px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Status
            </span>
          </TableHead>
          <TableHead className="w-[100px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Actions
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-32 px-4 py-0 text-center">
              <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                No subscriptions found
              </span>
            </TableCell>
          </TableRow>
        ) : (
          subscriptions.map((subscription, index) => (
            <TableRow
              key={subscription.id}
              className={
                index < subscriptions.length - 1
                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                  : ""
              }
            >
              <TableCell className="h-12 px-4 py-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(subscription.memberName)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#344054] dark:text-white text-sm">
                      {subscription.memberName}
                    </span>
                    <span className="font-normal text-[#344054] dark:text-white text-xs">
                      {subscription.memberEmail}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-[#344054] dark:text-white text-sm">
                  {subscription.plan}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-[#344054] dark:text-white text-sm">
                  {formatDate(subscription.startDate)}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-[#344054] dark:text-white text-sm">
                  {formatDate(subscription.endDate)}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <Badge
                  className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getSubscriptionStatusBadgeStyles(subscription.status)}`}
                >
                  <div
                    className={`w-1 h-1 rounded-sm ${getSubscriptionStatusDotColor(subscription.status)}`}
                  />
                  <span className="font-medium text-xs">
                    {subscription.status}
                  </span>
                </Badge>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <div className="flex items-center gap-2">
                  {(subscription.status === 'Expiring Soon' || subscription.status === 'Expired') && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onSendReminder?.(subscription)}
                      className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      title="Send reminder"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-white dark:bg-gray-900">
                      <DropdownMenuItem
                        onClick={() => onView?.(subscription)}
                        className="text-sm text-[#344054] dark:text-gray-200 cursor-pointer"
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit?.(subscription)}
                        className="text-sm text-[#344054] dark:text-gray-200 cursor-pointer"
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete?.(subscription)}
                        className="text-sm text-red-600 dark:text-red-400 cursor-pointer"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
