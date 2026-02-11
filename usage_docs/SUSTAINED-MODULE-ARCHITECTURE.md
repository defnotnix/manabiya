# Sustained Module Architecture

## Overview

A "sustained module" is a specialized module pattern where all CRUD operations are handled within a single page using modals and inline forms. Unlike the structured module which has separate pages for new/edit/view, the sustained module keeps everything contained on one list page.

**Key Characteristics:**

- Single page (List page)
- Modal-based forms for create/edit
- Inline delete confirmations
- Auto-refresh after operations
- Simplified routing (no /new, /edit routes)

## When to Use Sustained Module vs Structured Module

**Use Sustained Module when:**

- CRUD operations are simple and quick
- You want a cleaner, more compact UI
- Users frequently create/edit items without needing detail pages
- Form complexity is low-to-medium
- All data fits well in a table view

**Use Structured Module when:**

- Complex workflows with multiple pages
- Detailed view pages are important
- Form complexity is high (multi-step forms)
- Need separate routes for SEO/bookmarking
- Detail view has many related components

## Folder Structure

```
apps/admin-test/
├── modules/
│   └── admin/
│       └── [module-name]/
│           ├── index.ts                 # Module exports
│           ├── module.config.ts         # Configuration & constants
│           ├── module.api.ts            # API calls & endpoints
│           ├── pages/
│           │   └── list/
│           │       ├── page.tsx         # Single list page with modals
│           │       └── list.column.tsx  # Column definitions (REQUIRED)
│           └── form/
│               └── [ModuleName]Form.tsx # Reusable form component
└── app/
    └── admin/
        └── [module-name]/
            └── page.tsx                 # Routing page (thin wrapper)
```

> **IMPORTANT: File Organization Rules**
>
> 1. **Pages MUST be in their specific folders** - Each page type (list, new, edit, view) must have its own folder under `pages/`
> 2. **Columns MUST be stored separately** - Column definitions must be in a separate file named `list.column.tsx`, NOT inline in the page component
>
> This separation ensures:
> - Clean, maintainable code
> - Reusable column definitions
> - Smaller page components
> - Easier testing and modifications

### Key Differences from Structured Module

| Aspect         | Sustained           | Structured                 |
| -------------- | ------------------- | -------------------------- |
| Pages          | 1 (list only)       | 4+ (list, new, edit, view) |
| Forms          | Modal-based         | Page-based                 |
| Routing        | Simple              | Complex with sub-routes    |
| Form Placement | DataTableModalShell | FormShell with FormWrapper |
| Delete         | Confirmation modal  | API call with redirect     |

## File Descriptions

### `module.config.ts` - Configuration

Contains module metadata exported with API. Structure is identical to structured modules:

```typescript
import { AGENDA_API } from "./module.api";

export const AGENDA_MODULE_CONFIG = {
  name: "Agenda",
  label: "Agendas",
  description: "Manage agendas and community discussions",
  term: "Agenda",
  pluralName: "agendas",
  singularName: "agenda",
  icon: "ClipboardList",
};

export { AGENDA_API };
```

**Key Fields:**

- `name`: Singular module name
- `label`: Plural display label
- `term`: Used in modal titles ("New {term}")
- `description`: Module description
- `pluralName`: Plural form for consistency
- `singularName`: Singular form for consistency
- `icon`: Optional icon identifier

### `module.api.ts` - API Layer

All API endpoints using `moduleApiCall`. Same pattern as structured modules:

```typescript
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/agendas";

export const AGENDA_API = {
  // Return response directly - let dataKey handle extraction
  getAgendas: async (params?: any) => {
    return await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
  },

  createAgenda: async (data: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
    return { data: result };
  },

  updateAgenda: async (id: string, data: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
    return { data: result };
  },

  deleteAgenda: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },
};
```

> **Note:** For `getAgendas`, return the response directly without wrapping. The `dataKey` prop in `DataTableWrapper` will handle extracting the correct data array from the response.

