# DataTableModalShell Usage

## Overview

`DataTableModalShell` is a layout component from `@settle/admin` that provides a complete data table with integrated modal forms for create and edit operations. It combines the DataTableShell with built-in modal handling, making it perfect for "sustained modules" where all CRUD operations happen on a single page.

## Location

`@settle/admin/src/layouts/DataTableModalShell/`

## Key Features

- **Table Display**: Data table with columns, sorting, filtering
- **Modal Forms**: Built-in create and edit modals
- **Delete Confirmation**: Confirmation modal for deletions
- **Auto Refresh**: Table automatically refetches after operations
- **Form Integration**: Works with any form component via FormWrapper
- **Single Page CRUD**: All operations on one page without routing

## Props

| Prop                  | Type             | Default             | Description                                      |
| --------------------- | ---------------- | ------------------- | ------------------------------------------------ |
| `moduleInfo`          | `object`         | Required            | Module config with name, label, description      |
| `columns`             | `array`          | Required            | Column definitions for the table                 |
| `idAccessor`          | `string`         | `"id"`              | Property name used as unique identifier          |
| `filterList`          | `array`          | `[]`                | Filter configuration options                     |
| `hideFilters`         | `boolean`        | `false`             | Hide filter toolbar                              |
| `forceFilter`         | `object`         | -                   | Force apply specific filters                     |
| `pageSizes`           | `array`          | `[10, 20, 50, 100]` | Page size options                                |
| `tableActions`        | `array`          | `[]`                | Custom row action buttons                        |
| `tabs`                | `array`          | `[]`                | Tab configuration                                |
| `rowColor`            | `string`         | -                   | Row text color                                   |
| `rowBackgroundColor`  | `string`         | -                   | Row background color                             |
| `rowStyle`            | `CSSProperties`  | -                   | Custom row styles                                |
| `hasServerSearch`     | `boolean`        | `false`             | Enable server-side search                        |
| **Modal Props**       |                  |                     |                                                  |
| `modalWidth`          | `string\|number` | `"md"`              | Modal width (sm, md, lg, xl)                     |
| **API Handlers**      |                  |                     |                                                  |
| `onCreateApi`         | `function`       | -                   | Create API call: `(data) => Promise<result>`     |
| `onEditApi`           | `function`       | -                   | Update API call: `(id, data) => Promise<result>` |
| `onDeleteApi`         | `function`       | -                   | Delete API call: `(id) => Promise<void>`         |
| **Form Components**   |                  |                     |                                                  |
| `createFormComponent` | `ReactNode`      | -                   | Form component for create modal                  |
| `editFormComponent`   | `ReactNode`      | -                   | Form component for edit modal                    |
| **Callbacks**         |                  |                     |                                                  |
| `onCreateSuccess`     | `function`       | -                   | Called after successful create                   |
| `onEditSuccess`       | `function`       | -                   | Called after successful edit                     |
| `onDeleteSuccess`     | `function`       | -                   | Called after successful delete                   |
| `onEditTrigger`       | `function`       | -                   | Called when edit modal opens to fetch data       |
| **Transforms**        |                  |                     |                                                  |
| `transformOnCreate`   | `function`       | -                   | Transform data before create API call            |
| `transformOnEdit`     | `function`       | -                   | Transform data before edit API call              |
| `transformOnDelete`   | `function`       | -                   | Transform ID before delete API call              |
| **Validation**        |                  |                     |                                                  |
| `validator`           | `object`         | -                   | Zod validator for form validation                |

## Basic Usage

```tsx
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { AGENDA_API, AGENDA_MODULE_CONFIG } from "./module.config";
import { AgendaForm } from "./form/AgendaForm";

export function ListPage() {
  const columns = [
    { accessor: "title", header: "Title", size: 250 },
    { accessor: "status", header: "Status", size: 120 },
    { accessor: "created_at", header: "Created", size: 150 },
  ];

  return (
    <DataTableWrapper
      queryKey="agenda.list"
      queryGetFn={async () => {
        const response = await AGENDA_API.getAgendas();
        return { data: response?.data || [] };
      }}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={AGENDA_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
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
        // Form components
        createFormComponent={<AgendaForm />}
        editFormComponent={<AgendaForm />}
        // Modal customization
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
```

## Column Definition

Define columns as plain objects (not MRT_ColumnDef types):

### Basic Columns

```tsx
const columns = [
  {
    accessor: "id",
    header: "ID",
    size: 100,
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
  },
];
```

### With Custom Rendering

