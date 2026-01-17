'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeStyles, getStatusDotColor, type Transaction } from "./transaction-utils";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
          <TableHead className="w-12 h-10 px-4 py-0">
            <Checkbox className="w-4 h-4 bg-greyscale-0 dark:bg-gray-800 rounded-[4.8px] border border-solid border-[#dfe1e6] dark:border-gray-700" />
          </TableHead>
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Payer
            </span>
          </TableHead>
          <TableHead className="w-60 h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Email Address
            </span>
          </TableHead>
          <TableHead className="w-[178px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Time and Date
            </span>
          </TableHead>
          <TableHead className="w-[114px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Method
            </span>
          </TableHead>
          <TableHead className="flex-1 h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Status
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Amount
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="h-32 px-4 py-0 text-center">
              <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                No transactions found
              </span>
            </TableCell>
          </TableRow>
        ) : (
          transactions.map((row, index) => (
            <TableRow
              key={index}
              className={
                index < transactions.length - 1
                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                  : ""
              }
            >
              <TableCell className="h-12 px-4 py-0">
                <Checkbox className="w-4 h-4 bg-greyscale-0 dark:bg-gray-800 rounded-[4.8px] border border-solid border-[#dfe1e6] dark:border-gray-700" />
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {row.payer}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-[#009688] dark:text-teal-400 text-sm">
                  {row.email}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {row.datetime}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                  {row.method}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <Badge
                  className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusBadgeStyles(row.status)}`}
                >
                  <div
                    className={`w-1 h-1 rounded-sm ${getStatusDotColor(row.status)}`}
                  />
                  <span className="font-medium text-xs text-gray-900 dark:text-white">
                    {row.status}
                  </span>
                </Badge>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {row.amount}
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
