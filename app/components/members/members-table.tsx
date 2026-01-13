'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { membersData, type Member } from "./member-utils";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const MembersTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6]">
          <TableHead className="w-12 h-10 px-4 py-0">
            <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
          </TableHead>
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Customer
            </span>
          </TableHead>
          <TableHead className="w-60 h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Email
            </span>
          </TableHead>
          <TableHead className="w-[178px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Phone number
            </span>
          </TableHead>
          <TableHead className="w-[114px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Location
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Total orders
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 text-xs">
              Total spent
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {membersData.map((member, index) => (
          <TableRow
            key={index}
            className={
              index < membersData.length - 1
                ? "border-b border-solid border-[#dfe1e6]"
                : ""
            }
          >
            <TableCell className="h-12 px-4 py-0">
              <Checkbox className="w-4 h-4 bg-greyscale-0 rounded-[4.8px] border border-solid border-[#dfe1e6]" />
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs font-semibold">
                  {getInitials(member.name)}
                </div>
                <span className="font-semibold text-gray-900 text-sm">
                  {member.name}
                </span>
              </div>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-semibold text-[#009688] text-sm">
                {member.email}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-semibold text-gray-900 text-sm">
                {member.phone}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.location}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.totalOrders}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.totalSpent}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
