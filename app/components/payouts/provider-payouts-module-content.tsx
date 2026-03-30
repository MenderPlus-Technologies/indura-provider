'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  type ProviderPayoutHistoryItem,
  type ProviderSettingsPayouts,
  useCreateProviderPayoutRequestMutation,
  useGetProviderPayoutHistoryQuery,
  useGetProviderWalletBalanceQuery,
  useGetWalletBanksQuery,
  useResolveWalletAccountMutation,
  useUpdateProviderPayoutSettingsMutation,
} from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw, ShieldCheck, Wallet, Landmark, AlertCircle } from 'lucide-react';

interface ProviderPayoutsModuleContentProps {
  settings: ProviderSettingsPayouts;
}

export default function ProviderPayoutsModuleContent({ settings }: ProviderPayoutsModuleContentProps) {
  const { showToast } = useToast();
  const [historyPage, setHistoryPage] = useState(1);
  const historyLimit = 8;

  const [formData, setFormData] = useState({
    payoutFrequency: settings.payoutFrequency || '',
    payoutDay: settings.payoutDay || '',
    storeCurrency: settings.storeCurrency || 'NGN',
    bankName: settings.bankDetails?.bankName || '',
    bankCode: '',
    accountNumber: settings.bankDetails?.accountNumber || '',
    accountName: settings.bankDetails?.accountName || '',
  });
  const [requestAmount, setRequestAmount] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isAccountVerified, setIsAccountVerified] = useState(false);
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [isBankSelectOpen, setIsBankSelectOpen] = useState(false);

  const [createPayoutRequest, { isLoading: isSubmittingRequest }] = useCreateProviderPayoutRequestMutation();
  const [updatePayoutSettings, { isLoading: isSavingSettings }] = useUpdateProviderPayoutSettingsMutation();
  const { data: walletBalance, isLoading: isLoadingWallet, isError: isWalletError } = useGetProviderWalletBalanceQuery();
  const { data: payoutHistoryData, isLoading: isLoadingHistory, refetch: refetchHistory } =
    useGetProviderPayoutHistoryQuery({ page: historyPage, limit: historyLimit });
  const { data: banks = [], isLoading: isLoadingBanks } = useGetWalletBanksQuery();
  const [resolveWalletAccount, { isLoading: isResolvingAccount }] = useResolveWalletAccountMutation();

  useEffect(() => {
    setFormData({
      payoutFrequency: settings.payoutFrequency || '',
      payoutDay: settings.payoutDay || '',
      storeCurrency: settings.storeCurrency || 'NGN',
      bankName: settings.bankDetails?.bankName || '',
      bankCode: '',
      accountNumber: settings.bankDetails?.accountNumber || '',
      accountName: settings.bankDetails?.accountName || '',
    });
    setIsAccountVerified(false);
    setHasAttemptedVerification(false);
  }, [settings]);

  useEffect(() => {
    if (formData.bankCode) return;
    const selectedBank = banks.find((b) => String(b.name) === formData.bankName);
    if (selectedBank?.code) {
      setFormData((prev) => ({ ...prev, bankCode: String(selectedBank.code) }));
    }
  }, [banks, formData.bankCode, formData.bankName]);

  const handleVerifyAccount = async () => {
    const accountNumber = formData.accountNumber.trim();
    const bankCode = formData.bankCode.trim();
    setHasAttemptedVerification(true);

    if (!bankCode) {
      showToast('Please select a bank first.', 'error');
      return;
    }
    if (accountNumber.length < 10) {
      showToast('Account number must be 10 digits.', 'error');
      return;
    }

    try {
      const response = await resolveWalletAccount({ accountNumber, bankCode }).unwrap();
      const resolvedName =
        response?.data?.accountName ||
        response?.data?.accountNameResolved ||
        response?.accountName ||
        '';
      if (!resolvedName) {
        setIsAccountVerified(false);
        showToast('Unable to verify account. Check bank and account number.', 'error');
        return;
      }

      setFormData((prev) => ({ ...prev, accountName: resolvedName }));
      setIsAccountVerified(true);
      showToast('Account verified successfully.', 'success');
    } catch (e: unknown) {
      const message =
        (e as { data?: { message?: string; error?: string } })?.data?.message ||
        (e as { data?: { message?: string; error?: string } })?.data?.error ||
        'Failed to resolve account number.';
      setIsAccountVerified(false);
      showToast(message, 'error');
    }
  };

  const displayCurrency = walletBalance?.currency || settings.storeCurrency || 'NGN';
  const availableBalance = walletBalance?.availableBalance ?? 0;
  const pendingBalance = walletBalance?.pendingBalance ?? 0;
  const payoutHistory = payoutHistoryData?.payouts ?? [];

  const parsedAmount = useMemo(() => {
    const cleanedAmount = requestAmount.replace(/[^0-9.]/g, '');
    const amount = parseFloat(cleanedAmount || '0');
    return Number.isFinite(amount) ? amount : 0;
  }, [requestAmount]);

  const filteredBanks = useMemo(() => {
    const query = bankSearchQuery.trim().toLowerCase();
    if (!query) return banks;
    return banks.filter((bank) => String(bank.name).toLowerCase().includes(query));
  }, [banks, bankSearchQuery]);

  const validatePayoutRequest = (): string | null => {
    if (!requestAmount.trim() || parsedAmount <= 0) {
      return 'Enter a valid amount greater than zero.';
    }
    if (parsedAmount > availableBalance) {
      return 'Requested amount exceeds available balance.';
    }
    if (settings.minimumPayoutAmount && parsedAmount < settings.minimumPayoutAmount) {
      return `Minimum payout amount is ${displayCurrency} ${settings.minimumPayoutAmount.toLocaleString()}.`;
    }
    return null;
  };

  const handleOpenRequestConfirmation = () => {
    const validationError = validatePayoutRequest();
    if (validationError) {
      setRequestError(validationError);
      return;
    }
    setRequestError(null);
    setIsConfirmOpen(true);
  };

  const handleSubmitPayoutRequest = async () => {
    try {
      const response = await createPayoutRequest({
        amount: parsedAmount,
        currency: formData.storeCurrency || displayCurrency || 'NGN',
        description: requestDescription || 'Manual payout request',
      }).unwrap();
      if (!response?.success) {
        showToast(response?.message || 'Failed to submit payout request.', 'error');
        return;
      }
      showToast(response.message || 'Payout request submitted successfully.', 'success');
      setIsConfirmOpen(false);
      setRequestAmount('');
      setRequestDescription('');
      setRequestError(null);
      refetchHistory();
    } catch (e: unknown) {
      const message =
        (e as { data?: { message?: string; error?: string } })?.data?.message ||
        (e as { data?: { message?: string; error?: string } })?.data?.error ||
        'Failed to submit payout request. Please try again.';
      showToast(message, 'error');
    }
  };

  const handleSavePayoutSettings = async () => {
    if (!formData.bankCode || !formData.accountNumber || !formData.accountName) {
      showToast('Complete bank details and verify account number before saving.', 'error');
      return;
    }
    try {
      const response = await updatePayoutSettings({
        payoutFrequency: formData.payoutFrequency,
        payoutDay: formData.payoutDay,
        storeCurrency: formData.storeCurrency,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          accountName: formData.accountName,
        },
      }).unwrap();
      showToast(response?.message || 'Bank and payout settings updated successfully.', 'success');
    } catch (e: unknown) {
      const message =
        (e as { data?: { message?: string; error?: string } })?.data?.message ||
        (e as { data?: { message?: string; error?: string } })?.data?.error ||
        'Failed to update payout settings.';
      showToast(message, 'error');
    }
  };

  const getStatusBadge = (status: ProviderPayoutHistoryItem['status']) => {
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Successful</Badge>;
    }
    if (status === 'failed') {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Failed</Badge>;
    }
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pending</Badge>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {isLoadingWallet ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#009688]" />
              ) : (
                `${displayCurrency} ${availableBalance.toLocaleString()}`
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-medium">Pending Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-foreground">
              {isLoadingWallet ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#009688]" />
              ) : (
                `${displayCurrency} ${pendingBalance.toLocaleString()}`
              )}
            </div>
            {isWalletError && (
              <p className="text-xs text-destructive mt-2">Unable to load wallet balance right now.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Landmark className="h-4 w-4 text-[#009688]" />
            Bank Details & Payout Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Payout Frequency</label>
              <Select
                value={formData.payoutFrequency || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    payoutFrequency: value,
                    payoutDay: value === 'weekly' ? prev.payoutDay : '',
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Payout Day</label>
              <Select
                value={formData.payoutDay || ''}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, payoutDay: value }))}
                disabled={formData.payoutFrequency !== 'weekly'}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      formData.payoutFrequency === 'weekly'
                        ? 'Select payout day'
                        : 'Available for weekly payouts'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Store Currency</label>
              <Select
                value={formData.storeCurrency || ''}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, storeCurrency: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (NGN)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                  <SelectItem value="GHS">Ghanaian Cedi (GHS)</SelectItem>
                  <SelectItem value="KES">Kenyan Shilling (KES)</SelectItem>
                  <SelectItem value="ZAR">South African Rand (ZAR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Bank</label>
              <Select
                value={formData.bankCode || ''}
                open={isBankSelectOpen}
                onOpenChange={setIsBankSelectOpen}
                onValueChange={(value) => {
                  const selectedBank = banks.find((bank) => String(bank.code) === value);
                  setFormData((prev) => ({
                    ...prev,
                    bankCode: value,
                    bankName: selectedBank ? String(selectedBank.name) : '',
                    accountName: '',
                  }));
                  setIsAccountVerified(false);
                  setHasAttemptedVerification(false);
                  setBankSearchQuery('');
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  sideOffset={6}
                  align="start"
                  className="max-h-72 w-(--radix-select-trigger-width)"
                  header={
                    <Input
                      value={bankSearchQuery}
                      onChange={(e) => setBankSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      placeholder={isLoadingBanks ? 'Loading banks...' : 'Search bank...'}
                      className="h-8"
                    />
                  }
                >
                  {isLoadingBanks ? (
                    <div className="px-2 py-3 flex items-center text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Fetching banks...
                    </div>
                  ) : filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <SelectItem key={String(bank.code)} value={String(bank.code)}>
                        {String(bank.name)}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-sm text-muted-foreground">No bank found</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Account Number</label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                    accountName: '',
                  }));
                  setIsAccountVerified(false);
                  setHasAttemptedVerification(false);
                }}
                placeholder="Enter 10-digit account number"
              />
              {isResolvingAccount && (
                <p className="text-xs text-muted-foreground mt-1">Resolving account name...</p>
              )}
            </div>
            <div className="flex items-end">
              <div className="h-10 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyAccount}
                  disabled={isResolvingAccount || !formData.bankCode || formData.accountNumber.trim().length < 10}
                >
                  {isResolvingAccount ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Account'
                  )}
                </Button>
                {(hasAttemptedVerification || isResolvingAccount) &&
                  (isAccountVerified ? (
                    <Badge className="bg-green-100 text-green-700 border-green-200 inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="inline-flex items-center gap-1 text-muted-foreground">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Not verified
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Account Name</label>
              <Input
                value={formData.accountName}
                readOnly
                placeholder="Auto-filled after verification"
                className="bg-gray-50 dark:bg-gray-800/70 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSavePayoutSettings}
              disabled={isSavingSettings}
              className="bg-[#009688] hover:bg-[#007f74] text-white"
            >
              {isSavingSettings ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Payout Settings'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#009688]" />
            Request Payout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 border border-border p-3 text-sm text-muted-foreground">
            Available to request: <span className="font-semibold text-foreground">{displayCurrency} {availableBalance.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Amount ({displayCurrency})</label>
              <Input
                inputMode="decimal"
                value={requestAmount}
                onChange={(e) => setRequestAmount(e.target.value)}
                placeholder="Enter payout amount"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Description (Optional)</label>
              <Input
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                placeholder="e.g. Weekly settlement"
              />
            </div>
          </div>

          {requestError && <p className="text-sm text-destructive">{requestError}</p>}

          <div className="flex justify-end">
            <Button
              onClick={handleOpenRequestConfirmation}
              disabled={isSubmittingRequest || isLoadingWallet}
              className="bg-[#009688] hover:bg-[#007f74] text-white"
            >
              {isSubmittingRequest ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Payout History</CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetchHistory()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
            </div>
          ) : payoutHistory.length === 0 ? (
            <div className="text-center py-10 text-sm text-muted-foreground">
              No payout history yet. Your requests will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.invoice}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>{item.currency} {item.amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.bankDetails.bankName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {payoutHistoryData?.pagination && payoutHistoryData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Page {payoutHistoryData.pagination.page} of {payoutHistoryData.pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                      disabled={historyPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setHistoryPage((p) =>
                          Math.min(payoutHistoryData.pagination.totalPages, p + 1)
                        )
                      }
                      disabled={historyPage >= payoutHistoryData.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {isConfirmOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsConfirmOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl p-5 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Confirm payout request</h3>
              <p className="text-sm text-muted-foreground">
                You are requesting <span className="font-medium text-foreground">{displayCurrency} {parsedAmount.toLocaleString()}</span>.
              </p>
              <p className="text-xs text-muted-foreground">
                Funds will be sent to <span className="font-medium text-foreground">{formData.bankName}</span> ({formData.accountName}).
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitPayoutRequest}
                  disabled={isSubmittingRequest}
                  className="bg-[#009688] hover:bg-[#007f74] text-white"
                >
                  {isSubmittingRequest ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Confirm Request'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
