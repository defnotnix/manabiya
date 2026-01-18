# Core Helper Functions

Utility functions for API calls, data formatting, and search operations in the Settle framework.

## Overview

The `@settle/core` helpers package provides essential utility functions for:
- **API Communication** - Authenticated HTTP requests with automatic token refresh
- **Data Formatting** - Transform form data for API submission
- **Module API Calls** - High-level CRUD operations
- **Auto Search** - Client-side search functionality

## Available Helpers

### 1. apiDispatch

HTTP client with automatic authentication and token management.

**Functions:**
- `get()` - GET requests
- `post()` - POST requests
- `patch()` - PATCH requests
- `del()` - DELETE requests
- `login()` - Authentication requests

**Features:**
- ✅ Automatic Bearer token injection
- ✅ Token refresh on expiry
- ✅ Auto-logout on auth failure
- ✅ Error handling with retry
- ✅ Network error detection

**Usage:**

```typescript
import { apiDispatch } from "@settle/core";

// GET request
const { err, data } = await apiDispatch.get({
  endpoint: "/api/users",
  params: { page: 1, limit: 10 }
});

// POST request
const { err, data } = await apiDispatch.post({
  endpoint: "/api/users",
  body: { name: "John", email: "john@example.com" }
});

// PATCH request
const { err, data } = await apiDispatch.patch({
  endpoint: "/api/users/123",
  body: { name: "Jane" }
});

// DELETE request
const { err, data } = await apiDispatch.del({
  endpoint: "/api/users/",
  id: "123"
});

// Login
const { err, data } = await apiDispatch.login({
  endpoint: "/api/auth/login",
  body: { email: "john@example.com", password: "secret" }
});
```

**Token Storage:**
- Access Token: `sessionStorage.kcatoken`
- Refresh Token: `sessionStorage.kcrtoken`

**Return Format:**
```typescript
{
  err: boolean,     // true if error occurred
  data: any | null  // response data or null on error
}
```

---

### 2. formatJsonSubmit

Formats and transforms form data for API submission.

**Features:**
- ✅ Filter out ignored fields
- ✅ Dirty checking (only submit changed values)
- ✅ Stringify complex objects
- ✅ Convert to FormData for file uploads

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `Record<string, any>` | Raw form data |
| `keyIgnore` | `string[]` | Keys to exclude |
| `stringify` | `string[]` | Keys to JSON.stringify |
| `dirtCheckValues` | `Record<string, any>` | Original values for comparison |
| `formatToFormData` | `boolean` | Convert to FormData |

**Usage:**

```typescript
import { formatJsonSubmit } from "@settle/core";

// Basic filtering
const formatted = await formatJsonSubmit({
  data: { name: "John", email: "john@example.com", _id: "123" },
  keyIgnore: ["_id"]  // Remove internal fields
});
// Result: { name: "John", email: "john@example.com" }

// Dirty checking
const formatted = await formatJsonSubmit({
  data: { name: "Jane", email: "john@example.com", age: 25 },
  dirtCheckValues: { name: "John", email: "john@example.com", age: 25 }
});
// Result: { name: "Jane" } - only changed field

// Stringify objects
const formatted = await formatJsonSubmit({
  data: {
    name: "John",
    preferences: { theme: "dark", language: "en" }
  },
  stringify: ["preferences"]
});
// Result: { name: "John", preferences: '{"theme":"dark","language":"en"}' }

// Convert to FormData
const formData = await formatJsonSubmit({
  data: { name: "John", avatar: fileObject },
  formatToFormData: true
});
// Returns: FormData instance
```

---

### 3. moduleApiCall

High-level CRUD operations for API resources.

**Functions:**

| Function | Description | Parameters |
|----------|-------------|------------|
| `getRecords()` | Fetch list of records | `endpoint, params, paginationProps` |
| `getSingleRecord()` | Fetch single record | `endpoint, id, params` |
| `createRecord()` | Create new record | `endpoint, body, headers` |
| `editRecord()` | Update existing record | `endpoint, id, body, headers` |
| `deleteRecord()` | Delete record | `endpoint, id, headers` |
| `createGroupRecords()` | Bulk create records | `endpoint, body[], headers` |

