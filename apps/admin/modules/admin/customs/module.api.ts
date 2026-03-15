"use client";

import { moduleApiCall } from "@settle/core";

// Endpoint Constants
const ENDPOINTS = {
  CUSTOMS: "/api/documents/customs/",
};

// Custom Documents API
export const CUSTOMS_API = {
  getCustoms: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.CUSTOMS,
      params,
    });
  },

  getCustom: async (id: string) => {
    return await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
    });
  },

  createCustom: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      body,
    });
    return { data: result };
  },

  updateCustom: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
      body,
    });
    return { data: result };
  },

  deleteCustom: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
    });
  },

  searchCustoms: async (search: string) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.CUSTOMS,
      params: { search },
    });
    return { data: Array.isArray(data) ? data : data?.results || [] };
  },
};
