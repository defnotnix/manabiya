import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-unit-types/";

export const GEO_UNIT_TYPES_API = {
  getGeoUnitTypes: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