```tsx
import { Badge } from "@mantine/core";

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
    render: (row: any) => {
      const colorMap = {
        pending: "yellow",
        approved: "green",
        rejected: "red",
      };
      return <Badge color={colorMap[row.status]}>{row.status}</Badge>;
    },
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

- `accessor`: Field name from data object
- `header`: Column header label
- `size`: Column width in pixels
- `render`: Custom render function `(row, index) => ReactNode`

## API Handlers

### onCreateApi

Called when user submits the create form:

```tsx
onCreateApi={async (data) => {
  // data contains form values
  const response = await AGENDA_API.createAgenda(data);
  // Must return the created item
  return response.data;
}}
```

**Expected:**

- Input: Form data object
- Output: Created item object
- Called by: Form submission in create modal

### onEditApi

Called when user submits the edit form:

```tsx
onEditApi={async (id, data) => {
  // id is the record ID
  // data contains form values
  const response = await AGENDA_API.updateAgenda(String(id), data);
  // Must return the updated item
  return response.data;
}}
```

**Expected:**

- Input: ID (string | number) + form data
- Output: Updated item object
- Called by: Form submission in edit modal

### onDeleteApi

Called when user confirms delete:

```tsx
onDeleteApi={async (id) => {
  // id is the record ID(s)
  await AGENDA_API.deleteAgenda(String(id));
  // No return value needed
}}
```

**Expected:**

- Input: ID (string | number) or array of IDs
- Output: void (no return needed)
- Called by: Confirmation modal

## Form Components

Forms are rendered inside modals. Use the same form for both create and edit:

```tsx
// form/AgendaForm.tsx
import { TextInput, Textarea, Select, Stack } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function AgendaForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Title"
          placeholder="Enter title"
          {...form.getInputProps("title")}
          required
        />

        <Textarea
          label="Description"
          placeholder="Enter description"
          minRows={4}
          {...form.getInputProps("description")}
          required
        />

        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ]}
          {...form.getInputProps("status")}
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "8px 16px",
            backgroundColor: isLoading ? "#ccc" : "#1f77d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </Stack>
    </form>
  );
}
```

Then pass to DataTableModalShell:

```tsx
<DataTableModalShell
  createFormComponent={<AgendaForm />}
  editFormComponent={<AgendaForm />}
  // ... other props
/>
```

## Modal Behavior

### Create Modal

**Trigger:** User clicks "New" button

**Title:** "NEW {TERM}" (e.g., "NEW AGENDA")

**Initial State:** Empty form

**On Submit:**

1. Calls `onCreateApi` with form data
2. Validates using validator if provided
3. Shows success notification
4. Closes modal
5. Auto-refetches table data
6. Calls `onCreateSuccess` callback

**On Error:**

- Shows error notification
- Modal stays open
- Form data preserved

### Edit Modal

**Trigger:** User clicks row or edit action

**Title:** "EDIT {TERM}" (e.g., "EDIT AGENDA")

**Initial State:** Pre-filled with row data

**On Submit:**

1. Calls `onEditApi` with ID and form data
2. Validates using validator if provided
3. Shows success notification
4. Closes modal
5. Auto-refetches table data
6. Calls `onEditSuccess` callback

**On Error:**

- Shows error notification
- Modal stays open
- Form data preserved

**Optional onEditTrigger:**

- Called before modal opens
- Useful for fetching full record from API
- Overwrites row data with returned data

```tsx
onEditTrigger={async (row) => {
  // row contains current table row data
  const response = await AGENDA_API.getAgenda(row.id);
  // Return full record to populate form
  return response.data;
}}
```

### Delete Confirmation

**Trigger:** User clicks delete action

**Behavior:**

1. Shows confirmation modal
2. Displays "Are you sure?" message
3. On confirm: Calls `onDeleteApi`
4. Shows success notification
5. Auto-refetches table data

**No Error Recovery:** If delete fails, table is not refetched

## Filters

### Basic Filter List

```tsx
<DataTableModalShell
  filterList={[
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
    {
      key: "district",
      label: "District",
      type: "text",
    },
  ]}
  // ... other props
/>
```

### Hide Filters

```tsx
<DataTableModalShell
  hideFilters={true}
  // ... other props
/>
```

## Pagination & Page Size

Customize page size options:

```tsx
<DataTableModalShell
  pageSizes={[5, 10, 25, 50, 100]}
  // ... other props
