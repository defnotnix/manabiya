import { apiDispatch } from "@settle/core";

const ENDPOINT = "/api/catalogue/offers";

export const OFFER_API = {
  getOffers: async (params?: any) => {
    const response = await apiDispatch.get({
      endpoint: `${ENDPOINT}/`,
      params,
    });
    return response.data;
  },

  getOffer: async (id: string | number) => {
    return await apiDispatch.get({
      endpoint: `${ENDPOINT}/${id}/`,
    });
  },

  createOffer: async (data: any) => {
    return await apiDispatch.post({
      endpoint: `${ENDPOINT}/`,
      body: data,
    });
  },

  updateOffer: async (id: string | number, data: any) => {
    return await apiDispatch.patch({
      endpoint: `${ENDPOINT}/${id}/`,
      body: data,
    });
  },

  deleteOffer: async (id: string | number) => {
    return await apiDispatch.del({
      endpoint: `${ENDPOINT}/${id}/`,
      id: String(id),
    });
  },
};
