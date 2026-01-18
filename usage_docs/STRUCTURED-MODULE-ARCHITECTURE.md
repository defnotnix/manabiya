# Structured-Module Architecture

## Overview

A "structured-module" is a standardized, modular approach to building feature modules in the admin dashboard. Each module is self-contained with clear separation of concerns: API calls, configuration, pages, and forms.

## Folder Structure

```
modules/
└── admin/
    └── [module-name]/
        ├── index.ts                 # Module exports
        ├── module.config.ts         # Configuration & constants
        ├── module.api.ts            # API calls & endpoints
        ├── pages/
        │   ├── list/
        │   │   └── page.tsx         # List/default page (/[module])
        │   ├── new/
        │   │   └── page.tsx         # Create page (/[module]/new)
        │   ├── edit/
        │   │   └── page.tsx         # Edit page (/[module]/[id]/edit)
        │   └── view/
        │       └── page.tsx         # View/detail page (/[module]/[id])
        └── form/
            └── [ModuleName]Form.tsx # Shared form component
```

### Folder Structure Benefits

- Each page is isolated in its own folder
- Easy to add page-specific utilities, components, or styles later
- Follows Next.js App Router conventions
- Scalable: can add `layout.tsx`, `loading.tsx`, `error.tsx` per page folder
- Clear visual hierarchy of the module

## File Descriptions

### `index.ts` - Module Exports

Export all pages and configuration for easy imports from other parts of the application.

```typescript
export { ListPage } from "./pages/list/page";
export { NewPage } from "./pages/new/page";
export { EditPage } from "./pages/edit/page";
export { ViewPage } from "./pages/view/page";
```

Usage:

```typescript
import { ListPage, NewPage } from "@/modules/admin/applicant";
```

### `module.config.ts` - Configuration & Constants

Contains module metadata and shared configuration values. All strings and constants used across the module should be centralized here. Also re-exports the API from module.api.ts for convenience.

**What to include:**

- Module name, label, description
- Singular and plural naming
- Icon/visual identifiers
- Default values
- Shared constants

```typescript
import { APPLICANT_API } from "./module.api";

export const APPLICANT_MODULE_CONFIG = {
  name: "Applicant",
  label: "Applicants",
  description: "Manage applicant information and applications",
  pluralName: "applicants",
  singularName: "applicant",
  icon: "Users",
};

export { APPLICANT_API };
```

This pattern allows clean imports from both config and API:

```typescript
import { APPLICANT_MODULE_CONFIG, APPLICANT_API } from "../../module.config";
```

### `module.api.ts` - API Calls

All API endpoints and HTTP calls for the module. This file acts as the API client layer for the module. **Always use `moduleApiCall` from @settle/core instead of axios directly.**

**What to include:**

- All CRUD operations (GET, POST, PUT, DELETE)
- List/search endpoints
- Specific query operations
- Error handling utilities
- Request/response transformations

```typescript
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "/applicants/";

export const APPLICANT_API = {
  // Get all applicants
  getApplicants: async (params?: any) => {
    const data = await moduleApiCall.getRecords({
      endpoint: ENDPOINT,
      params,
    });
    return {
      data: Array.isArray(data) ? data : [],
    };
  },

  // Get single applicant by ID
  getApplicant: async (id: string) => {
    const data = await moduleApiCall.getSingleRecord({
      endpoint: ENDPOINT,
      id,
    });
    return { data };
  },

  // Create new applicant
  createApplicant: async (data: any) => {
    const result = await moduleApiCall.createRecord({
      endpoint: ENDPOINT,
      body: data,
    });
    return { data: result };
  },

  // Update applicant
  updateApplicant: async (id: string, data: any) => {
    const result = await moduleApiCall.editRecord({
      endpoint: ENDPOINT,
      id,
      body: data,
    });
    return { data: result };
  },

  // Delete applicant
  deleteApplicant: async (id: string) => {
    return await moduleApiCall.deleteRecord({
      endpoint: ENDPOINT,
      id,
    });
  },
};
```

**moduleApiCall Methods:**

- `getRecords({ endpoint, params })` - GET list with pagination/filters
- `getSingleRecord({ endpoint, id, params })` - GET single record
- `createRecord({ endpoint, body, headers })` - POST new record
- `editRecord({ endpoint, id, body, headers })` - PATCH update record
- `deleteRecord({ endpoint, id, headers })` - DELETE record
- `createGroupRecords({ endpoint, body, headers })` - POST multiple records

