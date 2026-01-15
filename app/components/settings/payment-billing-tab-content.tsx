import React, { useState } from 'react';
import { Mail, MoreVertical, Plus, Download, Bell } from 'lucide-react';

export default function PaymentBillingTabContent() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [email, setEmail] = useState('vennyvalentina@gmail.com');

  const paymentMethods = [
    { type: 'VISA', last4: '1466', expiry: '10/26', selected: true },
    { type: 'Mastercard', last4: '7450', expiry: '02/28', selected: false }
  ];

  const billingHistory = [
    { invoice: '#890776', date: 'Aug 15, 2024', plan: 'Pro Plan', amount: '$79' },
    { invoice: '#890775', date: 'Jul 15, 2024', plan: 'Basic Plan', amount: '$29' }
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-950 pb-8">
      <div className="max-w-4xl mx-auto p-4 space-y-12">
        
        {/* Payment Section */}
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Payment
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your payment methods securely. Add, update, or remove your credit/debit cards
              </p>
            </div>

            {/* Right Section - Cards */}
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors bg-white dark:bg-gray-800"
                >
                  <button
                    onClick={() => setSelectedCard(index)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      selectedCard === index
                        ? 'border-teal-600 bg-teal-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedCard === index && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>

                  <div className="flex items-center justify-center w-12 h-8 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded">
                    {method.type === 'VISA' ? (
                      <span className="text-blue-600 font-bold text-sm">VISA</span>
                    ) : (
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-orange-400 -ml-1.5"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      •••• •••• •••• {method.last4}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Expiry {method.expiry}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer">
                    <MoreVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </button>
                </div>
              ))}

              <button className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-500 transition-colors cursor-pointer">
                <Plus className="h-5 w-5" />
                New Payment Method
              </button>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Billing
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and update your billing information to ensure accurate and timely payments
              </p>
            </div>

            {/* Right Section - Billing Info */}
            <div className="space-y-6">
              {/* Billing Period */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Billing Period
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Next billing on Sept 15, 2024
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    Change Billing Period
                  </button>
                  <button className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Current Plan */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro Plan</h3>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                    19 days left
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">$79</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400"> / month</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Everything you need for a growing business
                </p>
                <div className="flex gap-3">
                  <button className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-colors cursor-pointer">
                    Cancel Plan
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    Change Plan
                  </button>
                </div>
              </div>

              {/* Billing History Table */}
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
                        Plan
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Amount
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {billingHistory.map((bill, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {bill.invoice}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {bill.date}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {bill.plan}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                          {bill.amount}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer">
                            <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
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

        {/* Email Address Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Email address
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Invoice will be sent to this email address
              </p>
            </div>

            {/* Right Section - Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-300 dark:border-gray-700 pr-3 bg-gray-50 dark:bg-gray-800">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
          <button className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
            Cancel
          </button>
          <button className="px-6 py-2.5 bg-teal-600 dark:bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-700 dark:hover:bg-teal-600 transition-colors cursor-pointer">
            Save Change
          </button>
        </div>
      </div>
    </div>
  );
}
