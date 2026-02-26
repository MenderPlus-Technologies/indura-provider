'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TransactionsHeader } from "./transactions-header";
import { OverallIncomeCard } from "./overall-income-card";
import { TransactionsTable } from "./transactions-table";
import { TransactionsPagination } from "./transactions-pagination";
import { NewRequestModal } from "./new-request-modal";
import { TransactionsFilterPanel, type FilterState } from "./transactions-filter-panel";
import { type Transaction, mapApiStatusToUIStatus, formatTransactionDate, formatTransactionAmount, getPayerName } from "./transaction-utils";
import { useGetProviderTransactionsQuery } from "@/app/store/apiSlice";
import type { ProviderTransaction } from "@/app/store/apiSlice";
import { TransactionDetailsSheet } from "./transaction-details-sheet";
import { Loader2 } from "lucide-react";
import { WalletSummary } from "./components/WalletSummary";
import { PaymentLinksTab } from "./components/PaymentLinksTab";
import { ManualTransactionsTab } from "./components/ManualTransactionsTab";
import { PaymentRequestsTab } from "./components/PaymentRequestsTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiDownloadFile } from "@/app/utils/api";

export const TransactionsScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: transactionsData, isLoading, isError, refetch, isFetching } =
    useGetProviderTransactionsQuery({
      page: currentPage,
      limit: 10,
      sortBy,
      sortOrder,
    });
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
    search: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
  });

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Map API transactions to UI format
  const allTransactions: Transaction[] = useMemo(() => {
    if (!transactionsData?.transactions) {
      return []; // Return empty array instead of dummy data
    }

    return transactionsData.transactions.map((apiTransaction: ProviderTransaction) => {
      const user =
        apiTransaction.userId && typeof apiTransaction.userId === "object"
          ? (apiTransaction.userId as { name?: string })
          : null;

      return {
        id: apiTransaction._id,
        payer: user?.name || getPayerName(apiTransaction),
        datetime: formatTransactionDate(apiTransaction.createdAt),
        method:
          apiTransaction.metadata?.paymentMethod ??
          (apiTransaction.category === "provider_payment"
            ? "Provider Payment"
            : apiTransaction.category === "payment_received"
            ? "Payment Received"
            : "Wallet"),
        status: mapApiStatusToUIStatus(apiTransaction.status),
        amount: formatTransactionAmount(apiTransaction.amount),
        type: apiTransaction.type,
        reference: apiTransaction.reference,
        category: apiTransaction.category,
        description:
          (apiTransaction.metadata as any)?.description ||
          (apiTransaction.category === "provider_payment"
            ? "Provider payment"
            : apiTransaction.category === "payment_received"
            ? "Payment received"
            : ""),
        // Store raw data for filtering/sorting
        rawAmount: apiTransaction.amount,
        rawDate: new Date(apiTransaction.createdAt),
      } as Transaction & { rawAmount: number; rawDate: Date };
    });
  }, [transactionsData]);

  // Apply filters, search, and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...allTransactions];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.payer.toLowerCase().includes(query) ||
        (t.reference && t.reference.toLowerCase().includes(query)) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.status.length > 0) {
      result = result.filter(t => filters.status.includes(t.status));
    }

    if (filters.type.length > 0) {
      result = result.filter(t => t.type && filters.type.includes(t.type));
    }

    if (filters.minAmount || filters.maxAmount) {
      result = result.filter(t => {
        const amount = (t as Transaction & { rawAmount?: number }).rawAmount || 0;
        if (filters.minAmount && amount < parseFloat(filters.minAmount)) return false;
        if (filters.maxAmount && amount > parseFloat(filters.maxAmount)) return false;
        return true;
      });
    }

    if (filters.dateFrom || filters.dateTo) {
      result = result.filter(t => {
        const date = (t as Transaction & { rawDate?: Date }).rawDate || new Date();
        if (filters.dateFrom && date < new Date(filters.dateFrom)) return false;
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (date > toDate) return false;
        }
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = (a as Transaction & { rawDate?: Date }).rawDate || new Date();
          bValue = (b as Transaction & { rawDate?: Date }).rawDate || new Date();
          break;
        case 'amount':
          aValue = (a as Transaction & { rawAmount?: number }).rawAmount || 0;
          bValue = (b as Transaction & { rawAmount?: number }).rawAmount || 0;
          break;
        case 'payer':
          aValue = a.payer.toLowerCase();
          bValue = b.payer.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allTransactions, searchQuery, filters, sortBy, sortOrder]);

  const totalPages = transactionsData?.pagination?.totalPages ?? 1;

  // Reset to page 1 if current page is out of bounds or when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredAndSortedTransactions.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewRequestSuccess = (newTransaction: Transaction) => {
    // Refetch transactions after new request
    refetch();
    console.log('New transaction request created:', newTransaction);
  };

  const handleDownloadCSV = async () => {
    try {
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      await apiDownloadFile("/providers/transactions/export?format=csv", filename);
    } catch (error) {
      console.error("Failed to export transactions CSV", error);
      alert("Failed to export transactions. Please try again.");
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterReset = () => {
    setFilters({
      status: [],
      type: [],
      search: '',
      minAmount: '',
      maxAmount: '',
      dateFrom: '',
      dateTo: '',
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFilterCount = 
    filters.status.length +
    filters.type.length +
    (filters.minAmount || filters.maxAmount ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  return (
    <div className="flex flex-col w-full items-start bg-background relative">
      <TransactionsHeader 
        onNewRequest={() => setIsNewRequestModalOpen(true)}
      />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] p-3 dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700  rounded-2xl">
          <WalletSummary />

          <OverallIncomeCard 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterClick={() => setIsFilterPanelOpen(true)}
            onSortChange={handleSortChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            activeFilterCount={activeFilterCount}
            onDownload={handleDownloadCSV}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />

          <Card className="flex flex-col shadow-none gap-4 p-4 w-full">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between mb-3">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="requests">Payment Requests</TabsTrigger>
                  <TabsTrigger value="payment-links">Payment Links</TabsTrigger>
                  <TabsTrigger value="manual">Manual / Offline</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Loading transactions...
                      </span>
                    </div>
                  </div>
                ) : isError ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-sm text-red-500 dark:text-red-400">
                        Failed to load transactions
                      </span>
                      <button
                        onClick={() => refetch()}
                        className="text-sm text-[#009688] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <TransactionsTable
                        transactions={filteredAndSortedTransactions}
                        onRowClick={(t) => {
                          if (t.id) {
                            setSelectedTransactionId(t.id);
                            setIsDetailsOpen(true);
                          }
                        }}
                      />
                    </div>
                    {transactionsData?.pagination &&
                      transactionsData.pagination.totalPages > 1 && (
                        <TransactionsPagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="payment-links">
                <PaymentLinksTab />
              </TabsContent>

              <TabsContent value="requests">
                <PaymentRequestsTab />
              </TabsContent>

              <TabsContent value="manual">
                <ManualTransactionsTab />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* New Request Modal */}
      <NewRequestModal
        isOpen={isNewRequestModalOpen}
        onClose={() => setIsNewRequestModalOpen(false)}
        onSuccess={handleNewRequestSuccess}
      />

      {/* Filter Panel */}
      <TransactionsFilterPanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      {/* Transaction details sheet */}
      <TransactionDetailsSheet
        transactionId={selectedTransactionId}
        open={isDetailsOpen}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedTransactionId(null);
          }
        }}
      />
    </div>
  );
};
