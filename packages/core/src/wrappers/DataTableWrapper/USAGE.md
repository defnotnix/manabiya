# DataTableWrapper Usage Guide

## Overview

`DataTableWrapper` is a powerful data table management wrapper built on top of React Query. It provides:

- **Automatic data fetching** with React Query integration
- **Client-side and server-side pagination** support
- **Search and filtering** capabilities
- **Automatic refetch management** for data updates
- **Context-based data sharing** with child components
- **Flexible data extraction** from API responses
- **Loading and error states** built-in

DataTableWrapper is the recommended choice for displaying lists and tables that need data fetching, pagination, and search functionality.

## Key Features

✅ **Client & Server Pagination** - Support for both client-side and server-side pagination
✅ **React Query Integration** - Built-in data fetching with caching and refetch
✅ **Search Functionality** - Auto-search through data with client or server filtering
✅ **Context API** - Share data, loading states, and refetch function with children
✅ **Flexible Data Extraction** - Extract data from nested API responses
✅ **Zustand Store** - Persistent pagination and search state management
✅ **Type-Safe** - Full TypeScript support with generics
✅ **Test Mode** - Debug mode for development
✅ **Error Handling** - Graceful error handling with empty array fallback

## Basic Usage

### Minimal Example - Client-Side Pagination

```tsx
import { DataTableWrapper } from "@settle/core";
import { DataTable } from "mantine-datatable";

export function UsersList() {
  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={async () => {
        const response = await fetch("/api/users");
        const data = await response.json();
        return data; // Returns array of users
      }}
    >
      <UsersTable />
    </DataTableWrapper>
  );
}

function UsersTable() {
  const { data, isLoading, refetch } = DataTableWrapper.useDataTableContext();
  const { page, pageSize, setPage } =
    DataTableWrapper.useDataTableWrapperStore();

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      <DataTable
        records={data}
        fetching={isLoading}
        page={page}
        onPageChange={setPage}
        recordsPerPage={pageSize}
        columns={[
          { accessor: "id", title: "ID" },
          { accessor: "name", title: "Name" },
          { accessor: "email", title: "Email" },
        ]}
      />
    </div>
  );
}
```

### Server-Side Pagination Example

```tsx
<DataTableWrapper
  queryKey="users.list"
  enableServerQuery={true} // Enable server-side pagination
  queryGetFn={async ({ page, pageSize, search, filters }) => {
    const response = await fetch(
      `/api/users?page=${page}&pageSize=${pageSize}&search=${search}`,
    );
    return response.json();
  }}
  dataKey="results" // Extract data from response.results
  paginationDataKey="pagination" // Extract pagination from response.pagination
>
  <UsersTable />
</DataTableWrapper>
```

### With Search Functionality

```tsx
function UsersTableWithSearch() {
  const { data, isLoading } = DataTableWrapper.useDataTableContext();
  const { search, setSearch } = DataTableWrapper.useDataTableWrapperStore();

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <DataTable
        records={data}
        fetching={isLoading}
        columns={[
          { accessor: "id", title: "ID" },
          { accessor: "name", title: "Name" },
          { accessor: "email", title: "Email" },
        ]}
      />
    </div>
  );
}
```

## Props Reference

### DataTableWrapper Props

| Prop                   | Type        | Required | Default         | Description                                         |
| ---------------------- | ----------- | -------- | --------------- | --------------------------------------------------- |
| `children`             | `ReactNode` | ✅ Yes   | -               | Child components that will consume the data         |
| `testMode`             | `boolean`   | No       | `false`         | Enable debug logging to console                     |
| `queryKey`             | `string`    | ✅ Yes   | `"module.list"` | React Query key (use dot notation: "users.list")    |
| `queryGetFn`           | `function`  | No       | `undefined`     | Async function to fetch data                        |
| `enableServerQuery`    | `boolean`   | No       | `false`         | Enable server-side pagination and filtering         |
| `dataKey`              | `string`    | No       | `undefined`     | Key to extract data from response (e.g., "results") |
| `paginationDataKey`    | `string`    | No       | `undefined`     | Key to extract pagination data from response        |
| `paginationResponseFn` | `function`  | No       | `() => {}`      | Custom function to extract pagination data          |

