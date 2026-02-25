'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ManualPaymentDrawer } from "./ManualPaymentDrawer";
import {
  useGetProviderManualTransactionsQuery,
  type ProviderManualTransaction,
} from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";
import {
  formatTransactionAmount,
  getStatusBadgeStyles,
  getStatusDotColor,
  mapApiStatusToUIStatus,
} from "../transaction-utils";
import { ManualTransactionDetailsSheet } from "./ManualTransactionDetailsSheet";

type ManualStatus = "Pending Reconciliation" | "Reconciled";

const getStatusClasses = (status: ManualStatus) => {
  const uiStatus =
    status === "Reconciled"
      ? ("Settled" as const)
      : ("Pending" as const);
  return getStatusBadgeStyles(uiStatus);
};

export const ManualTransactionsTab = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProviderManualTransactionsQuery({ page: 1, limit: 10 });

  const transactions: ProviderManualTransaction[] = data?.items ?? [];
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [localStatus, setLocalStatus] = useState<Record<string, ManualStatus>>(
    {}
  );
  const [selectedManualId, setSelectedManualId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleReconcile = (id: string) => {
    setLocalStatus((prev) => ({
      ...prev,
      [id]: "Reconciled",
    }));
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#344054]">
            Manual / offline payments
          </h3>
          <p className="text-xs text-[#475467]">
            Track cash, transfer and POS payments logged by your team.
          </p>
        </div>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer text-xs sm:text-sm"
        >
          Log Manual Payment
        </Button>
      </div>

      <Card className="shadow-none border border-[#DFE1E6] dark:border-gray-700 rounded-2xl">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-[#009688]" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <span className="text-sm text-red-500 dark:text-red-400">
                Failed to load manual transactions
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm text-[#475467]">
                No manual transactions found
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-solid border-[#DFE1E6] dark:border-gray-700">
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Customer
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Amount
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Method
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Logged by
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Date
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2 w-[140px]">
                    <span className="text-xs font-medium text-gray-500">
                      Action
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const currentStatus: ManualStatus =
                    localStatus[tx._id] ||
                    (tx.status === "reconciled"
                      ? "Reconciled"
                      : "Pending Reconciliation");

                  const methodLabel =
                    tx.paymentMethod === "cash"
                      ? "Cash"
                      : tx.paymentMethod === "pos"
                      ? "POS"
                      : tx.paymentMethod === "bank_transfer"
                      ? "Bank Transfer"
                      : tx.paymentMethod;

                  return (
                    <TableRow
                      key={tx._id}
                      className="border-b border-solid border-[#DFE1E6] dark:border-gray-700 last:border-b-0"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-semibold text-[#344054]">
                          {/* Manual endpoint doesn't include customer details */}
                          —
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-semibold text-[#344054]">
                          {formatTransactionAmount(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-medium text-[#475467]">
                          {methodLabel}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusClasses(
                            currentStatus
                          )}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-sm ${getStatusDotColor(
                              currentStatus === "Reconciled"
                                ? "Settled"
                                : "Pending"
                            )}`}
                          />
                          <span className="text-xs font-medium">
                            {currentStatus}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-[#475467]">
                          {tx.recordedBy}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-[#475467]">
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 space-x-2">
                        {currentStatus === "Pending Reconciliation" ? (
                          <Button
                            size="sm"
                            className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer text-xs"
                            onClick={() => handleReconcile(tx._id)}
                          >
                            Reconcile
                          </Button>
                        ) : (
                         ''
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs cursor-pointer"
                          onClick={() => {
                            setSelectedManualId(tx._id);
                            setIsDetailsOpen(true);
                          }}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <ManualPaymentDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />

      <ManualTransactionDetailsSheet
        open={isDetailsOpen}
        manualTransactionId={selectedManualId}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedManualId(null);
          }
        }}
      />
    </>
  );
};

