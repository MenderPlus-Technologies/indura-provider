'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Transaction, formatTransactionAmount } from './transaction-utils';
import { useGetProviderCustomersQuery, useCreateProviderPaymentRequestMutation, type ProviderCustomer } from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
}

// Payment methods (aligned with backend)
const paymentMethods = [
  { label: 'Wallet', value: 'wallet' },
];

// Format date for transaction display (no seconds)
const formatTransactionDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + '  ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NewRequestModal = ({ isOpen, onClose, onSuccess }: NewRequestModalProps) => {
  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isError: isCustomersError,
    refetch,
  } = useGetProviderCustomersQuery({ page: 1, limit: 100 });
  const [createPaymentRequest, { isLoading: isSubmitting }] = useCreateProviderPaymentRequestMutation();
  const { showToast } = useToast();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('wallet');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const customers: ProviderCustomer[] = customersData?.items ?? [];

  const isLoading = isLoadingCustomers || isSubmitting;

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCustomerId('');
      setAmount('');
      setPaymentMethod('wallet');
      setDescription('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedCustomerId || !amount || !paymentMethod) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than zero');
      return;
    }

    const customer = customers.find((c) => c._id === selectedCustomerId);
    if (!customer) {
      setError('Selected customer not found');
      return;
    }

    setError(null);

    try {
      const response = await createPaymentRequest({
        customerId: selectedCustomerId,
        amount: amountNum,
        currency: 'NGN',
        paymentMethod,
        description: description || 'Consultation payment request',
      }).unwrap();

      if (response?.success) {
        showToast(response.message || 'Payment request created successfully', 'success');
      } else {
        showToast(response?.message || 'Failed to create payment request', 'error');
      }

      const now = new Date();
      const newTransaction: Transaction = {
        payer: customer.name,
        datetime: formatTransactionDate(now),
        method: paymentMethod === 'wallet' ? 'Wallet' : paymentMethod,
        status: 'Pending',
        amount: formatTransactionAmount(amountNum),
        type: 'debit',
        reference: '',
        category: 'provider_payment',
      };

      onSuccess(newTransaction);

      // Reset form
      setSelectedCustomerId('');
      setAmount('');
      setPaymentMethod('wallet');
      setDescription('');
      onClose();
    } catch (e: any) {
      const apiMessage =
        (e?.data && (e.data.message || e.data.error)) ||
        e?.message ||
        'Failed to create payment request. Please try again.';
      setError(apiMessage);
      showToast(apiMessage, 'error');
    }
  };

  const handleCancel = () => {
    setSelectedCustomerId('');
    setAmount('');
    setPaymentMethod('wallet');
    setDescription('');
    setError(null);
    onClose();
  };

  // Format amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers and decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    setAmount(cleaned);
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
              <h2 className="text-lg font-semibold text-[#344054] dark:text-white">
                New Transaction Request
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a new payment request for a customer
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
            {isCustomersError && (
              <div className="mb-2 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-600 dark:text-red-300 flex items-center justify-between">
                <span>Failed to load customers.</span>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="underline text-red-600 dark:text-red-300"
                >
                  Retry
                </button>
              </div>
            )}
            {error && (
              <div className="mb-2 rounded-md bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-600 dark:text-red-300">
                {error}
              </div>
            )}
            <div>
              <Label htmlFor="customer" className="text-sm font-medium text-[#475467] dark:text-gray-300 mb-2 block">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedCustomerId}
                onValueChange={setSelectedCustomerId}
                disabled={isLoading || customers.length === 0}
              >
                <SelectTrigger id="customer" className="w-full">
                  <SelectValue placeholder={isLoading ? "Loading customers..." : "Select a customer"} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {customers.map((customer) => (
                    <SelectItem key={customer._id} value={customer._id}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-[#475467] dark:text-gray-300 mb-2 block">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">₦</span>
                  <Input
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    className="w-full pl-8"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="method" className="text-sm font-medium text-[#475467] dark:text-gray-300 mb-2 block">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isLoading}>
                  <SelectTrigger id="method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this transaction request..."
                className="w-full min-h-24"
                disabled={isLoading}
              />
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
              disabled={isLoading || !selectedCustomerId || !amount || !paymentMethod}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Request...
                </>
              ) : (
                'Create Request'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
