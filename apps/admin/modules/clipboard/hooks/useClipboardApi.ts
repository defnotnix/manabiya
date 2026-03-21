import { moduleApiCall } from "@settle/core";
import { notifications } from "@mantine/notifications";

export interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  owner: number;
  created_at: string;
  updated_at: string;
}

export interface ClipboardEntry {
  id: number;
  category: number;
  category_name: string;
  title: string;
  content: string;
  notes: string;
  is_pinned: boolean;
  is_archived: boolean;
  usage_count: number;
  last_used_at: string | null;
  owner: number;
  created_at: string;
  updated_at: string;
}

const BASE_URL = "/api/features";

export const useClipboardApi = () => {
  // Categories
  const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await moduleApiCall.getRecords({
        endpoint: `${BASE_URL}/categories/`,
      });
      // Handle both array and object responses
      if (Array.isArray(response)) {
        return response;
      }
      return response?.results || response?.data || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

  const createCategory = async (data: {
    name: string;
    description: string;
    is_active?: boolean;
  }): Promise<Category | null> => {
    try {
      const response = await moduleApiCall.createRecord({
        endpoint: `${BASE_URL}/categories/`,
        body: { ...data, is_active: data.is_active ?? true },
      });
      notifications.show({
        title: "Success",
        message: "Category created successfully",
        color: "green",
      });
      return response;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create category",
        color: "red",
      });
      return null;
    }
  };

  const updateCategory = async (
    id: number,
    data: Partial<Category>
  ): Promise<Category | null> => {
    try {
      const response = await moduleApiCall.editRecord({
        endpoint: `${BASE_URL}/categories/`,
        id,
        body: data,
      });
      notifications.show({
        title: "Success",
        message: "Category updated successfully",
        color: "green",
      });
      return response;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update category",
        color: "red",
      });
      return null;
    }
  };

  const deleteCategory = async (id: number): Promise<boolean> => {
    try {
      await moduleApiCall.deleteRecord({
        endpoint: `${BASE_URL}/categories/`,
        id,
      });
      notifications.show({
        title: "Success",
        message: "Category deleted successfully",
        color: "green",
      });
      return true;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete category",
        color: "red",
      });
      return false;
    }
  };

  // Clipboard Entries
  const fetchClipboardEntries = async (): Promise<ClipboardEntry[]> => {
    try {
      const response = await moduleApiCall.getRecords({
        endpoint: `${BASE_URL}/clipboards/`,
      });
      // Handle both array and object responses
      if (Array.isArray(response)) {
        return response;
      }
      return response?.results || response?.data || [];
    } catch (error) {
      console.error("Failed to fetch clipboard entries:", error);
      return [];
    }
  };

  const createClipboardEntry = async (data: {
    category: number;
    title: string;
    content: string;
    notes?: string;
    is_pinned?: boolean;
    is_archived?: boolean;
  }): Promise<ClipboardEntry | null> => {
    try {
      const response = await moduleApiCall.createRecord({
        endpoint: `${BASE_URL}/clipboards/`,
        body: {
          ...data,
          is_pinned: data.is_pinned ?? false,
          is_archived: data.is_archived ?? false,
        },
      });
      notifications.show({
        title: "Success",
        message: "Clipboard entry created successfully",
        color: "green",
      });
      return response;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create clipboard entry",
        color: "red",
      });
      return null;
    }
  };

  const updateClipboardEntry = async (
    id: number,
    data: Partial<ClipboardEntry>
  ): Promise<ClipboardEntry | null> => {
    try {
      const response = await moduleApiCall.editRecord({
        endpoint: `${BASE_URL}/clipboards/`,
        id,
        body: data,
      });
      notifications.show({
        title: "Success",
        message: "Clipboard entry updated successfully",
        color: "green",
      });
      return response;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to update clipboard entry",
        color: "red",
      });
      return null;
    }
  };

  const deleteClipboardEntry = async (id: number): Promise<boolean> => {
    try {
      await moduleApiCall.deleteRecord({
        endpoint: `${BASE_URL}/clipboards/`,
        id,
      });
      notifications.show({
        title: "Success",
        message: "Clipboard entry deleted successfully",
        color: "green",
      });
      return true;
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to delete clipboard entry",
        color: "red",
      });
      return false;
    }
  };

  const markClipboardAsUsed = async (id: number): Promise<ClipboardEntry | null> => {
    try {
      const response = await fetch(`${BASE_URL}/clipboards/${id}/use/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ used: true }),
      });
      if (!response.ok) throw new Error("Failed to mark as used");
      return await response.json();
    } catch (error) {
      console.error("Failed to mark clipboard as used:", error);
      return null;
    }
  };

  return {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchClipboardEntries,
    createClipboardEntry,
    updateClipboardEntry,
    deleteClipboardEntry,
    markClipboardAsUsed,
  };
};