**Usage:**

```typescript
import { moduleApiCall } from "@settle/core";

// Get all records
const users = await moduleApiCall.getRecords({
  endpoint: "/api/users/",
  params: { status: "active" },
  paginationProps: { page: 1, pageSize: 20 }
});

// Get single record
const user = await moduleApiCall.getSingleRecord({
  endpoint: "/api/users/",
  id: 123
});

// Create record
const newUser = await moduleApiCall.createRecord({
  endpoint: "/api/users/",
  body: { name: "John", email: "john@example.com" }
});

// Edit record
const updated = await moduleApiCall.editRecord({
  endpoint: "/api/users/",
  id: 123,
  body: { name: "Jane" }
});

// Delete record
const success = await moduleApiCall.deleteRecord({
  endpoint: "/api/users/",
  id: 123
});

// Bulk create
const created = await moduleApiCall.createGroupRecords({
  endpoint: "/api/users/bulk/",
  body: [
    { name: "User 1", email: "user1@example.com" },
    { name: "User 2", email: "user2@example.com" }
  ]
});
```

**Return Values:**
- `getRecords()` - Returns array (empty on error)
- `getSingleRecord()` - Returns object (null on error)
- `createRecord()` - Returns created object (null on error)
- `editRecord()` - Returns updated object (null on error)
- `deleteRecord()` - Returns `true` on success, `false` on error
- `createGroupRecords()` - Returns created array (empty on error)

---

### 4. autoSearch

Client-side case-insensitive search across all object fields.

**Features:**
- ✅ Searches all fields automatically
- ✅ Case-insensitive matching
- ✅ Works with any data type
- ✅ Type-safe with TypeScript generics

**Usage:**

```typescript
import { autoSearch } from "@settle/core";

const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" }
];

// Search by name
const results = autoSearch(users, "john");
// Returns: [{ id: 1, name: "John Doe", ... }, { id: 3, name: "Bob Johnson", ... }]

// Search by email
const results = autoSearch(users, "jane@");
// Returns: [{ id: 2, name: "Jane Smith", ... }]

// Search by ID (converts to string)
const results = autoSearch(users, "2");
// Returns: [{ id: 2, name: "Jane Smith", ... }]

// No results
const results = autoSearch(users, "nonexistent");
// Returns: []

// Empty search or data
autoSearch([], "test");    // Returns: []
autoSearch(users, "");     // Returns: []
```

**With DataTableWrapper:**

```tsx
import { DataTableWrapper, autoSearch } from "@settle/core";

function SearchableTable() {
  const { data } = DataTableWrapper.useDataTableContext();
  const { search } = DataTableWrapper.useDataTableWrapperStore();

  // DataTableWrapper uses autoSearch internally for client-side filtering
  const filteredData = autoSearch(data, search);

  return <DataTable records={filteredData} />;
}
```

---

## Integration Examples

### Example 1: Complete CRUD with moduleApiCall

```typescript
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/api/products/";

// List products with pagination
export async function getProducts(page = 1, pageSize = 20) {
  return moduleApiCall.getRecords({
    endpoint: ENDPOINT,
    paginationProps: { page, pageSize }
  });
}

// Get single product
export async function getProduct(id: number) {
  return moduleApiCall.getSingleRecord({
    endpoint: ENDPOINT,
    id
  });
}

// Create product
export async function createProduct(data: any) {
  return moduleApiCall.createRecord({
    endpoint: ENDPOINT,
    body: data
  });
}

// Update product
export async function updateProduct(id: number, data: any) {
  return moduleApiCall.editRecord({
    endpoint: ENDPOINT,
    id,
    body: data
  });
}

// Delete product
export async function deleteProduct(id: number) {
  return moduleApiCall.deleteRecord({
    endpoint: ENDPOINT,
    id
  });
}
```

### Example 2: Form Submission with formatJsonSubmit

