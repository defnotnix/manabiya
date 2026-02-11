import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/elections/parties/";

export const PARTY_API = {
    getParties: async (params?: any) => {
        return await moduleApiCall.getRecords({
            endpoint: ENDPOINT,
            params,
        });
    },

    getParty: async (id: string) => {
        return await moduleApiCall.getSingleRecord({
            endpoint: ENDPOINT,
            id,
        });
    },

    createParty: async (data: any) => {
        const result = await moduleApiCall.createRecord({
            endpoint: ENDPOINT,
            body: data,
        });
        return { data: result };
    },

    updateParty: async (id: string, data: any) => {
        const result = await moduleApiCall.editRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
            body: data,
        });
        return { data: result };
    },

    deleteParty: async (id: string) => {
        return await moduleApiCall.deleteRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
        });
    },
};
