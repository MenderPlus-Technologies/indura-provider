export type SubscriptionStatus = 'New' | 'Active' | 'Expiring Soon' | 'Expired';

export interface Subscription {
  id: string;
  memberName: string;
  memberEmail: string;
  plan: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: SubscriptionStatus; // Derived from dates
}

// Mock subscription plans
export const subscriptionPlans = [
  'Basic Plan',
  'Pro Plan',
  'Advanced Plan',
  'Premium Plan',
  'Monthly Membership',
  'Annual Membership',
];

// Helper function to derive status from dates
export const deriveSubscriptionStatus = (
  startDate: string,
  endDate: string,
  createdDate?: string
): SubscriptionStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const created = createdDate ? new Date(createdDate) : start;

  // Expired: end date is in the past
  if (end < now) {
    return 'Expired';
  }

  // Expiring Soon: end date is within next 7 days
  const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
    return 'Expiring Soon';
  }

  // New: created within last 7 days and not yet started or just started
  const daysSinceCreation = Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceCreation <= 7 && start <= now) {
    return 'New';
  }

  // Active: current date is within start and end date
  if (start <= now && now <= end) {
    return 'Active';
  }

  // Default to Active if start date is in the future
  return 'Active';
};

// Mock subscription data
export const subscriptionsData: Subscription[] = [
  {
    id: '1',
    memberName: 'Darlene Robertson',
    memberEmail: 'darlenerobertson@gmail.com',
    plan: 'Pro Plan',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    status: 'Active',
  },
  {
    id: '2',
    memberName: 'Jane Cooper',
    memberEmail: 'janecooper@gmail.com',
    plan: 'Basic Plan',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days from now
    status: 'New',
  },
  {
    id: '3',
    memberName: 'Jenny Wilson',
    memberEmail: 'jennywilson@gmail.com',
    plan: 'Advanced Plan',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    status: 'Expiring Soon',
  },
  {
    id: '4',
    memberName: 'Robert Fox',
    memberEmail: 'robertfox@gmail.com',
    plan: 'Premium Plan',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days ago
    endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'Expired',
  },
  {
    id: '5',
    memberName: 'Wade Warren',
    memberEmail: 'wadewarren@gmail.com',
    plan: 'Monthly Membership',
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    status: 'Active',
  },
  {
    id: '6',
    memberName: 'Albert Flores',
    memberEmail: 'albertflores@gmail.com',
    plan: 'Pro Plan',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days from now
    status: 'New',
  },
  {
    id: '7',
    memberName: 'Eleanor Pena',
    memberEmail: 'eleanorpena@gmail.com',
    plan: 'Annual Membership',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    status: 'Expiring Soon',
  },
  {
    id: '8',
    memberName: 'Ronald Richards',
    memberEmail: 'ronaldrichards@gmail.com',
    plan: 'Basic Plan',
    startDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days ago
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    status: 'Expired',
  },
  {
    id: '9',
    memberName: 'Darrell Steward',
    memberEmail: 'darrellsteward@gmail.com',
    plan: 'Advanced Plan',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    status: 'Active',
  },
  {
    id: '10',
    memberName: 'Cameron Williamson',
    memberEmail: 'cameronwilli@gmail.com',
    plan: 'Premium Plan',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    endDate: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000).toISOString(), // 29 days from now
    status: 'New',
  },
];

// Update statuses based on current date
export const getSubscriptionsWithDerivedStatus = (): Subscription[] => {
  return subscriptionsData.map(sub => ({
    ...sub,
    status: deriveSubscriptionStatus(sub.startDate, sub.endDate),
  }));
};

// Status badge styles
export const getSubscriptionStatusBadgeStyles = (status: SubscriptionStatus) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400';
    case 'Active':
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    case 'Expiring Soon':
      return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
    case 'Expired':
      return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400';
    default:
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const getSubscriptionStatusDotColor = (status: SubscriptionStatus) => {
  switch (status) {
    case 'New':
      return 'bg-blue-500';
    case 'Active':
      return 'bg-green-500';
    case 'Expiring Soon':
      return 'bg-yellow-500';
    case 'Expired':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
