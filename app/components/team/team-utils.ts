export type UserRole = 'Owner' | 'Admin' | 'Manager' | 'Staff';

export type UserStatus = 'Active' | 'Invited' | 'Pending';

export interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  invitedAt?: string; // ISO date string
  joinedAt?: string; // ISO date string
  lastActive?: string; // ISO date string
}

// Available roles for selection (Owner cannot be assigned, only displayed)
export const userRoles: UserRole[] = ['Admin', 'Manager', 'Staff'];

/**
 * Map API status (lowercase) to UI status (capitalized)
 */
export const mapApiStatusToUIStatus = (apiStatus: string): UserStatus => {
  const statusMap: Record<string, UserStatus> = {
    active: 'Active',
    invited: 'Invited',
    pending: 'Pending',
  };
  return statusMap[apiStatus.toLowerCase()] || 'Pending';
};

/**
 * Map API role to UI role (capitalize first letter)
 */
export const mapApiRoleToUIRole = (apiRole: string): UserRole => {
  // Capitalize first letter
  const capitalized = apiRole.charAt(0).toUpperCase() + apiRole.slice(1);
  
  // Check if it's a valid role (including Owner for display)
  const allRoles: UserRole[] = ['Owner', 'Admin', 'Manager', 'Staff'];
  if (allRoles.includes(capitalized as UserRole)) {
    return capitalized as UserRole;
  }
  // Default to Staff if role doesn't match
  return 'Staff';
};

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
