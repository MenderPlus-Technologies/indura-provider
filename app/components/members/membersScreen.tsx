'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { MembersHeader } from "./members-header";
import { TotalMembersCard } from "./total-members-card";
import { MembersTable } from "./members-table";
import { MembersPagination } from "./members-pagination";
import { NotificationModal } from "./notification-modal";
import { type Member, formatCustomerAmount, exportCustomersToCSV } from "./member-utils";
import { useGetProviderCustomersQuery } from "@/app/store/apiSlice";
import type { ProviderCustomer } from "@/app/store/apiSlice";
import { Loader2 } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const MembersScreen = () => {
  const { data: customersData, isLoading, isError, refetch, isFetching } = useGetProviderCustomersQuery();
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationRecipients, setNotificationRecipients] = useState<Member[]>([]);
  const [notificationType, setNotificationType] = useState<'all' | 'selected' | 'individual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Map API customers to UI format
  const allCustomers: Member[] = useMemo(() => {
    if (!customersData?.customers) {
      return []; // Return empty array instead of dummy data
    }

    return customersData.customers.map((apiCustomer: ProviderCustomer) => {
      return {
        name: apiCustomer.name,
        email: apiCustomer.email,
        phone: apiCustomer.phone,
        location: 'N/A', // API doesn't provide location, using fallback
        totalOrders: apiCustomer.transactionCount,
        totalSpent: formatCustomerAmount(apiCustomer.totalSpent),
        avatar: undefined,
      };
    });
  }, [customersData]);

  // Apply search filter
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return allCustomers;
    }

    const query = searchQuery.toLowerCase();
    return allCustomers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
  }, [allCustomers, searchQuery]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds or when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredCustomers.length]);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadCSV = () => {
    exportCustomersToCSV(filteredCustomers, 'customers');
  };

  const handleSendNotification = (type: 'all' | 'selected') => {
    if (type === 'all') {
      setNotificationRecipients(filteredCustomers);
      setNotificationType('all');
    } else {
      setNotificationRecipients(selectedMembers);
      setNotificationType('selected');
    }
    setIsNotificationModalOpen(true);
  };

  const handleIndividualNotification = (member: Member) => {
    setNotificationRecipients([member]);
    setNotificationType('individual');
    setIsNotificationModalOpen(true);
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalOpen(false);
    setNotificationRecipients([]);
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <MembersHeader 
        onSendNotification={handleSendNotification}
        hasSelectedMembers={selectedMembers.length > 0}
      />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <TotalMembersCard 
            totalCustomers={filteredCustomers.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRefresh={() => refetch()}
            onDownload={handleDownloadCSV}
            isRefreshing={isFetching}
          />

          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading customers...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-red-500 dark:text-red-400">Failed to load customers</span>
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
                  <MembersTable 
                    onIndividualNotification={handleIndividualNotification}
                    selectedMembers={selectedMembers}
                    onSelectionChange={setSelectedMembers}
                    customers={paginatedCustomers}
                    isLoading={isLoading}
                  />
                </div>
                {filteredCustomers.length > 0 && (
                  <MembersPagination
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

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={handleCloseNotificationModal}
        recipients={notificationRecipients}
        recipientType={notificationType}
      />
    </div>
  );
};
