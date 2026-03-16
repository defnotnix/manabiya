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
// Supports both: sessionStorage refresh token (sent in body) AND HttpOnly cookie (sent automatically)
async function performTokenRefresh(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(TOKEN_KEYS.refresh);

  // Build request body - if we have a refresh token in sessionStorage, include it
  // If not, rely on HttpOnly cookie (withCredentials: true sends cookies automatically)
  const requestBody = refreshToken ? { refresh: refreshToken } : {};

  console.log("Attempting refresh with:", refreshToken ? "sessionStorage token" : "HttpOnly cookie");

  try {
    const response = await axios.post(
      "/api/auth/token/refresh/",
      requestBody,
      { withCredentials: true }
    );

    if (response.data.access) {
      sessionStorage.setItem(TOKEN_KEYS.access, response.data.access);
      // Store new refresh token if returned (for sessionStorage mode)
      if (response.data.refresh) {
        sessionStorage.setItem(TOKEN_KEYS.refresh, response.data.refresh);
      }
      console.log("Token refreshed successfully");
      return true;
    }

    console.log("Refresh response missing access token");
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
    const url = error.config?.url || "";

    // Don't treat auth endpoints as token expiry (login, verify, refresh)
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/token/verify") ||
      url.includes("/auth/token/refresh") ||
      url.endsWith("/auth/token/") ||
      url.endsWith("/auth/token");

    if (isAuthEndpoint) {
      console.log("401 on auth endpoint, not treating as token expiry:", url);
      return false;
    }

    console.log("401 detected on:", url, "- will attempt token refresh");
    return true;
  }
  return false;
}

// Generic error handler
const MAX_NETWORK_RETRIES = 3;

async function handleApiError<T>(
  error: AxiosError<ApiErrorResponse>,
  retryFn: () => Promise<ApiResponse<T>>,
  retryCount = 0
): Promise<ApiResponse<T>> {
  const isExpired = isTokenExpiredError(error);

  console.log("handleApiError:", {
    status: error.response?.status,
    url: error.config?.url,
    isExpired,
    isLoggingOut,
    retryCount,
    hasRefreshToken: !!sessionStorage.getItem("kcrtoken"),
  });

  // Token expired - attempt refresh (only on first try)
  if (isExpired && !isLoggingOut && retryCount === 0) {
    console.log("Attempting token refresh...");
    const refreshed = await handleTokenExpiry();
    if (refreshed) {
      console.log("Token refresh successful, retrying request...");
      return retryFn();
    }
    console.log("Token refresh failed, logging out...");
    triggerLogout();
    return { err: true, data: null, error: "Session expired" };
  } else if (error.code === "ERR_NETWORK" && retryCount < MAX_NETWORK_RETRIES) {
    // Server unreachable - retry with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, retryCount), 8000); // 1s, 2s, 4s, max 8s
    console.log(`Server unreachable, retry ${retryCount + 1}/${MAX_NETWORK_RETRIES} in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryFn();
  } else if (error.code === "ERR_NETWORK") {
    // Max retries reached, give up
    console.error(`Server Offline after ${MAX_NETWORK_RETRIES} retries`);
    return { err: true, data: null, error: "Server is offline" };
  } else if (error.code === "ERR_NETWORK_CHANGED" && retryCount < MAX_NETWORK_RETRIES) {
    // Network changed during request - retry with backoff
    const delay = Math.min(500 * Math.pow(2, retryCount), 4000);
    console.log(`Network changed, retry ${retryCount + 1}/${MAX_NETWORK_RETRIES} in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryFn();
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
  retryCount = 0
): Promise<ApiResponse<T>> {
  try {
    let response;
    if (method === "get" || method === "delete") {
      response = await axios[method](endpoint, config);
    } else {
      // Log data format for verification
      const isFormData = data instanceof FormData;
      console.log(`[API ${method.toUpperCase()}] ${endpoint}`, {
        isFormData,
        contentType: config.headers?.["Content-Type"] || "auto",
      });
      if (isFormData) {
        console.log("[FormData entries]", Array.from(data.entries()));
      }
      response = await axios[method](endpoint, data, config);
    }
    return { err: false, data: response.data };
  } catch (error: any) {
    // Create retry function with fresh auth header and incremented retry count
    const retryFn = () =>
      makeRequest<T>(method, endpoint, data, { ...config, headers: { ...config.headers, ...getAuthHeader() } }, retryCount + 1);
    return handleApiError(error, retryFn, retryCount);
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
