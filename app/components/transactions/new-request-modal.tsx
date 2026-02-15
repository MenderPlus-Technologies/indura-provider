'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { membersData, type Member } from '../members/member-utils';
import { type Transaction } from './transaction-utils';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
}

// Payment methods
const paymentMethods = ['Wallet', 'Credit Card', 'Bank Transfer', 'PayPal', 'Cash'];

// Format date for transaction display
const formatTransactionDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + '  ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const NewRequestModal = ({ isOpen, onClose, onSuccess }: NewRequestModalProps) => {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Wallet');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMember('');
      setAmount('');
      setPaymentMethod('Wallet');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedMember || !amount || !paymentMethod) {
      console.log('Please fill in all required fields');
      return;
    }

    // Validate amount
    const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) {
      console.log('Please enter a valid amount');
      return;
    }

    const member = membersData.find(m => m.email === selectedMember);
    if (!member) {
      console.log('Selected member not found');
      return;
    }

    setIsLoading(true);

    // Mock API call - simulate network delay
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo

      if (success) {
        const now = new Date();
        const newTransaction: Transaction = {
          payer: member.name,
          email: member.email,
          datetime: formatTransactionDate(now),
          method: paymentMethod,
          status: 'Pending',
          amount: `$${amountNum.toFixed(2)}`,
        };

        console.log('Transaction request created successfully', newTransaction);
        onSuccess(newTransaction);
        
        // Reset form
        setSelectedMember('');
        setAmount('');
        setPaymentMethod('Wallet');
        setDescription('');
        setIsLoading(false);
        onClose();
      } else {
        console.log('Failed to create transaction request. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleCancel = () => {
    setSelectedMember('');
    setAmount('');
    setPaymentMethod('Wallet');
    setDescription('');
    onClose();
  };

  // Format amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers, decimal point, and dollar sign
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
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Transaction Request
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a new payment request
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
            <div>
              <Label htmlFor="member" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Customer <span className="text-red-500">*</span>
              </Label>
              <Select value={selectedMember} onValueChange={setSelectedMember} disabled={isLoading}>
                <SelectTrigger id="member" className="w-full">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {membersData.map((member) => (
                    <SelectItem key={member.email} value={member.email}>
                      {member.name} ({member.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
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
                <Label htmlFor="method" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Payment Method <span className="text-red-500">*</span>
                </Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isLoading}>
                  <SelectTrigger id="method" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800">
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
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
              disabled={isLoading || !selectedMember || !amount || !paymentMethod}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
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
