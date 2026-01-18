# DataTableShell Usage Guide

## Overview

`DataTableShell` is a complete data table layout with built-in features for displaying and managing tabular data. It provides:
- **Header with module info** and create button
- **Tab navigation** for filtering data views
- **Toolbar with filters** and column visibility controls
- **Data table** with pagination and sorting
- **Row actions** for edit, delete, and review
- **Bulk selection** and batch operations
- **Custom styling** for rows and cells
- **Server-side search** support

DataTableShell is the recommended choice for building full-featured data table pages with all UI components included.

## Key Features

✅ **Complete Layout** - Header, tabs, toolbar, and table in one component
✅ **Tab Navigation** - Filter data with tabbed interface
✅ **Column Controls** - Show/hide columns dynamically
✅ **Row Actions** - Edit, delete, review operations
✅ **Bulk Actions** - Select multiple rows for batch operations
✅ **Custom Styling** - Per-row styling and colors
✅ **Search Integration** - Client and server-side search
✅ **Pagination** - Built-in page size controls
✅ **Filter System** - Advanced filtering capabilities

## Basic Usage

### Minimal Example

```tsx
import { DataTableShell } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";

export function UsersPage() {
  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={async () => {
        const res = await fetch("/api/users");
        return res.json();
      }}
    >
      <DataTableShell
        moduleInfo={{
          name: "Users",
          term: "User",
        }}
        idAccessor="id"
        columns={[
          { accessor: "id", title: "ID" },
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

### With Tabs

```tsx
<DataTableShell
  moduleInfo={{ name: "Users", term: "User" }}
  idAccessor="id"
  columns={columns}
  tabs={[
    {
      label: "All Users",
      leftSection: <UsersIcon size={16} />,
    },
    {
      label: "Active",
      leftSection: <CheckIcon size={16} />,
    },
    {
      label: "Inactive",
      leftSection: <XIcon size={16} />,
    },
  ]}
  onEditClick={handleEdit}
  onDeleteClick={handleDelete}
/>
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| **Core Configuration** |
| `moduleInfo` | `object` | ✅ Yes | - | Module name and term (singular) |
| `idAccessor` | `string` | No | `"id"` | Primary key field name |
| `columns` | `array` | ✅ Yes | - | Column definitions |
| `sustained` | `boolean` | No | `false` | Keep table state on unmount |
| **Navigation & Actions** |
| `tabs` | `array` | No | `[]` | Tab configuration |
| `newButtonHref` | `string` | No | `undefined` | Create button link |
| `onNewClick` | `function` | No | `undefined` | Create button click handler |
| `onEditClick` | `function` | No | `undefined` | Edit row handler |
| `onDeleteClick` | `function` | No | `undefined` | Delete rows handler (bulk) |
| `onReviewClick` | `function` | No | `undefined` | Review row handler |
| **Table Configuration** |
| `tableActions` | `array` | No | `[]` | Custom table action buttons |
| `rowColor` | `string` | No | `"var(--mantine-color-gray-0)"` | Row text color |
| `rowBackgroundColor` | `string` | No | `"var(--mantine-color-gray-0)"` | Row background color |
| `rowStyle` | `function` | No | `undefined` | Custom row styling function |
| `pageSizes` | `number[]` | No | `[10, 20, 50, 100]` | Available page sizes |
| `hasServerSearch` | `boolean` | No | `false` | Enable server-side search |
| `disableActions` | `boolean` | No | `false` | Hide action buttons |
| **Filters** |
| `hideFilters` | `boolean` | No | `false` | Hide filter toolbar |
| `filterList` | `array` | No | `[]` | Filter configurations |
| `forceFilter` | `function` | No | `undefined` | Force filter on data |

### ModuleInfo Type

```typescript
type ModuleInfo = {
  name: string;     // Plural name (e.g., "Users")
  term: string;     // Singular name (e.g., "User")
};
```

### Column Type

```typescript
type Column = {
  accessor: string;           // Data key
  title: string;              // Column header
  width?: number;             // Column width
  sortable?: boolean;         // Enable sorting
  render?: (record) => ReactNode; // Custom cell renderer
  visible?: boolean;          // Initial visibility
};
```

### Tab Type

```typescript
type Tab = {
  label: string;              // Tab label
  leftSection?: ReactNode;    // Icon or element on left
  rightSection?: ReactNode;   // Badge or element on right
};
```

## Column Configuration

### Basic Columns

```tsx
const columns = [
  { accessor: "id", title: "ID", width: 80 },
  { accessor: "name", title: "Name", width: 200 },
  { accessor: "email", title: "Email" },
  { accessor: "role", title: "Role", width: 120 },
  { accessor: "createdAt", title: "Created" },
];
```

### With Custom Rendering

```tsx
const columns = [
  { accessor: "id", title: "ID" },
  { accessor: "name", title: "Name" },
  {
    accessor: "status",
    title: "Status",
    render: (record) => (
      <Badge color={record.status === "active" ? "green" : "gray"}>
        {record.status}
      </Badge>
    ),
  },
  {
    accessor: "email",
    title: "Email",
    render: (record) => (
      <a href={`mailto:${record.email}`}>{record.email}</a>
    ),
  },
  {
    accessor: "createdAt",
    title: "Created",
    render: (record) => new Date(record.createdAt).toLocaleDateString(),
  },
];
```