```typescript
import { formatJsonSubmit, apiDispatch } from "@settle/core";

async function handleFormSubmit(formData: any, originalData: any) {
  // Format data - only submit changed fields, ignore _id
  const formatted = await formatJsonSubmit({
    data: formData,
    keyIgnore: ["_id", "createdAt", "updatedAt"],
    dirtCheckValues: originalData,  // Dirty check
    stringify: ["metadata"]          // Stringify complex objects
  });

  // Submit to API
  const { err, data } = await apiDispatch.patch({
    endpoint: `/api/users/${formData._id}`,
    body: formatted
  });

  return { err, data };
}
```

### Example 3: File Upload with FormData

```typescript
import { formatJsonSubmit, apiDispatch } from "@settle/core";

async function uploadUserProfile(data: any) {
  // Convert to FormData for file upload
  const formData = await formatJsonSubmit({
    data: {
      name: data.name,
      email: data.email,
      avatar: data.avatarFile  // File object
    },
    formatToFormData: true
  });

  const { err, data: response } = await apiDispatch.post({
    endpoint: "/api/users/profile",
    body: formData,
    headers: {
      // Note: Don't set Content-Type for FormData
      // Browser will set it with boundary automatically
    }
  });

  return { err, data: response };
}
```

### Example 4: Search with Auto-refresh

```typescript
import { autoSearch } from "@settle/core";
import { useState, useEffect } from "react";

function LiveSearchTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(data);

  useEffect(() => {
    const results = autoSearch(data, search);
    setFiltered(results);
  }, [data, search]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
      />
      <Table data={filtered} />
    </div>
  );
}
```

---

## Best Practices

### apiDispatch
1. **Always check `err` flag** before using data
2. **Store tokens securely** - Use sessionStorage for SPAs
3. **Implement refresh token rotation** for security
4. **Handle network errors gracefully**
5. **Use proper endpoints** - Ensure trailing slashes match your API

### formatJsonSubmit
1. **Use dirty checking** to minimize payload size
2. **Ignore internal fields** like `_id`, `createdAt`
3. **Stringify nested objects** that the backend expects as strings
4. **Use FormData** for file uploads
5. **Validate data** before formatting

### moduleApiCall
1. **Use type-safe wrappers** for your specific API
2. **Handle errors** - All functions return null/empty on error
3. **Consistent endpoints** - Use trailing slashes consistently
4. **Pagination** - Always include pagination for large datasets

### autoSearch
1. **Use for small datasets** (< 1000 items)
2. **Server-side search** for large datasets
3. **Debounce input** to avoid excessive filtering
4. **Case sensitivity** - autoSearch is always case-insensitive

---

## Error Handling

### apiDispatch Errors

```typescript
const { err, data } = await apiDispatch.get({
  endpoint: "/api/users"
});

if (err) {
  // Handle error
  console.error("Failed to fetch users");
  return;
}

// Use data safely
console.log(data);
```

### moduleApiCall Errors

```typescript
const user = await moduleApiCall.getSingleRecord({
  endpoint: "/api/users/",
  id: 123
});

if (!user) {
  // Handle not found or error
  console.error("User not found");
  return;
}

// Use user safely
console.log(user.name);
```

---

## TypeScript Support

All helpers are fully typed:

```typescript
import {
  apiDispatch,
  formatJsonSubmit,
  moduleApiCall,
  autoSearch
} from "@settle/core";

// Type-safe API call
interface User {
  id: number;
  name: string;
  email: string;
}

const { data } = await apiDispatch.get<User[]>({
  endpoint: "/api/users"
});

// Type-safe search
const users: User[] = [...];
const filtered: User[] = autoSearch(users, "john");

// Type-safe module calls
const user: User | null = await moduleApiCall.getSingleRecord({
  endpoint: "/api/users/",
  id: 123
});
```

---

## Related Documentation

- [FormWrapper](../wrappers/FormWrapper/USAGE.md) - Uses formatJsonSubmit for submissions
- [DataTableWrapper](../wrappers/DataTableWrapper/USAGE.md) - Uses autoSearch for filtering
- [API Reference](/docs/API.md) - Complete API documentation

---

**Need Help?** Check the [Main Documentation](/README.md) or [open an issue](https://github.com/your-org/settle/issues).
