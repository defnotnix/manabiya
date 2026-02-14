import { moduleApiCall } from "@settle/core";

export const REPORTING_API = {
  // Dashboard summary (combined district + municipality + religion)
  getDashboardSummary: async (params?: {
    district?: number;
    municipality?: number;
    top_n?: number;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/dashboard-summary/",
      params,
    });
  },

  // District reports
  getDistricts: async (params?: {
    district?: number;
    province?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/districts/",
      params,
    });
  },
  getDistrictByGeoUnit: async (districtId: number) => {
    return moduleApiCall.getRecords({
      endpoint: `/api/reporting/districts/by-district/${districtId}/`,
    });
  },

  // Municipality reports
  getMunicipalities: async (params?: {
    municipality?: number;
    district?: number;
    province?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/municipalities/",
      params,
    });
  },
  getMunicipalityByGeoUnit: async (municipalityId: number) => {
    return moduleApiCall.getRecords({
      endpoint: `/api/reporting/municipalities/by-municipality/${municipalityId}/`,
    });
  },

  // Ward reports
  getWards: async (params?: {
    ward?: number;
    municipality?: number;
    district?: number;
    province?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/wards/",
      params,
    });
  },
  getWardByGeoUnit: async (wardId: number) => {
    return moduleApiCall.getRecords({
      endpoint: `/api/reporting/wards/by-ward/${wardId}/`,
    });
  },

  // Booth reports
  getBooths: async (params?: {
    polling_station?: number;
    place?: number;
    ward?: number;
    municipality?: number;
    district?: number;
    province?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/booths/",
      params,
    });
  },
  getBoothByPollingStation: async (pollingStationId: number) => {
    return moduleApiCall.getRecords({
      endpoint: `/api/reporting/booths/by-polling-station/${pollingStationId}/`,
    });
  },

  // Religion level reports
  getReligionLevels: async (params?: {
    scope?: "NATIONAL" | "DISTRICT" | "MUNICIPALITY" | "WARD" | "BOOTH";
    religion?: string;
    geo_unit?: number;
    polling_station?: number;
    page?: number;
    page_size?: number;
    ordering?: string;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: "/api/reporting/religion-levels/",
      params,
    });
  },
};
