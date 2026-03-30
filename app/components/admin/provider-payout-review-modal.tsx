'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export interface ProviderPayoutReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  action: 'approve' | 'reject';
  providerName: string;
  amountLabel: string;
  isLoading?: boolean;
}

export const ProviderPayoutReviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  providerName,
  amountLabel,
  isLoading = false,
}: ProviderPayoutReviewModalProps) => {
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setReason('');
      setReasonError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isApprove = action === 'approve';
  const title = isApprove ? 'Approve Payout Request' : 'Reject Payout Request';
  const message = isApprove
    ? `Are you sure you want to approve ${amountLabel} for ${providerName}?`
    : `Are you sure you want to reject ${amountLabel} for ${providerName}?`;

  const handleConfirm = () => {
    if (!isApprove && !reason.trim()) {
      setReasonError('Reason is required when rejecting a request.');
      return;
    }
    setReasonError('');
    onConfirm(isApprove ? undefined : reason.trim());
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isApprove ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {isApprove ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-600 dark:text-white">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{message}</p>
            {!isApprove && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This request will be marked as rejected.
                </p>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                  Rejection reason <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (reasonError) setReasonError('');
                  }}
                  placeholder="Enter reason for rejection"
                  className={reasonError ? 'border-red-500 dark:border-red-500' : ''}
                  disabled={isLoading}
                />
                {reasonError ? (
                  <p className="text-xs text-red-600 dark:text-red-400">{reasonError}</p>
                ) : null}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button variant="outline" onClick={onClose} disabled={isLoading} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`cursor-pointer ${
                isApprove ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : isApprove ? (
                'Approve'
              ) : (
                'Reject'
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
