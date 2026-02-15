'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { type Member } from "./member-utils";

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

interface MembersTableProps {
  onIndividualNotification?: (member: Member) => void;
  selectedMembers?: Member[];
  onSelectionChange?: (members: Member[]) => void;
  customers: Member[];
  isLoading?: boolean;
}

export const MembersTable = ({ onIndividualNotification, selectedMembers = [], onSelectionChange, customers, isLoading = false }: MembersTableProps) => {
  const getSelectedIndices = () => {
    return customers
      .map((member, idx) => ({ member, idx }))
      .filter(({ member }) => selectedMembers.some(selected => selected.email === member.email))
      .map(({ idx }) => idx);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onSelectionChange?.(customers);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number, checked: boolean | 'indeterminate') => {
    const member = customers[index];
    const isChecked = checked === true;
    
    if (isChecked) {
      if (!selectedMembers.some(selected => selected.email === member.email)) {
        onSelectionChange?.([...selectedMembers, member]);
      }
    } else {
      onSelectionChange?.(selectedMembers.filter(selected => selected.email !== member.email));
    }
  };

  const selectedIndices = getSelectedIndices();
  const isAllSelected = selectedIndices.length === customers.length && customers.length > 0;
  const isIndeterminate = selectedIndices.length > 0 && selectedIndices.length < customers.length;

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
          <TableHead className="w-12 h-10 px-4 py-0">
            <Checkbox 
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              className="w-4 h-4 bg-greyscale-0 dark:bg-gray-800 rounded-[4.8px] border border-solid border-[#dfe1e6] dark:border-gray-700" 
            />
          </TableHead>
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Customer
            </span>
          </TableHead>
          <TableHead className="w-60 h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Email
            </span>
          </TableHead>
          <TableHead className="w-[178px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Phone number
            </span>
          </TableHead>
          <TableHead className="w-[114px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Location
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Total orders
            </span>
          </TableHead>
          <TableHead className="w-[130px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Total spent
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
        {customers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="h-32 px-4 py-0 text-center">
              <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                No customers found
              </span>
            </TableCell>
          </TableRow>
        ) : (
          customers.map((member, index) => (
            <TableRow
              key={member.email}
              className={
                index < customers.length - 1
                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                  : ""
              }
            >
            <TableCell className="h-12 px-4 py-0">
              <Checkbox 
                checked={selectedIndices.includes(index)}
                onCheckedChange={(checked) => handleSelectRow(index, checked)}
                className="w-4 h-4 bg-greyscale-0 dark:bg-gray-800 rounded-[4.8px] border border-solid border-[#dfe1e6] dark:border-gray-700" 
              />
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs font-semibold">
                  {getInitials(member.name)}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white text-sm">
                  {member.name}
                </span>
              </div>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-semibold text-[#009688] dark:text-teal-400 text-sm">
                {member.email}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                {member.phone}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.location}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.totalOrders}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                {member.totalSpent}
              </span>
            </TableCell>
            <TableCell className="h-12 px-4 py-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onIndividualNotification?.(member)}
                className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Send notification to this customer"
              >
                <Bell className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))
        )}
      </TableBody>
    </Table>
  );
};
