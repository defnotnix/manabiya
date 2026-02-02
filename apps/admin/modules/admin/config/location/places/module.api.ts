import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/places/";

export const PLACES_API = {
  getPlaces: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
