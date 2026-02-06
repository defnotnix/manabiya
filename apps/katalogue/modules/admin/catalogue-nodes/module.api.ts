import { apiDispatch } from "@settle/core";

const ENDPOINT = "/api/catalogue/nodes";

export const CATALOG_NODE_API = {
  getTree: async () => {
    return await apiDispatch.get({
      endpoint: `${ENDPOINT}/tree/`,
    });
  },

  createNode: async (data: any) => {
    return await apiDispatch.post({
      endpoint: `${ENDPOINT}/`,
      body: data,
    });
  },

  updateNode: async (id: string | number, data: any) => {
    return await apiDispatch.patch({
      endpoint: `${ENDPOINT}/${id}/`,
      body: data,
    });
  },

  deleteNode: async (id: string | number) => {
    return await apiDispatch.del({
      endpoint: `${ENDPOINT}/${id}/`,
      id: String(id),
    });
  },
};
