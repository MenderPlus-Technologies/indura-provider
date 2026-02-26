'use client';

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteProviderSubscriptionMutation } from "@/app/store/apiSlice";
import { useToast } from "@/components/ui/toast";

interface ConfirmDeleteSubscriptionModalProps {
  isOpen: boolean;
  subscriptionId: string | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export const ConfirmDeleteSubscriptionModal = ({
  isOpen,
  subscriptionId,
  onClose,
  onDeleted,
}: ConfirmDeleteSubscriptionModalProps) => {
  const [deleteSubscription, { isLoading }] = useDeleteProviderSubscriptionMutation();
  const { showToast } = useToast();

  if (!isOpen || !subscriptionId) return null;

  const handleCancel = () => {
    if (isLoading) return;
    onClose();
  };

  const handleConfirm = async () => {
    if (!subscriptionId) return;
    try {
      const response = await deleteSubscription(subscriptionId).unwrap();
      showToast(
        (response as any)?.message || "Subscription deleted successfully",
        "success"
      );
      onDeleted?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to delete subscription", error);
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to delete subscription. Please try again.";
      showToast(errorMessage, "error");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 bg-opacity-10 z-45 transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete subscription
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action cannot be undone.
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

          {/* Body */}
          <div className="flex-1 p-6 space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              Are you sure you want to delete this subscription? The customer will
              lose access to any benefits tied to this subscription.
            </p>
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
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

