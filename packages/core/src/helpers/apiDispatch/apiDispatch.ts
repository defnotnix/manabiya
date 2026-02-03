"use client";

import axios, { AxiosError } from "axios";

// Type definitions
interface ApiResponse<T = any> {
  err: boolean;
  data: T | null;
  error?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const TOKEN_KEYS = {
  access: "kcatoken",
  refresh: "kcrtoken",
} as const;

// Refresh token state - prevents multiple concurrent refresh attempts
let refreshPromise: Promise<boolean> | null = null;
let isLoggingOut = false;

// Helper to get auth header
function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem(TOKEN_KEYS.access);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Token expiry handler with singleton pattern
async function handleTokenExpiry(): Promise<boolean> {
  // If already logging out, don't attempt refresh
  if (isLoggingOut) {
    return false;
  }

  // If a refresh is already in progress, wait for it
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start a new refresh attempt
  refreshPromise = performTokenRefresh();

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshPromise = null;
  }
}

// Actual token refresh logic
async function performTokenRefresh(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(TOKEN_KEYS.refresh);

  if (!refreshToken) {
    console.error("No refresh token available");
    return false;
  }

  try {
    const response = await axios.post(
      "/api/auth/token/refresh/",
      { refresh: refreshToken },
      { withCredentials: true }
    );

    if (response.data.access) {
      sessionStorage.setItem(TOKEN_KEYS.access, response.data.access);
      if (response.data.refresh) {
        sessionStorage.setItem(TOKEN_KEYS.refresh, response.data.refresh);
      }
      console.log("Token refreshed successfully");
      return true;
    }

    return false;
  } catch (err) {
    console.error("Token refresh failed:", err);
    return false;
  }
}

function triggerLogout(): void {
  // Prevent further refresh attempts
  if (isLoggingOut) return;
  isLoggingOut = true;

  sessionStorage.removeItem(TOKEN_KEYS.access);
  sessionStorage.removeItem(TOKEN_KEYS.refresh);

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Token verify handler
async function verifyToken(token: string): Promise<boolean> {
  try {
    await axios.post(
      "/api/auth/token/verify/",
      { token },
      { withCredentials: true }
    );
    return true;
  } catch (err) {
    console.error("Token verification failed:", err);
    return false;
  }
}

// Verify current session (checks if access token is valid)
export async function verifySession(): Promise<boolean> {
  const accessToken = sessionStorage.getItem(TOKEN_KEYS.access);
  if (!accessToken) {
    return false;
  }
  return verifyToken(accessToken);
}

// Check if error is a token expiry error
function isTokenExpiredError(error: AxiosError<any>): boolean {
  if (error.response?.status === 401) {
    const data = error.response?.data;
    // Check various token expiry response formats
    // Note: "authentication_failed" is NOT a token expiry - it's invalid credentials on login
    return (
      data?.message === "Token Expired" ||
      data?.error?.detail?.code === "token_not_valid" ||
      data?.code === "token_not_valid"
    );
  }
  return false;
}

// Generic error handler
async function handleApiError<T>(
  error: AxiosError<ApiErrorResponse>,
  retryFn: () => Promise<ApiResponse<T>>,
  isRetry = false
): Promise<ApiResponse<T>> {
  // Don't attempt refresh if already logging out or this is a retry
  if (isTokenExpiredError(error) && !isLoggingOut && !isRetry) {
    const refreshed = await handleTokenExpiry();
    if (refreshed) {
      // Mark as retry to prevent infinite loops
      return retryFn();
    }
    triggerLogout();
    return { err: true, data: null, error: "Session expired" };
  } else if (error.code === "ERR_NETWORK") {
    console.error("Server Offline");
    return { err: true, data: null, error: "Server is offline" };
  }

  return {
    err: true,
    data: null,
    error: error.message || "An error occurred",
  };
}

// Generic request wrapper
async function makeRequest<T>(
  method: "get" | "post" | "patch" | "delete",
  endpoint: string,
  data: any,
  config: any,
  isRetry = false
): Promise<ApiResponse<T>> {
  try {
    let response;
    if (method === "get" || method === "delete") {
      response = await axios[method](endpoint, config);
    } else {
      response = await axios[method](endpoint, data, config);
    }
    return { err: false, data: response.data };
  } catch (error: any) {
    // Create retry function with fresh auth header
    const retryFn = () =>
      makeRequest<T>(method, endpoint, data, { ...config, headers: { ...config.headers, ...getAuthHeader() } }, true);
    return handleApiError(error, retryFn, isRetry);
  }
}

export async function get<T = any>({
  endpoint = "",
  params = {},
}: {
  endpoint: string;
  params?: Record<string, any>;
}): Promise<ApiResponse<T>> {
  return makeRequest<T>("get", endpoint, null, {
    params,
    headers: getAuthHeader(),
  });
}

export async function post<T = any>({
  endpoint = "",
  body,
  headers = {},
  noAuthorization = false,
}: {
  endpoint: string;
  body: any;
  headers?: Record<string, any>;
  noAuthorization?: boolean;
}): Promise<ApiResponse<T>> {
  return makeRequest<T>("post", endpoint, body, {
    headers: {
      ...headers,
      ...(noAuthorization ? {} : getAuthHeader()),
    },
  });
}

export async function patch<T = any>({
  endpoint = "",
  body,
  headers = {},
}: {
  endpoint: string;
  body: any;
  headers?: Record<string, any>;
}): Promise<ApiResponse<T>> {
  return makeRequest<T>("patch", endpoint, body, {
    headers: {
      ...headers,
      ...getAuthHeader(),
    },
  });
}

export async function del<T = any>({
  endpoint = "",
  id,
  headers = {},
}: {
  endpoint: string;
  id: string;
  headers?: Record<string, any>;
}): Promise<ApiResponse<T>> {
  return makeRequest<T>("delete", `${endpoint}${id}/`, null, {
    headers: {
      ...headers,
      ...getAuthHeader(),
    },
  });
}

export async function login<T = any>({
  endpoint = "",
  body,
}: {
  endpoint: string;
  body: any;
}): Promise<ApiResponse<T>> {
  return post({ endpoint, body, noAuthorization: true });
}
