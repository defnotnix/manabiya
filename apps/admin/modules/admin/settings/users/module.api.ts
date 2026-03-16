"use client";

import { moduleApiCall } from "@settle/core";

// Endpoint Constants
const ENDPOINTS = {
  USERS: "/api/auth/users/",
};

// User API
export const USER_API = {
  getUsers: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.USERS,
      params,
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },

  getUser: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.USERS,
      id,
    });
    return { data };
  },

  createUser: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.USERS,
      body,
    });
    return { data: result };
  },

  updateUser: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.USERS,
      id,
      body,
    });
    return { data: result };
  },

  deleteUser: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.USERS,
      id,
    });
  },

  searchUsers: async (search: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.USERS,
      params: { search },
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },
};
