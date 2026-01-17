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
  mockTeamUsers,
  type TeamUser,
  type UserRole,
  type UserStatus,
} from "./team-utils";

export const TeamScreen = () => {
  const [users, setUsers] = useState<TeamUser[]>(mockTeamUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | 'All'>('All');
  
  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

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
    setUsers(prev => [...prev, newUser]);
    console.log('User invited:', newUser);
  };

  const handleEditRole = (user: TeamUser) => {
    setSelectedUser(user);
    setIsEditRoleModalOpen(true);
  };

  const handleRoleUpdateSuccess = (userId: string, newRole: UserRole) => {
    setUsers(prev =>
      prev.map(user => (user.id === userId ? { ...user, role: newRole } : user))
    );
    console.log('Role updated:', { userId, newRole });
  };

  const handleResendInvite = (user: TeamUser) => {
    setIsRemoving(false);
    
    // Mock resend invite
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      if (success) {
        setUsers(prev =>
          prev.map(u =>
            u.id === user.id
              ? { ...u, status: 'Pending' as UserStatus, invitedAt: new Date().toISOString() }
              : u
          )
        );
        console.log('Invitation resent:', user.email);
      } else {
        console.log('Failed to resend invitation. Please try again.');
      }
    }, 1000);
  };

  const handleRemoveUser = (user: TeamUser) => {
    setSelectedUser(user);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!selectedUser) return;

    setIsRemoving(true);

    // Mock API call
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
        console.log('User removed:', selectedUser.email);
        setIsRemoveModalOpen(false);
        setSelectedUser(null);
        setIsRemoving(false);
      } else {
        console.log('Failed to remove user. Please try again.');
        setIsRemoving(false);
      }
    }, 1000);
  };

  const handleRefresh = () => {
    // Refresh users (in real app, this would fetch from API)
    console.log('Refreshing team members');
  };

  const handleFilterClick = () => {
    // Handle advanced filter modal/drawer
    console.log('Open advanced filters');
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
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
              <TeamTable
                users={filteredUsers}
                onEditRole={handleEditRole}
                onResendInvite={handleResendInvite}
                onRemoveUser={handleRemoveUser}
              />
            </div>
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
          setIsRemoving(false);
        }}
        user={selectedUser}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
      />
    </div>
  );
};
