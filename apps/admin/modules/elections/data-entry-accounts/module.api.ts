import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/elections/data-entry-accounts/";
const POLLING_STATIONS_ENDPOINT = "/api/elections/polling-stations/";

export const DATA_ENTRY_ACCOUNTS_API = {
  getAccounts: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getAccount: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createAccount: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updateAccount: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deleteAccount: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};

export const POLLING_STATIONS_API = {
  getPollingStations: async (params?: { ward?: number; place?: number; search?: string }) => {
    return moduleApiCall.getRecords({ endpoint: POLLING_STATIONS_ENDPOINT, params });
  },
};
