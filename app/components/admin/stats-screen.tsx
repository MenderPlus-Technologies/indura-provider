'use client';

import { useGetAdminStatsQuery, useGetProviderApplicationsQuery, useGetCampaignsQuery, type ProviderApplication, type Campaign } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, UserCheck, FileText, Megaphone } from 'lucide-react';

export const StatsScreen = () => {
  const { data: stats, isLoading: statsLoading, error } = useGetAdminStatsQuery();
  const { data: applicationsData, isLoading: appsLoading } = useGetProviderApplicationsQuery();
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaignsQuery({
    page: 1,
    limit: 1000, // Fetch a large number to get all campaigns for counting
  });

  // Safely extract applications array - handle different response structures
  const applications: ProviderApplication[] = (() => {
    if (Array.isArray(applicationsData)) {
      return applicationsData;
    }
    if (applicationsData && typeof applicationsData === 'object') {
      const data = applicationsData as { applications?: unknown; data?: unknown };
      if (Array.isArray(data.applications)) {
        return data.applications as ProviderApplication[];
      }
      if (Array.isArray(data.data)) {
        return data.data as ProviderApplication[];
      }
    }
    return [];
  })();

  // Calculate active providers from approved applications
  const activeProvidersCount = applications.filter((app) => app.status === 'approved').length;
  
  // Calculate pending applications count
  const pendingCount = applications.filter((app) => app.status === 'pending').length;

  // Safely extract campaigns array - handle different response structures
  const campaigns: Campaign[] = (() => {
    if (Array.isArray(campaignsData)) {
      return campaignsData;
    }
    if (campaignsData && typeof campaignsData === 'object') {
      const data = campaignsData as { campaigns?: unknown; data?: unknown };
      if (Array.isArray(data.campaigns)) {
        return data.campaigns as Campaign[];
      }
      if (Array.isArray(data.data)) {
        return data.data as Campaign[];
      }
    }
    return [];
  })();

  const totalCampaignsCount = campaigns.length;

  if (statsLoading || appsLoading || campaignsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-600 dark:text-red-400">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Active Providers',
      value: activeProvidersCount,
      icon: UserCheck,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Pending Applications',
      value: pendingCount,
      icon: FileText,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Total Campaigns',
      value: totalCampaignsCount,
      icon: Megaphone,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-[number:var(--heading-h4-font-weight)] text-gray-600 dark:text-white text-[length:var(--heading-h4-font-size)] tracking-[var(--heading-h4-letter-spacing)] leading-[var(--heading-h4-line-height)] inter [font-style:var(--heading-h4-font-style)]">
          System Statistics
        </h1>
      </header>

      <div className="flex flex-col items-start gap-6 p-6 w-full">
        <div className="grid grid-cols-4 gap-6 w-full">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
                <CardContent className="flex items-center gap-4 p-4 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800">
                  <div className="flex flex-col items-start justify-end gap-2 flex-1">
                    <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] inter [font-style:var(--body-small-semibold-font-style)]">
                      {stat.title}
                    </div>
                    <div className="font-heading-h6 font-[number:var(--heading-h6-font-weight)] text-gray-600 dark:text-white text-[length:var(--heading-h6-font-size)] tracking-[var(--heading-h6-letter-spacing)] leading-[var(--heading-h6-line-height)] inter [font-style:var(--heading-h6-font-style)]">
                      {stat.value}
                    </div>
                  </div>
                  <div className="flex w-10 h-10 items-center justify-center gap-2 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!stats || Object.keys(stats).length === 0) && (
          <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
            <CardContent className="p-12 text-center bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700">
              <p className="font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] inter [font-style:var(--body-medium-regular-font-style)]">
                No statistics available
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
