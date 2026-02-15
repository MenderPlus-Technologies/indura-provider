'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGetAdminStatsQuery, useGetProviderApplicationsQuery, useGetCampaignsQuery, type ProviderApplication, type Campaign } from '@/app/store/apiSlice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, UserCheck, FileText, Megaphone, LogIn, CheckCircle, XCircle, ChevronLeft, ChevronRight, MessageSquare, BarChart3 } from 'lucide-react';
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
    return loginHistory.map((login: { id: string; email: string; timestamp: string }) => ({
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

const ITEMS_PER_PAGE = 5;

export const AdminDashboardScreen = () => {
  const { user } = useAuth();
  const [activitiesPage, setActivitiesPage] = useState(1);
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
  const allActivities = useMemo(() => {
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

    // Sort by timestamp (most recent first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [applications]);

  // Calculate pagination
  const totalActivities = allActivities.length;
  const totalPages = Math.ceil(totalActivities / ITEMS_PER_PAGE);
  const startIndex = (activitiesPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedActivities = allActivities.slice(startIndex, endIndex);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (totalPages > 0 && activitiesPage > totalPages) {
      setActivitiesPage(1);
    }
  }, [totalPages, activitiesPage]);

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
        <h1 className="font-heading-h4 font-(--heading-h4-font-weight) text-gray-600 dark:text-white text-(length:--heading-h4-font-size) tracking-(--heading-h4-letter-spacing) leading-(--heading-h4-line-height) [font-style:var(--heading-h4-font-style)]">
          Admin Dashboard
        </h1>
      </header>

      <div className="flex flex-col items-start gap-6 p-6 w-full">
        <div className="grid grid-cols-4 gap-6 w-full">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link key={index} href={stat.href} className="block">
                <Card className="flex text-gray-600 flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
                  <CardContent className="flex items-center gap-4 p-4 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800">
                    <div className="flex flex-col items-start justify-end gap-2 flex-1">
                      <div className="font-body-small-semibold text-sm text-gray-600 inter  dark:text-gray-400 tracking-(--body-small-semibold-letter-spacing) leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                        {stat.title}
                      </div>
                      <div className="flex items-center gap-2 w-full">
                        <div className="font-heading-h6 font-[number:var(--heading-h6-font-weight)] text-gray-600 dark:text-white text-[length:var(--heading-h6-font-size)] tracking-[var(--heading-h6-letter-spacing)] leading-[var(--heading-h6-line-height)] [font-style:var(--heading-h6-font-style)]">
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
            <CardContent className="flex flex-col gap-5 p-5 bg-greyscale-0 dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="font-body-small-semibold inter text-gray-600 dark:text-white font-[number:var(--body-small-semibold-font-weight)] text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/admin-dashboard/applications" className="group">
                  <div className="flex items-center justify-between p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 hover:border-[#009688] dark:hover:border-[#009688] hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                          Applications
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Review & approve
                        </span>
                      </div>
                    </div>
                    {pendingCount > 0 && (
                      <Badge className="bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 h-6 px-2">
                        {pendingCount}
                      </Badge>
                    )}
                  </div>
                </Link>
                <Link href="/admin-dashboard/users" className="group">
                  <div className="flex items-center justify-between p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 hover:border-[#009688] dark:hover:border-[#009688] hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                          Users
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Manage accounts
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/admin-dashboard/forum" className="group">
                  <div className="flex items-center justify-between p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 hover:border-[#009688] dark:hover:border-[#009688] hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                          Forum
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Moderate posts
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link href="/admin-dashboard/stats" className="group">
                  <div className="flex items-center justify-between p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 hover:border-[#009688] dark:hover:border-[#009688] hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                        <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-body-medium-semibold font-[number:var(--body-medium-semibold-font-weight)] text-gray-600 dark:text-white text-[length:var(--body-medium-semibold-font-size)] tracking-[var(--body-medium-semibold-letter-spacing)] leading-[var(--body-medium-semibold-line-height)] [font-style:var(--body-medium-semibold-font-style)]">
                          Statistics
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          View analytics
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col gap-1 p-1 bg-greyscale-25 dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_2px_4px_-1px_#0d0d120f] w-full">
            <CardContent className="flex flex-col gap-4 p-4 bg-greyscale-0 dark:bg-gray-800 rounded-xl overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700">
              <div className="font-body-small-semibold  text-gray-600 inter font-[number:var(--body-small-semibold-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-small-semibold-font-size)] tracking-[var(--body-small-semibold-letter-spacing)] leading-[var(--body-small-semibold-line-height)] [font-style:var(--body-small-semibold-font-style)]">
                RECENT ACTIVITY
              </div>
              {paginatedActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-body-medium-regular font-[number:var(--body-medium-regular-font-weight)] text-greyscale-500 dark:text-gray-400 text-[length:var(--body-medium-regular-font-size)] tracking-[var(--body-medium-regular-letter-spacing)] leading-[var(--body-medium-regular-line-height)] [font-style:var(--body-medium-regular-font-style)]">
                    No recent activity
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3">
                    {paginatedActivities.map((activity) => {
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
                          className="flex inter items-start gap-3 p-3 rounded-lg border border-solid border-[#dfe1e6] dark:border-gray-700 bg-greyscale-0 dark:bg-gray-800/50 hover:bg-greyscale-25 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgColorClass}`}>
                            <Icon className={`h-4 w-4 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0 text-gray-600">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-sm  ">
                                  {activity.title}
                                </p>
                                <p className="text-sm  ">
                                  {activity.description}
                                </p>
                              </div>
                              <span className="text-sm text-gray-600">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 p-4 w-full bg-greyscale-0 dark:bg-gray-800 rounded-xl border border-solid border-[#dfe1e6] dark:border-gray-700 mt-4">
                      <div className="inline-flex justify-center gap-2 items-center">
                        <div className="font-medium text-gray-600 dark:text-white text-xs sm:text-sm">
                          Page {activitiesPage} of {totalPages} ({totalActivities} total)
                        </div>
                      </div>
                      <div className="inline-flex items-start gap-[5px] overflow-x-auto">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setActivitiesPage((p) => Math.max(1, p - 1))}
                          disabled={activitiesPage === 1}
                          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={activitiesPage === pageNum ? "default" : "outline"}
                              onClick={() => setActivitiesPage(pageNum)}
                              className={activitiesPage === pageNum 
                                ? "h-8 w-8 p-2.5 bg-[#009688] hover:bg-[#008577] rounded-lg overflow-hidden shadow-drop-shadow cursor-pointer"
                                : "h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer"
                              }
                            >
                              <span className={activitiesPage === pageNum 
                                ? "text-white text-sm font-medium"
                                : "text-gray-600 dark:text-white text-sm font-medium"
                              }>
                                {pageNum}
                              </span>
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setActivitiesPage((p) => Math.min(totalPages, p + 1))}
                          disabled={activitiesPage === totalPages}
                          className="h-8 w-8 p-2.5 bg-greyscale-0 dark:bg-gray-800 rounded-lg overflow-hidden border border-solid border-[#dfe1e6] dark:border-gray-700 shadow-[0px_1px_2px_#0d0d120f] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
