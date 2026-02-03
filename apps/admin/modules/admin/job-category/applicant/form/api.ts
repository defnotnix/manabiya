import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/applicants/";

export const APPLICANT_API = {
  // Get all applicants
  getApplicants: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    filters?: Record<string, any>;
  }) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
    return {
      data: Array.isArray(data) ? data : [],
    };
  },

  // Get single applicant by ID
  getApplicant: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
    return {
      data,
    };
  },

  // Create new applicant
  createApplicant: async (data: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
    return {
      data: result,
    };
  },

  // Update applicant
  updateApplicant: async (id: string, data: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
    return {
      data: result,
    };
  },

  // Delete applicant
  deleteApplicant: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },
};
