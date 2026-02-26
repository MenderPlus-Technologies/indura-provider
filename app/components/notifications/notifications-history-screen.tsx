'use client';

import React, { useState } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import {
  useGetProviderNotificationsHistoryQuery,
  type ProviderNotification,
} from '@/app/store/apiSlice';
import { useToast } from '@/components/ui/toast';

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  sent: {
    bg: 'bg-emerald-50 text-emerald-700',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Sent',
  },
  failed: {
    bg: 'bg-red-50 text-red-700',
    text: 'text-red-700',
    dot: 'bg-red-500',
    label: 'Failed',
  },
  pending: {
    bg: 'bg-amber-50 text-amber-700',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    label: 'Pending',
  },
};

const formatDateTime = (iso: string) => {
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

const getStatusStyles = (status: string) => {
  const key = status?.toLowerCase();
  return STATUS_STYLES[key] || {
    bg: 'bg-gray-50 text-gray-700',
    text: 'text-gray-700',
    dot: 'bg-gray-400',
    label: status || 'Unknown',
  };
};

interface NotificationCardProps {
  notification: ProviderNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const styles = getStatusStyles(notification.status);

  return (
    <div className="w-full rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow p-4 md:p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <Bell className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-foreground">
              {notification.title}
            </h3>
            <p className="mt-1 text-xs md:text-sm text-muted-foreground">
              {notification.message}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles.bg}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
          <span>{styles.label}</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 mt-1">
        <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground">
              {notification.recipientCount}
            </span>
            <span>recipients</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground">
              {notification.sentCount}
            </span>
            <span>sent</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="font-medium text-foreground">
              {notification.failedCount}
            </span>
            <span>failed</span>
          </span>
        </div>

        <span className="text-xs md:text-sm text-muted-foreground">
          {formatDateTime(notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

export const NotificationsHistoryScreen: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { showToast } = useToast();

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetProviderNotificationsHistoryQuery({ page, limit });

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;

  const totalPages = pagination?.totalPages ?? 1;

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full gap-3">
        <p className="text-sm font-medium text-foreground">
          Failed to load notifications
        </p>
        <button
          onClick={() => {
            refetch();
            showToast('Retrying to fetch notifications...', 'info');
          }}
          className="px-4 py-2 rounded-lg bg-[#009688] text-white text-sm font-medium hover:bg-[#007a6b] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg md:text-xl font-semibold text-foreground">
              Notification history
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Review all notifications sent from your clinic, including status and
              delivery metrics.
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 border border-dashed border-border rounded-xl bg-muted">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground max-w-sm text-center">
              When you send notifications to your customers, they will appear here
              with their status and delivery details.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
              />
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-xs md:text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-medium text-foreground">
                  {notifications.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-foreground">
                  {pagination?.total ?? notifications.length}
                </span>{' '}
                notifications
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={page === 1 || isFetching}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs md:text-sm text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs md:text-sm text-muted-foreground">
                  Page{' '}
                  <span className="font-medium text-foreground">{page}</span> of{' '}
                  <span className="font-medium text-foreground">
                    {totalPages}
                  </span>
                </span>
                <button
                  onClick={handleNext}
                  disabled={page === totalPages || isFetching}
                  className="px-3 py-1.5 rounded-lg border border-border text-xs md:text-sm text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

