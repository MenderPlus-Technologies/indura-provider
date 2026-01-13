'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { tableData, getStatusBadgeStyles, getStatusDotColor, type Transaction } from "./transaction-utils";

export const TransactionsTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6]">
          <TableHead className="w-12 h-10 px-4 py-0">
            <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
          </TableHead>
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Payer
            </span>
          </TableHead>
          <TableHead className="w-60 h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Email Address
            </span>
          </TableHead>
          <TableHead className="w-[178px] h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Time and Date
            </span>
          </TableHead>
          <TableHead className="w-[114px] h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Method
            </span>
          </TableHead>
          <TableHead className="flex-1 h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Status
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-greyscale-500 text-[length:var(--body-small-medium-font-size)] tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
              Amount
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((row, index) => (
          <TableRow
            key={index}
            className={
              index < tableData.length - 1
                ? "border-b border-solid border-[#dfe1e6]"
                : ""
            }
          >
            <TableCell className="h-12 px-4 py-0">
              <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {row.payer}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-[#009688] text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {row.email}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {row.datetime}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
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
                <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                  {row.status}
                </span>
              </Badge>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {row.amount}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
