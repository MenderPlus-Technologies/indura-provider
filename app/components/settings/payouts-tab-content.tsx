import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Download, Bell, RefreshCw, X } from 'lucide-react';
import type {
  ProviderSettingsPayouts,
  ProviderPayoutRequest,
  ProviderPayoutHistoryItem,
} from '@/app/store/apiSlice';
import { useCreateProviderPayoutRequestMutation, useGetProviderPayoutHistoryQuery, useGetProviderWalletBalanceQuery } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';
import { apiDownloadFile } from '@/app/utils/api';

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

  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestError, setRequestError] = useState<string | null>(null);
  const [lastPayout, setLastPayout] = useState<ProviderPayoutRequest | null>(null);

  const [historyPage, setHistoryPage] = useState(1);
  const historyLimit = 4;
  const [selectedPayout, setSelectedPayout] = useState<ProviderPayoutHistoryItem | null>(null);

  const [createPayoutRequest, { isLoading: isSubmitting }] = useCreateProviderPayoutRequestMutation();
  const { showToast } = useToast();

  const handleRequestPayout = async () => {
    const cleanedAmount = requestAmount.replace(/[^0-9.]/g, '');
    const amountNum = parseFloat(cleanedAmount || '0');

    if (!cleanedAmount || isNaN(amountNum) || amountNum <= 0) {
      setRequestError('Enter a valid amount greater than zero.');
      return;
    }

    if (settings.minimumPayoutAmount && amountNum < settings.minimumPayoutAmount) {
      setRequestError(
        `Minimum payout amount is ${settings.storeCurrency || 'NGN'} ${settings.minimumPayoutAmount.toLocaleString()}`
      );
      return;
    }

    setRequestError(null);

    try {
      const response = await createPayoutRequest({
        amount: amountNum,
        currency: formData.storeCurrency || settings.storeCurrency || 'NGN',
        description: requestDescription || 'Manual payout request',
      }).unwrap();

      if (response?.success) {
        showToast(response.message || 'Payout request submitted successfully', 'success');
        setLastPayout(response.data);
        setRequestAmount('');
        setRequestDescription('');
      } else {
        showToast(response?.message || 'Failed to submit payout request', 'error');
      }
    } catch (e: any) {
      const apiMessage =
        (e?.data && (e.data.message || e.data.error)) ||
        e?.message ||
        'Failed to submit payout request. Please try again.';
      setRequestError(apiMessage);
      showToast(apiMessage, 'error');
    }
  };

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

  const {
    data: payoutHistoryData,
    isLoading: isLoadingHistory,
    isError: isHistoryError,
    refetch: refetchHistory,
  } = useGetProviderPayoutHistoryQuery({ page: historyPage, limit: historyLimit });

  const payoutHistory = payoutHistoryData?.payouts ?? [];

  const handleDownloadInvoice = async (payout: ProviderPayoutHistoryItem) => {
    try {
      const filename = `payout-${payout.invoice.replace('#', '')}.csv`;
      await apiDownloadFile(`/providers/payouts/${payout.id}/invoice?format=csv`, filename);
      showToast('Invoice download started', 'success');
    } catch (error: any) {
      showToast(
        error?.message || 'Failed to download invoice. Please try again.',
        'error'
      );
    }
  };

  const {
    data: walletBalance,
    isLoading: isWalletLoading,
    isError: isWalletError,
  } = useGetProviderWalletBalanceQuery();

  const displayCurrency = walletBalance?.currency || settings.storeCurrency || 'NGN';
  const availableBalance = walletBalance?.availableBalance ?? 0;
  const pendingBalance = walletBalance?.pendingBalance ?? 0;

  return (
    <div className="w-full bg-background pb-8">
      <div className="max-w-5xl mx-auto p-4 space-y-10">
        {/* Wallet balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Available balance
            </span>
            <span className="text-lg sm:text-xl font-semibold text-foreground">
              {isWalletLoading
                ? 'Loading...'
                : `${displayCurrency} ${availableBalance.toLocaleString()}`}
            </span>
            {walletBalance?.lastUpdated && (
              <span className="text-[11px] text-muted-foreground">
                Updated{' '}
                {new Date(walletBalance.lastUpdated).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-4 flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">
              Pending balance
            </span>
            <span className="text-lg sm:text-xl font-semibold text-foreground">
              {isWalletLoading
                ? 'Loading...'
                : `${displayCurrency} ${pendingBalance.toLocaleString()}`}
            </span>
            {isWalletError && (
              <span className="text-[11px] text-destructive">
                Failed to load wallet balance.
              </span>
            )}
          </div>
        </div>

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
              {/* Payout Frequency + Payout Day (flex on lg+) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

                <div>
                  {formData.payoutFrequency === 'weekly' && (
                    <>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Payout Day
                      </label>
                      <div className="relative">
                        <select
                          name="payoutDay"
                          value={formData.payoutDay}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus-border-transparent outline-none"
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
                    </>
                  )}
                </div>
              </div>

              {/* Store currency & Bank details (two per row on lg+) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
              </div>

              {/* Bank & account details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus-border-transparent outline-none"
                  />
                </div>

                {/* Routing Number */}
                {/* {formData.routingNumber && (
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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus-border-transparent outline-none"
                    />
                  </div>
                )} */}

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
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-teal-500 focus-border-transparent outline-none"
                    />
                  </div>
                )}
              </div>
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

        {/* Request Payout Section */}
        <div className="mt-8 rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left copy */}
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Request a payout
                </h2>
                <p className="text-sm text-muted-foreground">
                  Create a manual payout request to move funds from your Indura wallet to your bank account.
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-lg border border-border bg-background px-4 py-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Minimum payout
                    </div>
                    <div className="mt-1 text-base font-medium text-foreground">
                      {(settings.storeCurrency || 'NGN')}{' '}
                      {settings.minimumPayoutAmount?.toLocaleString() ?? '0'}
                    </div>
                  </div>
                  <div className="rounded-lg border border-border bg-background px-4 py-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Next scheduled payout
                    </div>
                    <div className="mt-1 text-sm text-foreground">
                      {settings.nextPayoutDate
                        ? new Date(settings.nextPayoutDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Not scheduled'}
                    </div>
                  </div>
                </div>
                {lastPayout && (
                  <div className="mt-4 rounded-lg border border-dashed border-border bg-background px-4 py-3 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      <span>
                        Last request{' '}
                        <span className="font-medium text-foreground">
                          {lastPayout.invoice}
                        </span>
                        {' '}for{' '}
                        <span className="font-medium text-foreground">
                          {lastPayout.currency} {lastPayout.amount.toLocaleString()}
                        </span>
                      </span>
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-muted text-foreground">
                        {lastPayout.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right form */}
              <div className="space-y-4">
                {requestError && (
                  <div className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    {requestError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Amount ({formData.storeCurrency || settings.storeCurrency || 'NGN'})
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    placeholder="Enter payout amount"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Description <span className="text-muted-foreground text-xs">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    placeholder="e.g. Weekly payout request"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestAmount('');
                      setRequestDescription('');
                      setRequestError(null);
                    }}
                    className="px-4 py-2 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestPayout}
                    className="inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Request payout'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payout History Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 gap-8">
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
                    Payout period
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {settings.nextPayoutDate
                      ? `Next payout on ${new Date(settings.nextPayoutDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}`
                      : 'No upcoming payout scheduled'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHistoryPage(1);
                    void refetchHistory();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isLoadingHistory}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {isLoadingHistory ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {isHistoryError && (
                <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-600 dark:text-red-300">
                  Failed to load payout history. Please try again.
                </div>
              )}

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
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {isLoadingHistory ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          Loading payout history...
                        </td>
                      </tr>
                    ) : payoutHistory.length > 0 ? (
                      payoutHistory.map((payout) => (
                        <tr
                          key={payout.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => setSelectedPayout(payout)}
                        >
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                            {payout.invoice}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                            {new Date(payout.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                            {payout.currency}{' '}
                            {payout.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                payout.status === 'completed'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                                  : payout.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                              }`}
                            >
                              {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDownloadInvoice(payout);
                              }}
                              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer"
                            >
                              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          No payout history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {payoutHistoryData?.pagination && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    Page {payoutHistoryData.pagination.page} of {payoutHistoryData.pagination.totalPages}{' '}
                    · Total {payoutHistoryData.pagination.total} payouts
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHistoryPage((prev) => Math.max(1, prev - 1))}
                      disabled={historyPage <= 1 || isLoadingHistory}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setHistoryPage((prev) =>
                          payoutHistoryData.pagination
                            ? Math.min(payoutHistoryData.pagination.totalPages, prev + 1)
                            : prev + 1
                        )
                      }
                      disabled={
                        isLoadingHistory ||
                        (payoutHistoryData.pagination
                          ? historyPage >= payoutHistoryData.pagination.totalPages
                          : false)
                      }
                      className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Payout details modal */}
        {selectedPayout &&
          typeof document !== 'undefined' &&
          createPortal(
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40 bg-black/40"
                onClick={() => setSelectedPayout(null)}
              />

              {/* Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Payout details
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Invoice {selectedPayout.invoice}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPayout(null)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Amount</div>
                      <div className="mt-1 text-base font-semibold text-foreground">
                        {selectedPayout.currency}{' '}
                        {selectedPayout.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Status</div>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          selectedPayout.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                            : selectedPayout.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                        }`}
                      >
                        {selectedPayout.status.charAt(0).toUpperCase() +
                          selectedPayout.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                      <div className="text-xs text-muted-foreground">Requested on</div>
                      <div className="mt-1 text-sm text-foreground">
                        {new Date(selectedPayout.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                      <div className="text-xs text-muted-foreground">Completed at</div>
                      <div className="mt-1 text-sm text-foreground">
                        {selectedPayout.completedAt
                          ? new Date(selectedPayout.completedAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Not completed yet'}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/40 px-3 py-2.5">
                    <div className="text-xs text-muted-foreground mb-1.5">
                      Bank account
                    </div>
                    <div className="text-sm text-foreground font-medium">
                      {selectedPayout.bankDetails.accountName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedPayout.bankDetails.bankName} ·{' '}
                      {selectedPayout.bankDetails.accountNumber}
                    </div>
                  </div>

                  <div className="rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between gap-2">
                      <span>Transaction reference</span>
                      <span className="font-mono text-[11px] text-foreground">
                        {selectedPayout.transactionReference || '—'}
                      </span>
                    </div>
                  </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-3 px-5 py-3 border-t border-border bg-muted/40">
                    <button
                      type="button"
                      onClick={() => setSelectedPayout(null)}
                      className="px-4 py-1.5 text-xs font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedPayout) {
                          void handleDownloadInvoice(selectedPayout);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download invoice
                    </button>
                  </div>
                </div>
              </div>
            </>,
            document.body
          )}
      </div>
    </div>
  );
}
