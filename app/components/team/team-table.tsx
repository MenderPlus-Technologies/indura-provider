'use client';

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Edit, Trash2 } from "lucide-react";
import {
  type TeamUser,
  getRoleBadgeStyles,
  getStatusBadgeStyles,
  getStatusDotColor,
} from "./team-utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface TeamTableProps {
  users: TeamUser[];
  onEditRole?: (user: TeamUser) => void;
  onResendInvite?: (user: TeamUser) => void;
  onRemoveUser?: (user: TeamUser) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const TeamTable = ({ users, onEditRole, onResendInvite, onRemoveUser }: TeamTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-solid border-[#dfe1e6] dark:border-gray-700">
          <TableHead className="w-[246px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Name
            </span>
          </TableHead>
          <TableHead className="w-[280px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Email
            </span>
          </TableHead>
          <TableHead className="w-[150px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Role
            </span>
          </TableHead>
          <TableHead className="w-[140px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Status
            </span>
          </TableHead>
          <TableHead className="w-[120px] h-10 px-4 py-0">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs">
              Actions
            </span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-32 px-4 py-0 text-center">
              <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                No team members found
              </span>
            </TableCell>
          </TableRow>
        ) : (
          users.map((user, index) => (
            <TableRow
              key={user.id}
              className={
                index < users.length - 1
                  ? "border-b border-solid border-[#dfe1e6] dark:border-gray-700"
                  : ""
              }
            >
              <TableCell className="h-12 px-4 py-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#009688] flex items-center justify-center text-white text-xs font-semibold">
                    {getInitials(user.name)}
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white text-sm">
                    {user.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <span className="font-semibold text-[#009688] dark:text-teal-400 text-sm">
                  {user.email}
                </span>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <Badge
                  className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getRoleBadgeStyles(user.role)}`}
                >
                  <span className="font-medium text-xs">
                    {user.role}
                  </span>
                </Badge>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
                <Badge
                  className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusBadgeStyles(user.status)}`}
                >
                  <div
                    className={`w-1 h-1 rounded-sm ${getStatusDotColor(user.status)}`}
                  />
                  <span className="font-medium text-xs">
                    {user.status}
                  </span>
                </Badge>
              </TableCell>
              <TableCell className="h-12 px-4 py-0">
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
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => onEditRole?.(user)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Role
                    </DropdownMenuItem>
                    {(user.status === 'Invited' || user.status === 'Pending') && (
                      <DropdownMenuItem
                        onClick={() => onResendInvite?.(user)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Invite
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onRemoveUser?.(user)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
