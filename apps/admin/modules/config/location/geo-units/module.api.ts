import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-units/";

export const GEO_UNIT_API = {
  getGeoUnits: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getGeoUnit: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createGeoUnit: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updateGeoUnit: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deleteGeoUnit: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};
