'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { SubscriptionsHeader } from "./subscriptions-header";
import { SubscriptionsSearchBar } from "./subscriptions-search-bar";
import { SubscriptionsTable } from "./subscriptions-table";
import { SubscriptionsPagination } from "./subscriptions-pagination";
import { CreateSubscriptionModal } from "./create-subscription-modal";
import { SubscriptionReminderModal } from "./subscription-reminder-modal";
import { SubscriptionDetailsSheet } from "./subscription-details-sheet";
import { EditSubscriptionModal } from "./edit-subscription-modal";
import { ConfirmDeleteSubscriptionModal } from "./confirm-delete-subscription-modal";
import {
  getSubscriptionsWithDerivedStatus,
  type Subscription,
  type SubscriptionStatus,
  mapApiSubscriberStatus,
  subscriptionPlans,
} from "./subscription-utils";
import { useGetProviderSubscribersQuery } from "@/app/store/apiSlice";
import type { ProviderSubscriber } from "@/app/store/apiSlice";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";

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
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubscriptionId, setEditingSubscriptionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSubscriptionId, setDeletingSubscriptionId] = useState<string | null>(null);
  const { showToast } = useToast();

  // Map API subscribers to UI format
  const allSubscriptions: Subscription[] = useMemo(() => {
    if (!subscribersData?.subscribers) {
      return []; // Return empty array instead of dummy data
    }

    return subscribersData.subscribers.map((apiSubscriber: ProviderSubscriber) => {
      // Handle userId which can be string, object, or null/undefined
      const rawUser = apiSubscriber.userId;

      const user =
        typeof rawUser === 'string'
          ? { _id: rawUser, email: '', name: '', phone: '' }
          : rawUser || { _id: undefined, email: '', name: '', phone: '' };

      return {
        id: apiSubscriber._id,
        memberId: user._id, // underlying customer ID (used for notifications; may be undefined)
        memberName: user.name || 'Unknown',
        memberEmail: user.email || '',
        plan: apiSubscriber.planName,
        startDate: apiSubscriber.startDate,
        endDate: apiSubscriber.expiryDate,
        status: mapApiSubscriberStatus(
          apiSubscriber.status,
          apiSubscriber.startDate,
          apiSubscriber.expiryDate,
          apiSubscriber.createdAt,
          apiSubscriber.derivedStatusLabel
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

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscriptionId(subscription.id);
    setIsDetailsOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscriptionId(subscription.id);
    setIsEditModalOpen(true);
  };

  const handleDeleteSubscription = (subscription: Subscription) => {
    setDeletingSubscriptionId(subscription.id);
    setIsDeleteModalOpen(true);
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

    // Open reminder modal directly for all expiring subscriptions
    setReminderSubscriptions(expiringSubs);
    setReminderType('expiring');
    setIsReminderModalOpen(true);
  };

  const handleBulkReminderExpired = () => {
    const expiredSubs = filteredSubscriptions.filter(sub => sub.status === 'Expired');
    if (expiredSubs.length === 0) return;

    // Open reminder modal directly for all expired subscriptions
    setReminderSubscriptions(expiredSubs);
    setReminderType('expired');
    setIsReminderModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleFilterClick = () => {
    // Handle advanced filter modal/drawer
    console.log('Open advanced filters');
  };

  return (
    <div className="flex flex-col w-full items-start bg-background relative">
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
                    onView={handleViewSubscription}
                    onEdit={handleEditSubscription}
                    onDelete={handleDeleteSubscription}
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

      {/* Edit Subscription Modal */}
      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        subscriptionId={editingSubscriptionId}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSubscriptionId(null);
        }}
        onUpdated={() => {
          refetch();
        }}
      />

      {/* Delete Subscription Confirmation Modal */}
      <ConfirmDeleteSubscriptionModal
        isOpen={isDeleteModalOpen}
        subscriptionId={deletingSubscriptionId}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingSubscriptionId(null);
        }}
        onDeleted={() => {
          refetch();
          showToast("Subscription deleted successfully", "success");
        }}
      />

      {/* Subscription details sheet */}
      <SubscriptionDetailsSheet
        open={isDetailsOpen}
        subscriptionId={selectedSubscriptionId}
        onOpenChange={(open) => {
          setIsDetailsOpen(open);
          if (!open) {
            setSelectedSubscriptionId(null);
          }
        }}
      />
    </div>
  );
};
