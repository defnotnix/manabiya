import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/places/";

export const PLACE_API = {
  getPlaces: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getPlace: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createPlace: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updatePlace: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deletePlace: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};
