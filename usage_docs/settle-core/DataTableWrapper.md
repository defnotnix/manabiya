# DataTableWrapper Usage

## Overview
`DataTableWrapper` is a core wrapper component from `@settle/core` that manages data fetching, pagination, searching, and filtering for data tables. It wraps your table content with context and store management.

## Location
`@settle/core/src/wrappers/DataTableWrapper/`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testMode` | `boolean` | `false` | Enable console logging for debugging |
| `children` | `ReactNode` | Required | Child components that consume the data table context |
| `queryKey` | `string` | `"module.list"` | Unique key for React Query caching |
| `queryGetFn` | `async function` | Required | Function that fetches data from your API |
| `enableServerQuery` | `boolean` | `false` | When true, pagination/search is handled by server |
| `dataKey` | `string` | - | Path to extract data array from response (e.g., `"data"` or `"results"`) |
| `paginationDataKey` | `string` | - | Path to extract pagination info from response |
| `paginationResponseFn` | `function` | `() => {}` | Custom function to extract pagination data from response |

## Basic Usage

```tsx
import { DataTableWrapper } from "@settle/core";

<DataTableWrapper
  queryKey="applicant.list"
  queryGetFn={async () => {
    const response = await APPLICANT_API.getApplicants();
    return {
      data: response?.data || [],
    };
  }}
  dataKey="data"
>
  {/* Your DataTableShell or custom table component */}
</DataTableWrapper>
```

## Key Features

### 1. **Client-Side Pagination & Search**
By default, DataTableWrapper handles pagination and search client-side using the store:

```tsx
<DataTableWrapper
  queryKey="applicant.list"
  queryGetFn={async () => {
    return await APPLICANT_API.getApplicants();
  }}
>
  {/* Pagination and search handled automatically */}
</DataTableWrapper>
```

### 2. **Server-Side Pagination & Search**
Enable server-side handling:

```tsx
<DataTableWrapper
  queryKey="applicant.list"
  enableServerQuery={true}
  queryGetFn={async (params) => {
    // params includes: page, pageSize, search, filters
    return await APPLICANT_API.getApplicants(params);
  }}
  dataKey="data"
  paginationDataKey="pagination"
>
  {/* Server handles pagination */}
</DataTableWrapper>
```

### 3. **Custom Pagination Response**
Use a function to extract pagination data:

```tsx
<DataTableWrapper
  queryKey="applicant.list"
  enableServerQuery={true}
  queryGetFn={async (params) => {
    return await API.getApplicants(params);
  }}
  dataKey="data"
  paginationResponseFn={(response) => ({
    total: response.total,
    hasMore: response.hasMore,
  })}
>
  {/* Custom pagination extraction */}
</DataTableWrapper>
```

## Store & Context Usage

Access pagination and search state:

```tsx
const { page, pageSize, search, filters, setPaginationData } =
  DataTableWrapper.useDataTableWrapperStore();

const { data, isLoading, isError, refetch } =
  DataTableWrapper.useDataTableContext();
```

## Testing Mode

Enable debug logging:

```tsx
<DataTableWrapper
  testMode={true}
  queryKey="applicant.list"
  queryGetFn={...}
  dataKey="data"
>
  {/* Logs: DataTableWrapper_Data, pagination info */}
</DataTableWrapper>
```

## Common Patterns

### Pattern 1: Simple List with Client-Side Search
```tsx
<DataTableWrapper
  queryKey="applicant.list"
  queryGetFn={() => APPLICANT_API.getApplicants()}
  dataKey="data"
>
  <DataTableShell columns={columns} />
</DataTableWrapper>
```

### Pattern 2: Server-Side Paginated List
```tsx
<DataTableWrapper
  queryKey="applicant.list"
  enableServerQuery={true}
  queryGetFn={(params) => APPLICANT_API.getApplicants(params)}
  dataKey="data"
  paginationDataKey="pagination"
>
  <DataTableShell columns={columns} />
</DataTableWrapper>
```

## Error Handling

The wrapper automatically catches errors and provides `isError` status:

```tsx
const { data, isLoading, isError, refetch } =
  DataTableWrapper.useDataTableContext();

if (isError) {
  return <ErrorState onRetry={refetch} />;
}
```

## Notes

- Data must be an array; non-arrays are logged as warnings
- Query key is automatically split by "." for nested React Query keys
- Use `testMode` to debug data transformations
- Server-side mode is recommended for large datasets
