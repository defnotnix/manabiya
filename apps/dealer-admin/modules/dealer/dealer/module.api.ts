import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/dealer/dealers/";

export const DEALER_API = {
  getDealers: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
    return { data: Array.isArray(data) ? data : [] };
  },

  getDealer: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
    return { data };
  },

  createDealer: async (data: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
    return { data: result };
  },

  updateDealer: async (id: string, data: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
    return { data: result };
  },

  deleteDealer: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },
};
