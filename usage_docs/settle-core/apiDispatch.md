# apiDispatch Usage

## Overview
`apiDispatch` is a core HTTP client utility from `@settle/core` that provides a type-safe, streamlined API for making HTTP requests. It handles authentication, token refresh, error handling, and automatic retry logic with a clean interface.

## Location
`@settle/core/src/helpers/apiDispatch/apiDispatch.ts`

## Features
- **Type-safe**: Generic response types with proper TypeScript support
- **Auto Token Refresh**: Automatically refreshes expired tokens and retries requests
- **Centralized Headers**: Manages authorization headers consistently
- **Error Handling**: Comprehensive error handling with error messages
- **Network Awareness**: Detects offline state and network errors
- **DRY**: Shared error handling logic across all HTTP methods

## Response Type

All functions return an `ApiResponse<T>` type:

```typescript
interface ApiResponse<T = any> {
  err: boolean;      // True if request failed, false if successful
  data: T | null;    // Response data, null if error
  error?: string;    // Error message if err is true
}
```

## Available Methods

### GET Request

```typescript
const response = await get<UserType>({
  endpoint: "/api/users",
  params: { page: 1, limit: 10 }
});

if (!response.err) {
  console.log(response.data); // UserType[]
} else {
  console.error(response.error);
}
```

**Parameters:**
- `endpoint` (string, required): API endpoint URL
- `params` (object, optional): Query parameters

---

### POST Request

```typescript
const response = await post<UserType>({
  endpoint: "/api/users",
  body: { name: "John", email: "john@example.com" },
});

if (!response.err) {
  console.log(response.data); // UserType
}
```

**Parameters:**
- `endpoint` (string, required): API endpoint URL
- `body` (object, required): Request payload
- `headers` (object, optional): Custom headers
- `noAuthorization` (boolean, optional): Skip auth header (default: false)

---

### PATCH Request

```typescript
const response = await patch<UserType>({
  endpoint: "/api/users/123",
  body: { name: "Jane" },
});

if (!response.err) {
  console.log(response.data); // Updated UserType
}
```

**Parameters:**
- `endpoint` (string, required): API endpoint URL
- `body` (object, required): Request payload
- `headers` (object, optional): Custom headers

---

### DELETE Request

```typescript
const response = await del<void>({
  endpoint: "/api/users/",
  id: "123"
});

if (!response.err) {
  console.log("Deleted successfully");
}
```

**Parameters:**
- `endpoint` (string, required): API endpoint URL (without ID)
- `id` (string, required): Record ID to delete
- `headers` (object, optional): Custom headers

---

### Login Request

```typescript
const response = await login<{ access: string; refresh: string }>({
  endpoint: "/api/auth/login/",
  body: { username: "john", password: "password123" }
});

if (!response.err) {
  const { access, refresh } = response.data!;
  // Tokens are automatically stored in sessionStorage
}
```

**Parameters:**
- `endpoint` (string, required): Login endpoint URL
- `body` (object, required): Credentials payload

---

## Basic Usage Examples

### Simple GET

```typescript
import { get } from "@settle/core/helpers/apiDispatch";

async function fetchUsers() {
  const response = await get({
    endpoint: "/api/users"
  });

  if (response.err) {
    alert(response.error);
    return;
  }

  console.log(response.data);
}
```

### GET with Parameters

```typescript
const response = await get({
  endpoint: "/api/applicants",
  params: {
    page: 1,
    limit: 20,
    status: "pending"
  }
});
```

### Create Record

```typescript
const response = await post({
  endpoint: "/api/applicants/",
  body: {
    fullName: "John Doe",
    email: "john@example.com",
    status: "pending"
  }
});

if (!response.err) {
  router.push(`/applicants/${response.data.id}`);
}
```

### Update Record

```typescript
const response = await patch({
  endpoint: "/api/applicants/123",
  body: {
    status: "approved",
    notes: "All documents received"
  }
});
```

### Delete Record

```typescript
const response = await del({
  endpoint: "/api/applicants/",
  id: "123"
});

if (!response.err) {
  router.push("/applicants");
}
```

---

## Advanced Usage

### With Type Safety

Define your types and use them in requests:

```typescript
interface Applicant {
  id: string;
  fullName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
}

// GET returns Applicant[]
const { data: applicants } = await get<Applicant[]>({
  endpoint: "/api/applicants"
});

// POST returns Applicant
const { data: newApplicant } = await post<Applicant>({
  endpoint: "/api/applicants/",
  body: { fullName: "Jane", email: "jane@example.com", status: "pending" }
});
```

### Error Handling

```typescript
const response = await post({
  endpoint: "/api/applicants/",
  body: applicantData
});

if (response.err) {
  // response.error contains the error message
  if (response.error === "Server is offline") {
    showNotification({
      title: "Network Error",
      message: "Please check your internet connection",
      color: "red"
    });
  } else {
    showNotification({
      title: "Error",
      message: response.error,
      color: "red"
    });
  }
  return;
}

// Success
console.log("Created:", response.data);
```

### Custom Headers

```typescript
const response = await post({
  endpoint: "/api/applicants/",
  body: data,
  headers: {
    "X-Custom-Header": "value"
  }
});
```

### Skip Authorization (for public endpoints)

```typescript
const response = await post({
  endpoint: "/api/auth/register/",
  body: { username, password },
  noAuthorization: true
});
```

---

## Authentication Flow

### Token Storage

Tokens are stored in sessionStorage with these keys:
- `kcatoken`: Access token (JWT)
- `kcrtoken`: Refresh token

### Automatic Token Refresh

