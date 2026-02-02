import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/elections/voter-roll-entries/";
const EXTRA_ENDPOINT = "/api/elections/voter-roll-entry-extras/";

export const VOTER_ROLL_ENTRIES_API = {
  getEntries: async (params?: any) => {
    const response = await moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
    if (response?.results) {
      response.results = response.results.map((item: any) => {
        if (item.extra) {
          return {
            ...item,
            ...item.extra,
            extra_id: item.extra.id,
          };
        }
        return item;
      });
    }
    return response;
  },
  getEntry: async (id: string) => {
    const item = await moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
    if (item.extra) {
      return {
        ...item,
        ...item.extra,
        extra_id: item.extra.id,
      };
    }
    return item;
  },
  updateEntry: async (id: string, data: any) => {
    const extraId = data.extra_id;

    if (extraId) {
      return moduleApiCall.editRecord({
        endpoint: EXTRA_ENDPOINT,
        id: extraId,
        body: data,
      });
    } else {
      return moduleApiCall.createRecord({
        endpoint: EXTRA_ENDPOINT,
        body: { ...data, entry: id }, // entry ID is required
      });
    }
  },
};
