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
  tagTypes: ['Auth'],
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
  }),
});

// Export hooks for usage in components
export const { useSignInMutation, useChangePasswordMutation } = apiSlice;
