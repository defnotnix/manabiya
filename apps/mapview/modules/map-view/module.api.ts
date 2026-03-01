import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/location/geo-units/";
const POLLING_STATIONS_ENDPOINT = "/api/location/polling-stations/";
const PROBLEMS_ENDPOINT = "/api/problems/items/";
const PLACE_MANAGEMENT_ENDPOINT = "/api/location/place-management/";

export const GEO_UNIT_API = {
  getGeoUnits: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  getGeoUnit: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  createGeoUnit: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  updateGeoUnit: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  deleteGeoUnit: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};

export const POLLING_STATIONS_API = {
  getPollingStations: async (params?: { ward?: number; place?: number; municipality?: number; search?: string }) => {
    return moduleApiCall.getRecords({ endpoint: POLLING_STATIONS_ENDPOINT, params });
  },
};

export const PROBLEMS_API = {
  getProblems: async (params?: {
    place?: number;
    ward?: number;
    municipality?: number;
    district?: number;
    province?: number;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    source?: string;
    is_active?: boolean;
    reported_by?: number;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
    compact?: boolean;
  }) => {
    return moduleApiCall.getRecords({ endpoint: PROBLEMS_ENDPOINT, params });
  },
  getProblem: async (id: number) => {
    return moduleApiCall.getSingleRecord({ endpoint: PROBLEMS_ENDPOINT, id: String(id) });
  },
  createProblem: async (data: {
    external_id?: string;
    name: string;
    name_en?: string;
    place: number;
    population?: number;
    houses?: number;
    voters?: number;
    people_present?: string;
    issues: Array<{ ne: string; en?: string }>;
    booth?: Array<{ ne: string; en?: string }>;
    previous_records?: string;
    previous_records_en?: string;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED";
    source?: string;
    notes?: string;
  }) => {
    return moduleApiCall.createRecord({ endpoint: PROBLEMS_ENDPOINT, body: data });
  },
  updateProblem: async (id: number, data: any) => {
    return moduleApiCall.editRecord({ endpoint: PROBLEMS_ENDPOINT, id: String(id), body: data });
  },
  deleteProblem: async (id: number) => {
    return moduleApiCall.deleteRecord({ endpoint: PROBLEMS_ENDPOINT, id: String(id) });
  },
};

export const PLACE_API = {
  getPlaces: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: PLACE_MANAGEMENT_ENDPOINT, params });
  },
  getPlace: async (id: number) => {
    return moduleApiCall.getSingleRecord({ endpoint: PLACE_MANAGEMENT_ENDPOINT, id: String(id) });
  },
  createPlace: async (data: {
    place_type: number;
    geo_unit: number;
    name: string;
    name_en?: string;
    normalized_name: string;
    normalized_name_en?: string;
    latitude: number;
    longitude: number;
    osm_node_id?: number;
    osm_way_id?: number;
    osm_relation_id?: number;
  }) => {
    return moduleApiCall.createRecord({ endpoint: PLACE_MANAGEMENT_ENDPOINT, body: data });
  },
  updatePlace: async (id: number, data: any) => {
    return moduleApiCall.editRecord({ endpoint: PLACE_MANAGEMENT_ENDPOINT, id: String(id), body: data });
  },
};
