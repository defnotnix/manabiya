import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/contacts/people/";

export const PERSON_API = {
    getPeople: async (params?: any) => {
        return await moduleApiCall.getRecords({
            endpoint: ENDPOINT,
            params,
        });
    },

    createPerson: async (data: any) => {
        const result = await moduleApiCall.createRecord({
            endpoint: ENDPOINT,
            body: data,
        });
        return { data: result };
    },

    updatePerson: async (id: string, data: any) => {
        const result = await moduleApiCall.editRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
            body: data,
        });
        return { data: result };
    },

    deletePerson: async (id: string) => {
        return await moduleApiCall.deleteRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
        });
    },
};
