import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/auth/users/";
const ROLES_ENDPOINT = "/api/auth/roles/";
const PERMISSIONS_ENDPOINT = "/api/auth/permissions/";

export const USERS_API = {
  getUsers: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },

  createUser: async (data: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
    return { data: result };
  },

  updateUser: async (id: string, data: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
    return { data: result };
  },

  deleteUser: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  getRoles: async () => {
    return await moduleApiCall.getRecords({
      endpoint: ROLES_ENDPOINT,
    });
  },

  getPermissions: async () => {
    const response = await moduleApiCall.getRecords({
      endpoint: PERMISSIONS_ENDPOINT,
    });
    return { data: response?.results || [] };
  },
};
