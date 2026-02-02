import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-unit-metric-values/";

export const GEO_UNIT_METRIC_VALUES_API = {
  getGeoUnitMetricValues: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
