'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  type ProviderManualTransaction,
  useUpdateProviderManualTransactionMutation,
} from "@/app/store/apiSlice";
import { useToast } from "@/components/ui/toast";

interface EditManualTransactionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ProviderManualTransaction | null;
  onUpdated?: () => void;
}

export const EditManualTransactionDrawer = ({
  open,
  onOpenChange,
  transaction,
  onUpdated,
}: EditManualTransactionDrawerProps) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer" | "pos" | "">("");
  const [transactionDate, setTransactionDate] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateManualTransaction] = useUpdateProviderManualTransactionMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (transaction && open) {
      // Check if transaction is reconciled
      if (transaction.status === "reconciled") {
        showToast("Reconciled manual transactions cannot be edited", "error");
        onOpenChange(false);
        return;
      }

      setAmount(transaction.amount ? String(transaction.amount) : "");
      setPaymentMethod(
        (transaction.paymentMethod as "cash" | "bank_transfer" | "pos") || ""
      );
      setTransactionDate(
        transaction.transactionDate
          ? new Date(transaction.transactionDate).toISOString().split("T")[0]
          : ""
      );
      setDescription(transaction.description || "");
    }
  }, [transaction, open, showToast, onOpenChange]);

  if (!open || !transaction) return null;

  // Additional check to prevent editing reconciled transactions
  if (transaction.status === "reconciled") {
    return null;
  }

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!transaction?._id) return;
    
    // Prevent editing reconciled transactions
    if (transaction.status === "reconciled") {
      showToast("Reconciled manual transactions cannot be edited", "error");
      return;
    }

    if (!amount || !paymentMethod || !transactionDate || !description) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert transactionDate to ISO string
      const dateIso = new Date(`${transactionDate}T00:00:00.000Z`).toISOString();

      const payload = {
        manualTransactionId: transaction._id,
        amount: Number(amount),
        currency: transaction.currency || "NGN",
        paymentMethod,
        transactionDate: dateIso,
        description,
      };

      const response = await updateManualTransaction(payload).unwrap();

      showToast(
        response?.message || "Manual transaction updated successfully",
        "success"
      );

      onOpenChange(false);
      onUpdated?.();
    } catch (error: any) {
      console.error("Failed to update manual transaction", error);
      // Handle the specific error response format
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed to update manual transaction. Please try again.";
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
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card text-card-foreground border border-border rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground dark:text-white">
                Edit manual transaction
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Update details for this manual transaction.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
            <div>
              <Label
                htmlFor="edit-amount"
                className="text-sm font-medium text-foreground dark:text-gray-300 mb-1.5 block"
              >
                Amount <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  ₦
                </span>
                <Input
                  id="edit-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full pl-8"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="edit-method"
                className="text-sm font-medium text-foreground dark:text-gray-300 mb-1.5 block"
              >
                Payment method <span className="text-red-500">*</span>
              </Label>
              <select
                id="edit-method"
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as "cash" | "bank_transfer" | "pos" | "")
                }
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-foreground dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              >
                <option value="">Select method</option>
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="pos">POS</option>
              </select>
            </div>

            <div>
              <Label
                htmlFor="edit-transactionDate"
                className="text-sm font-medium text-foreground dark:text-gray-300 mb-1.5 block"
              >
                Transaction date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-transactionDate"
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label
                htmlFor="edit-description"
                className="text-sm font-medium text-foreground dark:text-gray-300 mb-1.5 block"
              >
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full min-h-24"
                placeholder="e.g. Offline cash payment at front desk"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !transaction}
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