### `pages/list/list.column.tsx` - Column Definitions (REQUIRED)

> **IMPORTANT:** Column definitions MUST be in a separate file. Never define columns inline in page.tsx.

```typescript
import { Badge } from "@mantine/core";

export const columns = [
  {
    accessor: "id",
    header: "ID",
    size: 80,
  },
  {
    accessor: "title",
    header: "Title",
    size: 250,
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
    render: (row: any) => (
      <Badge color={row.status === "active" ? "green" : "gray"}>
        {row.status}
      </Badge>
    ),
  },
];
```

### `pages/list/page.tsx` - Single List Page

The only page in a sustained module. Uses `DataTableModalShell` which combines:

- DataTable display
- Modal forms for create/edit
- Confirmation for delete
- Auto-refresh after operations

```typescript
"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { AGENDA_MODULE_CONFIG, AGENDA_API } from "../../module.config";
import { AgendaForm } from "../../form/AgendaForm";
import { columns } from "./list.column"; // Import columns from separate file

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="agenda.list"
      queryGetFn={AGENDA_API.getAgendas}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={AGENDA_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}

        // Modal API handlers
        onCreateApi={async (data) => {
          const response = await AGENDA_API.createAgenda(data);
          return response.data;
        }}
        onEditApi={async (id, data) => {
          const response = await AGENDA_API.updateAgenda(String(id), data);
          return response.data;
        }}
        onDeleteApi={async (id) => {
          await AGENDA_API.deleteAgenda(String(id));
        }}

        // Form components
        createFormComponent={<AgendaForm />}
        editFormComponent={<AgendaForm />}

        // Modal configuration
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
```

**Key Points:**

- Wrapped in `DataTableWrapper` for data management
- Uses `DataTableModalShell` for modal-based CRUD
- `onCreateApi`, `onEditApi`, `onDeleteApi` handle API calls
- `createFormComponent` and `editFormComponent` render form modals
- Auto-refetch after successful operations

### `form/[ModuleName]Form.tsx` - Reusable Form

Same as structured modules - used in both create and edit modals:

```typescript
"use client";

import { TextInput, Textarea, Select, Stack } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function AgendaForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <Stack gap="md">
        <TextInput
          label="Title"
          {...form.getInputProps("title")}
          required
        />
        <Textarea
          label="Description"
          {...form.getInputProps("description")}
          required
        />
        {/* More fields */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </Stack>
    </form>
  );
}
```

**Key Differences from Structured:**

- No FormShell wrapper (modals handle layout)
- Form used for both create and edit (passed to `DataTableModalShell`)
- Form is inside Modal, not on a separate page

### `index.ts` - Module Exports

Simple exports for clean imports:

```typescript
export { ListPage } from "./pages/list/page";
export { AgendaForm } from "./form/AgendaForm";
export { AGENDA_MODULE_CONFIG, AGENDA_API } from "./module.config";
```

### `app/admin/[module]/page.tsx` - Routing Page

Thin wrapper that imports and exports the ListPage:

```typescript
import { ListPage } from "@/modules/admin/agenda";

export default ListPage;
```

## DataTableModalShell Usage

### Overview

`DataTableModalShell` is the core component for sustained modules. It combines a data table with built-in modal forms and delete confirmations.

### Props

| Prop                  | Type             | Description                                        |
| --------------------- | ---------------- | -------------------------------------------------- |
| `moduleInfo`          | `object`         | Module configuration with name, label, description |
| `columns`             | `array`          | Column definitions for the table                   |
| `idAccessor`          | `string`         | Property name used as unique identifier            |
| `filterList`          | `array`          | Filter configuration options                       |
| `onCreateApi`         | `function`       | API call function: `(data) => Promise<result>`     |
| `onEditApi`           | `function`       | API call function: `(id, data) => Promise<result>` |
| `onDeleteApi`         | `function`       | API call function: `(id) => Promise<void>`         |
| `createFormComponent` | `ReactNode`      | Form component for create modal                    |
| `editFormComponent`   | `ReactNode`      | Form component for edit modal                      |
| `onCreateSuccess`     | `function`       | Callback after successful create                   |
| `onEditSuccess`       | `function`       | Callback after successful edit                     |
| `onDeleteSuccess`     | `function`       | Callback after successful delete                   |
| `modalWidth`          | `string\|number` | Modal width (default: "md")                        |
| `hasReviewPage`       | `boolean`        | Enable review button (default: false)              |
| `onReviewClick`       | `function`       | Handler for review button                          |

