import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-units/";

export const GEO_UNIT_API = {
  getGeoUnits: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getGeoUnit: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
};