### `pages/list/page.tsx` - List Page

The default/list view showing all records with filtering, searching, sorting, and pagination.

**Responsibilities:**

- Fetch list of records using DataTableWrapper
- Display table using DataTableShell
- Handle row actions (edit, view, delete)
- Manage navigation to other pages

**Key Components:**

- DataTableWrapper (data fetching & state)
- DataTableShell (UI layout)
- Column definitions (plain objects without MRT_ColumnDef)

**Important:** Do NOT import `mantine-react-table` types in client apps. Define columns as plain objects.

```typescript
export function ListPage() {
  const router = useRouter();

  // Plain column definitions without MRT_ColumnDef type
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 100,
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
      size: 200,
    },
    {
      accessorKey: "email",
      header: "Email",
      size: 200,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 120,
    },
  ];

  return (
    <DataTableWrapper
      queryKey="applicant.list"
      queryGetFn={async () => {
        const response = await APPLICANT_API.getApplicants();
        return { data: response?.data || [] };
      }}
      dataKey="data"
    >
      <DataTableShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        newButtonHref="/admin/applicant/new"
        filterList={[]}
        onEditClick={(id) => {
          router.push(`/admin/applicant/${id}/edit`);
        }}
        onReviewClick={(id) => {
          router.push(`/admin/applicant/${id}`);
        }}
        onDeleteClick={async (ids) => {
          // Handle single or multiple deletions
          const idArray = Array.isArray(ids) ? ids : [ids];
          for (const id of idArray) {
            await APPLICANT_API.deleteApplicant(String(id));
          }
        }}
      />
    </DataTableShell>
  );
}
```

### `pages/new/page.tsx` - Create Page

Form page for creating new records. Typically accessed via `/[module]/new`.

**Responsibilities:**

- Provide initial empty form state
- Handle form submission to API
- Redirect on success
- Display form using FormShell & FormWrapper
- Provide form notifications

**Key Components:**

- FormWrapper (form state & submission)
- FormShell (form UI layout)
- Form component from /form directory
- triggerNotification.form (form notifications)

```typescript
import { triggerNotification } from "@settle/admin";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="applicant.new"
      formName="applicant-form"
      initial={{
        fullName: "",
        email: "",
        phone: "",
        status: "pending",
      }}
      steps={1}
      validation={[]}
      disabledSteps={[]}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return APPLICANT_API.createApplicant(data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/applicant");
      }}
    >
      <FormShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        title="Create New Applicant"
        bread={[{ label: "Applicants" }, { label: "New" }]}
      >
        <ApplicantForm />
      </FormShell>
    </FormWrapper>
  );
}
```

**FormWrapper Props:**

- `steps`: Number of form steps (1 for single-step)
- `validation`: Array of validation rules per step
- `disabledSteps`: Array of disabled step indices
- `notifications`: Form notification handlers (loading, success, error, etc.)

### `pages/edit/page.tsx` - Edit Page

Form page for updating existing records. Accessed via `/[module]/[id]/edit`.

**Responsibilities:**

- Fetch existing record data
- Populate form with current values
- Handle form submission for updates
- Show loading state while fetching
- Redirect on success
- Provide form notifications

**Key Components:**

- useQuery (fetch single record)
- FormWrapper (form state & submission)
- FormShell (form UI layout)
- Form component from /form directory
- Loader & Center (loading state)
- triggerNotification.form (form notifications)

```typescript
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";
import { triggerNotification } from "@settle/admin";
import { Loader, Center } from "@mantine/core";

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicant", id],
    queryFn: async () => {
      const response = await APPLICANT_API.getApplicant(id);
      return response?.data;
    },
  });

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <FormWrapper
      queryKey={`applicant.edit.${id}`}
      formName="applicant-form"
      initial={applicant}
      primaryKey="id"
      steps={1}
      validation={[]}
      disabledSteps={[]}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return APPLICANT_API.updateApplicant(id, data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/applicant");
      }}
    >
      <FormShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        title="Edit Applicant"
        bread={[
          { label: "Applicants" },
          { label: applicant?.fullName || "Edit" },
        ]}
      >
        <ApplicantForm />
      </FormShell>
    </FormWrapper>
  );
}
```

