import { apiDispatch } from "@settle/core";

const ENDPOINT = "/api/catalogue/products";

export const PRODUCT_API = {
  getProducts: async (params?: any) => {
    const response = await apiDispatch.get({
      endpoint: `${ENDPOINT}/`,
      params,
    });
    // Return unwrapped data (apiDispatch returns { err, data })
    return response.data;
  },

  getProduct: async (id: string | number) => {
    return await apiDispatch.get({
      endpoint: `${ENDPOINT}/${id}/`,
    });
  },

  createProduct: async (data: any) => {
    return await apiDispatch.post({
      endpoint: `${ENDPOINT}/`,
      body: data,
    });
  },

  updateProduct: async (id: string | number, data: any) => {
    return await apiDispatch.patch({
      endpoint: `${ENDPOINT}/${id}/`,
      body: data,
    });
  },

  deleteProduct: async (id: string | number) => {
    return await apiDispatch.del({
      endpoint: `${ENDPOINT}/${id}/`,
      id: String(id),
    });
  },
};
