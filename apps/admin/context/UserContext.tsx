"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { apiDispatch } from "@settle/core";

export interface UserData {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_disabled: boolean;
  disabled_at: string | null;
  disabled_reason: string | null;
  groups: number[];
  user_permissions: string[];
  roles: string[];
  permissions: string[];
}

export interface UserContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: UserData | null) => void;
  fetchCurrentUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user data from API
  const fetchCurrentUser = useCallback(async () => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

    if (!token) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiDispatch.get({
        endpoint: "/api/auth/users/me/",
      });

      if (response.err) {
        setError(
          response.data?.message || "Failed to fetch user data"
        );
        setUser(null);
      } else {
        setUser(response.data);
        setError(null);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore user data from localStorage on mount
  useEffect(() => {
    const storedUser = typeof window !== "undefined"
      ? localStorage.getItem("user_data")
      : null;

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user_data");
      }
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_data");
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        setUser,
        fetchCurrentUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    // Return a default/fallback context if not wrapped
    return {
      user: null,
      isLoading: false,
      error: "UserContextProvider not found. Wrap your app with UserContextProvider.",
      setUser: () => {},
      fetchCurrentUser: async () => {},
      logout: () => {},
    } as UserContextType;
  }
  return ctx;
}

/**
 * Hook to check if the current user is an admin
 */
export function useIsAdmin() {
  const { user } = useUser();
  return user?.roles?.includes("admin") ?? false;
}

/**
 * Hook to check if the current user is a data entry staff
 */
export function useIsDataEntry() {
  const { user } = useUser();
  return user?.roles?.includes("data_entry") ?? false;
}