### `pages/view/page.tsx` - View/Detail Page

Read-only detail page for viewing a single record. Accessed via `/[module]/[id]`.

**Responsibilities:**

- Fetch and display single record details
- Show profile/detail information
- Provide navigation to edit or back
- Display related information/sections

**Components:**

- useQuery (fetch single record)
- Mantine UI components (Box, Stack, Title, Text, Badge)
- Custom profile layout

```typescript
export function ViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicant", id],
    queryFn: () => APPLICANT_API.getApplicant(id),
  });

  return (
    <Box p="lg">
      <Stack gap="lg">
        {/* Header with title and actions */}
        {/* Profile sections */}
      </Stack>
    </Box>
  );
}
```

### `form/[ModuleName]Form.tsx` - Shared Form Component

Reusable form component used by both new and edit pages. Contains all form fields and validation logic.

**Responsibilities:**

- Define form fields
- Handle field validation
- Provide consistent form UI across new/edit
- Use FormWrapper hooks for state access

**Key Features:**

- Wraps form fields
- Accesses form state via FormWrapper.useForm()
- Accesses submission handlers via FormWrapper.useFormProps()
- Can be used in both new and edit pages

```typescript
export function ApplicantForm() {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}>
      <TextInput
        label="Full Name"
        {...form.getInputProps("fullName")}
        required
      />
      {/* More fields */}
      <Button type="submit" loading={isLoading}>
        Submit
      </Button>
    </form>
  );
}
```

## Data Flow

### List Page Flow

```
ListPage
  ↓
DataTableWrapper (fetches data)
  ↓
useQuery (calls APPLICANT_API.getApplicants)
  ↓
DataTableShell (displays table)
  ↓
Row actions trigger router.push()
```

### Create/New Page Flow

```
NewPage
  ↓
FormWrapper (manages form state)
  ↓
ApplicantForm (renders form fields)
  ↓
User submits
  ↓
FormWrapper calls APPLICANT_API.createApplicant()
  ↓
Success → router.push("/admin/applicant")
```

### Edit Page Flow

```
EditPage
  ↓
useQuery fetches record
  ↓
FormWrapper (initializes with data)
  ↓
ApplicantForm (renders with values)
  ↓
User submits changes
  ↓
FormWrapper calls APPLICANT_API.updateApplicant()
  ↓
Success → router.push("/admin/applicant")
```

### View/Detail Page Flow

```
ViewPage
  ↓
useQuery fetches record
  ↓
Render profile layout
  ↓
Display information
  ↓
Provide edit/back navigation
```

## Routing Structure

### Module Routes (modules/admin/[module]/)

```
modules/admin/applicant/
├── pages/
│   ├── list/page.tsx
│   ├── new/page.tsx
│   ├── edit/page.tsx
│   └── view/page.tsx
```

### App Routes (app/admin/[module]/)

The app folder contains thin routing pages that import and export module components:

```
app/admin/applicant/
├── page.tsx                  → Imports ListPage from module
├── new/
│   └── page.tsx             → Imports NewPage from module
├── [id]/
│   ├── page.tsx             → Imports ViewPage from module
│   └── edit/
│       └── page.tsx         → Imports EditPage from module
```

**Example app/admin/applicant/page.tsx:**

```typescript
import { ListPage } from "@/modules/admin/applicant";

export default ListPage;
```

**Example app/admin/applicant/new/page.tsx:**

```typescript
import { NewPage } from "@/modules/admin/applicant";

export default NewPage;
```

### URL Mapping

```
GET  /admin/applicant              → ListPage
GET  /admin/applicant/new          → NewPage
GET  /admin/applicant/[id]         → ViewPage
GET  /admin/applicant/[id]/edit    → EditPage
```

This separation keeps:

