import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Loader2 } from 'lucide-react';
import type { ProviderSettingsAccount } from '@/app/store/apiSlice';
import { useUpdateProviderAccountSettingsMutation, useGetProviderSettingsQuery } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

interface AccountTabContentProps {
  settings: ProviderSettingsAccount;
}

export default function AccountTabContent({ settings }: AccountTabContentProps) {
  const [formData, setFormData] = useState({
    fullName: settings.fullName || '',
    email: settings.email || '',
    phone: settings.phone || ''
  });

  const { showToast } = useToast();
  const [updateAccountSettings, { isLoading: isUpdating }] = useUpdateProviderAccountSettingsMutation();
  const { refetch: refetchSettings } = useGetProviderSettingsQuery();

  useEffect(() => {
    setFormData({
      fullName: settings.fullName || '',
      email: settings.email || '',
      phone: settings.phone || ''
    });
  }, [settings]);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateAccountSettings({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      }).unwrap();

      showToast(response.message || 'Account settings updated successfully', 'success');
      await refetchSettings();
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to update account settings';
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: settings.fullName || '',
      email: settings.email || '',
      phone: settings.phone || ''
    });
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4">
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Account setting
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and update your account details, profile, and more.
              </p>
            </div>

            {/* Right Section - Form */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute border-r border-gray-300 dark:border-gray-700 pr-2 inset-y-0 left-0 pl-4 flex items-center pointer-events-none bg-gray-50 dark:bg-gray-800">
                    <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 border-r border-gray-300 dark:border-gray-700 pr-2 left-0 pl-4 flex items-center pointer-events-none bg-gray-50 dark:bg-gray-800">
                    <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone number (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 border-r border-gray-300 dark:border-gray-700 pr-2 left-0 pl-4 flex items-center pointer-events-none bg-gray-50 dark:bg-gray-800">
                    <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isUpdating ? 'Saving...' : 'Save Change'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}