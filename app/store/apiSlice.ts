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
     * Get provider payment requests
     * GET /providers/transactions/payment-requests?page=1&limit=20
     */
    getProviderPaymentRequests: builder.query<
      ProviderPaymentRequestsData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/providers/transactions/payment-requests',
        params: { page, limit },
      }),
      transformResponse: (
        response:
          | ProviderPaymentRequestsApiResponse
          | ProviderPaymentRequestsData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderPaymentRequestsApiResponse).data;
        }
        return response as ProviderPaymentRequestsData;
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
     * Get provider payment request by id
     * GET /providers/transactions/payment-requests/:id
     */
    getProviderPaymentRequest: builder.query<ProviderPaymentRequest, string>({
      query: (id) => `/providers/transactions/payment-requests/${id}`,
      transformResponse: (
        response:
          | ProviderPaymentRequestByIdApiResponse
          | ProviderPaymentRequest
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderPaymentRequestByIdApiResponse).data;
        }
        return response as ProviderPaymentRequest;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Update provider payment request
     * PATCH /providers/transactions/payment-requests/:id
     */
    updateProviderPaymentRequest: builder.mutation<
      UpdateProviderPaymentRequestResponse,
      UpdateProviderPaymentRequestRequest
    >({
      query: ({ paymentRequestId, ...body }) => ({
        url: `/providers/transactions/payment-requests/${paymentRequestId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Cancel provider payment request
     * POST /providers/transactions/payment-requests/:id/cancel
     */
    cancelProviderPaymentRequest: builder.mutation<
      CancelProviderPaymentRequestResponse,
      string
    >({
      query: (paymentRequestId) => ({
        url: `/providers/transactions/payment-requests/${paymentRequestId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider customers
     * GET /providers/customers
     */
    getProviderCustomers: builder.query<
      ProviderCustomersData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/providers/customers',
        params: { page, limit },
      }),
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
     * Create provider customer
     * POST /providers/customers
     */
    createProviderCustomer: builder.mutation<
      CreateProviderCustomerResponse,
      CreateProviderCustomerRequest
    >({
      query: (body) => ({
        url: '/providers/customers',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider customer by ID
     * GET /providers/customers/:id
     */
    getProviderCustomer: builder.query<ProviderCustomer, string>({
      query: (customerId) => `/providers/customers/${customerId}`,
      transformResponse: (
        response: ProviderCustomer | ProviderCustomerByIdApiResponse
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderCustomerByIdApiResponse).data;
        }
        return response as ProviderCustomer;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Update provider customer
     * PATCH /providers/customers/:id
     */
    updateProviderCustomer: builder.mutation<
      {
        success: boolean;
        message?: string;
        data?: ProviderCustomer;
        timestamp?: string;
      },
      { customerId: string; name?: string; status?: string }
    >({
      query: ({ customerId, ...body }) => ({
        url: `/providers/customers/${customerId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider subscriptions/subscribers
     * GET /providers/subscriptions?page=1&limit=10
     */
    getProviderSubscribers: builder.query<
      ProviderSubscribersResponse,
      { page?: number; limit?: number } | void
    >({
      query: (args = { page: 1, limit: 10 }) => {
        const { page = 1, limit = 10 } = args || {};
        return {
          url: '/providers/subscriptions',
          params: { page, limit },
        };
      },
      transformResponse: (
        response:
          | ProviderSubscriptionsApiResponse
          | ProviderSubscribersResponse
      ) => {
        // Handle wrapped API response: { success, data: { items, subscribers, ... } }
        if (response && typeof response === 'object' && 'success' in response) {
          const data = (response as ProviderSubscriptionsApiResponse).data;
          return {
            subscribers:
              (data.subscribers && data.subscribers.length > 0
                ? data.subscribers
                : data.items) ?? [],
          } as ProviderSubscribersResponse;
        }

        // Fallback for already-normalised shape
        return response as ProviderSubscribersResponse;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Create provider subscription
     * POST /providers/subscriptions
     */
    createProviderSubscription: builder.mutation<
      CreateProviderSubscriptionResponse,
      CreateProviderSubscriptionRequest
    >({
      query: (body) => ({
        url: '/providers/subscriptions',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update provider subscription
     * PUT /providers/subscriptions/:id
     */
    updateProviderSubscription: builder.mutation<
      UpdateProviderSubscriptionResponse,
      UpdateProviderSubscriptionRequest
    >({
      query: ({ subscriptionId, ...body }) => ({
        url: `/providers/subscriptions/${subscriptionId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Delete provider subscription
     * DELETE /providers/subscriptions/:id
     */
    deleteProviderSubscription: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      string
    >({
      query: (subscriptionId) => ({
        url: `/providers/subscriptions/${subscriptionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider subscription by ID
     * GET /providers/subscriptions/:id
     */
    getProviderSubscription: builder.query<
      ProviderSubscriber,
      string
    >({
      query: (id) => `/providers/subscriptions/${id}`,
      transformResponse: (
        response:
          | ProviderSubscriptionByIdApiResponse
          | ProviderSubscriber
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderSubscriptionByIdApiResponse).data;
        }
        return response as ProviderSubscriber;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider notifications history
     * GET /providers/notifications/history?page=1&limit=10
     */
    getProviderNotificationsHistory: builder.query<
      ProviderNotificationsHistoryData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/providers/notifications/history',
        params: { page, limit },
      }),
      transformResponse: (
        response:
          | ProviderNotificationsHistoryApiResponse
          | ProviderNotificationsHistoryData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderNotificationsHistoryApiResponse).data;
        }
        return response as ProviderNotificationsHistoryData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get provider manual transactions
     * GET /providers/transactions/manual?page=1&limit=10
     */
    getProviderManualTransactions: builder.query<
      ProviderManualTransactionsData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/providers/transactions/manual',
        params: { page, limit },
      }),
      transformResponse: (
        response:
          | ProviderManualTransactionsApiResponse
          | ProviderManualTransactionsData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderManualTransactionsApiResponse).data;
        }
        return response as ProviderManualTransactionsData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Get manual transaction by id
     * GET /providers/transactions/manual/:id
     */
    getProviderManualTransaction: builder.query<
      ProviderManualTransaction,
      string
    >({
      query: (id) => `/providers/transactions/manual/${id}`,
      transformResponse: (
        response:
          | ProviderManualTransaction
          | ProviderManualTransactionByIdApiResponse
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderManualTransactionByIdApiResponse).data;
        }
        return response as ProviderManualTransaction;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Create provider manual transaction
     * POST /providers/transactions/manual
     */
    createProviderManualTransaction: builder.mutation<
      {
        success: boolean;
        message?: string;
        data?: ProviderManualTransaction;
        timestamp?: string;
      },
      { amount: number; currency: string; paymentMethod: string; transactionDate: string; description: string }
    >({
      query: (body) => ({
        url: '/providers/transactions/manual',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Reconcile provider manual transaction
     * POST /providers/transactions/manual/:id/reconcile
     */
    reconcileProviderManualTransaction: builder.mutation<
      {
        success: boolean;
        message?: string;
        data?: ProviderManualTransaction;
        timestamp?: string;
      },
      string
    >({
      query: (id) => ({
        url: `/providers/transactions/manual/${id}/reconcile`,
        method: 'POST',
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update provider manual transaction
     * PATCH /providers/transactions/manual/:id
     */
    updateProviderManualTransaction: builder.mutation<
      {
        success: boolean;
        message?: string;
        data?: ProviderManualTransaction;
        timestamp?: string;
      },
      {
        manualTransactionId: string;
        amount?: number;
        currency?: string;
        paymentMethod?: string;
        transactionDate?: string;
        description?: string;
      }
    >({
      query: ({ manualTransactionId, ...body }) => ({
        url: `/providers/transactions/manual/${manualTransactionId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider payment links
     * GET /providers/payment-links?page=1&limit=10
     */
    getProviderPaymentLinks: builder.query<
      ProviderPaymentLinksData,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: '/providers/payment-links',
        params: { page, limit },
      }),
      transformResponse: (
        response:
          | ProviderPaymentLinksApiResponse
          | ProviderPaymentLinksData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderPaymentLinksApiResponse).data;
        }
        return response as ProviderPaymentLinksData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Create provider payment link
     * POST /providers/payment-links
     */
    createProviderPaymentLink: builder.mutation<
      CreateProviderPaymentLinkResponse,
      CreateProviderPaymentLinkRequest
    >({
      query: (body) => ({
        url: '/providers/payment-links',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get provider payment link by id
     * GET /providers/payment-links/:id
     */
    getProviderPaymentLink: builder.query<ProviderPaymentLink, string>({
      query: (id) => `/providers/payment-links/${id}`,
      transformResponse: (
        response: ProviderPaymentLink | ProviderPaymentLinkByIdApiResponse
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderPaymentLinkByIdApiResponse).data;
        }
        return response as ProviderPaymentLink;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Send provider notification
     * POST /providers/notifications/send
     */
    sendProviderNotification: builder.mutation<
      SendProviderNotificationResponse,
      SendProviderNotificationRequest
    >({
      query: (body) => ({
        url: '/providers/notifications/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Stats'],
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
     * Update provider payment link
     * PATCH /providers/payment-links/:id
     */
    updateProviderPaymentLink: builder.mutation<
      UpdateProviderPaymentLinkResponse,
      UpdateProviderPaymentLinkRequest
    >({
      query: ({ paymentLinkId, ...body }) => ({
        url: `/providers/payment-links/${paymentLinkId}`,
        method: 'PATCH',
        body,
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
     * Get provider settings
     * GET /providers/settings
     */
    getProviderSettings: builder.query<ProviderSettingsData, void>({
      query: () => '/providers/settings',
      transformResponse: (
        response: ProviderSettingsApiResponse | ProviderSettingsData
      ) => {
        if (response && typeof response === 'object' && 'data' in response) {
          return (response as ProviderSettingsApiResponse).data;
        }
        return response as ProviderSettingsData;
      },
      providesTags: ['Stats'],
    }),

    /**
     * Update provider general settings
     * PUT /providers/settings/general
     */
    updateProviderGeneralSettings: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      {
        facilityName: string;
        facilityType: string;
        providerDescription: string;
        country: string;
        city: string;
        address: string;
        postalCode: string;
        services: string[];
      }
    >({
      query: (body) => ({
        url: '/providers/settings/general',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update provider account settings
     * PUT /providers/settings/account
     */
    updateProviderAccountSettings: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      {
        fullName: string;
        email: string;
        phone: string;
      }
    >({
      query: (body) => ({
        url: '/providers/settings/account',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update provider password
     * PUT /providers/settings/password
     */
    updateProviderPasswordSettings: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      {
        currentPassword: string;
        newPassword: string;
      }
    >({
      query: (body) => ({
        url: '/providers/settings/password',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Update provider time & language settings
     * PUT /providers/settings/time-language
     */
    updateProviderTimeLanguageSettings: builder.mutation<
      {
        success: boolean;
        message?: string;
        timestamp?: string;
      },
      {
        timezone: string;
        language: string;
        dateFormat: string;
        timeFormat: string;
      }
    >({
      query: (body) => ({
        url: '/providers/settings/time-language',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Stats'],
    }),

    /**
     * Get countries list
     * Uses REST Countries API
     */
    getCountries: builder.query<Country[], void>({
      queryFn: async () => {
        try {
          const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
          const data = await response.json();
          const countries: Country[] = data.map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
          })).sort((a: Country, b: Country) => a.name.localeCompare(b.name));
          return { data: countries };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: 'Failed to fetch countries' } };
        }
      },
    }),

    /**
     * Get cities by country
     * Uses Geonames API (free tier)
     */
    getCitiesByCountry: builder.query<City[], string>({
      queryFn: async (countryName) => {
        try {
          // Using a free city API service
          // Note: This is a placeholder - you may want to use your backend endpoint
          const response = await fetch(
            `https://api.geonames.org/searchJSON?country=${countryName}&maxRows=1000&username=demo&featureClass=P`
          );
          const data = await response.json();
          const cities: City[] = (data.geonames || []).map((city: any) => ({
            name: city.name,
            country: city.countryName,
          })).sort((a: City, b: City) => a.name.localeCompare(b.name));
          return { data: cities };
        } catch (error) {
          // Fallback: return empty array if API fails
          return { data: [] };
        }
      },
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
  items?: ProviderTransaction[];
  pagination?: ProviderTransactionsPagination;
  summary?: ProviderTransactionsSummary;
  manualReporting?: {
    summary: {
      recorded: { count: number; amount: number };
      reconciled: { count: number; amount: number };
      voided: { count: number; amount: number };
    };
    total: number;
  };
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
  providerId: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  hasAppAccount: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProviderCustomersPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderCustomersData {
  items: ProviderCustomer[];
  pagination: ProviderCustomersPagination;
}

export interface ProviderCustomersApiResponse {
  success: boolean;
  message?: string;
  data: ProviderCustomersData;
  timestamp?: string;
}

// Create provider subscription
export interface CreateProviderSubscriptionRequest {
  customerId: string;
  planName: string;
  planType: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
}

export interface CreateProviderSubscriptionResponse {
  success: boolean;
  message?: string;
  data?: ProviderSubscriber;
  timestamp?: string;
}

// Update provider subscription (PUT /providers/subscriptions/:id)
export interface UpdateProviderSubscriptionRequest {
  subscriptionId: string;
  planName?: string;
  planType?: string;
  amount?: number;
  currency?: string;
  autoRenew?: boolean;
}

export interface UpdateProviderSubscriptionResponse {
  success: boolean;
  message?: string;
  data?: ProviderSubscriber;
  timestamp?: string;
}

// Payment requests
export interface ProviderPaymentRequestCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ProviderPaymentRequestLinkInfo {
  id: string;
  code: string;
  checkoutEndpoint: string;
  url: string;
}

export interface ProviderPaymentRequest {
  _id: string;
  customerType: string;
  customerId: string;
  customer: ProviderPaymentRequestCustomer;
  amount: number;
  currency: string;
  paymentMethod: string;
  description: string;
  status: string;
  reference: string;
  dueDate: string;
  paymentLink: ProviderPaymentRequestLinkInfo | null;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderPaymentRequestsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderPaymentRequestsData {
  items: ProviderPaymentRequest[];
  paymentRequests?: ProviderPaymentRequest[];
  pagination: ProviderPaymentRequestsPagination;
}

export interface ProviderPaymentRequestsApiResponse {
  success: boolean;
  message?: string;
  data: ProviderPaymentRequestsData;
  timestamp?: string;
}

export interface ProviderPaymentRequestByIdApiResponse {
  success: boolean;
  message?: string;
  data: ProviderPaymentRequest;
  timestamp?: string;
}

export interface UpdateProviderPaymentRequestRequest {
  paymentRequestId: string;
  amount?: number;
  paymentMethod?: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateProviderPaymentRequestResponse {
  success: boolean;
  message?: string;
  data?: ProviderPaymentRequest;
  timestamp?: string;
}

export interface CancelProviderPaymentRequestResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// Manual transactions
export interface ProviderManualTransactionReconciliation {
  reconciledAt: string;
  reconciledBy: string;
  creditedTransactionId: string;
  reconciliationReference: string;
  note: string;
}

export interface ProviderManualTransaction {
  _id: string;
  providerId: string;
  customerId: string | null;
  recordedBy: string;
  amount: number;
  currency: string;
  transactionDate: string;
  paymentMethod: string;
  status: string;
  description: string;
  reference: string;
  reconciliation?: ProviderManualTransactionReconciliation;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProviderManualTransactionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderManualTransactionsSummary {
  recorded: { count: number; amount: number };
  reconciled: { count: number; amount: number };
  voided: { count: number; amount: number };
}

export interface ProviderManualTransactionsData {
  items: ProviderManualTransaction[];
  manualTransactions: ProviderManualTransaction[];
  pagination: ProviderManualTransactionsPagination;
  summary: ProviderManualTransactionsSummary;
}

export interface ProviderManualTransactionsApiResponse {
  success: boolean;
  message?: string;
  data: ProviderManualTransactionsData;
  timestamp?: string;
}

export interface ProviderManualTransactionByIdApiResponse {
  success: boolean;
  message?: string;
  data: ProviderManualTransaction;
  timestamp?: string;
}

// Payment links
export interface ProviderPaymentLink {
  _id: string;
  providerId: string;
  createdBy: string;
  customerId: string | null;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  expiresAt: string;
  publicCode: string;
  totalPayments: number;
  totalAmountPaid: number;
  lastPaidAt: string | null;
  metadata: any;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  url: string;
}

export interface ProviderPaymentLinksPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderPaymentLinksData {
  items: ProviderPaymentLink[];
  pagination: ProviderPaymentLinksPagination;
}

export interface ProviderPaymentLinksApiResponse {
  success: boolean;
  message?: string;
  data: ProviderPaymentLinksData;
  timestamp?: string;
}

export interface ProviderPaymentLinkByIdApiResponse {
  success: boolean;
  message?: string;
  data: ProviderPaymentLink;
  timestamp?: string;
}

export interface CreateProviderPaymentLinkRequest {
  title: string;
  description: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface CreateProviderPaymentLinkResponse {
  success: boolean;
  message?: string;
  data?: ProviderPaymentLink;
  timestamp?: string;
}

export interface UpdateProviderPaymentLinkRequest {
  paymentLinkId: string;
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  status?: string;
  expiresAt?: string;
}

export interface UpdateProviderPaymentLinkResponse {
  success: boolean;
  message?: string;
  data?: ProviderPaymentLink;
  timestamp?: string;
}

export interface CreateProviderCustomerRequest {
  name: string;
  email: string;
  phone: string;
  status: string;
}

export interface CreateProviderCustomerResponse {
  success: boolean;
  message?: string;
  data?: ProviderCustomer;
  timestamp?: string;
}

export interface ProviderCustomerByIdApiResponse {
  success: boolean;
  message?: string;
  data: ProviderCustomer;
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

export interface ProviderSettingsGeneral {
  facilityName: string;
  facilityType: string;
  providerDescription: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  services: string[];
}

export interface ProviderSettingsAccount {
  fullName: string;
  email: string;
  phone: string;
}

export interface ProviderSettingsBankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  routingNumber: string;
  swiftCode: string;
}

export interface ProviderSettingsPayouts {
  payoutFrequency: string;
  payoutDay: string;
  storeCurrency: string;
  bankDetails: ProviderSettingsBankDetails;
  nextPayoutDate: string | null;
  minimumPayoutAmount: number;
}

export interface ProviderSettingsCurrentPlan {
  name: string;
  amount: number;
  currency: string;
  billingDate: string | null;
  daysRemaining: number;
}

export interface ProviderSettingsPaymentBilling {
  paymentMethods: string[];
  billingEmail: string;
  billingPeriod: string;
  currentPlan: ProviderSettingsCurrentPlan;
  billingHistory: any[];
}

export interface ProviderSettingsTimeLanguage {
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
}

export interface ProviderSettingsData {
  general: ProviderSettingsGeneral;
  account: ProviderSettingsAccount;
  payouts: ProviderSettingsPayouts;
  paymentBilling: ProviderSettingsPaymentBilling;
  timeLanguage: ProviderSettingsTimeLanguage;
}

export interface ProviderSettingsApiResponse {
  success: boolean;
  message?: string;
  data: ProviderSettingsData;
  timestamp?: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface City {
  name: string;
  country: string;
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
  derivedStatusKey?: string;
  derivedStatusLabel?: string;
  paymentHistory?: any[];
}

export interface ProviderSubscribersResponse {
  subscribers: ProviderSubscriber[];
}

// Subscriptions list (providers/subscriptions)
export interface ProviderSubscriptionsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderSubscriptionsSummary {
  totalSubscriptions: number;
  activeCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  availablePlans: string[];
}

export interface ProviderSubscriptionsData {
  items: ProviderSubscriber[];
  subscribers: ProviderSubscriber[];
  pagination: ProviderSubscriptionsPagination;
  summary: ProviderSubscriptionsSummary;
}

export interface ProviderSubscriptionsApiResponse {
  success: boolean;
  data: ProviderSubscriptionsData;
  timestamp?: string;
}

export interface ProviderSubscriptionByIdApiResponse {
  success: boolean;
  message?: string;
  data: ProviderSubscriber;
  timestamp?: string;
}

// Provider notifications history
export interface ProviderNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  status: string;
  createdAt: string;
}

export interface ProviderNotificationsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProviderNotificationsHistoryData {
  notifications: ProviderNotification[];
  pagination: ProviderNotificationsPagination;
}

export interface ProviderNotificationsHistoryApiResponse {
  success: boolean;
  message?: string;
  data: ProviderNotificationsHistoryData;
  timestamp?: string;
}

export interface SendProviderNotificationRequest {
  /**
   * 'all' will notify every customer.
   * Otherwise, provide an array of customer IDs to notify specific recipients.
   */
  recipients: 'all' | string[];
  title: string;
  message: string;
  type: string;
}

export interface SendProviderNotificationResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
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
  useGetProviderPaymentRequestsQuery,
  useGetProviderPaymentRequestQuery,
  useGetProviderCustomersQuery,
  useCreateProviderSubscriptionMutation,
  useUpdateProviderSubscriptionMutation,
  useDeleteProviderSubscriptionMutation,
  useGetProviderSubscribersQuery,
  useGetProviderSubscriptionQuery,
  useGetProviderIncomeChartQuery,
  useGetProviderRecentActivitiesQuery,
  useCreateProviderPaymentRequestMutation,
  useCreateProviderManualTransactionMutation,
  useReconcileProviderManualTransactionMutation,
  useUpdateProviderManualTransactionMutation,
  useGetProviderTransactionQuery,
  useUpdateProviderPaymentRequestMutation,
  useCancelProviderPaymentRequestMutation,
  useGetProviderTeamMembersQuery,
  useInviteProviderTeamMemberMutation,
  useResendTeamMemberInvitationMutation,
  useUpdateTeamMemberRoleMutation,
  useDeleteTeamMemberMutation,
  useGetProviderSettingsQuery,
  useGetCountriesQuery,
  useGetCitiesByCountryQuery,
  useUpdateProviderGeneralSettingsMutation,
  useUpdateProviderAccountSettingsMutation,
  useUpdateProviderPasswordSettingsMutation,
  useUpdateProviderTimeLanguageSettingsMutation,
  useGetProviderNotificationsHistoryQuery,
  useSendProviderNotificationMutation,
  useCreateProviderCustomerMutation,
  useUpdateProviderPaymentLinkMutation,
  useGetProviderCustomerQuery,
  useUpdateProviderCustomerMutation,
  useGetProviderManualTransactionsQuery,
  useGetProviderPaymentLinksQuery,
  useGetProviderPaymentLinkQuery,
  useGetProviderManualTransactionQuery,
  useCreateProviderPaymentLinkMutation,
} = apiSlice;
