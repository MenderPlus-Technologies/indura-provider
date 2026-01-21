import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for auth API
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  message?: string;
  user: {
    id: string;
    email: string;
    role: string;
    [key: string]: unknown;
  };
  token: string;
  requiresPasswordChange?: boolean;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Get base URL from environment variable
 */
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_API_BASE_URL is not set. API calls may fail.');
    return '';
  }
  return baseUrl;
};

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
};

/**
 * RTK Query API slice with baseQuery configuration
 */
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers) => {
      // Set Content-Type header
      headers.set('Content-Type', 'application/json');
      
      // Add Authorization header if token exists
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Auth', 'ProviderApplication', 'User', 'Forum', 'Campaign', 'Stats'],
  endpoints: (builder) => ({
    /**
     * Sign in mutation
     * POST /auth/signin
     */
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
      // Transform error response to a consistent format
      transformErrorResponse: (response) => {
        const errorData = (response as { data?: ApiErrorResponse })?.data || response;
        const status = (response as { status?: number })?.status || 500;
        return {
          status,
          message:
            (errorData as ApiErrorResponse)?.message ||
            (status === 401
              ? 'Invalid credentials. Please check your email and password.'
              : status === 400
              ? 'Invalid request. Please check your input.'
              : status >= 500
              ? 'Server error. Please try again later.'
              : 'An unexpected error occurred. Please try again.'),
          errors: (errorData as ApiErrorResponse)?.errors,
        };
      },
    }),

    /**
     * Change password mutation
     * POST /auth/change-password
     */
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (passwords) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: passwords,
      }),
      // Transform error response to a consistent format
      transformErrorResponse: (response) => {
        const errorData = (response as { data?: ApiErrorResponse })?.data || response;
        const status = (response as { status?: number })?.status || 500;
        return {
          status,
          message:
            (errorData as ApiErrorResponse)?.message ||
            (status === 401
              ? 'Incorrect current password. Please try again.'
              : status === 400
              ? 'Invalid request. Please check your input.'
              : status >= 500
              ? 'Server error. Please try again later.'
              : 'An unexpected error occurred. Please try again.'),
          errors: (errorData as ApiErrorResponse)?.errors,
        };
      },
    }),

    // ========== ADMIN ENDPOINTS ==========

    /**
     * Get provider applications
     * GET /provider-applications
     */
    getProviderApplications: builder.query<ProviderApplication[], void>({
      query: () => '/provider-applications',
      providesTags: ['ProviderApplication'],
    }),

    /**
     * Get provider application by ID
     * GET /provider-applications/:id
     */
    getProviderApplication: builder.query<ProviderApplication, string>({
      query: (id) => `/provider-applications/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'ProviderApplication', id }],
    }),

    /**
     * Approve provider application
     * POST /provider-applications/:id/approve
     */
    approveProviderApplication: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/provider-applications/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['ProviderApplication', 'Stats'],
    }),

    /**
     * Reject provider application
     * POST /provider-applications/:id/reject
     */
    rejectProviderApplication: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/provider-applications/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['ProviderApplication', 'Stats'],
    }),

    /**
     * Get admin statistics
     * GET /admin/stats
     */
    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Stats'],
    }),

    /**
     * Get all users
     * GET /admin/users
     */
    getUsers: builder.query<{ users: User[]; total: number }, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),

    /**
     * Get user by ID
     * GET /admin/users/:id
     */
    getUser: builder.query<User, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    /**
     * Update user status
     * PATCH /admin/users/:id/status
     */
    updateUserStatus: builder.mutation<{ message: string }, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    /**
     * Update user role
     * PATCH /admin/users/:id/role
     */
    updateUserRole: builder.mutation<{ message: string }, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    /**
     * Soft delete user
     * DELETE /admin/users/:id
     */
    softDeleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    /**
     * Hard delete user
     * DELETE /admin/users/:id/hard
     */
    hardDeleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/admin/users/${id}/hard`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Stats'],
    }),

    /**
     * Forum moderation actions
     * POST /forum/:id/mod
     */
    moderateForumPost: builder.mutation<{ message: string }, { id: string; action: 'pin' | 'unpin' | 'lock' | 'unlock' | 'delete' }>({
      query: ({ id, action }) => ({
        url: `/forum/${id}/mod`,
        method: 'POST',
        body: { action },
      }),
      invalidatesTags: ['Forum'],
    }),

    /**
     * Get campaigns
     * GET /campaigns
     */
    getCampaigns: builder.query<Campaign[], { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: '/campaigns',
        params,
      }),
      transformResponse: (response: { campaigns?: Campaign[]; data?: Campaign[] } | Campaign[]) => {
        // Handle different response structures
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === 'object') {
          if (Array.isArray(response.campaigns)) {
            return response.campaigns;
          }
          if (Array.isArray(response.data)) {
            return response.data;
          }
        }
        return [];
      },
      providesTags: ['Campaign'],
    }),

    /**
     * Get campaign by ID
     * GET /campaigns/:id
     */
    getCampaign: builder.query<Campaign, string>({
      query: (id) => `/campaigns/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Campaign', id }],
    }),

    /**
     * Search providers
     * GET /providers/search
     */
    searchProviders: builder.query<Provider[], { query: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: '/providers/search',
        params,
      }),
    }),

    /**
     * Get provider by ID
     * GET /providers/:id
     */
    getProvider: builder.query<Provider, string>({
      query: (id) => `/providers/${id}`,
    }),

    /**
     * Internal webhook
     * POST /wallet/webhook
     */
    walletWebhook: builder.mutation<{ message: string }, unknown>({
      query: (body) => ({
        url: '/wallet/webhook',
        method: 'POST',
        body,
      }),
    }),
  }),
});

// ========== ADMIN TYPES ==========

export interface ProviderApplication {
  _id: string;
  id?: string; // Computed from _id for compatibility
  facilityName: string;
  providerName?: string; // Computed from facilityName for compatibility
  contactPerson: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  email?: string; // Computed from contactPerson.email for compatibility
  facilityType: string;
  yearEstablished: number;
  description: string;
  country: string;
  state: string;
  city: string;
  address: string;
  declarationAccepted: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  submittedAt?: string; // Computed from createdAt for compatibility
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  providerAdminUserId?: string;
  providerId?: string;
  [key: string]: unknown;
}

export interface AdminStats {
  totalUsers: number;
  activeProviders: number;
  pendingApplications: number;
  totalCampaigns: number;
  [key: string]: unknown;
}

export interface User {
  id: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'deleted';
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  [key: string]: unknown;
}

export interface Campaign {
  _id: string;
  id?: string; // For backward compatibility
  title: string;
  name?: string; // For backward compatibility
  description: string;
  status: string;
  deadline?: string;
  endDate?: string;
  startDate?: string;
  createdAt?: string;
  targetAmount?: number;
  raisedAmount?: number;
  currency?: string;
  organizerId?: {
    _id: string;
    name: string;
    isVerified: boolean;
  };
  beneficiaryId?: string;
  category?: string;
  contributorsCount?: number;
  isFeatured?: boolean;
  [key: string]: unknown;
}

export interface Provider {
  id: string;
  name: string;
  email: string;
  status: string;
  [key: string]: unknown;
}

// Export hooks for usage in components
export const {
  useSignInMutation,
  useChangePasswordMutation,
  // Admin hooks
  useGetProviderApplicationsQuery,
  useGetProviderApplicationQuery,
  useApproveProviderApplicationMutation,
  useRejectProviderApplicationMutation,
  useGetAdminStatsQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
  useModerateForumPostMutation,
  useGetCampaignsQuery,
  useGetCampaignQuery,
  useSearchProvidersQuery,
  useGetProviderQuery,
  useWalletWebhookMutation,
} = apiSlice;
