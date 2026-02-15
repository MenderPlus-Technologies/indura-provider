'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  type: 'approve' | 'reject' | 'delete';
  providerName: string;
  isLoading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  providerName,
  isLoading = false,
}: ConfirmationModalProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setRejectionReason('');
      setReasonError('');
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const isApprove = type === 'approve';
  const isReject = type === 'reject';

  const title = isApprove
    ? 'Approve Application'
    : isReject
    ? 'Reject Application'
    : 'Delete Application';

  const message = isApprove
    ? `Are you sure you want to approve the application for ${providerName}?`
    : isReject
    ? `Are you sure you want to reject the application for ${providerName}?`
    : `Are you sure you want to permanently delete the application for ${providerName}? This action cannot be undone.`;

  const confirmText = isApprove ? 'Approve' : isReject ? 'Reject' : 'Delete';
  const iconBgColor = isApprove ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30';
  const iconColor = isApprove ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const buttonColor = isApprove
    ? 'bg-green-600 hover:bg-green-700 text-white'
    : 'bg-red-600 hover:bg-red-700 text-white';

  const handleConfirmClick = () => {
    if (isReject && !rejectionReason.trim()) {
      setReasonError('Rejection reason is required');
      return;
    }
    setReasonError('');
    onConfirm(rejectionReason.trim() || undefined);
  };

  const handleClose = () => {
    setRejectionReason('');
    setReasonError('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
                {isApprove ? (
                  <CheckCircle className={`h-5 w-5 ${iconColor}`} />
                ) : (
                  <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-600 dark:text-white inter">
                  {title}
                </h2>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 cursor-pointer text-gray-700 dark:text-gray-300"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              {message}
            </p>
            {isReject && (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  This action cannot be undone. The application will be marked as rejected.
                </p>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => {
                      setRejectionReason(e.target.value);
                      if (reasonError) setReasonError('');
                    }}
                    placeholder="Please provide a reason for rejecting this application..."
                    className={`min-h-[100px] w-full bg-greyscale-0 dark:bg-gray-800 border-[#dfe1e6] dark:border-gray-700 text-gray-600 dark:text-white ${
                      reasonError ? 'border-red-500 dark:border-red-500' : ''
                    }`}
                    disabled={isLoading}
                  />
                  {reasonError && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {reasonError}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmClick}
              disabled={isLoading}
              className={`${buttonColor} cursor-pointer`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isApprove ? 'Approving...' : 'Rejecting...'}
                </>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

