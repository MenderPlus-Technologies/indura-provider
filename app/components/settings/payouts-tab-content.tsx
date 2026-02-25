import React, { useState, useEffect } from 'react';
import { ChevronDown, Download, Bell } from 'lucide-react';
import type { ProviderSettingsPayouts } from '@/app/store/apiSlice';

interface PayoutsTabContentProps {
  settings: ProviderSettingsPayouts;
}

export default function PayoutsTabContent({ settings }: PayoutsTabContentProps) {
  const [formData, setFormData] = useState({
    payoutFrequency: settings.payoutFrequency || '',
    payoutDay: settings.payoutDay || '',
    storeCurrency: settings.storeCurrency || '',
    bankName: settings.bankDetails?.bankName || '',
    accountNumber: settings.bankDetails?.accountNumber || '',
    accountName: settings.bankDetails?.accountName || '',
    routingNumber: settings.bankDetails?.routingNumber || '',
    swiftCode: settings.bankDetails?.swiftCode || ''
  });

  useEffect(() => {
    setFormData({
      payoutFrequency: settings.payoutFrequency || '',
      payoutDay: settings.payoutDay || '',
      storeCurrency: settings.storeCurrency || '',
      bankName: settings.bankDetails?.bankName || '',
      accountNumber: settings.bankDetails?.accountNumber || '',
      accountName: settings.bankDetails?.accountName || '',
      routingNumber: settings.bankDetails?.routingNumber || '',
      swiftCode: settings.bankDetails?.swiftCode || ''
    });
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    console.log('Saving changes:', formData);
    alert('Changes saved successfully!');
  };

  const handleCancel = () => {
    setFormData({
      payoutFrequency: settings.payoutFrequency || '',
      payoutDay: settings.payoutDay || '',
      storeCurrency: settings.storeCurrency || '',
      bankName: settings.bankDetails?.bankName || '',
      accountNumber: settings.bankDetails?.accountNumber || '',
      accountName: settings.bankDetails?.accountName || '',
      routingNumber: settings.bankDetails?.routingNumber || '',
      swiftCode: settings.bankDetails?.swiftCode || ''
    });
  };

  // Payout history is not included in the API response
  const payoutHistory: any[] = [];

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Payouts Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Section */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payouts
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and update your payout information and history to ensure accurate and timely payments
              </p>
            </div>

            {/* Right Section - Form */}
            <div className="space-y-5">
              {/* Payout Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payout Frequency
                </label>
                <div className="relative">
                  <select
                    name="payoutFrequency"
                    value={formData.payoutFrequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
                {formData.payoutFrequency && formData.payoutDay && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Current: {formData.payoutFrequency.charAt(0).toUpperCase() + formData.payoutFrequency.slice(1)} on {formData.payoutDay.charAt(0).toUpperCase() + formData.payoutDay.slice(1)}
                  </p>
                )}
              </div>

              {/* Payout Day (shown when frequency is weekly) */}
              {formData.payoutFrequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payout Day
                  </label>
                  <div className="relative">
                    <select
                      name="payoutDay"
                      value={formData.payoutDay}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select day</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Store Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Store currency
                </label>
                <div className="relative">
                  <select
                    name="storeCurrency"
                    value={formData.storeCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select currency</option>
                    <option value="NGN">Nigerian Naira (NGN)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                    <option value="GHS">Ghanaian Cedi (GHS)</option>
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="ZAR">South African Rand (ZAR)</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  placeholder="Enter account name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Routing Number */}
              {formData.routingNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    name="routingNumber"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    placeholder="Enter routing number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              )}

              {/* Swift Code */}
              {formData.swiftCode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    name="swiftCode"
                    value={formData.swiftCode}
                    onChange={handleChange}
                    placeholder="Enter SWIFT code"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors cursor-pointer"
            >
              Save Change
            </button>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payout history
              </h2>
            </div>

            {/* Right Section - History */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payout Period
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {settings.nextPayoutDate 
                      ? `Next payout on ${new Date(settings.nextPayoutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : 'No upcoming payout scheduled'}
                  </div>
                </div>
                <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Table */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {payoutHistory.length > 0 ? (
                      payoutHistory.map((payout, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                            {payout.invoice}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {payout.date}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                            {payout.amount}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer">
                              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No payout history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
