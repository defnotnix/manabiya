import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/metrics/";

export const METRICS_API = {
  getMetrics: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