When a request returns a "Token Expired" error:
1. The client automatically calls the refresh endpoint: `POST /api/auth/token/refresh/`
2. A new access token is received and stored
3. The original request is automatically retried
4. If refresh fails, user is logged out and redirected to `/login`

### Manual Login

```typescript
async function handleLogin(username: string, password: string) {
  const response = await login({
    endpoint: "/api/auth/login/",
    body: { username, password }
  });

  if (!response.err) {
    // Tokens automatically stored, redirect to dashboard
    router.push("/admin/dashboard");
  } else {
    // Show error message
    alert(response.error);
  }
}
```

### Manual Logout

```typescript
function handleLogout() {
  sessionStorage.removeItem("kcatoken");
  sessionStorage.removeItem("kcrtoken");
  router.push("/login");
}
```

---

## React Integration

### In a Custom Hook

```typescript
import { useState } from "react";
import { get, post } from "@settle/core/helpers/apiDispatch";

export function useApplicants() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);

    const response = await get({
      endpoint: "/api/applicants"
    });

    setLoading(false);

    if (response.err) {
      setError(response.error || "Failed to fetch");
      return null;
    }

    return response.data;
  };

  const createApplicant = async (data: any) => {
    setLoading(true);
    setError(null);

    const response = await post({
      endpoint: "/api/applicants/",
      body: data
    });

    setLoading(false);

    if (response.err) {
      setError(response.error || "Failed to create");
      return null;
    }

    return response.data;
  };

  return {
    fetchApplicants,
    createApplicant,
    loading,
    error
  };
}
```

### In a Component

```typescript
import { post } from "@settle/core/helpers/apiDispatch";
import { useState } from "react";

export function ApplicantForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);

    const response = await post({
      endpoint: "/api/applicants/",
      body: formData
    });

    setLoading(false);

    if (!response.err) {
      alert("Application submitted successfully!");
      // Redirect or refresh data
    } else {
      alert(`Error: ${response.error}`);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* Form fields */}
      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

### With React Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { get, post } from "@settle/core/helpers/apiDispatch";

// Fetch data
const { data, isLoading } = useQuery({
  queryKey: ["applicants"],
  queryFn: async () => {
    const response = await get({ endpoint: "/api/applicants" });
    if (response.err) throw new Error(response.error);
    return response.data;
  }
});

// Mutation
const { mutate: createApplicant } = useMutation({
  mutationFn: async (formData) => {
    const response = await post({
      endpoint: "/api/applicants/",
      body: formData
    });
    if (response.err) throw new Error(response.error);
    return response.data;
  },
  onSuccess: () => {
    // Refetch or redirect
  }
});
```

---

## Common Patterns

### Pattern 1: CRUD API Service

```typescript
// services/applicantApi.ts
import { get, post, patch, del } from "@settle/core/helpers/apiDispatch";

export const APPLICANT_API = {
  list: (params?: any) => get({ endpoint: "/api/applicants", params }),

  get: (id: string) => get({ endpoint: `/api/applicants/${id}` }),

  create: (data: any) => post({
    endpoint: "/api/applicants/",
    body: data
  }),

  update: (id: string, data: any) => patch({
    endpoint: `/api/applicants/${id}`,
    body: data
  }),

  delete: (id: string) => del({
    endpoint: "/api/applicants/",
    id
  })
};
```

### Pattern 2: List with Data Fetching

```typescript
<DataTableWrapper
  queryKey="applicant.list"
  queryGetFn={() => APPLICANT_API.list()}
  dataKey="results"
>
  <DataTableShell
    columns={columns}
    onEditClick={(id) => router.push(`/applicant/${id}/edit`)}
    onDeleteClick={(id) => APPLICANT_API.delete(id)}
  />
</DataTableWrapper>
```

### Pattern 3: Form Submission

```typescript
<FormWrapper
  apiSubmitFn={async (data) => {
    const response = await post({
      endpoint: "/api/applicants/",
      body: data
    });

    if (response.err) {
      throw new Error(response.error);
    }

    return response.data;
  }}
  submitSuccessFn={() => router.push("/applicants")}
>
  <ApplicantForm />
</FormWrapper>
```

---

## Error Scenarios

### Network Error (Offline)
```
response.err = true
response.error = "Server is offline"
```

### Token Expired (Auto-handled)
- Token is automatically refreshed
- Request is retried
- If refresh fails → User is logged out

### Generic Error
```
response.err = true
response.error = "[error message from server or axios]"
```

---

## Best Practices

1. **Always check `err` before accessing `data`**
   ```typescript
   if (response.err) {
     console.error(response.error);
     return;
   }
   console.log(response.data);
   ```

2. **Use type generics for better IDE support**
   ```typescript
   const response = await get<User[]>({ endpoint: "/api/users" });
   // response.data is typed as User[] | null
   ```

3. **Create API service objects for organization**
   ```typescript
   export const API = {
     users: { list: () => get({ ... }) },
     applicants: { create: (data) => post({ ... }) }
   };
   ```

4. **Handle offline scenarios gracefully**
   ```typescript
   if (response.error === "Server is offline") {
     showOfflineNotification();
   }
   ```

5. **Use with FormWrapper for forms**
   ```typescript
   <FormWrapper apiSubmitFn={async (data) => {
     const response = await post({ ... });
     if (response.err) throw new Error(response.error);
     return response.data;
   }} />
   ```

---

## Notes

- All requests automatically include the Bearer token from sessionStorage
- Token refresh is automatic when requests return "Token Expired"
- Use `noAuthorization: true` only for public endpoints (login, register)
- Login stores tokens automatically in sessionStorage
- Network errors are detected and reported with "Server is offline" message
- All exported functions are async and return promises
