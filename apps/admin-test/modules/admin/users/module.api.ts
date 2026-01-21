import { moduleApiCall } from "@settle/core";

const ENDPOINT = "https://dummyjson.com/users";

export const USERS_API = {
  // Get all records (supports server-side search and filtering)
  getUsers: async (params?: any) => {
    let url = ENDPOINT;
    const { q, ...filters } = params || {};
    
    // Check for search query first
    if (q && q.length > 0) {
      url = `${ENDPOINT}/search?q=${q}`;
    } 
    // Check for specific filters (handling the 'filter' endpoint requirement)
    // The requirement says: https://dummyjson.com/users/filter?key=hair.color&value=Brown
    // We'll need to adapt generic filters to this format if present.
    // For now, let's assuming if there's a specific key-value pair in params that matches a filterable field
    // we use the filter endpoint.
    // However, dummyjson filter endpoint only supports one key-value pair at a time roughly.
    // Let's implement a simple check for 'key' and 'value' in params if valid, or just pass generic params.
    else if (filters && Object.keys(filters).length > 0) {
       // Support specific key/value pair if passed explicitly
       if (filters.key && filters.value) {
         url = `${ENDPOINT}/filter?key=${filters.key}&value=${filters.value}`;
       } 
       // Support standard object filters (take the first one found)
       // e.g., { 'hair.color': 'Brown' } -> key='hair.color', value='Brown'
       else {
          const filterKeys = Object.keys(filters).filter(k => k !== 'limit' && k !== 'skip');
          if (filterKeys.length > 0) {
              const key = filterKeys[0];
              const value = filters[key];
              if (value) {
                  url = `${ENDPOINT}/filter?key=${key}&value=${value}`;
              }
          }
       }
    }

    // Pass limit and skip if not already in query string of url (search/filter endpoints support them too)
    const queryParams: any = {};
    if (filters.limit) queryParams.limit = filters.limit;
    if (filters.skip) queryParams.skip = filters.skip;

    // We can't easily use moduleApiCall.getRecords because the base URL changes dynamically.
    // So we'll fetch directly or use a custom caller if moduleApiCall is too rigid.
    // However, moduleApiCall usually takes an endpoint.
    // Let's look at how moduleApiCall is defined.
    // Assuming it does a GET request.
    
    // Actually, to keep it simple and safe with the provided `sustained-module.md` pattern:
    // We should construct the correct endpoint string and pass it.
    
    // Re-constructing logic safely:
    let finalEndpoint = ENDPOINT;
    if (q) {
        finalEndpoint = `${ENDPOINT}/search?q=${encodeURIComponent(q)}`;
    } else if (filters.filterKey && filters.filterValue) {
        finalEndpoint = `${ENDPOINT}/filter?key=${filters.filterKey}&value=${filters.filterValue}`;
    }

    return moduleApiCall.getRecords({
      endpoint: finalEndpoint,
      // We pass remaining params like limit/skip here
      params: {
          limit: params?.limit,
          skip: params?.skip
      },
    });
  },

  // Get single record
  getUser: async (id: string) => {
    return moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Create record
  createUser: async (data: any) => {
    return moduleApiCall.createRecord({
      endpoint: `${ENDPOINT}/add`,
      body: data,
    });
  },

  // Update record
  updateUser: async (id: string, data: any) => {
    return moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
  },

  // Delete record
  deleteUser: async (id: string) => {
    return moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Custom User calls
  getUserCarts: async (id: string) => {
     const response = await fetch(`${ENDPOINT}/${id}/carts`);
     return response.json();
  },

  getUserPosts: async (id: string) => {
     const response = await fetch(`${ENDPOINT}/${id}/posts`);
     return response.json();
  },

  getUserTodos: async (id: string) => {
     const response = await fetch(`${ENDPOINT}/${id}/todos`);
     return response.json();
  }
};
