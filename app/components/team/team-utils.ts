export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Staff' | 'Viewer';

export type UserStatus = 'Active' | 'Invited' | 'Pending';

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt?: string; // ISO date string
  joinedAt?: string; // ISO date string
}

// Available roles
export const userRoles: UserRole[] = ['Owner', 'Admin', 'Manager', 'Staff', 'Viewer'];

// Mock team users data
export const mockTeamUsers: TeamUser[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Owner',
    status: 'Active',
    joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year ago
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Admin',
    status: 'Active',
    joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'Manager',
    status: 'Active',
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 3 months ago
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'Staff',
    status: 'Invited',
    invitedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    role: 'Viewer',
    status: 'Pending',
    invitedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];

// Role badge styles
export const getRoleBadgeStyles = (role: UserRole) => {
  switch (role) {
    case 'Owner':
      return 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400';
    case 'Admin':
      return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400';
    case 'Manager':
      return 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-400';
    case 'Staff':
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    case 'Viewer':
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
    default:
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
  }
};

// Status badge styles
export const getStatusBadgeStyles = (status: UserStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400';
    case 'Invited':
      return 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400';
    case 'Pending':
      return 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400';
    default:
      return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300';
  }
};

export const getStatusDotColor = (status: UserStatus) => {
  switch (status) {
    case 'Active':
      return 'bg-green-500';
    case 'Invited':
      return 'bg-yellow-500';
    case 'Pending':
      return 'bg-orange-500';
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
