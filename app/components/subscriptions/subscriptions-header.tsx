'use client';

import { Button } from "@/components/ui/button";
import { PanelLeft, Plus, Bell } from "lucide-react";
import { SubscriptionStatus } from "./subscription-utils";

interface SubscriptionsHeaderProps {
  activeStatusFilter: SubscriptionStatus | 'All';
  onStatusFilterChange: (status: SubscriptionStatus | 'All') => void;
  onAddSubscription?: () => void;
  onBulkReminderExpiring?: () => void;
  onBulkReminderExpired?: () => void;
  hasExpiringSubscriptions?: boolean;
  hasExpiredSubscriptions?: boolean;
}

export const SubscriptionsHeader = ({
  activeStatusFilter,
  onStatusFilterChange,
  onAddSubscription,
  onBulkReminderExpiring,
  onBulkReminderExpired,
  hasExpiringSubscriptions = false,
  hasExpiredSubscriptions = false,
}: SubscriptionsHeaderProps) => {
  const statusFilters: (SubscriptionStatus | 'All')[] = ['All', 'New', 'Active', 'Expiring Soon', 'Expired'];

  return (
    <header className="h-auto sm:h-[72px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-4 bg-background border-b border-solid border-border w-full">
      <Button
        variant="outline"
        className="h-auto bg-muted inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-solid border-border cursor-pointer"
      >
        <PanelLeft className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground text-sm">
          Subscriptions
        </span>
      </Button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {statusFilters.map((status) => (
            <Button
              key={status}
              variant={activeStatusFilter === status ? "default" : "outline"}
              onClick={() => onStatusFilterChange(status)}
              className={`h-auto px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-colors ${
                activeStatusFilter === status
                  ? "bg-[#009688] hover:bg-[#008577] text-white"
                  : "bg-muted text-muted-foreground border border-solid border-border hover:bg-muted/80"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Bulk Reminder Actions */}
        {hasExpiringSubscriptions && (
          <Button
            variant="outline"
            onClick={onBulkReminderExpiring}
            className="inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-card rounded-[10px] border border-solid border-border shadow-shadow-xsmall cursor-pointer shrink-0"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground text-xs sm:text-sm">
              Remind Expiring
            </span>
          </Button>
        )}
        {hasExpiredSubscriptions && (
          <Button
            variant="outline"
            onClick={onBulkReminderExpired}
            className="inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-card rounded-[10px] border border-solid border-border shadow-shadow-xsmall cursor-pointer shrink-0"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-foreground text-xs sm:text-sm">
              Remind Expired
            </span>
          </Button>
        )}

        <Button
          onClick={onAddSubscription}
          className="inline-flex h-10 items-center justify-center gap-2 px-2 sm:px-3 py-2 bg-[#009688] hover:bg-[#008577] rounded-[10px] shadow-shadow-xsmall cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 text-white" />
          <span className="font-semibold text-white text-xs sm:text-sm">
            New Subscription
          </span>
        </Button>
      </div>
    </header>
  );
};
