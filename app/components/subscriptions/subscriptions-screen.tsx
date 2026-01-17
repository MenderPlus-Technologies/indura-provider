'use client';

import { useState, useMemo } from 'react';
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
} from "./subscription-utils";

export const SubscriptionsScreen = () => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<SubscriptionStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderSubscriptions, setReminderSubscriptions] = useState<Subscription[]>([]);
  const [reminderType, setReminderType] = useState<'expiring' | 'expired' | 'individual'>('individual');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => getSubscriptionsWithDerivedStatus());

  // Get subscriptions with derived statuses
  const allSubscriptions = useMemo(() => subscriptions, [subscriptions]);

  // Filter subscriptions based on status, search query, and plan
  const filteredSubscriptions = useMemo(() => {
    let filtered = allSubscriptions;

    // Filter by status
    if (activeStatusFilter !== 'All') {
      filtered = filtered.filter(sub => sub.status === activeStatusFilter);
    }

    // Filter by search query (member name)
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
    // Add new subscription to the list
    setSubscriptions(prev => [...prev, newSubscription]);
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
    // Refresh subscriptions (in real app, this would fetch from API)
    setSubscriptions(getSubscriptionsWithDerivedStatus());
    console.log('Refreshing subscriptions');
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
            />
            <div className="overflow-x-auto">
              <SubscriptionsTable
                subscriptions={filteredSubscriptions}
                onActionClick={handleActionClick}
                onSendReminder={handleSendReminder}
              />
            </div>
            <SubscriptionsPagination />
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