### With Sortable Columns

```tsx
const columns = [
  { accessor: "id", title: "ID", sortable: true },
  { accessor: "name", title: "Name", sortable: true },
  { accessor: "email", title: "Email", sortable: true },
  { accessor: "createdAt", title: "Created", sortable: true },
];
```

## Row Actions

### Edit and Delete

```tsx
<DataTableShell
  columns={columns}
  onEditClick={(record) => {
    router.push(`/users/${record.id}/edit`);
  }}
  onDeleteClick={async (ids) => {
    await deleteUsers(ids);
    refetch();
  }}
/>
```

### Review/View Action

```tsx
<DataTableShell
  columns={columns}
  onReviewClick={(record) => {
    router.push(`/users/${record.id}`);
  }}
/>
```

### All Actions

```tsx
<DataTableShell
  columns={columns}
  onNewClick={() => router.push("/users/new")}
  onEditClick={(record) => router.push(`/users/${record.id}/edit`)}
  onDeleteClick={handleBulkDelete}
  onReviewClick={(record) => router.push(`/users/${record.id}`)}
/>
```

## Advanced Examples

### Example 1: User Management Table

```tsx
import { DataTableShell } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";
import { Badge, Group, Avatar, Text } from "@mantine/core";
import { UsersIcon, CheckIcon, XIcon } from "@phosphor-icons/react";

export function UsersTable() {
  const router = useRouter();

  const columns = [
    {
      accessor: "avatar",
      title: "",
      width: 60,
      render: (record) => <Avatar src={record.avatar} size="sm" />,
    },
    {
      accessor: "name",
      title: "Name",
      render: (record) => (
        <div>
          <Text size="sm" fw={500}>{record.firstName} {record.lastName}</Text>
          <Text size="xs" c="dimmed">{record.email}</Text>
        </div>
      ),
    },
    {
      accessor: "role",
      title: "Role",
      render: (record) => (
        <Badge variant="light">
          {record.role}
        </Badge>
      ),
    },
    {
      accessor: "status",
      title: "Status",
      render: (record) => (
        <Badge color={record.status === "active" ? "green" : "gray"}>
          {record.status}
        </Badge>
      ),
    },
    {
      accessor: "lastLogin",
      title: "Last Login",
      render: (record) =>
        record.lastLogin
          ? new Date(record.lastLogin).toLocaleDateString()
          : "Never",
    },
  ];

  return (
    <DataTableWrapper queryKey="users.list" queryGetFn={fetchUsers}>
      <DataTableShell
        moduleInfo={{ name: "Users", term: "User" }}
        idAccessor="id"
        columns={columns}
        tabs={[
          {
            label: "All Users",
            leftSection: <UsersIcon size={16} />,
          },
          {
            label: "Active",
            leftSection: <CheckIcon size={16} />,
          },
          {
            label: "Inactive",
            leftSection: <XIcon size={16} />,
          },
        ]}
        onNewClick={() => router.push("/users/new")}
        onEditClick={(record) => router.push(`/users/${record.id}/edit`)}
        onDeleteClick={handleDeleteUsers}
        onReviewClick={(record) => router.push(`/users/${record.id}`)}
      />
    </DataTableWrapper>
  );
}
```

### Example 2: Products with Custom Row Styling

```tsx
export function ProductsTable() {
  const columns = [
    { accessor: "sku", title: "SKU" },
    { accessor: "name", title: "Product Name" },
    { accessor: "price", title: "Price", render: (r) => `$${r.price}` },
    { accessor: "stock", title: "Stock" },
  ];

  return (
    <DataTableWrapper queryKey="products.list" queryGetFn={fetchProducts}>
      <DataTableShell
        moduleInfo={{ name: "Products", term: "Product" }}
        columns={columns}
        rowStyle={(record) => {
          // Highlight low stock items
          if (record.stock < 10) {
            return {
              backgroundColor: "var(--mantine-color-red-0)",
            };
          }
          // Highlight out of stock
          if (record.stock === 0) {
            return {
              backgroundColor: "var(--mantine-color-red-1)",
              opacity: 0.6,
            };
          }
          return {};
        }}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />
    </DataTableWrapper>
  );
}
```

### Example 3: Server-Side Search and Pagination

```tsx
export function OrdersTable() {
  return (
    <DataTableWrapper
      queryKey="orders.list"
      enableServerQuery={true}  // Enable server-side mode
      dataKey="results"
      paginationDataKey="pagination"
      queryGetFn={async ({ page, pageSize, search }) => {
        const res = await fetch(
          `/api/orders?page=${page}&pageSize=${pageSize}&search=${search}`
        );
        return res.json();
      }}
    >
      <DataTableShell
        moduleInfo={{ name: "Orders", term: "Order" }}
        idAccessor="orderId"
        hasServerSearch={true}  // Enable server search
        columns={[
          { accessor: "orderId", title: "Order ID" },
          { accessor: "customer", title: "Customer" },
          { accessor: "total", title: "Total" },
          { accessor: "status", title: "Status" },
        ]}
        onReviewClick={(record) => router.push(`/orders/${record.orderId}`)}
      />
    </DataTableWrapper>
  );
}
```

