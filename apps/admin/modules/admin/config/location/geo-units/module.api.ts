import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-units/";

export const GEO_UNITS_API = {
  getGeoUnits: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
