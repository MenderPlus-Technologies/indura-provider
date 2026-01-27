'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSignInMutation, useChangePasswordMutation } from '../store/apiSlice';

export interface User {
  id: string;
  email: string;
  role: string;
  [key: string]: unknown;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  requiresPasswordChange: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  signOut: () => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  clearPasswordChangeRequirement: () => void;
  // RTK Query mutation states
  isSigningIn: boolean;
  isChangingPassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'authToken';
const USER_STORAGE_KEY = 'authUser';
const PASSWORD_CHANGE_KEY = 'requiresPasswordChange';

/**
 * Load auth state from localStorage
 */
const loadAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      user: null,
      token: null,
      requiresPasswordChange: false,
    };
  }

  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  const requiresPasswordChange = localStorage.getItem(PASSWORD_CHANGE_KEY) === 'true';

  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
    }
  }

  return {
    isAuthenticated: !!token && !!user,
    user,
    token,
    requiresPasswordChange,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(loadAuthState);
  const [signInMutation, { isLoading: isSigningIn }] = useSignInMutation();
  const [changePasswordMutation, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Sync with localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === AUTH_STORAGE_KEY ||
        e.key === USER_STORAGE_KEY ||
        e.key === PASSWORD_CHANGE_KEY
      ) {
        setAuthState(loadAuthState());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    try {
      const result = await signInMutation({ email, password }).unwrap();

      // Safely validate response structure
      if (!result) {
        return {
          success: false,
          error: 'Invalid response from server. Please try again.',
        };
      }

      const token = result.token;
      const user = result.user;
      const requiresPasswordChange = result.requiresPasswordChange === true;

      if (!token || !user) {
        return {
          success: false,
          error: 'Invalid response from server. Missing authentication data.',
        };
      }

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        if (requiresPasswordChange) {
          localStorage.setItem(PASSWORD_CHANGE_KEY, 'true');
        } else {
          localStorage.removeItem(PASSWORD_CHANGE_KEY);
        }
      }

      setAuthState({
        isAuthenticated: true,
        user,
        token,
        requiresPasswordChange,
      });

      return { success: true, user };
    } catch (error: unknown) {
      // RTK Query error handling
      const errorMessage = 
        (error as { data?: { message?: string }; status?: number })?.data?.message ||
        (error as { message?: string })?.message ||
        'Sign in failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [signInMutation]);

  const changePassword = useCallback(async (
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await changePasswordMutation({ oldPassword, newPassword }).unwrap();

      // Clear password change requirement
      if (typeof window !== 'undefined') {
        localStorage.removeItem(PASSWORD_CHANGE_KEY);
      }

      setAuthState((prev) => ({
        ...prev,
        requiresPasswordChange: false,
      }));

      return { success: true };
    } catch (error: unknown) {
      // RTK Query error handling
      const errorMessage = 
        (error as { data?: { message?: string }; status?: number })?.data?.message ||
        (error as { message?: string })?.message ||
        'Password change failed. Please try again.';
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [changePasswordMutation]);

  const signOut = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(PASSWORD_CHANGE_KEY);
      localStorage.removeItem('isLoggedIn'); // Legacy support
    }

    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      requiresPasswordChange: false,
    });
  }, []);

  const clearPasswordChangeRequirement = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(PASSWORD_CHANGE_KEY);
    }

    setAuthState((prev) => ({
      ...prev,
      requiresPasswordChange: false,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signIn,
        signOut,
        changePassword,
        clearPasswordChangeRequirement,
        isSigningIn,
        isChangingPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
