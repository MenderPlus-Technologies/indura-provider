'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { TransactionsHeader } from "./transactions-header";
import { OverallIncomeCard } from "./overall-income-card";
import { TransactionsTable } from "./transactions-table";
import { TransactionsPagination } from "./transactions-pagination";
import { NewRequestModal } from "./new-request-modal";
import { TransactionsFilterPanel, type FilterState } from "./transactions-filter-panel";
import { type Transaction, mapApiStatusToUIStatus, formatTransactionDate, formatTransactionAmount, getPayerName, getPayerEmail, exportToCSV } from "./transaction-utils";
import { useGetProviderTransactionsQuery } from "@/app/store/apiSlice";
import type { ProviderTransaction } from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const TransactionsScreen = () => {
  const { data: transactionsData, isLoading, isError, refetch, isFetching } = useGetProviderTransactionsQuery();
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    type: [],
    search: '',
    minAmount: '',
    maxAmount: '',
    dateFrom: '',
    dateTo: '',
  });

  // Map API transactions to UI format
  const allTransactions: Transaction[] = useMemo(() => {
    if (!transactionsData?.transactions) {
      return []; // Return empty array instead of dummy data
    }

    return transactionsData.transactions.map((apiTransaction: ProviderTransaction) => {
      return {
        payer: getPayerName(apiTransaction),
        email: getPayerEmail(apiTransaction),
        datetime: formatTransactionDate(apiTransaction.createdAt),
        method: apiTransaction.category === 'provider_payment' ? 'Provider Payment' : 
                apiTransaction.category === 'payment_received' ? 'Payment Received' : 
                'Wallet',
        status: mapApiStatusToUIStatus(apiTransaction.status),
        amount: formatTransactionAmount(apiTransaction.amount),
        type: apiTransaction.type,
        reference: apiTransaction.reference,
        category: apiTransaction.category,
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
        t.email.toLowerCase().includes(query) ||
        (t.reference && t.reference.toLowerCase().includes(query))
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

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

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

  const handleDownloadCSV = () => {
    exportToCSV(filteredAndSortedTransactions, 'transactions');
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
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <TransactionsHeader 
        onNewRequest={() => setIsNewRequestModalOpen(true)}
      />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
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

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading transactions...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-red-500 dark:text-red-400">Failed to load transactions</span>
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
                  <TransactionsTable transactions={paginatedTransactions} />
                </div>
                {filteredAndSortedTransactions.length > 0 && (
                  <TransactionsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
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
    </div>
  );
};
