import React, { useState } from 'react';
import { Key, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useUpdateProviderPasswordSettingsMutation } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

export default function PasswordTabContent() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { showToast } = useToast();
  const [updatePassword, { isLoading }] = useUpdateProviderPasswordSettingsMutation();

  const handleSave = async () => {
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }

    try {
      const response = await updatePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      showToast(response.message || 'Password changed successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to change password';
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    setCurrentPassword('');
    setNewPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Password Section */}
        <div className="pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Password
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Change or view your password
              </p>
            </div>

            {/* Right Section */}
            <div className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r pr-3">
                    <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-14 pr-12 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r pr-3">
                    <Key className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pl-14 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Must be at least 8 character
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Saving...' : 'Save Change'}
            </button>
          </div>
      </div>
    </div>
  );
}
