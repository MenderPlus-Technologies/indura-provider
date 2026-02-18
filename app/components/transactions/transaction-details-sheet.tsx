'use client';

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, X, Copy } from "lucide-react";
import {
  useGetProviderTransactionQuery,
  type ProviderTransactionDetail,
} from "@/app/store/apiSlice";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getStatusBadgeStyles,
  getStatusDotColor,
} from "./transaction-utils";
import { useToast } from "@/components/ui/toast";

interface TransactionDetailsSheetProps {
  transactionId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatUserDisplay = (
  user: ProviderTransactionDetail["userId"]
): { name: string; email: string; phone: string } => {
  if (!user) {
    return { name: "Unknown", email: "N/A", phone: "N/A" };
  }
  if (typeof user === "string") {
    return { name: user, email: "N/A", phone: "N/A" };
  }
  return {
    name: user.name || "Unknown",
    email: user.email || "N/A",
    phone: user.phone || "N/A",
  };
};

export const TransactionDetailsSheet = ({
  transactionId,
  open,
  onOpenChange,
}: TransactionDetailsSheetProps) => {
  const { showToast } = useToast();
  const { data, isLoading, isError, refetch } = useGetProviderTransactionQuery(
    transactionId || "",
    {
      skip: !open || !transactionId,
    }
  );

  const handleCopyReference = () => {
    if (!data?.reference) return;
    navigator.clipboard
      .writeText(data.reference)
      .then(() => showToast("Reference copied to clipboard", "success"))
      .catch(() => showToast("Failed to copy reference", "error"));
  };

  const handleRetry = () => {
    refetch();
  };

  const user = data ? formatUserDisplay(data.userId) : null;
  const description =
    (data?.metadata as any)?.description ||
    (data?.category === "provider_payment"
      ? "Provider payment"
      : data?.category === "payment_received"
      ? "Payment received"
      : "N/A");

  const related = data?.relatedTransactions ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="max-w-xl w-full border-l border-gray-200/80 dark:border-gray-800/80"
      >
        <SheetHeader className="bg-[#009688]  text-white">
          <div className="flex items-center justify-between w-full">
            <div className="space-y-1">
              <SheetTitle className="text-white">
                Transaction details
              </SheetTitle>
              {data?.reference && (
                <SheetDescription className="text-xs text-white/80">
                  Reference:{" "}
                  <span className="font-mono break-all">
                    {data.reference}
                  </span>
                </SheetDescription>
              )}
            </div>
            <div className="flex items-center gap-3">
              {data && (
                <Badge
                  className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[999px] border border-solid bg-white/10 text-white ${getStatusBadgeStyles(
                    data.uiStatus || data.status
                  )}`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-sm ${getStatusDotColor(
                      data.uiStatus || data.status
                    )}`}
                  />
                  <span className="font-body-small-medium font-[number:var(--body-small-medium-font-weight)] text-[length:var(--body-small-medium-font-size)] text-right tracking-[var(--body-small-medium-letter-spacing)] leading-[var(--body-small-medium-line-height)] [font-style:var(--body-small-medium-font-style)]">
                    {data.uiStatus || data.status}
                  </span>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/10"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 bg-gray-50/60 dark:bg-gray-900">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading transaction details...
                </p>
              </div>
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <p className="text-sm text-red-500">
                Failed to load transaction details.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={handleRetry}
              >
                Try again
              </Button>
            </div>
          )}

          {!isLoading && !isError && data && (
            <>
              {/* Amount & reference */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-[#475467] dark:text-gray-400 uppercase">
                      Amount
                    </div>
                    <div className="text-2xl font-semibold text-[#344054] dark:text-white mt-1">
                      {formatTransactionAmount(data.amount)}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {data.reference && (
                      <>
                        <div className="text-xs font-medium text-[#475467] dark:text-gray-400 uppercase">
                          Reference
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyReference}
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-50/90 bg-gray-900/90 dark:bg-gray-800 px-2 py-1 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <span className="truncate max-w-[160px]">
                            {data.reference}
                          </span>
                          <Copy className="h-3 w-3 shrink-0" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Payer card */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2 shadow-sm">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Payer
                </div>
                <div className="text-sm font-semibold text-[#344054] dark:text-white">
                  {user?.name}
                </div>
                <div className="text-xs text-[#475467] dark:text-gray-400">
                  {user?.email}
                </div>
                <div className="text-xs text-[#475467] dark:text-gray-400">
                  {user?.phone}
                </div>
              </div>

              {/* Details & description */}
              <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4 shadow-sm">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-[#475467] dark:text-gray-400 uppercase">
                    Details
                  </div>
                  <div className="text-xs text-[#475467] dark:text-gray-400">
                    <span className="font-semibold text-[#344054] dark:text-gray-200">
                      Type:
                    </span>{" "}
                    {data.type}
                  </div>
                  <div className="text-xs text-[#475467] dark:text-gray-400">
                    <span className="font-semibold text-[#344054] dark:text-gray-200">
                      Method:
                    </span>{" "}
                    {(data.metadata as any)?.paymentMethod || "N/A"}
                  </div>
                  <div className="text-xs text-[#475467] dark:text-gray-400">
                    <span className="font-semibold text-[#344054] dark:text-gray-200">
                      Created:
                    </span>{" "}
                    {formatTransactionDate(data.createdAt)}
                  </div>
                </div>

                <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-800 mt-1">
                  <div className="text-xs font-medium text-[#475467] dark:text-gray-400 uppercase mb-1.5">
                    Description
                  </div>
                  <p className="text-sm text-[#475467] dark:text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* Related transactions table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Related transactions
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {related.length} transaction
                    {related.length === 1 ? "" : "s"}
                  </p>
                </div>

                {related.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 py-6 px-4 text-center bg-white/60 dark:bg-gray-900/40">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No related transactions found for this request.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/60">
                          <TableHead className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Type
                          </TableHead>
                          <TableHead className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Amount
                          </TableHead>
                          <TableHead className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Reference
                          </TableHead>
                          <TableHead className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {related.map((rt) => (
                          <TableRow
                            key={rt._id}
                                className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/80 dark:hover:bg-gray-900/40 transition-colors"
                          >
                            <TableCell className="px-4 py-2">
                              <Badge
                                className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${
                                  rt.type === "credit"
                                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                                    : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                }`}
                              >
                                <span className="font-medium text-xs capitalize">
                                  {rt.type}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white">
                              {formatTransactionAmount(rt.amount)}
                            </TableCell>
                            <TableCell className="px-4 py-2 text-xs font-mono text-gray-600 dark:text-gray-300">
                              {rt.reference}
                            </TableCell>
                            <TableCell className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300">
                              {formatTransactionDate(rt.createdAt)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

