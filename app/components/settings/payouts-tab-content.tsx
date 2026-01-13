import React, { useState } from 'react';
import { ChevronDown, Download, Bell } from 'lucide-react';

export default function PayoutsTabContent() {
  const [formData, setFormData] = useState({
    payoutFrequency: 'Weekly (Every Friday)',
    storeCurrency: 'US Dollar - USD',
    bankName: 'Zagadat Bank',
    accountNumber: '102910293839',
    accountName: 'Timothy Tips Store'
  });

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
      payoutFrequency: 'Weekly (Every Friday)',
      storeCurrency: 'US Dollar - USD',
      bankName: 'Zagadat Bank',
      accountNumber: '102910293839',
      accountName: 'Timothy Tips Store'
    });
  };

  const payoutHistory = [
    { invoice: '#890776', date: 'Nov 15, 2025', amount: '$7,900' },
    { invoice: '#890775', date: 'Dec 15, 2025', amount: '$2,900' }
  ];

  return (
    <div className="w-full bg-white pb-8">
      <div className="max-w-4xl mx-auto p-4">
        {/* Payouts Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Section */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Payouts
              </h1>
              <p className="text-sm text-gray-600">
                Review and update your payout information and history to ensure accurate and timely payments
              </p>
            </div>

            {/* Right Section - Form */}
            <div className="space-y-5">
              {/* Payout Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payout Frequency
                </label>
                <div className="relative">
                  <select
                    name="payoutFrequency"
                    value={formData.payoutFrequency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option>Weekly (Every Friday)</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Store Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store currency
                </label>
                <div className="relative">
                  <select
                    name="storeCurrency"
                    value={formData.storeCurrency}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option>US Dollar - USD</option>
                    <option>Euro - EUR</option>
                    <option>British Pound - GBP</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Name
                </label>
                <div className="relative">
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none bg-white text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  >
                    <option>Zagadat Bank</option>
                    <option>First National Bank</option>
                    <option>Commerce Bank</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  name="accountName"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Payout history
              </h2>
            </div>

            {/* Right Section - History */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">
                    Payout Period
                  </div>
                  <div className="text-sm text-gray-600">
                    Next payout on Jan 15, 2026
                  </div>
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Invoice #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payoutHistory.map((payout, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {payout.invoice}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {payout.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {payout.amount}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Download className="h-4 w-4 text-gray-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
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
