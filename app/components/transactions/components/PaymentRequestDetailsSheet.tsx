'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  useGetProviderPaymentRequestQuery,
  useUpdateProviderPaymentRequestMutation,
  useCancelProviderPaymentRequestMutation,
  type ProviderPaymentRequest,
} from "@/app/store/apiSlice";
import {
  getStatusBadgeStyles,
  getStatusDotColor,
  mapApiStatusToUIStatus,
} from "../transaction-utils";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

interface PaymentRequestDetailsSheetProps {
  open: boolean;
  paymentRequestId: string | null;
  onOpenChange: (open: boolean) => void;
}

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PaymentRequestDetailsSheet = ({
  open,
  paymentRequestId,
  onOpenChange,
}: PaymentRequestDetailsSheetProps) => {
  const { showToast } = useToast();
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProviderPaymentRequestQuery(paymentRequestId || "", {
    skip: !open || !paymentRequestId,
  });

  const request = data as ProviderPaymentRequest | undefined;

  const uiStatus = request
    ? mapApiStatusToUIStatus(request.status)
    : ("Pending" as const);

  const handleRetry = () => {
    refetch();
  };

  const [updatePaymentRequest, { isLoading: isUpdating }] =
    useUpdateProviderPaymentRequestMutation();
  const [cancelPaymentRequest, { isLoading: isCancelling }] =
    useCancelProviderPaymentRequestMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [amountInput, setAmountInput] = useState("");
  const [methodInput, setMethodInput] = useState("wallet");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  useEffect(() => {
    if (request && open) {
      setAmountInput(request.amount ? String(request.amount) : "");
      setMethodInput(request.paymentMethod || "wallet");
      setDescriptionInput(request.description || "");
      setDueDateInput(
        request.dueDate
          ? new Date(request.dueDate).toISOString().split("T")[0]
          : ""
      );
      setIsEditing(false);
    }
  }, [request, open]);

  const handleSaveChanges = async () => {
    if (!request?._id) return;

    const amountNum = parseFloat(amountInput);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast("Please enter a valid amount greater than zero.", "error");
      return;
    }

    if (!dueDateInput) {
      showToast("Please select a due date.", "error");
      return;
    }

    const dueDateIso = new Date(
      `${dueDateInput}T23:59:59.000Z`
    ).toISOString();

    try {
      const response = await updatePaymentRequest({
        paymentRequestId: request._id,
        amount: amountNum,
        paymentMethod: methodInput,
        description: descriptionInput,
        dueDate: dueDateIso,
      }).unwrap();

      showToast(
        (response as any)?.message || "Payment request updated successfully",
        "success"
      );
      setIsEditing(false);
      refetch();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to update payment request. Please try again.";
      showToast(message, "error");
      console.error("Failed to update payment request", error);
    }
  };

  const handleCancelRequest = async () => {
    if (!request?._id) return;

    try {
      const response = await cancelPaymentRequest(request._id).unwrap();
      showToast(
        (response as any)?.message || "Payment request cancelled",
        "success"
      );
      refetch();
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        "Failed to cancel payment request. Please try again.";
      showToast(message, "error");
      console.error("Failed to cancel payment request", error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-xl w-full flex flex-col p-0"
      >
        <SheetHeader className="bg-[#009688] text-white px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <SheetTitle className="text-white">
                Payment request details
              </SheetTitle>
              {request?.reference && (
                <SheetDescription className="text-xs text-white/80">
                  Reference:{" "}
                  <span className="font-mono break-all">
                    {request.reference}
                  </span>
                </SheetDescription>
              )}
            </div>
            {request && (
              <Badge
                className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[999px] border border-solid ${getStatusBadgeStyles(
                  uiStatus
                )}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-sm ${getStatusDotColor(
                    uiStatus
                  )}`}
                />
                <span className="text-xs font-medium">{uiStatus}</span>
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto bg-background">
          {isLoading && (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <span className="text-sm text-red-500 dark:text-red-400">
                Failed to load payment request
              </span>
              <Button
                size="sm"
                variant="outline"
                className="text-xs cursor-pointer"
                onClick={handleRetry}
              >
                Try again
              </Button>
            </div>
          )}

          {request && !isLoading && !isError && (
            <>
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="text-xl font-semibold text-foreground">
                  {formatAmount(request.amount, request.currency)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Payment method:{" "}
                  <span className="font-medium text-foreground">
                    {request.paymentMethod === "wallet"
                      ? "Wallet"
                      : request.paymentMethod === "link"
                      ? "Payment link"
                      : request.paymentMethod}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Customer
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {request.customer?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {request.customer?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {request.customer?.phone}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.description || "No description provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Created at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Due date
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(request.dueDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {request.paymentLink && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Payment link
                  </p>
                  <p className="text-xs text-muted-foreground break-all">
                    {request.paymentLink.url}
                  </p>
                </div>
              )}

              {/* Edit form */}
              <div className="mt-2 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">
                    Edit payment request
                  </p>
                  {!isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs cursor-pointer"
                      onClick={() => setIsEditing(true)}
                      disabled={isUpdating || isCancelling}
                    >
                      Edit
                    </Button>
                  )}
                </div>

                {isEditing && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="edit-pr-amount"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Amount
                        </Label>
                        <Input
                          id="edit-pr-amount"
                          type="number"
                          value={amountInput}
                          onChange={(e) => setAmountInput(e.target.value)}
                          disabled={isUpdating || isCancelling}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="edit-pr-method"
                          className="text-xs font-medium text-muted-foreground"
                        >
                          Payment method
                        </Label>
                        <select
                          id="edit-pr-method"
                          value={methodInput}
                          onChange={(e) => setMethodInput(e.target.value)}
                          disabled={isUpdating || isCancelling}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-xs text-foreground focus:ring-2 focus:ring-[#009688] focus:border-transparent outline-none"
                        >
                          <option value="wallet">Wallet</option>
                          <option value="link">Payment link</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-pr-description"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Description
                      </Label>
                      <Textarea
                        id="edit-pr-description"
                        value={descriptionInput}
                        onChange={(e) =>
                          setDescriptionInput(e.target.value)
                        }
                        disabled={isUpdating || isCancelling}
                        className="text-sm min-h-20"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-pr-due-date"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Due date
                      </Label>
                      <Input
                        id="edit-pr-due-date"
                        type="date"
                        value={dueDateInput}
                        onChange={(e) => setDueDateInput(e.target.value)}
                        disabled={isUpdating || isCancelling}
                        className="text-sm"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                        disabled={isUpdating || isCancelling}
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs bg-[#009688] hover:bg-[#008577] text-white cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={isUpdating || isCancelling}
                        onClick={handleSaveChanges}
                      >
                        {isUpdating && (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        )}
                        Save changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-background">
          {request && (
            <Button
              variant="outline"
              onClick={handleCancelRequest}
              disabled={isCancelling}
              className="cursor-pointer border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
            >
              {isCancelling ? "Cancelling..." : "Cancel request"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