### Example 4: With Custom Page Sizes

```tsx
<DataTableShell
  moduleInfo={{ name: "Transactions", term: "Transaction" }}
  columns={columns}
  pageSizes={[25, 50, 100, 250]}  // Custom page size options
  onEditClick={handleEdit}
/>
```

### Example 5: With Filters

```tsx
const filterList = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "pending", label: "Pending" },
    ],
  },
  {
    key: "role",
    label: "Role",
    options: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
      { value: "guest", label: "Guest" },
    ],
  },
];

<DataTableShell
  moduleInfo={{ name: "Users", term: "User" }}
  columns={columns}
  filterList={filterList}
  hideFilters={false}  // Show filter toolbar
  onEditClick={handleEdit}
/>
```

## Tab Filtering

### Tab-Based Data Filtering

```tsx
function UsersWithTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { data } = DataTableWrapper.useDataTableContext();

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (activeTab === 0) return data; // All users
    if (activeTab === 1) return data.filter(u => u.status === "active");
    if (activeTab === 2) return data.filter(u => u.status === "inactive");
    return data;
  }, [data, activeTab]);

  return (
    <DataTableShell
      columns={columns}
      tabs={[
        { label: "All" },
        { label: "Active" },
        { label: "Inactive" },
      ]}
      forceFilter={() => filteredData}  // Use filtered data
      onEditClick={handleEdit}
    />
  );
}
```

## Custom Row Styling

### Conditional Row Colors

```tsx
<DataTableShell
  columns={columns}
  rowStyle={(record) => {
    if (record.isPriority) {
      return { backgroundColor: "var(--mantine-color-yellow-0)" };
    }
    if (record.isCompleted) {
      return { backgroundColor: "var(--mantine-color-green-0)" };
    }
    return {};
  }}
/>
```

### Row Hover Effects

```tsx
<DataTableShell
  columns={columns}
  rowStyle={(record, index) => ({
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--mantine-color-blue-0)",
    },
  })}
  onEditClick={handleEdit}
/>
```

## Integration with DataTableWrapper

DataTableShell **must** be used inside DataTableWrapper:

```tsx
// ✅ Good
<DataTableWrapper queryKey="users.list" queryGetFn={fetchUsers}>
  <DataTableShell columns={columns} />
</DataTableWrapper>

// ❌ Bad - Will not work
<DataTableShell columns={columns} />
```

## TypeScript Usage

```typescript
import { DataTableShell } from "@settle/admin";
import type { DataTableColumn } from "mantine-datatable";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
}

const columns: DataTableColumn<User>[] = [
  { accessor: "id", title: "ID" },
  { accessor: "firstName", title: "First Name" },
  { accessor: "lastName", title: "Last Name" },
  { accessor: "email", title: "Email" },
];

// Type-safe handlers
const handleEdit = (record: User) => {
  console.log("Editing user:", record.id);
};

const handleDelete = (ids: number[]) => {
  console.log("Deleting users:", ids);
};
```

## Best Practices

1. **Use DataTableWrapper**: Always wrap in DataTableWrapper for data fetching
2. **Define Column Widths**: Set widths for better table layout
3. **Custom Renderers**: Use `render` for badges, links, formatted dates
4. **Type Your Data**: Use TypeScript interfaces for type safety
5. **Server-Side for Large Data**: Enable server search/pagination for 1000+ records
6. **Meaningful Tabs**: Use tabs for common filters (status, category, etc.)
7. **Consistent Actions**: Provide edit and delete handlers
8. **Row Styling**: Use sparingly for highlighting important rows

## Troubleshooting

### Issue: Table not showing data

**Solution**: Ensure DataTableWrapper is providing data:

```tsx
const { data } = DataTableWrapper.useDataTableContext();
console.log("Data:", data);  // Check if data is loaded
```

### Issue: Actions not working

**Solution**: Provide callback functions:

```tsx
<DataTableShell
  onEditClick={(record) => console.log(record)}  // Must provide handler
  onDeleteClick={(ids) => console.log(ids)}
/>
```

### Issue: Columns not visible

**Solution**: Check column visibility toggle in toolbar, or reset columns.

### Issue: Search not working

**Solution**: For client-side, ensure data is an array. For server-side, set `hasServerSearch={true}` and `enableServerQuery={true}` in DataTableWrapper.

### Issue: Pagination not working

**Solution**: Check if `pageSizes` prop is provided and DataTableWrapper is configured correctly.

## Related Documentation

- [DataTableWrapper Usage](../../../../core/src/wrappers/DataTableWrapper/USAGE.md) - Data fetching wrapper
- [DataTableModalShell Usage](../DataTableModalShell/USAGE.md) - Table with modal CRUD
- [Tabs Usage](../../components/Tabs/USAGE.md) - Tab component
- [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/) - Underlying table library

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
