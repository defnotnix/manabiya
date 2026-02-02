import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-unit-names/";

export const GEO_UNIT_NAMES_API = {
  getGeoUnitNames: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
