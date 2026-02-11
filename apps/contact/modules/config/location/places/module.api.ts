import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/places/";

export const PLACE_API = {
  getPlaces: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getPlace: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
};