### Basic Implementation

```tsx
<DataTableWrapper
  queryKey="agenda.list"
  queryGetFn={async () => {
    const response = await AGENDA_API.getAgendas();
    return { data: response?.data || [] };
  }}
  dataKey="results"
>
  <DataTableModalShell
    // Required
    moduleInfo={AGENDA_MODULE_CONFIG}
    columns={columns}
    idAccessor="id"
    // API handlers
    onCreateApi={async (data) => {
      const response = await AGENDA_API.createAgenda(data);
      return response.data;
    }}
    onEditApi={async (id, data) => {
      const response = await AGENDA_API.updateAgenda(String(id), data);
      return response.data;
    }}
    onDeleteApi={async (id) => {
      await AGENDA_API.deleteAgenda(String(id));
    }}
    // Forms
    createFormComponent={<AgendaForm />}
    editFormComponent={<AgendaForm />}
    // Customization
    modalWidth="lg"
    filterList={[]}
  />
</DataTableWrapper>
```

### Modal Form Behavior

**Create Modal:**

- Opens when user clicks "New" button
- Shows title: "NEW {TERM}"
- Calls `onCreateApi` on submit
- Closes and refetches on success

**Edit Modal:**

- Opens when user clicks row or edit action
- Shows title: "EDIT {TERM}"
- Pre-populates with row data
- Calls `onEditApi` on submit
- Closes and refetches on success

**Delete Confirmation:**

- Shows confirmation modal
- Calls `onDeleteApi` on confirm
- Auto-refetches on success

### Column Definitions

Define columns as plain objects (not MRT_ColumnDef):

```typescript
const columns = [
  {
    accessor: "title",
    header: "Title",
    size: 250,
  },
  {
    accessor: "status",
    header: "Status",
    size: 120,
    render: (row: any) => (
      <Badge>{row.status}</Badge>
    ),
  },
  {
    accessor: "created_at",
    header: "Created",
    size: 150,
    render: (row: any) => new Date(row.created_at).toLocaleDateString(),
  },
];
```

**Column Properties:**

- `accessor`: Data field to display
- `header`: Column header label
- `size`: Column width in pixels
- `render`: Custom render function `(row, index) => ReactNode`

## Data Flow

### List Page Flow

```
ListPage
  ↓
DataTableWrapper (fetches and manages data)
  ↓
DataTableModalShell (renders table + modals)
  ↓
Table displays with action buttons (New, Edit, Delete)
```

### Create Flow

```
User clicks "New" button
  ↓
onCreateApi modal opens
  ↓
AgendaForm renders inside modal
  ↓
User submits form
  ↓
FormWrapper calls onCreateApi
  ↓
Success: Close modal → Auto-refetch table
```

### Edit Flow

```
User clicks row/Edit button
  ↓
Edit modal opens with pre-filled data
  ↓
AgendaForm renders inside modal
  ↓
User submits form
  ↓
FormWrapper calls onEditApi with ID and data
  ↓
Success: Close modal → Auto-refetch table
```

### Delete Flow

```
User clicks Delete button
  ↓
Confirmation modal shows
  ↓
User confirms
  ↓
onDeleteApi called
  ↓
Success: Auto-refetch table
```

## Implementation Checklist

Before implementing a sustained module, ensure you have:

