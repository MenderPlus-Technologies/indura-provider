'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  getStatusBadgeStyles,
  getStatusDotColor,
  mapApiStatusToUIStatus,
} from "../transaction-utils";
import {
  useGetProviderPaymentRequestsQuery,
  type ProviderPaymentRequest,
} from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";
import { PaymentRequestDetailsSheet } from "./PaymentRequestDetailsSheet";

const getStatusClasses = (status: string) => {
  const uiStatus = mapApiStatusToUIStatus(status);
  return getStatusBadgeStyles(uiStatus);
};

const formatAmount = (amount: number, currency: string) => {
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const PaymentRequestsTab = () => {
  const [page] = useState(1);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProviderPaymentRequestsQuery({ page, limit: 10 });

  const requests: ProviderPaymentRequest[] = data?.items ?? data?.paymentRequests ?? [];

  return (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Payment requests
          </h3>
          <p className="text-xs text-muted-foreground">
            View and track payment requests sent to your customers.
          </p>
        </div>
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
                Failed to load payment requests
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : !requests || requests.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm text-muted-foreground">
                No payment requests found
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-solid border-[#DFE1E6] dark:border-gray-700">
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Reference
                    </span>
                  </TableHead>
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
                      Due date
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2 w-[100px]">
                    <span className="text-xs font-medium text-gray-500">
                      Action
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const uiStatus = mapApiStatusToUIStatus(request.status);
                  const methodLabel =
                    request.paymentMethod === "wallet"
                      ? "Wallet"
                      : request.paymentMethod === "link"
                      ? "Payment link"
                      : request.paymentMethod;

                  return (
                    <TableRow
                      key={request._id}
                      className="border-b border-solid border-[#DFE1E6] dark:border-gray-700 last:border-b-0"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="text-xs font-mono text-[#475467]">
                          {request.reference}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#344054]">
                            {request.customer?.name}
                          </span>
                          <span className="text-xs text-[#6B7280]">
                            {request.customer?.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-sm font-semibold text-[#344054]">
                          {formatAmount(request.amount, request.currency)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-[#475467]">
                          {methodLabel}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusClasses(
                            request.status
                          )}`}
                        >
                          <span
                            className={`w-1 h-1 rounded-sm ${getStatusDotColor(
                              uiStatus
                            )}`}
                          />
                          <span className="text-xs font-medium">
                            {uiStatus}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <span className="text-xs text-[#475467]">
                          {new Date(request.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <button
                          type="button"
                          className="text-xs text-[#009688] hover:underline cursor-pointer"
                          onClick={() => {
                            setSelectedRequestId(request._id);
                            setIsDetailsOpen(true);
                          }}
                        >
                          View
                        </button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <PaymentRequestDetailsSheet
        open={isDetailsOpen}
        paymentRequestId={selectedRequestId}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedRequestId(null);
          }
        }}
      />
    </>
  );
};

