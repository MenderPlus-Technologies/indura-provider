/**
 * API utility layer for making HTTP requests
 * Handles base URL, headers, error parsing, and response validation
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

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
}

/**
 * Safely parse JSON response
 */
const parseJson = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  if (!text.trim()) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return null;
  }
};

/**
 * Parse error response from API
 */
const parseError = async (response: Response): Promise<ApiError> => {
  const data = await parseJson(response);
  
  if (data && typeof data === 'object' && 'message' in data) {
    return {
      message: String(data.message),
      status: response.status,
      errors: 'errors' in data && typeof data.errors === 'object' 
        ? data.errors as Record<string, string[]> 
        : undefined,
    };
  }
  
  // Fallback error messages based on status code
  const statusMessages: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Invalid credentials. Please check your email and password.',
    403: 'Access denied. You do not have permission to perform this action.',
    404: 'Resource not found.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable. Please try again later.',
    503: 'Service unavailable. Please try again later.',
  };
  
  return {
    message: statusMessages[response.status] || 'An unexpected error occurred. Please try again.',
    status: response.status,
  };
};

/**
 * Get authorization header from localStorage
 */
const getAuthHeader = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const token = localStorage.getItem('authToken');
  return token ? `Bearer ${token}` : null;
};

/**
 * Make API request with error handling
 */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const authHeader = getAuthHeader();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(authHeader && { Authorization: authHeader }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await parseJson(response);

    if (!response.ok) {
      const error = await parseError(response);
      return { error };
    }

    // Validate response structure
    if (data === null || data === undefined) {
      return {
        error: {
          message: 'Received empty response from server.',
          status: response.status,
        },
      };
    }

    return { data: data as T };
  } catch (error) {
    // Handle network errors, timeouts, etc.
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        error: {
          message: 'Network error. Please check your internet connection and try again.',
        },
      };
    }

    return {
      error: {
        message: error instanceof Error ? error.message : 'An unexpected error occurred.',
      },
    };
  }
};

/**
 * POST request helper
 */
export const apiPost = <T = unknown>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * GET request helper
 */
export const apiGet = <T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    ...options,
  });
};

/**
 * PUT request helper
 */
export const apiPut = <T = unknown>(
  endpoint: string,
  body: unknown
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = <T = unknown>(
  endpoint: string
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
};