- [ ] **module.config.ts** - Module metadata and API re-export
- [ ] **module.api.ts** - All CRUD endpoints
- [ ] **pages/list/page.tsx** - List page with DataTableModalShell
- [ ] **pages/list/list.column.tsx** - Column definitions (REQUIRED - never inline)
- [ ] **form/[ModuleName]Form.tsx** - Reusable form component
- [ ] **index.ts** - Module exports
- [ ] **app/admin/[module]/page.tsx** - Routing page (thin wrapper)
- [ ] **Navigation Setup** - Add menu item to nav config

## Navigation Setup

After creating the module, add it to the navigation menu so users can access it:

### Add to Navigation Config

**File:** `apps/admin-test/config/nav/navs/main-nav.tsx`

```typescript
import {
  ChartDonutIcon,
  ClipboardIcon,
  // ... other icons
} from "@phosphor-icons/react";

export const navItems: PropAdminNavItems[] = [
  {
    label: "Home",
    icon: ChartDonutIcon,
    value: "/home",
    roles: ["admin"],
  },
  {
    label: "Agendas",
    icon: ClipboardIcon,
    value: "/agenda",
    roles: ["admin"],
  },
  // ... other menu items
];
```

**Key Points:**

- Import an appropriate icon from `@phosphor-icons/react`
- `label`: Display name in navigation
- `value`: Route path (e.g., `/agenda`)
- `roles`: User roles that can access this menu (e.g., `["admin"]`)

### Icon Selection

Choose from available Phosphor Icons:

- `ClipboardIcon` - For agendas, tasks, lists
- `FileTextIcon` - For documents, proposals
- `CheckCircleIcon` - For approvals, workflows
- `UsersIcon` - For people, teams
- `BuildingIcon` - For organizations
- `ShoppingBagIcon` - For commerce modules
- `GearIcon` - For settings

