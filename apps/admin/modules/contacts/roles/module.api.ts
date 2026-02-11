import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/contacts/roles/";

export const ROLE_API = {
    getRoles: async (params?: any) => {
        return await moduleApiCall.getRecords({
            endpoint: ENDPOINT,
            params,
        });
    },

    createRole: async (data: any) => {
        const result = await moduleApiCall.createRecord({
            endpoint: ENDPOINT,
            body: data,
        });
        return { data: result };
    },

    updateRole: async (id: string, data: any) => {
        const result = await moduleApiCall.editRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
            body: data,
        });
        return { data: result };
    },

    deleteRole: async (id: string) => {
        return await moduleApiCall.deleteRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
        });
    },
};
