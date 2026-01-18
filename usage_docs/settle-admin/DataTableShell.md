# DataTableShell Usage

## Overview
`DataTableShell` is a layout component from `@settle/admin` that provides the complete UI shell for a data table list page. It includes header, filters, toolbar, pagination, and row actions.

## Location
`@settle/admin/src/layouts/DataTableShell/`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `moduleInfo` | `object` | Required | Module configuration with name, description, etc. |
| `columns` | `MRT_ColumnDef[]` | Required | Column definitions for mantine-react-table |
| `idAccessor` | `string` | `"id"` | Property name used as unique identifier for rows |
| `newButtonHref` | `string` | - | URL for creating new records |
| `onNewClick` | `function` | - | Callback when new button is clicked |
| `onEditClick` | `function` | - | Callback when edit action is triggered |
| `onDeleteClick` | `function` | - | Callback when delete action is triggered |
| `onReviewClick` | `function` | - | Callback when review/view action is triggered |
| `tabs` | `array` | `[]` | Tab configuration array |
| `tableActions` | `array` | `[]` | Custom row action buttons |
| `pageSizes` | `array` | `[10, 20, 50, 100]` | Page size options |
| `disableActions` | `boolean` | `false` | Disable row action buttons |
| `hideFilters` | `boolean` | - | Hide filter toolbar |
| `filterList` | `array` | `[]` | Filter configuration |
| `forceFilter` | `object` | - | Force apply specific filters |
| `hasServerSearch` | `boolean` | `false` | Enable server-side search |
| `sustained` | `boolean` | `false` | Maintain selected records across pages |
| `rowColor` | `string` | `"var(--mantine-color-gray-0)"` | Row text color |
| `rowBackgroundColor` | `string` | `"var(--mantine-color-gray-0)"` | Row background color |
| `rowStyle` | `CSSProperties` | - | Custom row styles |

## Basic Usage

```tsx
import { DataTableShell } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";

<DataTableWrapper
  queryKey="applicant.list"
  queryGetFn={() => APPLICANT_API.getApplicants()}
  dataKey="data"
>
  <DataTableShell
    moduleInfo={{
      name: "Applicant",
      label: "Applicants",
      description: "Manage applicants",
    }}
    columns={columns}
    idAccessor="id"
    newButtonHref="/admin/applicant/new"
    onEditClick={(id) => router.push(`/admin/applicant/${id}/edit`)}
    onReviewClick={(id) => router.push(`/admin/applicant/${id}`)}
    onDeleteClick={(id) => API.deleteApplicant(id)}
  />
</DataTableWrapper>
```

## Column Definition

Define columns using the following format:

### Column Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `accessor` | `string` | Yes | The data field key to access from records |
| `header` | `string` | Yes | The column header label to display |
| `size` | `number` | No | Column width in pixels |
| `render` | `function` | No | Custom render function: `(row, index) => ReactNode` |

### Basic Column Definition

```tsx
// Create a separate file: pages/list/list.columns.tsx
export const applicantListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 100,
  },
  {
    accessor: "fullName",
    header: "Full Name",
    size: 200,
  },
  {
    accessor: "email",
    header: "Email",
    size: 200,
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
  },
];
```

### With Custom Rendering

```tsx
import { Badge } from "@mantine/core";

export const applicantListColumns = [
  {
    accessor: "id",
    header: "ID",
    size: 100,
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
    render: (row: any) => <Badge>{row.status}</Badge>,
  },
  {
    accessor: "createdAt",
    header: "Created At",
    size: 150,
    render: (row: any) => new Date(row.createdAt).toLocaleDateString(),
  },
];
```

### Using Columns in Page

```tsx
import { applicantListColumns } from "./list.columns";

<DataTableShell
  moduleInfo={APPLICANT_MODULE_CONFIG}
  columns={applicantListColumns}
  idAccessor="id"
  // ... other props
/>
```

## Row Actions

### Default Actions
The shell automatically provides Edit, Delete, and Review buttons based on callbacks:

```tsx
<DataTableShell
  onEditClick={(id) => {
    router.push(`/admin/applicant/${id}/edit`);
  }}
  onDeleteClick={async (id) => {
    await API.deleteApplicant(id);
  }}
  onReviewClick={(id) => {
    router.push(`/admin/applicant/${id}`);
  }}
/>
```

### Custom Actions
Add custom row actions:

```tsx
<DataTableShell
  tableActions={[
    {
      label: "Export",
      action: (id) => exportApplicant(id),
      icon: "FileDownload",
    },
    {
      label: "Send Email",
      action: (id) => sendEmail(id),
      icon: "Mail",
    },
  ]}
/>
```

## Filters & Search

### Hide Filters
```tsx
<DataTableShell
  hideFilters={true}
/>
```

### Define Filter Options
```tsx
<DataTableShell
  filterList={[
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
      ],
    },
    {
      key: "email",
      label: "Email",
      type: "text",
    },
  ]}
/>
```

### Force Apply Filters
```tsx
<DataTableShell
  forceFilter={{
    status: "approved",
    createdAt: { from: "2024-01-01", to: "2024-12-31" },
  }}
/>
```

## Tabs

Add multiple tabs to the list:

```tsx
<DataTableShell
  tabs={[
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
  ]}
/>
```

## Pagination

Customize page size options:

```tsx
<DataTableShell
  pageSizes={[5, 10, 25, 50]}
/>
```

## Row Styling

Apply custom styles to rows:

```tsx
<DataTableShell
  rowBackgroundColor="var(--mantine-color-blue-0)"
  rowStyle={{
    padding: "12px",
    fontSize: "14px",
  }}
/>
```

## Selection Management

Track selected records:

```tsx
const { selectedRecords } = DataTableShell.useContext();
// selectedRecords contains IDs of selected rows
```

## Common Patterns

### Pattern 1: Simple Read-Only List
```tsx
<DataTableShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  hideFilters={true}
  disableActions={true}
/>
```

### Pattern 2: Full CRUD Operations
```tsx
<DataTableShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  newButtonHref="/admin/applicant/new"
  onEditClick={(id) => router.push(`/admin/applicant/${id}/edit`)}
  onDeleteClick={(id) => API.delete(id)}
  onReviewClick={(id) => router.push(`/admin/applicant/${id}`)}
/>
```

### Pattern 3: With Server-Side Search
```tsx
<DataTableShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  hasServerSearch={true}
  filterList={filters}
/>
```

## Context Usage

Access shell context:

```tsx
import { useContext } from "react";
import { Context as DataTableShellContext } from "@settle/admin";

const { selectedRecords, setSelectedRecords } = useContext(DataTableShellContext);
```

## Notes

- Always wrap with `DataTableWrapper` for data management
- `moduleInfo` should contain name, label, and description
- **Column Format**: Use `accessor` (not `accessorKey`) to match data property names
- **Column Headers**: Use `header` (or `label`) for the display label
- **Custom Rendering**: Use `render` function for custom cell content: `(row, index) => JSX`
- Store column definitions in separate `list.columns.tsx` files for better organization
- Ensure all records have the field specified by `idAccessor` for proper row identification
- Row actions are automatically placed in the last column
- Selected records are maintained per context provider