See [Phosphor Icons](https://phosphoricons.com/) for full list.

## Best Practices

### 1. Form Component Design

Keep forms simple and reusable for both create and edit:

```typescript
export function AgendaForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  // Form logic here - works for both create and edit
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      {/* Fields */}
    </form>
  );
}
```

### 2. API Handler Design

Ensure API handlers return proper responses:

```typescript
onCreateApi={async (data) => {
  // Transform if needed
  const response = await AGENDA_API.createAgenda(data);
  // Return the created item
  return response.data;
}}
```

### 3. Custom Rendering in Columns

Use render functions for formatted display:

```typescript
{
  accessor: "status",
  header: "Status",
  render: (row: any) => {
    const colorMap = { pending: "yellow", approved: "green", rejected: "red" };
    return <Badge color={colorMap[row.status]}>{row.status}</Badge>;
  }
}
```

### 4. Error Handling

Modal forms automatically handle errors via FormWrapper notifications. API errors are caught and displayed.

### 5. Auto-Refresh

DataTableModalShell automatically refetches data after successful create/edit/delete. No manual refresh needed.

### 6. Modal Width

Set appropriate modal width based on form complexity:

```typescript
modalWidth = "sm"; // Small forms
modalWidth = "md"; // Default (medium)
modalWidth = "lg"; // Complex forms
modalWidth = "xl"; // Very complex forms
```

## Comparison: Sustained vs Structured

### Sustained Module Structure

```
agenda/
├── module.config.ts
├── module.api.ts
├── form/
│   └── AgendaForm.tsx
├── pages/
│   └── list/
│       ├── page.tsx
│       └── list.column.tsx  # REQUIRED: Column definitions
└── index.ts
```

### Structured Module Structure

```
applicant/
├── module.config.ts
├── module.api.ts
├── form/
│   └── ApplicantForm.tsx
├── pages/
│   ├── list/
│   │   └── page.tsx
│   ├── new/
│   │   └── page.tsx
│   ├── edit/
│   │   └── page.tsx
│   └── view/
│       └── page.tsx
└── index.ts
```

**Key Differences:**

- Sustained: 1 page → Modal-based forms
- Structured: 4+ pages → Page-based forms
- Sustained: Simpler, more compact
- Structured: More flexibility, better for complex workflows

## Row Expansion for Nested Data

When your sustained module needs to display hierarchical data (e.g., Parent > Children relationships), use the `rowExpansion` prop.

### When to Use Row Expansion

- Displaying parent-child relationships (Company > Departments > Employees)
- Showing related records without navigating to a new page
- Hierarchical data that needs drill-down capability

### Implementation Pattern

```tsx
// pages/list/page.tsx
"use client";

import { useState } from "react";
import { DataTable } from "mantine-datatable";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { MODULE_CONFIG, MODULE_API } from "../../module.config";
import { columns } from "./list.column";

// Nested table component (uses raw DataTable, not DataTableModalShell)
function ChildItemsTable({ parentId }: { parentId: string }) {
  const { records, loading } = useChildItemsAsync({ parentId });

  return (
    <DataTable
      noHeader
      minHeight={100}
      withColumnBorders
      columns={[
        { accessor: "name", title: "Name" },
        { accessor: "status", title: "Status" },
      ]}
      records={records}
      fetching={loading}
    />
  );
}

export function ListPage() {
  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([]);

  return (
    <DataTableWrapper
      queryKey="module.list"
      queryGetFn={MODULE_API.getItems}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
        // Row expansion for nested data
        rowExpansion={{
          allowMultiple: true,
          expanded: {
            recordIds: expandedRecordIds,
            onRecordIdsChange: setExpandedRecordIds,
          },
          content: ({ record }) => <ChildItemsTable parentId={record.id} />,
        }}
        // Modal API handlers
        onCreateApi={async (data) => MODULE_API.createItem(data)}
        onEditApi={async (id, data) => MODULE_API.updateItem(String(id), data)}
        onDeleteApi={async (id) => MODULE_API.deleteItem(String(id))}
        createFormComponent={<ItemForm />}
        editFormComponent={<ItemForm />}
      />
    </DataTableWrapper>
  );
}
```

### Key Points for Nested Tables in Sustained Modules

1. **Top Level**: Use `DataTableModalShell` (or `DataTableShell`) with `rowExpansion` prop
2. **Nested Levels**: Use raw `DataTable` from mantine-datatable with `noHeader`
3. **Each Level Manages Its Own State**: Each nested table has its own `expandedRecordIds` state
4. **Async Data Fetching**: Nested tables can fetch their data independently based on parent ID
5. **Multi-Level Nesting**: For deeper hierarchies, nested tables can also have their own `rowExpansion`

### Multi-Level Nesting Example

```tsx
// Level 2: Departments (nested inside Companies)
function DepartmentsTable({ companyId }: { companyId: string }) {
  const { records, loading } = useDepartmentsAsync({ companyId });
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  return (
    <DataTable
      noHeader
      minHeight={100}
      withColumnBorders
      columns={departmentColumns}
      records={records}
      fetching={loading}
      rowExpansion={{
        allowMultiple: true,
        expanded: { recordIds: expandedIds, onRecordIdsChange: setExpandedIds },
        content: ({ record }) => <EmployeesTable departmentId={record.id} />,
      }}
    />
  );
}

// Level 3: Employees (leaf level - no expansion)
function EmployeesTable({ departmentId }: { departmentId: string }) {
  const { records, loading } = useEmployeesAsync({ departmentId });

  return (
    <DataTable
      noHeader
      minHeight={100}
      withColumnBorders
      columns={employeeColumns}
      records={records}
      fetching={loading}
    />
  );
}
```

## Common Patterns

### Pattern 1: Basic Sustained Module

```typescript
// pages/list/page.tsx
<DataTableWrapper
  queryKey="item.list"
  queryGetFn={() => API.getItems()}
  dataKey="results"
>
  <DataTableModalShell
    moduleInfo={MODULE_CONFIG}
    columns={columns}
    idAccessor="id"
    onCreateApi={(data) => API.createItem(data)}
    onEditApi={(id, data) => API.updateItem(id, data)}
    onDeleteApi={(id) => API.deleteItem(id)}
    createFormComponent={<ItemForm />}
    editFormComponent={<ItemForm />}
  />
</DataTableWrapper>
```

### Pattern 2: With Filters

```typescript
<DataTableModalShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  filterList={[
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ]}
  // ... other props
/>
```

### Pattern 3: With Custom Callbacks

```typescript
<DataTableModalShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  onCreateApi={(data) => API.createItem(data)}
  onCreateSuccess={(res) => {
    console.log("Item created:", res);
  }}
  onEditApi={(id, data) => API.updateItem(id, data)}
  onEditSuccess={(res) => {
    console.log("Item updated:", res);
  }}
  onDeleteApi={(id) => API.deleteItem(id)}
  onDeleteSuccess={(id) => {
    console.log("Item deleted:", id);
  }}
  // ... other props
/>
```

## File Size Guidelines

- **module.api.ts**: Up to 10-15 endpoints
- **module.config.ts**: Lightweight, <20 lines
- **[ModuleName]Form.tsx**: <80 lines
- **pages/list/page.tsx**: <60 lines (columns are separate)
- **pages/list/list.column.tsx**: <50 lines per column file

If files exceed these, consider:

- Extracting form fields to separate components
- Creating utility functions for complex logic
- Splitting large forms into multi-step forms (if needed)

## Extension Points

The sustained module architecture allows easy extension:

1. **Add columns to table** → Modify columns definition in list page
2. **Add form fields** → Add to form component
3. **Add validation** → Add FormWrapper validation prop
4. **Add filters** → Add to filterList prop
5. **Add custom styling** → Use rowStyle, rowColor props
6. **Add custom actions** → Use tableActions prop

## Notes

- Always wrap with `DataTableWrapper` for data management
- Forms automatically refetch data after operations
- Delete shows confirmation modal
- Modal forms don't require separate routes
- Form is reused for both create and edit
- All notifications are automatic
- Error handling is built-in

## Quick Setup Guide

To create a new sustained module in 5 steps:

### Step 1: Create Module Directory Structure

```bash
mkdir -p apps/admin-test/modules/admin/[module-name]/{form,pages/list}
```

### Step 2: Create Core Files

- **module.config.ts** - Module configuration
- **module.api.ts** - API endpoints
- **form/[ModuleName]Form.tsx** - Form component
- **pages/list/page.tsx** - List page (imports columns)
- **pages/list/list.column.tsx** - Column definitions (REQUIRED)
- **index.ts** - Module exports

### Step 3: Create Routing Page

```bash
mkdir -p apps/admin-test/app/admin/[module-name]
```

**File:** `app/admin/[module-name]/page.tsx`

```typescript
import { ListPage } from "@/modules/admin/[module-name]";
export default ListPage;
```

### Step 4: Add to Navigation

**File:** `config/nav/navs/main-nav.tsx`

```typescript
{
  label: "[Module Label]",
  icon: [ApproprateIcon],
  value: "/[module-name]",
  roles: ["admin"],
}
```

### Step 5: Test

- Navigate to `/admin/[module-name]` in browser
- Verify module appears in navigation sidebar
- Test create, edit, delete operations

## Summary

Sustained modules provide:

- Simplified architecture with single page
- Modal-based forms integrated with table
- Automatic data refresh after operations
- Cleaner UI for simple CRUD operations
- Reduced routing complexity
- Quick implementation for simple modules

## Troubleshooting

### Runtime TypeError: createContext only works in Client Components

If you encounter this error when importing icons in `module.config.ts`:

```
Runtime TypeError: createContext only works in Client Components
```

This happens because many icon libraries (like `@phosphor-icons/react`) use React Context under the hood. Since `module.config.ts` is imported in both server and client components, it may be evaluated in a Server Component context where `createContext` is not allowed.

**Fix:** Add `"use client";` at the very top of your `module.config.ts` file.

```typescript
"use client";

import { AddressBookIcon } from "@phosphor-icons/react";
// ...
```