### queryGetFn Function Signature

**Client-Side Mode:**

```typescript
queryGetFn: () => Promise<T[]>;
```

**Server-Side Mode:**

```typescript
queryGetFn: (params: {
  page: number;
  pageSize: number;
  search: string;
  filters: any;
}) => Promise<any>;
```

## Context and Store API

### useDataTableContext Hook

Access data, loading states, and refetch function:

```typescript
const {
  data, // T[] - Current page data
  isLoading, // boolean - Loading or fetching state
  isError, // boolean - Error state
  refetch, // function - Manually refetch data
} = DataTableWrapper.useDataTableContext();
```

### useDataTableWrapperStore Hook

Access and update pagination and search state:

```typescript
const {
  page, // number - Current page
  pageSize, // number - Items per page
  search, // string - Search query
  filters, // any - Additional filters
  paginationData, // any - Pagination metadata from server

  setPage, // (page: number) => void
  setPageSize, // (size: number) => void
  setSearch, // (search: string) => void
  setFilters, // (filters: any) => void
  setPaginationData, // (data: any) => void
} = DataTableWrapper.useDataTableWrapperStore();
```

## Advanced Examples

### Example 1: Client-Side Pagination with Search

```tsx
import { DataTableWrapper } from "@settle/core";
import { DataTable } from "mantine-datatable";
import { TextInput } from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

export function ProductsList() {
  return (
    <DataTableWrapper<Product>
      queryKey="products.list"
      queryGetFn={async () => {
        const response = await fetch("/api/products");
        return response.json();
      }}
    >
      <ProductsTable />
    </DataTableWrapper>
  );
}

function ProductsTable() {
  const { data, isLoading } = DataTableWrapper.useDataTableContext();
  const { page, pageSize, search, setPage, setPageSize, setSearch } =
    DataTableWrapper.useDataTableWrapperStore();

  return (
    <div>
      <TextInput
        placeholder="Search products..."
        leftSection={<MagnifyingGlassIcon />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb="md"
      />

      <DataTable
        records={data}
        fetching={isLoading}
        page={page}
        onPageChange={setPage}
        recordsPerPage={pageSize}
        recordsPerPageOptions={[10, 20, 50]}
        onRecordsPerPageChange={setPageSize}
        columns={[
          { accessor: "id", title: "ID" },
          { accessor: "name", title: "Product Name" },
          {
            accessor: "price",
            title: "Price",
            render: (item) => `$${item.price}`,
          },
          { accessor: "stock", title: "In Stock" },
        ]}
      />
    </div>
  );
}
```

### Example 2: Server-Side Pagination with Nested Response

```tsx
// API Response Format:
// {
//   results: [...],
//   pagination: {
//     total: 100,
//     currentPage: 1,
//     totalPages: 10
//   }
// }

export function ServerPaginatedList() {
  return (
    <DataTableWrapper<User>
      queryKey="users.list"
      enableServerQuery={true}
      dataKey="results"
      paginationDataKey="pagination"
      queryGetFn={async ({ page, pageSize, search, filters }) => {
        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          search: search || "",
          ...filters,
        });

        const response = await fetch(`/api/users?${params}`);
        return response.json();
      }}
    >
      <UsersList />
    </DataTableWrapper>
  );
}

function UsersList() {
  const { data, isLoading } = DataTableWrapper.useDataTableContext();
  const { paginationData, page, setPage } =
    DataTableWrapper.useDataTableWrapperStore();

  return (
    <div>
      <DataTable
        records={data}
        fetching={isLoading}
        page={page}
        onPageChange={setPage}
        totalRecords={paginationData?.total || 0}
        recordsPerPage={10}
        columns={[
          { accessor: "id", title: "ID" },
          { accessor: "firstName", title: "First Name" },
          { accessor: "lastName", title: "Last Name" },
          { accessor: "email", title: "Email" },
        ]}
      />

      {paginationData && (
        <p>
          Page {paginationData.currentPage} of {paginationData.totalPages}
        </p>
      )}
    </div>
  );
}
```

