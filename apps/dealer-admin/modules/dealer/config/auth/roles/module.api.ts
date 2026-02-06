import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/auth/roles/";
const PERMISSIONS_ENDPOINT = "/api/auth/permissions/";

export const ROLES_API = {
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
    // Ensure ID is passed in the URL, not just body if moduleApiCall expects it
    // The user request says: PATCH /api/auth/roles/{id}/
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT, 
      id,
      body: data,
    });
    return { data: result };
  },

  deleteRole: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  getPermissions: async () => {
    const response = await moduleApiCall.getRecords({
      endpoint: PERMISSIONS_ENDPOINT,
    });
    return { data: response?.results || [] };
  }
};
