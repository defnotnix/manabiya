import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/place-types/";

export const PLACE_TYPE_API = {
  getPlaceTypes: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getPlaceType: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createPlaceType: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updatePlaceType: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deletePlaceType: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};
