'use client';

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetProviderSubscriptionQuery,
  useUpdateProviderSubscriptionMutation,
} from "@/app/store/apiSlice";
import { useToast } from "@/components/ui/toast";

interface EditSubscriptionModalProps {
  isOpen: boolean;
  subscriptionId: string | null;
  onClose: () => void;
  onUpdated?: () => void;
}

export const EditSubscriptionModal = ({
  isOpen,
  subscriptionId,
  onClose,
  onUpdated,
}: EditSubscriptionModalProps) => {
  const { data: sub, isLoading: isLoadingSub } = useGetProviderSubscriptionQuery(
    subscriptionId || "",
    { skip: !subscriptionId || !isOpen }
  );
  const [planName, setPlanName] = useState("");
  const [planType, setPlanType] = useState("");
  const [amount, setAmount] = useState("");
  const [autoRenew, setAutoRenew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateSubscription] = useUpdateProviderSubscriptionMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (sub && isOpen) {
      setPlanName(sub.planName || "");
      setPlanType(sub.planType || "monthly");
      setAmount(sub.amount ? String(sub.amount) : "");
      setAutoRenew(!!sub.autoRenew);
    }
  }, [sub, isOpen]);

  if (!isOpen) return null;

  const handleCancel = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!subscriptionId) return;
    if (!planName || !planType || !amount) {
      showToast("Please fill in plan name, type and amount", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        subscriptionId,
        planName,
        planType,
        amount: Number(amount),
        currency: sub?.currency || "NGN",
        autoRenew,
      };

      const response = await updateSubscription(payload).unwrap();

      showToast(
        (response as any)?.message || "Subscription updated successfully",
        "success"
      );

      onUpdated?.();
      onClose();
    } catch (error: any) {
      console.error("Failed to update subscription", error);
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to update subscription. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
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
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Subscription
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Update plan details and auto-renew settings
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
            {isLoadingSub ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="edit-planName"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                    >
                      Plan name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-planName"
                      type="text"
                      value={planName}
                      onChange={(e) => setPlanName(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. Basic"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="edit-planType"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                    >
                      Plan type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-planType"
                      type="text"
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. monthly"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="edit-amount"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block"
                    >
                      Amount (NGN) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="e.g. 2500"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      id="edit-autoRenew"
                      type="checkbox"
                      checked={autoRenew}
                      onChange={(e) => setAutoRenew(e.target.checked)}
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-gray-300 text-[#009688] focus:ring-[#009688]"
                    />
                    <Label
                      htmlFor="edit-autoRenew"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Enable auto-renew
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || isLoadingSub}
              className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