/>
```

## Data Transformation

Transform data before sending to API:

### Transform on Create

```tsx
<DataTableModalShell
  transformOnCreate={(data) => {
    return {
      ...data,
      title: data.title?.toUpperCase(),
      tags: data.tags?.split(",") || [],
    };
  }}
  onCreateApi={async (transformedData) => {
    return await API.createItem(transformedData);
  }}
  // ... other props
/>
```

### Transform on Edit

```tsx
<DataTableModalShell
  transformOnEdit={(data) => {
    return {
      ...data,
      status: data.status?.toLowerCase(),
    };
  }}
  onEditApi={async (id, transformedData) => {
    return await API.updateItem(id, transformedData);
  }}
  // ... other props
/>
```

### Transform on Delete

```tsx
<DataTableModalShell
  transformOnDelete={(id) => {
    // Useful for converting ID format
    return String(id).trim();
  }}
  onDeleteApi={async (transformedId) => {
    await API.deleteItem(transformedId);
  }}
  // ... other props
/>
```

## Common Patterns

### Pattern 1: Simple Sustained Module

```tsx
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

### Pattern 2: With Custom Callbacks

```tsx
<DataTableModalShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  onCreateApi={(data) => API.createItem(data)}
  onCreateSuccess={(res) => {
    console.log("Created:", res);
  }}
  onEditApi={(id, data) => API.updateItem(id, data)}
  onEditSuccess={(res) => {
    console.log("Updated:", res);
  }}
  onDeleteApi={(id) => API.deleteItem(id)}
  onDeleteSuccess={(id) => {
    console.log("Deleted:", id);
  }}
  createFormComponent={<ItemForm />}
  editFormComponent={<ItemForm />}
/>
```

### Pattern 3: With Filtering

```tsx
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
  onCreateApi={(data) => API.createItem(data)}
  onEditApi={(id, data) => API.updateItem(id, data)}
  onDeleteApi={(id) => API.deleteItem(id)}
  createFormComponent={<ItemForm />}
  editFormComponent={<ItemForm />}
/>
```

### Pattern 4: With Data Fetching on Edit

```tsx
<DataTableModalShell
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  onEditTrigger={async (row) => {
    // Fetch full record when edit modal opens
    const response = await API.getItemDetail(row.id);
    return response.data;
  }}
  onEditApi={(id, data) => API.updateItem(id, data)}
  // ... other props
/>
```

### Pattern 5: With Custom Modal Width

```tsx
<DataTableModalShell
  modalWidth="lg" // or "sm", "md", "xl"
  moduleInfo={MODULE_CONFIG}
  columns={columns}
  // ... other props
/>
```

## Context Usage

Access the modal shell context in child components:

```tsx
import { useDataTableModalShellContext } from "@settle/admin";

export function CustomButton() {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    activeEditRecord,
    openCreateModal,
    openEditModal,
    closeCreateModal,
    closeEditModal,
  } = useDataTableModalShellContext();

  return <button onClick={openCreateModal}>Custom Create Button</button>;
}
```

## Form Context in Modal Forms

Access form state in modal forms:

```tsx
import { useEditFormContext } from "@settle/admin";

export function AgendaForm() {
  const form = useEditFormContext();
  // Access form values, errors, etc.
  const title = form.values.title;

  return <form>{/* Form fields */}</form>;
}
```

## Validation

Use Zod validator for form validation:

```tsx
import { z } from "zod";

const agendaValidator = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["pending", "approved", "rejected"]),
});

<DataTableModalShell
  validator={agendaValidator}
  // ... other props
/>;
```

## Notifications

Notifications are automatically handled:

- **Success**: "{Term} created/updated successfully"
- **Delete Success**: "Item deleted successfully"
- **Error**: "Failed to create/update/delete {term}"
- **Validation Error**: Displays first validation error

Custom notifications can be handled via callbacks:

```tsx
onCreateSuccess={(res) => {
  // Custom notification logic
}}
onCreateSuccess={(err) => {
  // Custom error handling
}
```

## Notes

- Always wrap with `DataTableWrapper` for data management
- Forms automatically refetch data after operations
- Delete shows confirmation modal
- Modal forms work with FormWrapper internally
- All notifications are automatic
- Error handling is built-in
- Row data is pre-filled in edit modal
- Use `onEditTrigger` to fetch fresh data on edit

## Summary

DataTableModalShell provides:

- Complete table with built-in modals
- Seamless create/edit/delete workflow
- Auto-refetch after operations
- Form integration via FormWrapper
- Confirmation dialogs for destructive actions
- Flexible filtering and customization
- Perfect for sustained modules
