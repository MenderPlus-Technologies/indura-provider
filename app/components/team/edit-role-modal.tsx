'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userRoles, type TeamUser, type UserRole } from './team-utils';
import { useUpdateTeamMemberRoleMutation } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TeamUser | null;
  onSuccess: (userId: string, newRole: UserRole) => void;
}

export const EditRoleModal = ({ isOpen, onClose, user, onSuccess }: EditRoleModalProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Staff');
  const [updateTeamMemberRole, { isLoading }] = useUpdateTeamMemberRoleMutation();
  const { showToast } = useToast();

  // Set initial role when modal opens
  useEffect(() => {
    if (isOpen && user) {
      // If user is Owner, default to Staff (Owner cannot be selected)
      setSelectedRole(user.role === 'Owner' ? 'Staff' : user.role);
    }
  }, [isOpen, user]);

  /**
   * Map UI role to API role format (Staff -> staff)
   */
  const mapUIRoleToAPIRole = (uiRole: UserRole): string => {
    return uiRole.toLowerCase();
  };

  const handleSubmit = async () => {
    if (!user || !selectedRole || selectedRole === user.role) {
      onClose();
      return;
    }

    try {
      const response = await updateTeamMemberRole({
        teamMemberId: user.id,
        role: mapUIRoleToAPIRole(selectedRole),
      }).unwrap();

      if (response.success) {
        showToast(response.message || 'Role updated successfully', 'success');
        onSuccess(user.id, selectedRole);
        onClose();
      } else {
        showToast(response.message || 'Failed to update role', 'error');
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update role. Please try again.';
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    if (user) {
      setSelectedRole(user.role);
    }
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Role
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {user.name} ({user.email})
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 p-6">
            {user.role === 'Owner' ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Owner role cannot be changed. Only Admin, Manager, and Staff roles can be assigned.
                </p>
              </div>
            ) : (
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Role <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  disabled={isLoading}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    {userRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedRole === user.role || user.role === 'Owner'}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Role'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
