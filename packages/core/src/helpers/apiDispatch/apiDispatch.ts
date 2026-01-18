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

// Helper to get auth header
function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem(TOKEN_KEYS.access);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Token expiry handler
async function handleTokenExpiry(): Promise<boolean> {
  const refreshToken = sessionStorage.getItem(TOKEN_KEYS.refresh);

  if (!refreshToken) {
    console.error("No refresh token available");
    return false;
  }

  try {
    const response = await axios.post("/api/auth/token/refresh/", {
      refresh: refreshToken,
    });

    if (response.data.access) {
      sessionStorage.setItem(TOKEN_KEYS.access, response.data.access);
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
  sessionStorage.removeItem(TOKEN_KEYS.access);
  sessionStorage.removeItem(TOKEN_KEYS.refresh);

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Generic error handler
async function handleApiError<T>(
  error: AxiosError<ApiErrorResponse>,
  retryFn: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  if (error.response?.data?.message === "Token Expired") {
    const refreshed = await handleTokenExpiry();
    if (refreshed) {
      return retryFn();
    }
    triggerLogout();
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
  retryFn?: () => Promise<ApiResponse<T>>
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
    if (!retryFn) {
      retryFn = () => makeRequest(method, endpoint, data, config);
    }
    return handleApiError(error, retryFn);
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
