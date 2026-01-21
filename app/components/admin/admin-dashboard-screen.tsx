'use client';

import { useEffect, useMemo } from 'react';
import { useGetAdminStatsQuery, useGetProviderApplicationsQuery, useGetCampaignsQuery, type ProviderApplication, type Campaign } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, UserCheck, FileText, Megaphone, LogIn, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/contexts/auth-context';

interface Activity {
  id: string;
  type: 'login' | 'approval' | 'rejection';
  title: string;
  description: string;
  timestamp: string;
  icon: typeof LogIn | typeof CheckCircle | typeof XCircle;
  color: string;
}

const ADMIN_LOGIN_KEY = 'adminLoginHistory';

// Track admin login
const trackAdminLogin = (email: string) => {
  if (typeof window === 'undefined') return;
  
  const loginHistory = JSON.parse(localStorage.getItem(ADMIN_LOGIN_KEY) || '[]');
  const newLogin = {
    id: `login-${Date.now()}-${Math.random()}`,
    email,
    timestamp: new Date().toISOString(),
  };
  
  // Add new login and keep only last 50 logins
  const updatedHistory = [newLogin, ...loginHistory].slice(0, 50);
  localStorage.setItem(ADMIN_LOGIN_KEY, JSON.stringify(updatedHistory));
};

// Get recent admin logins
const getRecentAdminLogins = (): Activity[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const loginHistory = JSON.parse(localStorage.getItem(ADMIN_LOGIN_KEY) || '[]');
    return loginHistory.slice(0, 10).map((login: { id: string; email: string; timestamp: string }) => ({
      id: login.id,
      type: 'login' as const,
      title: 'Admin Login',
      description: `Admin ${login.email} logged in`,
      timestamp: login.timestamp,
      icon: LogIn,
      color: 'text-blue-600 dark:text-blue-400',
    }));
  } catch (error) {
    console.error('Failed to parse admin login history:', error);
    return [];
  }
};

