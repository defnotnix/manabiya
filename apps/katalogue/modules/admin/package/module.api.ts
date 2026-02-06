import { apiDispatch } from "@settle/core";

const ENDPOINT = "/api/catalogue/packages";
const COMPONENT_ENDPOINT = "/api/catalogue/package-components";

export const PACKAGE_API = {
  getPackages: async (params?: any) => {
    const response = await apiDispatch.get({
      endpoint: `${ENDPOINT}/`,
      params,
    });
    return response.data;
  },

  getPackage: async (id: string | number) => {
    return await apiDispatch.get({
      endpoint: `${ENDPOINT}/${id}/`,
    });
  },

  createPackage: async (data: any) => {
    return await apiDispatch.post({
      endpoint: `${ENDPOINT}/`,
      body: data,
    });
  },

  updatePackage: async (id: string | number, data: any) => {
    return await apiDispatch.patch({
      endpoint: `${ENDPOINT}/${id}/`,
      body: data,
    });
  },

  deletePackage: async (id: string | number) => {
    return await apiDispatch.del({
      endpoint: `${ENDPOINT}/${id}/`,
      id: String(id),
    });
  },

  // Component API
  getComponents: async (params?: any) => {
    return await apiDispatch.get({
      endpoint: `${COMPONENT_ENDPOINT}/`,
      params,
    });
  },

  createComponent: async (data: any) => {
    return await apiDispatch.post({
      endpoint: `${COMPONENT_ENDPOINT}/`,
      body: data,
    });
  },

  deleteComponent: async (id: string | number) => {
    return await apiDispatch.del({
      endpoint: `${COMPONENT_ENDPOINT}/${id}/`,
      id: String(id),
    });
  },
};
