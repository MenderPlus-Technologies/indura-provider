'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { SubscriptionsHeader } from "./subscriptions-header";
import { SubscriptionsSearchBar } from "./subscriptions-search-bar";
import { SubscriptionsTable } from "./subscriptions-table";
import { SubscriptionsPagination } from "./subscriptions-pagination";
import { CreateSubscriptionModal } from "./create-subscription-modal";
import { SubscriptionReminderModal } from "./subscription-reminder-modal";
import {
  getSubscriptionsWithDerivedStatus,
  type Subscription,
  type SubscriptionStatus,
  mapApiSubscriberStatus,
  subscriptionPlans,
} from "./subscription-utils";
import { useGetProviderSubscribersQuery } from "@/app/store/apiSlice";
import type { ProviderSubscriber } from "@/app/store/apiSlice";

const ITEMS_PER_PAGE = 10;

export const SubscriptionsScreen = () => {
  const { data: subscribersData, isLoading, isError, refetch, isFetching } = useGetProviderSubscribersQuery();
  const [activeStatusFilter, setActiveStatusFilter] = useState<SubscriptionStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderSubscriptions, setReminderSubscriptions] = useState<Subscription[]>([]);
  const [reminderType, setReminderType] = useState<'expiring' | 'expired' | 'individual'>('individual');

  // Map API subscribers to UI format
  const allSubscriptions: Subscription[] = useMemo(() => {
    if (!subscribersData?.subscribers) {
      return []; // Return empty array instead of dummy data
    }

    return subscribersData.subscribers.map((apiSubscriber: ProviderSubscriber) => {
      // Handle userId which can be string or object
      const userId = typeof apiSubscriber.userId === 'string' 
        ? { _id: apiSubscriber.userId, email: '', name: '', phone: '' }
        : apiSubscriber.userId;

      return {
        id: apiSubscriber._id,
        memberName: userId.name || 'Unknown',
        memberEmail: userId.email || '',
        plan: apiSubscriber.planName,
        startDate: apiSubscriber.startDate,
        endDate: apiSubscriber.expiryDate,
        status: mapApiSubscriberStatus(
          apiSubscriber.status,
          apiSubscriber.startDate,
          apiSubscriber.expiryDate,
          apiSubscriber.createdAt
        ),
      };
    });
  }, [subscribersData]);

  // Get unique plan names from API data for filter dropdown
  const availablePlans = useMemo(() => {
    if (!subscribersData?.subscribers) {
      return []; // Return empty array instead of dummy plans
    }
    const plans = new Set(subscribersData.subscribers.map(sub => sub.planName));
    return Array.from(plans).sort();
  }, [subscribersData]);

  // Filter subscriptions based on status, search query, and plan
  const filteredSubscriptions = useMemo(() => {
    let filtered = allSubscriptions;

    // Filter by status
    if (activeStatusFilter !== 'All') {
      filtered = filtered.filter(sub => sub.status === activeStatusFilter);
    }

    // Filter by search query (customer name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        sub =>
          sub.memberName.toLowerCase().includes(query) ||
          sub.memberEmail.toLowerCase().includes(query)
      );
    }

    // Filter by plan
    if (selectedPlan) {
      filtered = filtered.filter(sub => sub.plan === selectedPlan);
    }

    return filtered;
  }, [allSubscriptions, activeStatusFilter, searchQuery, selectedPlan]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredSubscriptions.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds or when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, filteredSubscriptions.length]);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedPlan, activeStatusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if there are expiring or expired subscriptions for bulk actions
  const hasExpiringSubscriptions = useMemo(() => {
    return filteredSubscriptions.some(sub => sub.status === 'Expiring Soon');
  }, [filteredSubscriptions]);

  const hasExpiredSubscriptions = useMemo(() => {
    return filteredSubscriptions.some(sub => sub.status === 'Expired');
  }, [filteredSubscriptions]);

  const handleActionClick = (subscription: Subscription) => {
    // Handle action (edit, view, etc.)
    console.log('Action clicked for subscription:', subscription);
  };

  const handleAddSubscription = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSuccess = (newSubscription: Subscription) => {
    // Refetch subscriptions after creating new one
    refetch();
    console.log('Subscription created:', newSubscription);
  };

  const handleSendReminder = (subscription: Subscription) => {
    setReminderSubscriptions([subscription]);
    setReminderType('individual');
    setIsReminderModalOpen(true);
  };

  const handleBulkReminderExpiring = () => {
    const expiringSubs = filteredSubscriptions.filter(sub => sub.status === 'Expiring Soon');
    if (expiringSubs.length === 0) return;
    
    // Confirmation
    if (window.confirm(`Send reminder notifications to ${expiringSubs.length} customer(s) with expiring subscriptions?`)) {
      setReminderSubscriptions(expiringSubs);
      setReminderType('expiring');
      setIsReminderModalOpen(true);
    }
  };

  const handleBulkReminderExpired = () => {
    const expiredSubs = filteredSubscriptions.filter(sub => sub.status === 'Expired');
    if (expiredSubs.length === 0) return;
    
    // Confirmation
    if (window.confirm(`Send reminder notifications to ${expiredSubs.length} customer(s) with expired subscriptions?`)) {
      setReminderSubscriptions(expiredSubs);
      setReminderType('expired');
      setIsReminderModalOpen(true);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterClick = () => {
    // Handle advanced filter modal/drawer
    console.log('Open advanced filters');
  };

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <SubscriptionsHeader
        activeStatusFilter={activeStatusFilter}
        onStatusFilterChange={setActiveStatusFilter}
        onAddSubscription={handleAddSubscription}
        onBulkReminderExpiring={handleBulkReminderExpiring}
        onBulkReminderExpired={handleBulkReminderExpired}
        hasExpiringSubscriptions={hasExpiringSubscriptions}
        hasExpiredSubscriptions={hasExpiredSubscriptions}
      />

      <div className="mt-4 px-4 sm:px-6 gap-4 sm:gap-6 justify-center w-full">
        <div className="bg-[#F9F9FB] dark:bg-gray-800/50 flex flex-col gap-2 items-center border border-[#DFE1E6] dark:border-gray-700 p-1 rounded-2xl">
          <Card className="flex flex-col shadow-none gap-1 p-1 w-full">
            <SubscriptionsSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
              onRefresh={handleRefresh}
              onFilterClick={handleFilterClick}
              isRefreshing={isFetching}
              availablePlans={availablePlans}
            />
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading subscriptions...</span>
                </div>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-sm text-red-500 dark:text-red-400">Failed to load subscriptions</span>
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
                  <SubscriptionsTable
                    subscriptions={paginatedSubscriptions}
                    onActionClick={handleActionClick}
                    onSendReminder={handleSendReminder}
                  />
                </div>
                {filteredSubscriptions.length > 0 && (
                  <SubscriptionsPagination
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

      {/* Create Subscription Modal */}
      <CreateSubscriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Reminder Notification Modal */}
      <SubscriptionReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        subscriptions={reminderSubscriptions}
        reminderType={reminderType}
      />
    </div>
  );
};