### Example 3: Custom Pagination Extraction

```tsx
// When pagination data has a custom structure
<DataTableWrapper
  queryKey="orders.list"
  enableServerQuery={true}
  dataKey="results"
  paginationResponseFn={(response) => ({
    total: response.meta.total_items,
    currentPage: response.meta.current,
    totalPages: response.meta.pages,
  })}
  queryGetFn={async ({ page, pageSize }) => {
    const response = await fetch(`/api/orders?page=${page}&limit=${pageSize}`);
    return response.json();
  }}
>
  <OrdersList />
</DataTableWrapper>
```

### Example 4: With Filters

```tsx
function FilteredProductsList() {
  const { refetch } = DataTableWrapper.useDataTableContext();
  const { filters, setFilters } = DataTableWrapper.useDataTableWrapperStore();

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div>
      <select
        value={filters?.category || ""}
        onChange={(e) => handleFilterChange("category", e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={filters?.status || ""}
        onChange={(e) => handleFilterChange("status", e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button onClick={() => refetch()}>Apply Filters</button>

      {/* Table component */}
    </div>
  );
}
```

### Example 5: With Manual Refetch

```tsx
function RefetchableList() {
  const { data, isLoading, refetch } = DataTableWrapper.useDataTableContext();

  useEffect(() => {
    // Auto-refetch every 30 seconds
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div>
      <button onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh Now"}
      </button>

      {/* Table component */}
    </div>
  );
}
```

## Test Mode

Enable test mode to see debug information in the console:

```tsx
<DataTableWrapper
  testMode={true} // Enable debug logging
  queryKey="users.list"
  queryGetFn={async () => {
    const response = await fetch("/api/users");
    return response.json();
  }}
>
  <UsersList />
</DataTableWrapper>
```

Console output will include:

- `DataTableWrapper_Data` - The fetched data after extraction

## Common Patterns

### Pattern 1: Combining with DataTableShell

```tsx
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";

export function UsersPage() {
  return (
    <DataTableWrapper<User>
      queryKey="users.list"
      queryGetFn={async () => {
        const response = await fetch("/api/users");
        return response.json();
      }}
    >
      <DataTableShell
        moduleInfo={{ name: "Users", term: "User" }}
        idAccessor="id"
        columns={[
          { accessor: "firstName", title: "First Name" },
          { accessor: "lastName", title: "Last Name" },
          { accessor: "email", title: "Email" },
        ]}
        onEditClick={(record) => console.log("Edit", record)}
        onDeleteClick={(ids) => console.log("Delete", ids)}
      />
    </DataTableWrapper>
  );
}
```

### Pattern 2: Multiple Tables with Same Data

```tsx
export function Dashboard() {
  return (
    <DataTableWrapper queryKey="users.list" queryGetFn={fetchUsers}>
      <ActiveUsersTable />
      <InactiveUsersTable />
    </DataTableWrapper>
  );
}

function ActiveUsersTable() {
  const { data } = DataTableWrapper.useDataTableContext();
  const activeUsers = data.filter(user => user.status === "active");

  return <DataTable records={activeUsers} columns={...} />;
}

function InactiveUsersTable() {
  const { data } = DataTableWrapper.useDataTableContext();
  const inactiveUsers = data.filter(user => user.status === "inactive");

  return <DataTable records={inactiveUsers} columns={...} />;
}
```

## Error Handling

DataTableWrapper handles errors gracefully:

