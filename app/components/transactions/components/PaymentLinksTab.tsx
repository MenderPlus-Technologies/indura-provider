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
import { CreatePaymentLinkDrawer } from "./CreatePaymentLinkDrawer";
import { EditPaymentLinkDrawer } from "./EditPaymentLinkDrawer";
import { PaymentLinkDetailsSheet } from "./PaymentLinkDetailsSheet";
import {
  getStatusBadgeStyles,
  getStatusDotColor,
  mapApiStatusToUIStatus,
} from "../transaction-utils";
import {
  useGetProviderPaymentLinksQuery,
  type ProviderPaymentLink,
} from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";

const getStatusClasses = (status: string) => {
  const uiStatus = mapApiStatusToUIStatus(status);
  return getStatusBadgeStyles(uiStatus);
};

export const PaymentLinksTab = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetProviderPaymentLinksQuery({ page: 1, limit: 10 });

  const links: ProviderPaymentLink[] = data?.items ?? [];
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [editingLink, setEditingLink] = useState<ProviderPaymentLink | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Payment links
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage one-time links you share with customers.
          </p>
        </div>
        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-[#009688] hover:bg-[#008577] text-white cursor-pointer text-xs sm:text-sm"
        >
          Create Payment Link
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
                Failed to load payment links
              </span>
              <button
                onClick={() => refetch()}
                className="text-xs text-[#009688] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : links.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <span className="text-sm text-muted-foreground">
                No payment links found
              </span>
            </div>
          ) : (
            <Table>
              <TableHeader >
                <TableRow className="border-b border-solid border-[#DFE1E6] dark:border-gray-700">
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Description
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Amount
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Status
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Created
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2">
                    <span className="text-xs font-medium text-gray-500">
                      Expires
                    </span>
                  </TableHead>
                  <TableHead className="px-4 py-2 w-[120px]">
                    <span className="text-xs font-medium text-gray-500">
                      Action
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow
                    key={link._id}
                    className="border-b border-solid border-[#DFE1E6] dark:border-gray-700 last:border-b-0"
                  >
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-muted-foreground line-clamp-2 max-w-xs">
                        {link.description}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm font-semibold text-foreground">
                        ₦
                        {link.amount.toLocaleString("en-NG", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        className={`inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[100px] border border-solid ${getStatusClasses(
                          link.status
                        )}`}
                      >
                        <span
                          className={`w-1 h-1 rounded-sm ${getStatusDotColor(
                            mapApiStatusToUIStatus(link.status)
                          )}`}
                        />
                        <span className="text-xs font-medium">
                          {mapApiStatusToUIStatus(link.status)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {new Date(link.expiresAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                        onClick={() => {
                          setSelectedLinkId(link._id);
                          setIsDetailsOpen(true);
                        }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs cursor-pointer"
                        onClick={() => {
                          setEditingLink(link);
                          setIsEditDrawerOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <CreatePaymentLinkDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onCreated={() => refetch()}
      />

      <EditPaymentLinkDrawer
        open={isEditDrawerOpen}
        onOpenChange={(open) => {
          setIsEditDrawerOpen(open);
          if (!open) {
            setEditingLink(null);
          }
        }}
        link={editingLink}
        onUpdated={() => refetch()}
      />

      <PaymentLinkDetailsSheet
        open={isDetailsOpen}
        paymentLinkId={selectedLinkId}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedLinkId(null);
          }
        }}
      />
    </>
  );
};

