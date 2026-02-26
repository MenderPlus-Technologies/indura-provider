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
import { EditManualTransactionDrawer } from "./EditManualTransactionDrawer";
import {
  useGetProviderManualTransactionsQuery,
  useReconcileProviderManualTransactionMutation,
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
import { useToast } from "@/components/ui/toast";

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
  const [selectedManualId, setSelectedManualId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<ProviderManualTransaction | null>(null);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [reconcileManualTransaction] = useReconcileProviderManualTransactionMutation();
  const { showToast } = useToast();

  const handleReconcile = async (id: string) => {
    setReconcilingId(id);
    try {
      const response = await reconcileManualTransaction(id).unwrap();
      showToast(
        response?.message || "Transaction reconciled successfully",
        "success"
      );
      refetch();
    } catch (error: any) {
      console.error("Failed to reconcile transaction", error);
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to reconcile transaction. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setReconcilingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Manual / offline payments
          </h3>
          <p className="text-xs text-muted-foreground">
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
              <span className="text-sm text-muted-foreground">
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
                    tx.status === "reconciled"
                      ? "Reconciled"
                      : "Pending Reconciliation";
                  
                  const isReconciling = reconcilingId === tx._id;

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
                        <span className="text-sm font-semibold text-foreground">
                          {/* Manual endpoint doesn't include customer details */}
                          —
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-semibold text-foreground">
                          {formatTransactionAmount(tx.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-medium text-muted-foreground">
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
                        <span className="text-xs text-muted-foreground">
                          {tx.recordedBy}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.transactionDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 space-x-2">
                        {currentStatus === "Pending Reconciliation" ? (
                          <Button
                            size="sm"
                            className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleReconcile(tx._id)}
                            disabled={isReconciling}
                          >
                            {isReconciling && <Loader2 className="h-3 w-3 animate-spin" />}
                            {isReconciling ? "Reconciling..." : "Reconcile"}
                          </Button>
                        ) : (
                         ''
                        )}
                        {currentStatus === "Pending Reconciliation" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs cursor-pointer"
                            onClick={() => {
                              setEditingTransaction(tx);
                              setIsEditDrawerOpen(true);
                            }}
                          >
                            Edit
                          </Button>
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
        onCreated={() => {
          refetch();
        }}
      />

      <EditManualTransactionDrawer
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          setIsEditDrawerOpen(open);
          if (!open) {
            setEditingTransaction(null);
          }
        }}
        transaction={editingTransaction}
        onUpdated={() => {
          refetch();
        }}
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

