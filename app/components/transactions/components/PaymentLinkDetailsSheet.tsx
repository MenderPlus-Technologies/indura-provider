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
import {
  useGetProviderPaymentLinkQuery,
  type ProviderPaymentLink,
} from "@/app/store/apiSlice";
import { Loader2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import {
  getStatusBadgeStyles,
  getStatusDotColor,
  mapApiStatusToUIStatus,
} from "../transaction-utils";

interface PaymentLinkDetailsSheetProps {
  open: boolean;
  paymentLinkId: string | null;
  onOpenChange: (open: boolean) => void;
}

const formatAmount = (amount: number, currency: string) => {
  const symbol = currency === "NGN" ? "₦" : "";
  return (
    symbol +
    amount.toLocaleString("en-NG", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
};

const getStatusClasses = (status: string) => {
  const uiStatus = mapApiStatusToUIStatus(status);
  return getStatusBadgeStyles(uiStatus);
};

export const PaymentLinkDetailsSheet = ({
  open,
  paymentLinkId,
  onOpenChange,
}: PaymentLinkDetailsSheetProps) => {
  const { showToast } = useToast();

  const {
    data: link,
    isLoading,
    isError,
    refetch,
  } = useGetProviderPaymentLinkQuery(paymentLinkId || "", {
    skip: !paymentLinkId || !open,
  });

  const handleCopyUrl = () => {
    if (!link?.url) return;
    navigator.clipboard
      .writeText(link.url)
      .then(() => showToast("Payment link URL copied", "success"))
      .catch(() => showToast("Failed to copy link", "error"));
  };

  const handleCopyCode = () => {
    if (!link?.publicCode) return;
    navigator.clipboard
      .writeText(link.publicCode)
      .then(() => showToast("Payment link code copied", "success"))
      .catch(() => showToast("Failed to copy code", "error"));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="max-w-xl w-full flex flex-col p-0"
      >
        <SheetHeader className="bg-[#009688] text-white px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <SheetTitle className="text-white">
                Payment link details
              </SheetTitle>
              {link?.publicCode && (
                <SheetDescription className="text-xs text-white/80">
                  Code:{" "}
                  <span className="font-mono break-all">
                    {link.publicCode}
                  </span>
                </SheetDescription>
              )}
            </div>
            {link && (
              (() => {
                const uiStatus = mapApiStatusToUIStatus(link.status);
                return (
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
                );
              })()
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
                Failed to load payment link
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {link && !isLoading && (
            <>
              {/* Amount & status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatAmount(link.amount, link.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {link.currency}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Payments summary
                  </p>
                  <p className="text-sm text-foreground">
                    Total payments:{" "}
                    <span className="font-semibold">
                      {link.totalPayments}
                    </span>
                  </p>
                  <p className="text-sm text-foreground">
                    Amount received:{" "}
                    <span className="font-semibold">
                      {formatAmount(link.totalAmountPaid, link.currency)}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last paid:{" "}
                    {link.lastPaidAt
                      ? new Date(link.lastPaidAt).toLocaleString()
                      : "No payments yet"}
                  </p>
                </div>
              </div>

              {/* Title & description */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Link information
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {link.title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {link.description || "No description provided."}
                </p>
              </div>

              {/* URL & codes */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Payment URL
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground break-all flex-1">
                      {link.url}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      onClick={handleCopyUrl}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Checkout endpoint
                  </p>
                  <span className="text-xs text-foreground break-all">
                    {/* checkoutEndpoint is not on list endpoint, but exists on single */}
                    {"checkoutEndpoint" in link
                      ? (link as any).checkoutEndpoint
                      : "—"}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Public code
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground break-all flex-1">
                      {link.publicCode}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 cursor-pointer"
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Created at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(link.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Expires at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(link.expiresAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-background">
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

