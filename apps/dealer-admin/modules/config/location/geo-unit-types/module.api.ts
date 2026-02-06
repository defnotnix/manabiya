import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/unit-types/";

export const GEO_UNIT_TYPE_API = {
  getGeoUnitTypes: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getGeoUnitType: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createGeoUnitType: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updateGeoUnitType: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deleteGeoUnitType: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};
