'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userRoles, type TeamUser, type UserRole } from './team-utils';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: TeamUser) => void;
}

export const InviteUserModal = ({ isOpen, onClose, onSuccess }: InviteUserModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setEmail('');
      setRole('Staff');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !role) {
      console.log('Please fill in all required fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Mock API call - simulate network delay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        const newUser: TeamUser = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: email.trim(),
          role,
          status: 'Pending',
          invitedAt: new Date().toISOString(),
        };

        console.log('User invited successfully', newUser);
        onSuccess(newUser);
        
        // Reset form
        setName('');
        setEmail('');
        setRole('Staff');
        setIsLoading(false);
        onClose();
      } else {
        console.log('Failed to invite user. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleCancel = () => {
    setName('');
    setEmail('');
    setRole('Staff');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite Team Member
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Send an invitation to a new team member
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Form */}
          <div className="flex-1 p-6 space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)} disabled={isLoading}>
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
              disabled={isLoading || !name.trim() || !email.trim() || !role}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Sending Invitation...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
