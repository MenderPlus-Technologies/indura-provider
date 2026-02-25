import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import type { ProviderSettingsTimeLanguage } from '@/app/store/apiSlice';
import {
  useUpdateProviderTimeLanguageSettingsMutation,
  useGetProviderSettingsQuery,
} from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

interface TimeLanguageTabContentProps {
  settings: ProviderSettingsTimeLanguage;
}

export default function TimeLanguageTabContent({ settings }: TimeLanguageTabContentProps) {
  const [timezone, setTimezone] = useState(settings.timezone || '');
  const [language, setLanguage] = useState(settings.language || 'en');
  const [dateFormat, setDateFormat] = useState(settings.dateFormat || 'DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState(settings.timeFormat || '24h');

  const { showToast } = useToast();
  const [updateTimeLanguage, { isLoading }] = useUpdateProviderTimeLanguageSettingsMutation();
  const { refetch: refetchSettings } = useGetProviderSettingsQuery();

  useEffect(() => {
    setTimezone(settings.timezone || '');
    setLanguage(settings.language || 'en');
    setDateFormat(settings.dateFormat || 'DD/MM/YYYY');
    setTimeFormat(settings.timeFormat || '24h');
  }, [settings]);

  const handleSave = async () => {
    try {
      const response = await updateTimeLanguage({
        timezone,
        language,
        dateFormat,
        timeFormat,
      }).unwrap();

      showToast(response.message || 'Time & language settings updated successfully', 'success');
      await refetchSettings();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || error?.message || 'Failed to update time & language settings';
      showToast(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    setTimezone(settings.timezone || '');
    setLanguage(settings.language || 'en');
    setDateFormat(settings.dateFormat || 'DD/MM/YYYY');
    setTimeFormat(settings.timeFormat || '24h');
  };

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Time Section */}
        <div className="pb-8 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Time
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Set your preferred timezone to ensure that all activities align with your local time
              </p>
            </div>

            {/* Right Section */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select timezone</option>
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                    <option value="Africa/Johannesburg">Africa/Johannesburg (SAST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                    <option value="America/Chicago">America/Chicago (CST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
                {timezone && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Current timezone: {timezone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date Format
                </label>
                <div className="relative">
                  <select
                    value={dateFormat}
                    onChange={(e) => setDateFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Format
                </label>
                <div className="relative">
                  <select
                    value={timeFormat}
                    onChange={(e) => setTimeFormat(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="24h">24-hour (24h)</option>
                    <option value="12h">12-hour (12h)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Set your language
              </h2>
              <p className="text-sm text-gray-600">
                Choose the language. All text and communication will be displayed in the language you select
              </p>
            </div>

            {/* Right Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                  <option value="ar">Arabic</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="hi">Hindi</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Change'}
          </button>
        </div>
      </div>
    </div>
  );
}
