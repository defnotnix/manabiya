import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/contacts/assignments/";

export const ASSIGNMENT_API = {
    getAssignments: async (params?: any) => {
        return await moduleApiCall.getRecords({
            endpoint: ENDPOINT,
            params,
        });
    },

    createAssignment: async (data: any) => {
        const result = await moduleApiCall.createRecord({
            endpoint: ENDPOINT,
            body: data,
        });
        return { data: result };
    },

    updateAssignment: async (id: string, data: any) => {
        const result = await moduleApiCall.editRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
            body: data,
        });
        return { data: result };
    },

    deleteAssignment: async (id: string) => {
        return await moduleApiCall.deleteRecord({
            endpoint: `${ENDPOINT}${id}/`,
            id,
        });
    },
};