```tsx
function ErrorHandledTable() {
  const { data, isError } = DataTableWrapper.useDataTableContext();

  if (isError) {
    return <div>Error loading data. Please try again.</div>;
  }

  return <DataTable records={data} columns={...} />;
}
```

## TypeScript Usage

Use generics for type-safe data:

```typescript
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

<DataTableWrapper<User>
  queryKey="users.list"
  queryGetFn={async (): Promise<User[]> => {
    const response = await fetch("/api/users");
    return response.json();
  }}
>
  <UsersList />
</DataTableWrapper>
```

## Best Practices

1. **Use Descriptive Query Keys**: Use dot notation for namespacing (e.g., "users.list", "products.active")
2. **Enable Server Query for Large Datasets**: Use server-side pagination for better performance
3. **Extract Data Correctly**: Use `dataKey` for nested responses to avoid data access issues
4. **Handle Loading States**: Always show loading indicators for better UX
5. **Implement Error Boundaries**: Wrap DataTableWrapper in error boundaries for production
6. **Use TypeScript Generics**: Type your data for better development experience
7. **Memoize Query Functions**: Prevent unnecessary re-renders by memoizing `queryGetFn`

## Comparison with ListHandler

| Feature            | DataTableWrapper | ListHandler (Legacy)                    |
| ------------------ | ---------------- | --------------------------------------- |
| React Query        | ✅ Yes           | ❌ No                                   |
| Auto Caching       | ✅ Yes           | ❌ No                                   |
| Type Safety        | ✅ Generics      | ⚠️ Basic                                |
| Server Pagination  | ✅ Yes           | ❌ No                                   |
| Search             | ✅ Built-in      | ⚠️ Manual                               |
| Context API        | ✅ Yes           | ❌ No                                   |
| **Recommendation** | ✅ Use this      | ⚠️ Legacy - migrate to DataTableWrapper |

## Migration from ListHandler

If you're using the legacy `ListHandler`, migrate to `DataTableWrapper`:

**Before (ListHandler):**

```tsx
const { data, isLoading, refetch } = useListHandler({
  endpoint: "/api/users",
});
```

**After (DataTableWrapper):**

```tsx
<DataTableWrapper
  queryKey="users.list"
  queryGetFn={async () => {
    const response = await fetch("/api/users");
    return response.json();
  }}
>
  <UsersList />
</DataTableWrapper>;

// In child component:
const { data, isLoading, refetch } = DataTableWrapper.useDataTableContext();
```

## Troubleshooting

### Issue: Data not updating after API call

**Solution**: Call `refetch()` after mutations:

```tsx
const { refetch } = DataTableWrapper.useDataTableContext();

const handleCreate = async (data) => {
  await createUser(data);
  refetch(); // Refetch to get updated data
};
```

### Issue: Search not working

**Solution**: Ensure search is enabled and data is an array:

```tsx
// Client-side: Data should be an array
queryGetFn={async () => {
  const res = await fetch("/api/users");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}}

// Server-side: Pass search parameter
queryGetFn={async ({ search }) => {
  const res = await fetch(`/api/users?search=${search}`);
  return res.json();
}}
```

### Issue: Pagination not working with server query

**Solution**: Make sure `enableServerQuery`, `dataKey`, and `paginationDataKey` are set:

```tsx
<DataTableWrapper
  enableServerQuery={true}
  dataKey="results"
  paginationDataKey="pagination"
  queryGetFn={async ({ page, pageSize }) => {
    // Return format: { results: [...], pagination: {...} }
  }}
>
```

## Related Documentation

- [DataTableShell Usage](../../../admin/src/layouts/DataTableShell/USAGE.md) - Pre-built table layout
- [DataTableModalShell Usage](../../../admin/src/layouts/DataTableModalShell/USAGE.md) - Table with modal CRUD
- [FormWrapper Usage](../FormWrapper/USAGE.md) - Form management wrapper
- [React Query Documentation](https://tanstack.com/query/latest) - Underlying query library

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
