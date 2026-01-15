import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function TimeLanguageTabContent() {
  const [timezone, setTimezone] = useState('EST - San Fransisco, CA (GMT-7:00)');
  const [language, setLanguage] = useState('English (United States)');

  const handleSave = () => {
    console.log('Saving changes:', { timezone, language });
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setTimezone('EST - San Fransisco, CA (GMT-7:00)');
    setLanguage('English (United States)');
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timezone
              </label>
              <div className="relative mb-3">
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option>EST - San Fransisco, CA (GMT-7:00)</option>
                  <option>PST - Los Angeles, CA (GMT-8:00)</option>
                  <option>CST - Chicago, IL (GMT-6:00)</option>
                  <option>MST - Denver, CO (GMT-7:00)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
              <p className="text-sm text-gray-500">
                Current Time 02:45 AM
              </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option>English (United States)</option>
                  <option>English (United Kingdom)</option>
                  <option>Spanish (Spain)</option>
                  <option>French (France)</option>
                  <option>German (Germany)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
}
