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
    rejectProviderApplication: builder.mutation<{ message: string }, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/provider-applications/${id}/reject`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['ProviderApplication', 'Stats'],
    }),

    /**
     * Delete provider application
     * DELETE /provider-applications/:id
     */
    deleteProviderApplication: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/provider-applications/${id}`,
        method: 'DELETE',
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
     * Get all forum posts
     * GET /forum
     */
    getForumPosts: builder.query<ForumPost[], void>({
      query: () => '/forum',
      transformResponse: (response: { posts?: ForumPost[]; data?: ForumPost[] } | ForumPost[]) => {
        // Handle different response structures
        if (Array.isArray(response)) {
          return response;
        }
        if (response && typeof response === 'object') {
          if (Array.isArray(response.posts)) {
            return response.posts;
          }
          if (Array.isArray(response.data)) {
            return response.data;
          }
        }
        return [];
      },
      providesTags: ['Forum'],
    }),

    /**
     * Get forum post by ID
     * GET /forum/:id
     */
    getForumPost: builder.query<ForumPostDetail, string>({
      query: (id) => `/forum/${id}`,
      transformResponse: (response: { post?: ForumPost; comments?: ForumComment[] } | ForumPostDetail) => {
        // Handle different response structures
        if (response && typeof response === 'object') {
          if ('post' in response && 'comments' in response) {
            return response as ForumPostDetail;
          }
          // If response is just the post object, wrap it
          if ('title' in response || '_id' in response || 'id' in response) {
            return {
              post: response as ForumPost,
              comments: [],
            };
          }
        }
        return { post: {} as ForumPost, comments: [] };
      },
      providesTags: (_result, _error, id) => [{ type: 'Forum', id }],
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

    // ========== PROVIDER ENDPOINTS ==========

    /**
     * Get provider dashboard stats
     * GET /providers/dashboard/stats
     */
    getProviderDashboardStats: builder.query<ProviderDashboardStats, void>({
      query: () => '/providers/dashboard/stats',
      transformResponse: (response: ProviderDashboardStatsApiResponse | ProviderDashboardStats) => {
        // Support both wrapped and unwrapped backend responses
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderDashboardStatsApiResponse).data;
        }
        return response as ProviderDashboardStats;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider income chart data
     * GET /providers/dashboard/income-chart?period={daily|weekly|monthly}
     */
    getProviderIncomeChart: builder.query<ProviderIncomeChartData, { period?: IncomeChartPeriod }>({
      query: ({ period = 'monthly' } = {}) => ({
        url: '/providers/dashboard/income-chart',
        params: { period },
      }),
      transformResponse: (response: ProviderIncomeChartApiResponse | ProviderIncomeChartData) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderIncomeChartApiResponse).data;
        }
        return response as ProviderIncomeChartData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider recent activities
     * GET /providers/dashboard/recent-activities
     */
    getProviderRecentActivities: builder.query<
      ProviderRecentActivitiesData,
      { limit?: number; offset?: number; period?: IncomeChartPeriod }
    >({
      query: ({ limit = 10, offset = 0, period = 'monthly' } = {}) => ({
        url: '/providers/dashboard/recent-activities',
        params: { limit, offset, period },
      }),
      transformResponse: (
        response: ProviderRecentActivitiesApiResponse | ProviderRecentActivitiesData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderRecentActivitiesApiResponse).data;
        }
        return response as ProviderRecentActivitiesData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider transactions (paginated)
     * GET /providers/transactions?page=1&limit=10&sortBy=date&sortOrder=desc
     */
    getProviderTransactions: builder.query<
      ProviderTransactionsData,
      { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
    >({
      query: ({ page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = {}) => ({
        url: '/providers/transactions',
        params: { page, limit, sortBy, sortOrder },
      }),
      transformResponse: (
        response: ProviderTransactionsApiResponse | ProviderTransactionsData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderTransactionsApiResponse).data;
        }
        return response as ProviderTransactionsData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get single provider transaction by id
     * GET /providers/transactions/:id
     */
    getProviderTransaction: builder.query<ProviderTransactionDetail, string>({
      query: (id) => `/providers/transactions/${id}`,
      transformResponse: (
        response: ProviderTransactionDetailApiResponse | ProviderTransactionDetail
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderTransactionDetailApiResponse).data;
        }
        return response as ProviderTransactionDetail;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider customers
     * GET /providers/dashboard/customers
     */
    getProviderCustomers: builder.query<ProviderCustomersData, void>({
      query: () => '/providers/dashboard/customers',
      transformResponse: (
        response: ProviderCustomersApiResponse | ProviderCustomersData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderCustomersApiResponse).data;
        }
        return response as ProviderCustomersData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider subscribers
     * GET /subscriptions/provider/subscribers
     */
    getProviderSubscribers: builder.query<ProviderSubscribersResponse, void>({
      query: () => '/subscriptions/provider/subscribers',
      providesTags: ['Stats'],
    }),

    /**
     * Get provider team members
     * GET /providers/team/members?page=1&limit=10
     */
    getProviderTeamMembers: builder.query<
      ProviderTeamMembersData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/providers/team/members',
        params: { page, limit },
      }),
      transformResponse: (
        response: ProviderTeamMembersApiResponse | ProviderTeamMembersData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderTeamMembersApiResponse).data;
        }
        return response as ProviderTeamMembersData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Invite team member
     * POST /providers/team/members/invite
     */
    inviteProviderTeamMember: builder.mutation<
      {
        success: boolean;
        message?: string;
        data?: ProviderTeamMember;
        timestamp?: string;
      },
      { name: string; email: string; role: string }
    >({
      query: (body) => ({
        url: '/providers/team/members/invite',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Resend invitation to team member
     * POST /providers/team/members/:id/resend-invitation
     */
    resendTeamMemberInvitation: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      string
    >({
      query: (teamMemberId) => ({
        url: `/providers/team/members/${teamMemberId}/resend-invitation`,
        method: 'POST',
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update team member role
     * PUT /providers/team/members/:id/role
     */
    updateTeamMemberRole: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      { teamMemberId: string; role: string }
    >({
      query: ({ teamMemberId, role }) => ({
        url: `/providers/team/members/${teamMemberId}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Delete team member
     * DELETE /providers/team/members/:id
     */
    deleteTeamMember: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      string
    >({
      query: (teamMemberId) => ({
        url: `/providers/team/members/${teamMemberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Create provider payment request
     * POST /providers/transactions/payment-request
     */
    createProviderPaymentRequest: builder.mutation<
      {
        success: boolean;
        message: string;
        data?: {
          _id: string;
          customerId: string;
          amount: number;
          currency: string;
          paymentMethod: string;
          status: string;
          reference: string;
          description?: string | null;
          dueDate?: string | null;
          createdAt: string;
        };
        timestamp?: string;
      },
      { customerId: string; amount: number; currency: string; paymentMethod: string; description?: string }
    >({
      query: (body) => ({
        url: '/providers/transactions/payment-request',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),
  }),
});

// ========== ADMIN TYPES ==========

export interface ProviderApplication {
  _id: string;
  id?: string; // Computed from _id for compatibility
  facilityName: string;
  providerName?: string; // Computed from facilityName for compatibility
  // Newer backend field for facility / provider type
  providerType?: string;
  contactPerson: {
    fullName: string;
    email: string;
    phone: string;
    role: string;
  };
  // Newer backend contact fields (flattened)
  contactFullName?: string;
  contactRole?: string;
  contactPhoneNumber?: string;
  email?: string; // Computed from contactPerson.email for compatibility
  facilityType: string;
  yearEstablished: number;
  description: string;
  // Newer backend description field
  serviceDescription?: string;
  country: string;
  state: string;
  // Older backend used `city`, newer uses `lga`
  city: string;
  lga?: string;
  address: string;
  declarationAccepted: boolean;
  // Newer backend agreement flags
  agreeToTerms?: boolean;
  consentToVerification?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  submittedAt?: string; // Computed from createdAt for compatibility
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?:
    | string
    | {
        _id?: string;
        email?: string;
        name?: string;
      };
  // Newer backend returns nested user / provider objects
  providerAdminUserId?:
    | string
    | {
        _id: string;
        email: string;
        name: string;
      };
  providerId?:
    | string
    | {
        _id: string;
        name: string;
        status: string;
      };
  // Newer backend documents object
  documents?: {
    operatingLicense?: string;
    cacCertificate?: string;
    [key: string]: unknown;
  };
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
  _id?: string;
  id?: string;
  title: string;
  content: string;
  author: string | {
    _id: string;
    name: string;
    role: string;
    email?: string;
  };
  category?: string;
  likes?: string[];
  isPinned: boolean;
  isLocked: boolean;
  viewCount?: number;
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ForumComment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    role: string;
    email?: string;
  };
  post: string;
  parentComment?: string | null;
  likes?: string[];
  createdAt: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ForumPostDetail {
  post: ForumPost;
  comments: ForumComment[];
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

export interface TransactionSummary {
  _id: string;
  count: number;
  totalAmount: number;
}

export interface ProviderDashboardStats {
  income: number;
  activeSubscribers: number;
  transactionsSummary: TransactionSummary[];
  periodComparison?: {
    incomeChange?: number;
    incomeChangeAmount?: number;
    payoutsChange?: number;
    payoutsChangeCount?: number;
    subscribersChange?: number;
    subscribersChangeCount?: number;
  };
  walletBalance?: number;
  pendingPayouts?: number;
  failedRefundedCount?: number;
  failedRefundedAmount?: number;
}

export interface ProviderDashboardStatsApiResponse {
  success: boolean;
  message?: string;
  data: ProviderDashboardStats;
  timestamp?: string;
}

// Income chart types
export type IncomeChartPeriod = 'daily' | 'weekly' | 'monthly';

export interface ProviderIncomeChartPoint {
  date: string; // e.g. "2026-02-17"
  thisPeriod: number;
  lastPeriod: number;
}

export interface ProviderIncomeChartSummary {
  thisPeriodTotal: number;
  lastPeriodTotal: number;
  percentageChange: number;
}

export interface ProviderIncomeChartData {
  period: string;
  startDate: string;
  endDate: string;
  dataPoints: ProviderIncomeChartPoint[];
  summary: ProviderIncomeChartSummary;
}

export interface ProviderIncomeChartApiResponse {
  success: boolean;
  message?: string;
  data: ProviderIncomeChartData;
  timestamp?: string;
}

// Recent activities types
export interface ProviderRecentActivity {
  id: string;
  payer: string;
  email: string;
  datetime: string;
  method: string;
  status: string;
  amount: string;
  reference: string;
}

export interface ProviderRecentActivitiesData {
  activities: ProviderRecentActivity[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProviderRecentActivitiesApiResponse {
  success: boolean;
  message?: string;
  data: ProviderRecentActivitiesData;
  timestamp?: string;
}

export interface ProviderTransaction {
  _id: string;
  walletId: string;
  userId: string | ProviderTransactionUser;
  type: 'debit' | 'credit';
  category: string;
  amount: number;
  reference: string;
  status: string;
  metadata?: {
    providerId?: string;
    providerName?: string;
    payerUserId?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProviderTransactionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderTransactionsSummary {
  totalAmount: number;
  totalCount: number;
  filteredCount: number;
}

export interface ProviderTransactionsData {
  transactions: ProviderTransaction[];
  pagination?: ProviderTransactionsPagination;
  summary?: ProviderTransactionsSummary;
}

export interface ProviderTransactionsApiResponse {
  success: boolean;
  message?: string;
  data: ProviderTransactionsData;
  timestamp?: string;
}

export interface ProviderTransactionUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProviderRelatedTransaction {
  _id: string;
  type: 'debit' | 'credit';
  amount: number;
  reference: string;
  createdAt: string;
}

export interface ProviderTransactionDetail extends ProviderTransaction {
  uiStatus?: string;
  uiStatusKey?: string;
  relatedTransactions?: ProviderRelatedTransaction[];
}

export interface ProviderTransactionDetailApiResponse {
  success: boolean;
  message?: string;
  data: ProviderTransactionDetail;
  timestamp?: string;
}

export interface ProviderCustomer {
  _id: string;
  totalSpent: number;
  lastTransactionDate: string;
  transactionCount: number;
  name: string;
  email: string;
  phone: string;
}

export interface ProviderCustomersData {
  customers: ProviderCustomer[];
  total?: number;
  limit?: number;
  offset?: number;
}

export interface ProviderCustomersApiResponse {
  success: boolean;
  message?: string;
  data: ProviderCustomersData;
  timestamp?: string;
}

export interface ProviderTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  roleKey: string;
  status: string;
  invitedAt?: string;
  joinedAt?: string;
  lastActive?: string;
  permissions: string[];
  source: string;
}

export interface ProviderTeamMembersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderTeamMembersSummary {
  totalMembers: number;
  activeCount: number;
  pendingCount: number;
}

export interface ProviderTeamMembersData {
  members: ProviderTeamMember[];
  pagination: ProviderTeamMembersPagination;
  summary: ProviderTeamMembersSummary;
}

export interface ProviderTeamMembersApiResponse {
  success: boolean;
  message?: string;
  data: ProviderTeamMembersData;
  timestamp?: string;
}

export interface ProviderSubscriberUser {
  _id: string;
  email: string;
  name: string;
  phone: string;
}

export interface ProviderSubscriber {
  _id: string;
  userId: ProviderSubscriberUser | string;
  providerId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: string;
  startDate: string;
  expiryDate: string;
  status: string;
  autoRenew: boolean;
  renewalReminderSent: boolean;
  transactionReference?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProviderSubscribersResponse {
  subscribers: ProviderSubscriber[];
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
  useDeleteProviderApplicationMutation,
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
  useGetForumPostsQuery,
  useGetForumPostQuery,
  useWalletWebhookMutation,
  useGetProviderDashboardStatsQuery,
  useGetProviderTransactionsQuery,
  useGetProviderCustomersQuery,
  useGetProviderSubscribersQuery,
  useGetProviderIncomeChartQuery,
  useGetProviderRecentActivitiesQuery,
  useCreateProviderPaymentRequestMutation,
  useGetProviderTransactionQuery,
  useGetProviderTeamMembersQuery,
  useInviteProviderTeamMemberMutation,
  useResendTeamMemberInvitationMutation,
  useUpdateTeamMemberRoleMutation,
  useDeleteTeamMemberMutation,
} = apiSlice;
