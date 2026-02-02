import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/place-types/";

export const PLACE_TYPES_API = {
  getPlaceTypes: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },
};
