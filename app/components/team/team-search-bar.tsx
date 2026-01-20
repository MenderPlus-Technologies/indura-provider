'use client';

import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ArrowUpDown, Filter, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { userRoles, type UserRole, type UserStatus } from "./team-utils";

interface TeamSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: UserRole | 'All';
  onRoleChange: (role: UserRole | 'All') => void;
  selectedStatus: UserStatus | 'All';
  onStatusChange: (status: UserStatus | 'All') => void;
  onRefresh?: () => void;
  onFilterClick?: () => void;
}

export const TeamSearchBar = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  onRefresh,
  onFilterClick,
}: TeamSearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center my-2 justify-between gap-2 sm:gap-0 px-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-greyscale-500 dark:text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full h-10 pl-10 pr-4 bg-white dark:bg-gray-800 rounded-lg border border-solid border-gray-200 dark:border-gray-700 font-normal text-gray-900 dark:text-white text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-[#009688]"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
            >
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                {selectedRole === 'All' ? 'All Roles' : selectedRole}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onRoleChange('All')}
            >
              All Roles
            </DropdownMenuItem>
            {userRoles.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(role)}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-auto inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-4 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 cursor-pointer"
            >
              <span className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                {selectedStatus === 'All' ? 'All Status' : selectedStatus}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onStatusChange('All')}
            >
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange('Active')}
            >
              Active
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange('Invited')}
            >
              Invited
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange('Pending')}
            >
              Pending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <RefreshCw className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <ArrowUpDown className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onFilterClick}
          className="h-10 w-10 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
        >
          <Filter className="h-4 w-4 text-gray-700 dark:text-gray-300" />
        </Button>
      </div>
    </div>
  );
};