export const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useGetAdminStatsQuery();
  const { data: applicationsData, isLoading: appsLoading } = useGetProviderApplicationsQuery();
  
  // Fetch campaigns with a large limit to get total count
  const { data: campaignsData, isLoading: campaignsLoading } = useGetCampaignsQuery({
    page: 1,
    limit: 1000, // Fetch a large number to get all campaigns for counting
  });

  // Track admin login on mount
  useEffect(() => {
    if (user?.role === 'admin' && user?.email) {
      // Only track if this is a fresh login (check if last login was more than 1 minute ago)
      const lastLogin = localStorage.getItem('lastAdminLoginTime');
      const now = Date.now();
      if (!lastLogin || now - parseInt(lastLogin) > 60000) {
        trackAdminLogin(user.email);
        localStorage.setItem('lastAdminLoginTime', now.toString());
      }
    }
  }, [user]);

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

  const pendingCount = applications.filter((app) => app.status === 'pending').length;
  const activeProvidersCount = applications.filter((app) => app.status === 'approved').length;

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

  // Build recent activities from applications and logins
  const recentActivities = useMemo(() => {
    const activities: Activity[] = [];

    // Get login activities
    const loginActivities = getRecentAdminLogins();
    activities.push(...loginActivities);

    // Get approval/rejection activities from applications
    applications.forEach((app) => {
      if (app.status === 'approved' && app.reviewedAt) {
        activities.push({
          id: `approval-${app._id}`,
          type: 'approval',
          title: 'Application Approved',
          description: `Provider application for ${app.facilityName || app.providerName || 'Unknown'} was approved`,
          timestamp: app.reviewedAt,
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
        });
      } else if (app.status === 'rejected' && app.reviewedAt) {
        activities.push({
          id: `rejection-${app._id}`,
          type: 'rejection',
          title: 'Application Rejected',
          description: `Provider application for ${app.facilityName || app.providerName || 'Unknown'} was rejected`,
          timestamp: app.reviewedAt,
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
        });
      }
    });

    // Sort by timestamp (most recent first) and take top 10
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [applications]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (statsLoading || appsLoading || campaignsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#009688]" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      href: '/admin-dashboard/users',
    },
    {
      title: 'Active Providers',
      value: activeProvidersCount,
      icon: UserCheck,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      href: '/admin-dashboard/users',
    },
    {
      title: 'Pending Applications',
      value: pendingCount,
      icon: FileText,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      href: '/admin-dashboard/applications',
      urgent: pendingCount > 0,
    },
    {
      title: 'Total Campaigns',
      value: totalCampaignsCount,
      icon: Megaphone,
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      href: '/admin-dashboard/campaigns',
    },
  ];

  return (
    <div className="flex flex-col w-full items-start bg-white dark:bg-gray-950 relative">
      <header className="h-[72px] flex items-center justify-between px-6 py-4 bg-greyscale-0 dark:bg-gray-900 border-b border-solid border-[#dfe1e6] dark:border-gray-800 w-full">
        <h1 className="font-heading-h4 font-(--heading-h4-font-weight) text-greyscale-900 dark:text-white text-(length:--heading-h4-font-size) tracking-(--heading-h4-letter-spacing) leading-(--heading-h4-line-height) [font-style:var(--heading-h4-font-style)]">
          Admin Dashboard
        </h1>
      </header>

      <div className="flex flex-col items-start gap-6 p-6 w-full">
        <div className="grid grid-cols-4 gap-6 w-full">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href} className="block">
                <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
                  <CardContent className="flex items-center gap-4 p-4 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800">
                    <div className="flex flex-col items-start justify-end gap-2 flex-1">
                      <div className="font-body-small-semibold font-(--body-small-semibold-font-weight) text-greyscale-500 dark:text-gray-400 text-(length:--body-small-semibold-font-size) tracking-(--body-small-semibold-letter-spacing) leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                        {stat.title}
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <div className="font-heading-h6 font-[number:var(--heading-h6-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--heading-h6-font-size)] tracking-[var(--heading-h6-letter-spacing)] leading-[var(--heading-h6-line-height)] [font-style:var(--heading-h6-font-style)]">
                          {stat.value}
                        </div>
                        {stat.urgent && (
                          <Badge className="inline-flex items-center gap-1 px-1 py-0.5 rounded-[100px] border border-solid bg-red-200 border-[#f9d2d9] text-red-700">
                            <span className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                              Urgent
                            </span>
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex w-10 h-10 items-center justify-center gap-2 p-2 bg-greyscale-0 dark:bg-gray-800 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall">
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
            <CardContent className="flex flex-col gap-4 p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700">
              <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                QUICK ACTIONS
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/admin-dashboard/applications">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      Review Provider Applications
                    </span>
                    {pendingCount > 0 && (
                      <Badge className="ml-auto bg-red-200 border-[#f9d2d9] text-red-700">
                        {pendingCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link href="/admin-dashboard/users">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      Manage Users
                    </span>
                  </Button>
                </Link>
                <Link href="/admin-dashboard/forum">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      Moderate Forum
                    </span>
                  </Button>
                </Link>
                <Link href="/admin-dashboard/stats">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto inline-flex h-10 items-center justify-center gap-2 px-3 py-2 bg-greyscale-0 dark:bg-gray-800 rounded-[10px] border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-shadow-xsmall cursor-pointer"
                  >
                    <Megaphone className="h-4 w-4" />
                    <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-medium-semibold-font-size)] text-center tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                      View Statistics
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
            <CardContent className="flex flex-col gap-4 p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700">
              <div className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                RECENT ACTIVITY
              </div>
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                    No recent activity
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    // Get background color class based on activity type
                    const bgColorClass = activity.type === 'login' 
                      ? 'bg-blue-100 dark:bg-blue-900/20' 
                      : activity.type === 'approval'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : 'bg-red-100 dark:bg-red-900/20';
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800/50 hover:bg-greyscale-25 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgColorClass}`}>
                          <Icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-body-small-semibold font-[number:var(--body-small-semibold-font-weight)] text-greyscale-900 dark:text-white text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                                {activity.title}
                              </p>
                              <p className="font-body-small-regular font-[number:var(--body-small-regular-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] [font-style:var(--body-small-regular-font-style)] mt-0.5">
                                {activity.description}
                              </p>
                            </div>
                            <span className="font-body-small-regular font-[number:var(--body-small-regular-font-weight)] text-greyscale-400 dark:text-gray-500 text-[length:var(--body-small-regular-font-size)] tracking-[var(--body-small-regular-letter-spacing)] leading-[var(--body-small-regular-line-height)] [font-style:var(--body-small-regular-font-style)] whitespace-nowrap ml-2">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
