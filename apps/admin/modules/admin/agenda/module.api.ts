import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/agendas/";

export const AGENDA_API = {
  // Get all agendas
  getAgendas: async (params?: any) => {
    return moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },

  // Get single agenda by ID
  getAgenda: async (id: string) => {
    return moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Create new agenda
  createAgenda: async (data: any) => {
    return moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
  },

  // Update agenda
  updateAgenda: async (id: string, data: any) => {
    return moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
  },

  // Delete agenda
  deleteAgenda: async (id: string) => {
    return moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Get districts for dropdown
  getDistricts: async () => {
    return moduleApiCall.getRecords({
      endpoint: "/districts",
    });
  },
};
