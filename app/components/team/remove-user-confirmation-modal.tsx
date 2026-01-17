'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type TeamUser } from './team-utils';

interface RemoveUserConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: TeamUser | null;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const RemoveUserConfirmationModal = ({
  isOpen,
  onClose,
  user,
  onConfirm,
  isLoading = false,
}: RemoveUserConfirmationModalProps) => {
  if (!isOpen || !user) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Remove Team Member
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              Are you sure you want to remove <span className="font-semibold">{user.name}</span> ({user.email}) from your team?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. The user will lose access to the dashboard immediately.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Removing...
                </>
              ) : (
                'Remove User'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
