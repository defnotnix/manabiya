"use client";

import { moduleApiCall } from "@settle/core";

// Endpoint Constants
const ENDPOINTS = {
  CUSTOMS: "/api/documents/customs/",
  STATEMENTS: "/api/documents/statements/",
  STATEMENT_LOGS: "/api/documents/statement-logs/",
  WODA_DOCS: "/api/documents/woda-docs/",
  WODA_LOGS: "/api/documents/woda-logs/",
};

// Custom Group API
export const CUSTOM_API = {
  getRecords: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.CUSTOMS,
      paginationProps: params,
    });
  },

  getSingleRecord: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
    });
    return { data };
  },

  createRecord: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      body,
    });
    return { data: result };
  },

  editRecord: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
      body,
    });
    return { data: result };
  },

  deleteRecord: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.CUSTOMS,
      id,
    });
  },
};

// Statement API
export const STATEMENT_API = {
  getRecords: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.STATEMENTS,
      paginationProps: params,
    });
  },

  getSingleRecord: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.STATEMENTS,
      id,
    });
    return { data };
  },

  createRecord: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.STATEMENTS,
      body,
    });
    return { data: result };
  },

  editRecord: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.STATEMENTS,
      id,
      body,
    });
    return { data: result };
  },

  deleteRecord: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.STATEMENTS,
      id,
    });
  },
};

// Statement Log API
export const STATEMENT_LOG_API = {
  getRecords: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.STATEMENT_LOGS,
      paginationProps: params,
    });
  },

  getSingleRecord: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.STATEMENT_LOGS,
      id,
    });
    return { data };
  },

  createRecord: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.STATEMENT_LOGS,
      body,
    });
    return { data: result };
  },
};

// Woda Doc API
export const WODA_DOC_API = {
  getRecords: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.WODA_DOCS,
      paginationProps: params,
    });
  },

  getSingleRecord: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.WODA_DOCS,
      id,
    });
    return { data };
  },

  createRecord: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.WODA_DOCS,
      body,
    });
    return { data: result };
  },

  editRecord: async (id: string, body: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINTS.WODA_DOCS,
      id,
      body,
    });
    return { data: result };
  },

  deleteRecord: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINTS.WODA_DOCS,
      id,
    });
  },
};

// Woda Log API
export const WODA_LOG_API = {
  getRecords: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINTS.WODA_LOGS,
      paginationProps: params,
    });
  },

  getSingleRecord: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINTS.WODA_LOGS,
      id,
    });
    return { data };
  },

  createRecord: async (body: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINTS.WODA_LOGS,
      body,
    });
    return { data: result };
  },
};
