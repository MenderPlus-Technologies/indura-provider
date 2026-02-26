'use client';

import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { TeamHeader } from "./team-header";
import { TeamSearchBar } from "./team-search-bar";
import { TeamTable } from "./team-table";
import { InviteUserModal } from "./invite-user-modal";
import { EditRoleModal } from "./edit-role-modal";
import { RemoveUserConfirmationModal } from "./remove-user-confirmation-modal";
import {
  type TeamUser,
  type UserRole,
  type UserStatus,
  mapApiStatusToUIStatus,
  mapApiRoleToUIRole,
} from "./team-utils";
import { useGetProviderTeamMembersQuery, useResendTeamMemberInvitationMutation, useDeleteTeamMemberMutation } from "@/app/store/apiSlice";
import type { ProviderTeamMember } from "@/app/store/apiSlice";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export const TeamScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'All'>('All');
  
  const { data: teamMembersData, isLoading, isError, refetch, isFetching } =
    useGetProviderTeamMembersQuery({
      page: currentPage,
      limit: 10,
    });
  const [resendInvitation, { isLoading: isResendingInvite }] = useResendTeamMemberInvitationMutation();
  const [deleteTeamMember, { isLoading: isRemoving }] = useDeleteTeamMemberMutation();
  const { showToast } = useToast();
  
  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);

  // Map API team members to UI format
  const users: TeamUser[] = useMemo(() => {
    if (!teamMembersData?.members) {
      return [];
    }

    return teamMembersData.members.map((apiMember: ProviderTeamMember) => ({
      id: apiMember.id,
      name: apiMember.name,
      email: apiMember.email,
      role: mapApiRoleToUIRole(apiMember.role),
      status: mapApiStatusToUIStatus(apiMember.status),
      invitedAt: apiMember.invitedAt,
      joinedAt: apiMember.joinedAt,
      lastActive: apiMember.lastActive,
    }));
  }, [teamMembersData]);

  // Filter users based on search, role, and status
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by search query (name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by status
    if (selectedStatus !== 'All') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    return filtered;
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const handleInviteSuccess = (newUser: TeamUser) => {
    // Refetch team members to get updated list
    refetch();
    console.log('User invited:', newUser);
  };

  const handleEditRole = (user: TeamUser) => {
    setSelectedUser(user);
    setIsEditRoleModalOpen(true);
  };

  const handleRoleUpdateSuccess = (userId: string, newRole: UserRole) => {
    // Refetch team members to get updated list
    refetch();
    console.log('Role updated:', { userId, newRole });
  };

  const handleResendInvite = async (user: TeamUser) => {
    try {
      const response = await resendInvitation(user.id).unwrap();
      
      if (response.success) {
        showToast(response.message || 'Invitation resent successfully', 'success');
        // Refetch to get updated status
        refetch();
      } else {
        showToast(response.message || 'Failed to resend invitation', 'error');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to resend invitation. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const handleRemoveUser = (user: TeamUser) => {
    setSelectedUser(user);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!selectedUser) return;

    try {
      const response = await deleteTeamMember(selectedUser.id).unwrap();

      if (response.success) {
        showToast(response.message || 'Team member removed successfully', 'success');
        // Refetch to get updated list
        refetch();
        setIsRemoveModalOpen(false);
        setSelectedUser(null);
      } else {
        showToast(response.message || 'Failed to remove team member', 'error');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to remove team member. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const handleRefresh = () => {
    refetch();
    console.log('Refreshing team members');
  };

  const handleFilterClick = () => {
    // Handle advanced filter modal/drawer
    console.log('Open advanced filters');
  };

  return (
    <div className="flex flex-col w-full items-start bg-background relative">
      <TeamHeader onInviteUser={() => setIsInviteModalOpen(true)} />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <TeamSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onRefresh={handleRefresh}
              onFilterClick={handleFilterClick}
            />
            <div className="overflow-x-auto">
              {isLoading || isFetching ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center h-64 gap-2">
                  <span className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                    Failed to load team members
                  </span>
                  <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-[#009688] text-white rounded-lg hover:bg-[#007a6b] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <TeamTable
                  users={filteredUsers}
                  onEditRole={handleEditRole}
                  onResendInvite={handleResendInvite}
                  onRemoveUser={handleRemoveUser}
                />
              )}
            </div>
            {/* Pagination */}
            {!isLoading && !isError && teamMembersData?.pagination && teamMembersData.pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
                <div className="inline-flex justify-center gap-2 items-center">
                  <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                    Page {teamMembersData.pagination.page} of {teamMembersData.pagination.totalPages}
                  </div>
                </div>
                <div className="inline-flex items-start gap-[5px]">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(teamMembersData.pagination.totalPages, currentPage + 1))}
                    disabled={currentPage === teamMembersData.pagination.totalPages}
                    className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={isEditRoleModalOpen}
        onClose={() => {
          setIsEditRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleRoleUpdateSuccess}
      />

      {/* Remove User Confirmation Modal */}
      <RemoveUserConfirmationModal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
      />
    </div>
  );
};
