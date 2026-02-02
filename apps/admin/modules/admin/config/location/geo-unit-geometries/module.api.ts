import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-unit-geometries/";

export const GEO_UNIT_GEOMETRIES_API = {
  getGeoUnitGeometries: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
