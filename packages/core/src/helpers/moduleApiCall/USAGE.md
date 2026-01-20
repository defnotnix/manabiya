# moduleApiCall

A standardized API helper for CRUD operations. Provides consistent methods for interacting with REST APIs.

## When to Use

- Building module API layers
- Standard REST CRUD operations
- When you need consistent error handling

## Import

```typescript
import { moduleApiCall } from "@settle/core";
```

## Available Methods

| Method | Description | HTTP Method |
|--------|-------------|-------------|
| `getRecords` | Fetch list of records | GET |
| `getSingleRecord` | Fetch single record by ID | GET |
| `createRecord` | Create new record | POST |
| `editRecord` | Update existing record | PATCH |
| `deleteRecord` | Delete record by ID | DELETE |
| `createGroupRecords` | Create multiple records | POST |

## Basic Usage

```typescript
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/users/";

export const USERS_API = {
  // Get all records
  getUsers: async (params?: any) => {
    return moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
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
      endpoint: ENDPOINT,
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
};
```

## Method Signatures

### getRecords

Fetch a list of records with optional pagination and params.

```typescript
moduleApiCall.getRecords({
  endpoint: string;           // API endpoint (e.g., "/api/users/")
  paginationProps?: object;   // Pagination parameters
  params?: object;            // Additional query parameters
}): Promise<any[]>
```

**Example:**
```typescript
const users = await moduleApiCall.getRecords({
  endpoint: "/api/users/",
  params: { status: "active" },
});
```

### getSingleRecord

Fetch a single record by ID.

```typescript
moduleApiCall.getSingleRecord({
  endpoint: string;    // Base endpoint (e.g., "/api/users/")
  id: string | number; // Record ID
  params?: object;     // Additional query parameters
}): Promise<any | null>
```

**Example:**
```typescript
const user = await moduleApiCall.getSingleRecord({
  endpoint: "/api/users/",
  id: "123",
});
// Calls: GET /api/users/123/
```

### createRecord

Create a new record.

```typescript
moduleApiCall.createRecord({
  endpoint: string;   // API endpoint
  body: any;          // Data to create
  headers?: object;   // Optional headers
}): Promise<any | null>
```

**Example:**
```typescript
const newUser = await moduleApiCall.createRecord({
  endpoint: "/api/users/",
  body: { name: "John", email: "john@example.com" },
});
```

### editRecord

Update an existing record (PATCH).

```typescript
moduleApiCall.editRecord({
  endpoint: string;    // Base endpoint
  id: string | number; // Record ID
  body: any;           // Data to update
  headers?: object;    // Optional headers
}): Promise<any | null>
```

**Example:**
```typescript
const updated = await moduleApiCall.editRecord({
  endpoint: "/api/users/",
  id: "123",
  body: { name: "John Updated" },
});
// Calls: PATCH /api/users/123/
```

### deleteRecord

Delete a record by ID.

```typescript
moduleApiCall.deleteRecord({
  endpoint: string;    // Base endpoint
  id: string | number; // Record ID
  headers?: object;    // Optional headers
}): Promise<boolean>
```

**Example:**
```typescript
const success = await moduleApiCall.deleteRecord({
  endpoint: "/api/users/",
  id: "123",
});
// Calls: DELETE /api/users/123/
// Returns: true if successful, false if error
```

### createGroupRecords

Create multiple records at once.

```typescript
moduleApiCall.createGroupRecords({
  endpoint: string;   // API endpoint
  body: any[];        // Array of records to create
  headers?: object;   // Optional headers
}): Promise<any[]>
```

**Example:**
```typescript
const users = await moduleApiCall.createGroupRecords({
  endpoint: "/api/users/bulk/",
  body: [
    { name: "John", email: "john@example.com" },
    { name: "Jane", email: "jane@example.com" },
  ],
});
```

## Complete Module API Example

```typescript
// module.api.ts
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/products/";

export const PRODUCTS_API = {
  // List with pagination support
  getProducts: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    filters?: Record<string, any>;
  }) => {
    return moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },

  // Single record
  getProduct: async (id: string) => {
    return moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Create
  createProduct: async (data: {
    name: string;
    price: number;
    category: string;
  }) => {
    return moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
  },

  // Update
  updateProduct: async (id: string, data: Partial<{
    name: string;
    price: number;
    category: string;
  }>) => {
    return moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
  },

  // Delete
  deleteProduct: async (id: string) => {
    return moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },

  // Bulk create
  createProducts: async (products: Array<{
    name: string;
    price: number;
    category: string;
  }>) => {
    return moduleApiCall.createGroupRecords({
      endpoint: `${ENDPOINT}bulk/`,
      body: products,
    });
  },
};
```

## URL Patterns

The moduleApiCall helper follows these URL patterns:

| Method | URL Pattern | Example |
|--------|-------------|---------|
| `getRecords` | `{endpoint}` | `GET /api/users/` |
| `getSingleRecord` | `{endpoint}{id}/` | `GET /api/users/123/` |
| `createRecord` | `{endpoint}` | `POST /api/users/` |
| `editRecord` | `{endpoint}{id}/` | `PATCH /api/users/123/` |
| `deleteRecord` | `{endpoint}{id}/` | `DELETE /api/users/123/` |

**Note:** Always include trailing slash in your endpoint (e.g., `/api/users/`).

## Error Handling

All methods return `null`, `false`, or empty array on error:

| Method | Success Return | Error Return |
|--------|----------------|--------------|
| `getRecords` | `data[]` | `[]` |
| `getSingleRecord` | `data` | `null` |
| `createRecord` | `data` | `null` |
| `editRecord` | `data` | `null` |
| `deleteRecord` | `true` | `false` |
| `createGroupRecords` | `data[]` | `[]` |

## With Custom Headers

```typescript
// For file uploads
const created = await moduleApiCall.createRecord({
  endpoint: "/api/documents/",
  body: formData,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// With authentication
const data = await moduleApiCall.getRecords({
  endpoint: "/api/private/",
  params: {},
});
// Note: Auth headers are typically handled by apiDispatch
```

## Related

- [DataTableWrapper](../../wrappers/DataTableWrapper/USAGE.md) - Uses API for data fetching
- [DataTableModalShell](../../../admin/src/layouts/DataTableModalShell/USAGE.md) - Uses API for CRUD
