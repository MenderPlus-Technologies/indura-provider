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
  useGetProviderSubscriptionQuery,
  type ProviderSubscriber,
} from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";
import { formatDate, type SubscriptionStatus, deriveSubscriptionStatus } from "./subscription-utils";

interface SubscriptionDetailsSheetProps {
  open: boolean;
  subscriptionId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionDetailsSheet = ({
  open,
  subscriptionId,
  onOpenChange,
}: SubscriptionDetailsSheetProps) => {
  const {
    data: sub,
    isLoading,
    isError,
    refetch,
  } = useGetProviderSubscriptionQuery(subscriptionId || "", {
    skip: !subscriptionId || !open,
  });

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  const getUiStatus = (subscription: ProviderSubscriber | undefined): SubscriptionStatus => {
    if (!subscription) return "Active";
    // Prefer derived status from backend if present
    if (subscription.derivedStatusLabel) {
      const label = subscription.derivedStatusLabel;
      if (label === "New" || label === "Active" || label === "Expiring Soon" || label === "Expired") {
        return label;
      }
    }
    return deriveSubscriptionStatus(
      subscription.startDate,
      subscription.expiryDate,
      subscription.createdAt
    );
  };

  const uiStatus = getUiStatus(sub);

  const getStatusBadgeClasses = (status: SubscriptionStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400";
      case "Active":
        return "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";
      case "Expiring Soon":
        return "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400";
      case "Expired":
        return "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300";
    }
  };

  const getStatusDotColor = (status: SubscriptionStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Active":
        return "bg-green-500";
      case "Expiring Soon":
        return "bg-yellow-500";
      case "Expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="max-w-xl w-full flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <SheetTitle>
                Subscription details
              </SheetTitle>
              {sub?.userId && typeof sub.userId === "object" && (
                <SheetDescription className="text-xs">
                  {sub.userId.name} • {sub.userId.email}
                </SheetDescription>
              )}
            </div>
            {sub && (
              <Badge
                className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[999px] border border-solid ${getStatusBadgeClasses(
                  uiStatus
                )}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-sm ${getStatusDotColor(
                    uiStatus
                  )}`}
                />
                <span className="text-xs font-medium">
                  {sub.derivedStatusLabel || uiStatus}
                </span>
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
                Failed to load subscription
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {sub && !isLoading && (
            <>
              {/* Plan & amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Plan
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {sub.planName}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {sub.planType}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {sub.amount.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      {sub.currency}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Status: {sub.status}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Start date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(sub.startDate)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Expiry date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDate(sub.expiryDate)}
                  </p>
                </div>
              </div>

              {/* Auto renew & meta */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Subscription settings
                </p>
                <p className="text-sm text-foreground">
                  Auto renew:{" "}
                  <span className="font-medium text-foreground">
                    {sub.autoRenew ? "Enabled" : "Disabled"}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Renewal reminder sent:{" "}
                  <span className="font-medium">
                    {sub.renewalReminderSent ? "Yes" : "No"}
                  </span>
                </p>
                {sub.transactionReference && (
                  <p className="text-sm text-muted-foreground">
                    Transaction reference:{" "}
                    <span className="font-mono break-all text-foreground">
                      {sub.transactionReference}
                    </span>
                  </p>
                )}
              </div>

              {/* Payment history */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Payment history
                </p>
                {sub.paymentHistory && sub.paymentHistory.length > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Payment history is available (not yet detailed in UI).
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No payments recorded for this subscription yet.
                  </p>
                )}
              </div>

              {/* Created / Updated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Created at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(sub.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Updated at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(sub.updatedAt).toLocaleString()}
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
}

