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
  useGetProviderManualTransactionQuery,
  type ProviderManualTransaction,
} from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";
import {
  formatTransactionAmount,
  getStatusBadgeStyles,
  getStatusDotColor,
} from "../transaction-utils";

interface ManualTransactionDetailsSheetProps {
  open: boolean;
  manualTransactionId: string | null;
  onOpenChange: (open: boolean) => void;
}

export const ManualTransactionDetailsSheet = ({
  open,
  manualTransactionId,
  onOpenChange,
}: ManualTransactionDetailsSheetProps) => {
  const {
    data: tx,
    isLoading,
    isError,
    refetch,
  } = useGetProviderManualTransactionQuery(manualTransactionId || "", {
    skip: !manualTransactionId || !open,
  });

  const uiStatus =
    tx?.status === "reconciled" ? "Settled" : ("Pending" as const);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
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
                Manual transaction
              </SheetTitle>
              {tx?.reference && (
                <SheetDescription className="text-xs">
                  Reference:{" "}
                  <span className="font-mono break-all">{tx.reference}</span>
                </SheetDescription>
              )}
            </div>
            {tx && (
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
                Failed to load manual transaction
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {tx && !isLoading && (
            <>
              {/* Amount & method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Amount
                  </p>
                  <p className="text-xl font-semibold text-foreground">
                    {formatTransactionAmount(tx.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase">
                    {tx.currency}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Payment method
                  </p>
                  <p className="text-sm text-foreground">
                    {tx.paymentMethod === "cash"
                      ? "Cash"
                      : tx.paymentMethod === "pos"
                      ? "POS"
                      : tx.paymentMethod === "bank_transfer"
                      ? "Bank Transfer"
                      : tx.paymentMethod}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Transaction date:{" "}
                    {new Date(tx.transactionDate).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Description & metadata */}
              <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-card p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-sm text-foreground">
                  {tx.description || "No description provided."}
                </p>
              </div>

              {/* Reconciliation block */}
              {tx.reconciliation && (
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-card p-4 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Reconciliation details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Reconciled at</p>
                      <p className="text-sm text-foreground">
                        {new Date(
                          tx.reconciliation.reconciledAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Reconciled by</p>
                      <p className="text-sm text-foreground">
                        {tx.reconciliation.reconciledBy}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Credited transaction
                      </p>
                      <p className="text-sm text-foreground">
                        {tx.reconciliation.creditedTransactionId}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Reconciliation reference
                      </p>
                      <p className="text-sm text-foreground">
                        {tx.reconciliation.reconciliationReference}
                      </p>
                    </div>
                  </div>
                  {tx.reconciliation.note && (
                    <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-muted-foreground">Note</p>
                      <p className="text-sm text-foreground">
                        {tx.reconciliation.note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Created / Updated */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-card p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Created at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-card p-4 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Updated at
                  </p>
                  <p className="text-sm text-foreground">
                    {new Date(tx.updatedAt).toLocaleString()}
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

