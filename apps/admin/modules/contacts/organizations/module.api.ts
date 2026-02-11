import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/contacts/organizations/";

export const ORGANIZATION_API = {
    getOrganizations: async (params?: any) => {
        return await moduleApiCall.getRecords({
            endpoint: ENDPOINT,
            params,
        });
    },

    createOrganization: async (data: any) => {
        const result = await moduleApiCall.createRecord({
            endpoint: ENDPOINT,
            body: data,
        });
        return { data: result };
    },

    updateOrganization: async (id: string, data: any) => {
        const result = await moduleApiCall.editRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
            body: data,
        });
        return { data: result };
    },

    deleteOrganization: async (id: string) => {
        return await moduleApiCall.deleteRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
        });
    },
};