- **modules/**: Business logic, components, state management
- **app/**: Next.js routing and page entry points

## Implementation Checklist

Before implementing a new module, ensure you have:

- [ ] **module.config.ts** - Module metadata and re-exported API
- [ ] **module.api.ts** - All CRUD endpoints
- [ ] **pages/list/page.tsx** - DataTableWrapper + DataTableShell
- [ ] **pages/new/page.tsx** - FormWrapper + FormShell with notifications
- [ ] **pages/edit/page.tsx** - FormWrapper + FormShell with notifications & data fetching
- [ ] **pages/view/page.tsx** - Profile/detail layout
- [ ] **form/[ModuleName]Form.tsx** - Shared form component
- [ ] **index.ts** - Module exports
- [ ] **app/admin/[module]/** - Routing pages (thin wrappers)

## Best Practices

1. **API Layer Isolation**
   - All API calls in module.api.ts
   - API functions return raw API responses
   - No business logic in API layer
   - Export API from module.config.ts for cleaner imports

2. **Configuration Centralization**
   - All constants in module.config.ts
   - Import both CONFIG and API from module.config.ts
   - Use consistent naming patterns (APPLICANT_MODULE_CONFIG, APPLICANT_API)

3. **Form Reusability**
   - Create single form component in /form
   - Use in both new and edit pages
   - Keep form logic separate from page logic
   - Always include FormWrapper props: `steps`, `validation`, `disabledSteps`, `notifications`

4. **Notifications**
   - Always include `notifications={triggerNotification.form}` in FormWrapper
   - Shows automatic loading, success, error, and validation messages
   - Provides consistent user feedback across all forms

5. **API Layer**
   - Always use `moduleApiCall` from `@settle/core` instead of axios
   - Never import or use axios directly in module.api.ts
   - Use the appropriate method: `getRecords`, `getSingleRecord`, `createRecord`, `editRecord`, `deleteRecord`
   - Always wrap responses in `{ data: ... }` format for consistency

6. **Column Definitions**
   - Define columns as plain objects, NOT `MRT_ColumnDef`
   - Do NOT import `mantine-react-table` in client apps
   - Use simple object literals: `{ accessorKey, header, size }`

7. **Delete Operations**
   - `onDeleteClick` receives an array of IDs: `(ids: (string | number)[])`
   - Handle both single and bulk deletions
   - Convert IDs to strings for API calls

8. **Loading States**
   - Show Loader + Center while fetching record data in edit/view pages
   - Provide visual feedback during form submission (automatic via FormWrapper)

9. **Consistent Imports**

   ```typescript
   import { APPLICANT_MODULE_CONFIG, APPLICANT_API } from "../../module.config";
   import { triggerNotification } from "@settle/admin";
   ```

10. **Error Handling**
    - Handle loading states in useQuery (show Loader)
    - Display error states appropriately
    - API errors handled by FormWrapper with notifications

11. **Navigation**
    - Use useRouter for navigation
    - Push to list after successful operations
    - Provide breadcrumbs in forms via `bread` prop

## Module Scale

### Small Module (Simple CRUD)

- 1 list page
- 1 form (shared for new/edit)
- 2 pages (new, edit)
- 1 view page
- Total: ~5-6 pages

### Large Module (Complex Features)

- Multiple list pages with tabs
- Multiple form components (different types)
- Sub-modules
- Custom detail sections
- Advanced filters and search

## Extension Points

The structured-module architecture allows easy extension:

1. **Add API endpoints** → Add to module.api.ts
2. **Add form fields** → Extend ApplicantForm or create new forms
3. **Add columns to list** → Add to columns definition
4. **Add tabs/filters** → Pass to DataTableShell
5. **Add validation** → Add to FormWrapper validation
6. **Add multi-step forms** → Use steps prop in FormWrapper

## File Size Guidelines

- **module.api.ts**: Up to 15-20 endpoints
- **module.config.ts**: Lightweight, <50 lines
- **[ModuleName]Form.tsx**: <100 lines
- **pages/\*/page.tsx**: Each <80 lines

If files exceed these, consider:

- Splitting forms into smaller components
- Creating sub-modules
- Extracting common logic to utilities

## Page-Specific Utilities

Since each page is in its own folder, you can add page-specific files:

```
pages/
├── list/
│   ├── page.tsx
│   ├── columns.ts        # Column definitions
│   └── hooks.ts          # List-specific hooks
├── new/
│   └── page.tsx
├── edit/
│   ├── page.tsx
│   └── validations.ts    # Edit-specific validations
└── view/
    ├── page.tsx
    └── sections.tsx      # Profile sections
```

This keeps related code together and makes the module highly maintainable.

## Summary

The structured-module architecture provides:

- Clear separation of concerns
- Reusable components
- Easy to navigate and understand
- Scalable for growth
- Consistent naming and patterns
- Single responsibility principle
- DRY (Don't Repeat Yourself)
