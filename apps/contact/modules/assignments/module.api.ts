import { moduleApiCall } from "@settle/core";

// Assignments API
const ASSIGNMENTS_ENDPOINT = "/api/contacts/assignments/";

export const ASSIGNMENT_API = {
  getAssignments: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ASSIGNMENTS_ENDPOINT, params });
  },
  getAssignment: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ASSIGNMENTS_ENDPOINT, id });
  },
};

// Roles API (for filter options)
const ROLES_ENDPOINT = "/api/contacts/roles/";

export const ROLE_API = {
  getRoles: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ROLES_ENDPOINT, params });
  },
  getRoleOptions: async () => {
    return moduleApiCall.getRecords({ endpoint: `${ROLES_ENDPOINT}options/` });
  },
};

// Parties API (for filter options)
const PARTIES_ENDPOINT = "/api/elections/parties/";

export const PARTY_API = {
  getParties: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: PARTIES_ENDPOINT, params });
  },
};
