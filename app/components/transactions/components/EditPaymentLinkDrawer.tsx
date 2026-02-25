'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  type ProviderPaymentLink,
  useUpdateProviderPaymentLinkMutation,
} from "@/app/store/apiSlice";
import { useToast } from "@/components/ui/toast";

interface EditPaymentLinkDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: ProviderPaymentLink | null;
  onUpdated?: () => void;
}

export const EditPaymentLinkDrawer = ({
  open,
  onOpenChange,
  link,
  onUpdated,
}: EditPaymentLinkDrawerProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState<string>("active");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updatePaymentLink] = useUpdateProviderPaymentLinkMutation();
  const { showToast } = useToast();

  useEffect(() => {
    if (link && open) {
      setTitle(link.title || "");
      setDescription(link.description || "");
      setAmount(link.amount ? String(link.amount) : "");
      setStatus(link.status || "active");
      setExpiryDate(
        link.expiresAt ? new Date(link.expiresAt).toISOString().split("T")[0] : ""
      );
    }
  }, [link, open]);

  if (!open || !link) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!link?._id) return;
    if (!title || !amount || !description || !expiryDate) {
      showToast("Please fill in title, amount, description and expiry date", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const expiryIso = new Date(`${expiryDate}T23:59:59.000Z`).toISOString();

      const payload = {
        paymentLinkId: link._id,
        title,
        description,
        amount: Number(amount),
        status,
        expiresAt: expiryIso,
      };

      const response = await updatePaymentLink(payload).unwrap();

      showToast(
        (response as any)?.message || "Payment link updated successfully",
        "success"
      );

      onOpenChange(false);
      onUpdated?.();
    } catch (error: any) {
      console.error("Failed to update payment link", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to update payment link. Please try again.";
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
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-[#344054] dark:text-white">
                Edit payment link
              </h2>
              <p className="text-sm text-[#475467] dark:text-gray-400">
                Update details for this payment link.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
            <div>
              <Label
                htmlFor="edit-title"
                className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
              >
                Title
              </Label>
              <Input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Consultation Fee"
              />
            </div>

            <div>
              <Label
                htmlFor="edit-amount"
                className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
              >
                Amount
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
                htmlFor="edit-description"
                className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
              >
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                className="w-full min-h-24"
                placeholder="What is this payment link for?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="edit-expiry"
                  className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                >
                  Expiry date
                </Label>
                <Input
                  id="edit-expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label
                  htmlFor="edit-status"
                  className="text-sm font-medium text-[#344054] dark:text-gray-300 mb-1.5 block"
                >
                  Status
                </Label>
                <select
                  id="edit-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-[#344054] dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
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
              disabled={isSubmitting || !link}
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

