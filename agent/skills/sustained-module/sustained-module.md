# Sustained Module Generator

Generate a complete CRUD module following Settle framework patterns.

---

## Workflow

### Step 1: Gather Required Information

Ask the user for:

1. **Base API Endpoint** - e.g., `/api/users/`
2. **Data Format** - Sample JSON response (to generate columns and form fields)
3. **Module Name** - PascalCase (e.g., `AuthUsers`)
4. **Module Location** - Default: `apps/admin-test/modules/admin/[kebab-name]/`

### Step 2: Configuration Options

Ask the user:

5. **Shell Type**
   - `DataTableModalShell` - Modal-based CRUD (default, recommended for simple modules)
   - `DataTableShell` - Page-based CRUD (for complex forms)

6. **Form Type**
   - `single` - Single step form (default)
   - `stepper` - Multi-step form
   - If stepper: Ask for step count and step labels

7. **Features**
   - Server-side search? (true/false)
   - Tabs for filtering? (true/false)
     - If yes: First tab = "All [Module Label]", then additional tabs
   - Filter dropdowns? (true/false)
     - If yes: Get filter definitions (label, field, options)

### Step 3: Generate Files

Based on inputs, generate all files listed below.

---

## Files to Generate

### Core Files (Always)

```
[module-location]/
├── index.ts
├── module.config.ts
├── module.api.ts
├── form/
│   ├── form.config.tsx
│   └── [ModuleName]Form.tsx
└── pages/
    └── list/
        ├── page.tsx
        └── list.columns.tsx
```

### Shell-Specific Files

**DataTableModalShell** (modal-based):
```
└── pages/list/components/
    └── [ModuleName]ProfileModal.tsx
```

**DataTableShell** (page-based):
```
└── pages/
    ├── new/page.tsx
    ├── edit/page.tsx
    └── view/page.tsx
```

### Routing Pages

```
apps/admin-test/app/admin/[module-slug]/page.tsx
```

For DataTableShell, also:
```
apps/admin-test/app/admin/[module-slug]/new/page.tsx
apps/admin-test/app/admin/[module-slug]/[id]/page.tsx
apps/admin-test/app/admin/[module-slug]/[id]/edit/page.tsx
```

---

## Component Documentation References

Before generating code, read these USAGE.md files for accurate patterns:

| Component | Documentation |
|-----------|---------------|
| DataTableModalShell | `packages/admin/src/layouts/DataTableModalShell/USAGE.md` |
| DataTableShell | `packages/admin/src/layouts/DataTableShell/USAGE.md` |
| DataTableWrapper | `packages/core/src/wrappers/DataTableWrapper/USAGE.md` |
| FormWrapper | `packages/core/src/wrappers/FormWrapper/USAGE.md` |
| FormShell | `packages/admin/src/layouts/FormShell/USAGE.md` |
| moduleApiCall | `packages/core/src/helpers/moduleApiCall/USAGE.md` |

---

## Naming Conventions

From module name `AuthUsers`:

| Format | Output |
|--------|--------|
| PascalCase | `AuthUsers` |
| camelCase | `authUsers` |
| SCREAMING_SNAKE | `AUTH_USERS` |
| kebab-case | `auth-users` |
| Singular | `AuthUser` / `User` |
| Plural | `AuthUsers` / `Users` |

---

## Column Generation

From data format, generate columns:

| Field Type | Pattern |
|------------|---------|
| `id` | `{ accessor: "id", header: "ID", size: 80 }` |
| `string` | `{ accessor: "field", header: "Label", size: 150 }` |
| `email` | `{ accessor: "email", header: "Email", size: 220 }` |
| `date` | Render with `toLocaleDateString()` |
| `boolean` | Render with `<Badge>` |
| `status/role` | Render with colored `<Badge>` |
| `nested.field` | `accessor: "parent.child"`, render with `row.parent?.child` |
| `image` | Render with `<Avatar>` |

---

## Form Field Generation

| Field Type | Component |
|------------|-----------|
| `string` (short) | `<TextInput>` |
| `string` (long) | `<Textarea>` |
| `email` | `<TextInput type="email">` |
| `password` | `<PasswordInput>` |
| `number` | `<NumberInput>` |
| `date` | `<DateInput>` |
| `boolean` | `<Switch>` |
| `enum` | `<Select>` |
| `nested.field` | `form.getInputProps("parent.child")` |

---

## Zod Validation

Always generate `form.config.tsx` with Zod schemas:

```tsx
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const formSchema = z.object({
  field: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  // ...
});

export const formConfig = {
  initial: { field: "", email: "" },
  steps: 1,
  validation: [zodResolver(formSchema)],
};
```

---

## Minimal File Templates

### module.config.ts

```tsx
import { [MODULE_NAME]_API } from "./module.api";

export const [MODULE_NAME]_MODULE_CONFIG = {
  name: "[Module Name]",
  label: "[Module Label Plural]",
  description: "Manage [description]",
  term: "[Singular Term]",
  pluralName: "[plural-name]",
  singularName: "[singular-name]",
  icon: "[PhosphorIconName]",
};

export { [MODULE_NAME]_API };
```

### module.api.ts

```tsx
import { moduleApiCall } from "@settle/core";

const ENDPOINT = "[BASE_API_ENDPOINT]";

export const [MODULE_NAME]_API = {
  get[Plural]: async (params?: any) => {
    return moduleApiCall.getRecords({ endpoint: ENDPOINT, params });
  },
  get[Singular]: async (id: string) => {
    return moduleApiCall.getSingleRecord({ endpoint: ENDPOINT, id });
  },
  create[Singular]: async (data: any) => {
    return moduleApiCall.createRecord({ endpoint: ENDPOINT, body: data });
  },
  update[Singular]: async (id: string, data: any) => {
    return moduleApiCall.editRecord({ endpoint: ENDPOINT, id, body: data });
  },
  delete[Singular]: async (id: string) => {
    return moduleApiCall.deleteRecord({ endpoint: ENDPOINT, id });
  },
};
```

### form/form.config.tsx

```tsx
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";

export const [moduleName]FormSchema = z.object({
  // Generate from data format
});

export const [moduleName]FormConfig = {
  initial: {
    // Initial values from schema
  },
  steps: 1,  // Or number of steps for stepper
  validation: [zodResolver([moduleName]FormSchema)],
};
```

### form/[ModuleName]Form.tsx

```tsx
"use client";

import { Stack, TextInput } from "@mantine/core";
import { FormWrapper } from "@settle/core";

export function [ModuleName]Form() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md" p="md">
      {/* Generate fields from data format */}
    </Stack>
  );
}
```

### pages/list/list.columns.tsx

```tsx
import { Badge, Avatar } from "@mantine/core";

export const [moduleName]ListColumns = [
  // Generate from data format
];
```

### pages/list/page.tsx (DataTableModalShell)

```tsx
"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell, AutoBreadcrumb } from "@settle/admin";
import { [MODULE_NAME]_MODULE_CONFIG, [MODULE_NAME]_API } from "../../module.config";
import { [ModuleName]Form } from "../../form/[ModuleName]Form";
import { [moduleName]FormConfig } from "../../form/form.config";
import { [moduleName]ListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="[module-key].list"
      queryGetFn={async () => [MODULE_NAME]_API.get[Plural]()}
      dataKey="results"
    >
      <AutoBreadcrumb items={[{ label: "[Module Label]" }]} />

      <DataTableModalShell
        moduleInfo={[MODULE_NAME]_MODULE_CONFIG}
        columns={[moduleName]ListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => [MODULE_NAME]_API.create[Singular](data)}
        onEditApi={async (id, data) => [MODULE_NAME]_API.update[Singular](String(id), data)}
        onDeleteApi={async (id) => [MODULE_NAME]_API.delete[Singular](String(id))}
        createFormComponent={<[ModuleName]Form />}
        editFormComponent={<[ModuleName]Form />}
        createFormConfig={[moduleName]FormConfig}
        editFormConfig={[moduleName]FormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
```

### pages/list/page.tsx (DataTableShell)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { DataTableWrapper } from "@settle/core";
import { DataTableShell, AutoBreadcrumb } from "@settle/admin";
import { [MODULE_NAME]_MODULE_CONFIG, [MODULE_NAME]_API } from "../../module.config";
import { [moduleName]ListColumns } from "./list.columns";

export function ListPage() {
  const router = useRouter();

  return (
    <DataTableWrapper
      queryKey="[module-key].list"
      queryGetFn={async () => [MODULE_NAME]_API.get[Plural]()}
      dataKey="results"
    >
      <AutoBreadcrumb items={[{ label: "[Module Label]" }]} />

      <DataTableShell
        moduleInfo={[MODULE_NAME]_MODULE_CONFIG}
        columns={[moduleName]ListColumns}
        idAccessor="id"
        newButtonHref="/admin/[module-slug]/new"
        filterList={[]}
        onEditClick={(record) => router.push(`/admin/[module-slug]/${record.id}/edit`)}
        onReviewClick={(record) => router.push(`/admin/[module-slug]/${record.id}`)}
        onDeleteClick={async (ids) => {
          for (const id of Array.isArray(ids) ? ids : [ids]) {
            await [MODULE_NAME]_API.delete[Singular](String(id));
          }
        }}
      />
    </DataTableWrapper>
  );
}
```

### pages/new/page.tsx (DataTableShell only)

```tsx
"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { [MODULE_NAME]_MODULE_CONFIG, [MODULE_NAME]_API } from "../../module.config";
import { [ModuleName]Form } from "../../form/[ModuleName]Form";
import { [moduleName]FormConfig } from "../../form/form.config";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="[module-key].new"
      formName="[module-name]-form"
      initial={[moduleName]FormConfig.initial}
      steps={[moduleName]FormConfig.steps}
      validation={[moduleName]FormConfig.validation}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => [MODULE_NAME]_API.create[Singular](data)}
      submitSuccessFn={() => router.push("/admin/[module-slug]")}
    >
      <FormShell
        moduleInfo={[MODULE_NAME]_MODULE_CONFIG}
        title="Create [Term]"
        bread={[{ label: "[Module Label]" }, { label: "New" }]}
      >
        <[ModuleName]Form />
      </FormShell>
    </FormWrapper>
  );
}
```

### index.ts

```tsx
export { ListPage } from "./pages/list/page";
export { [ModuleName]Form } from "./form/[ModuleName]Form";
export { [MODULE_NAME]_MODULE_CONFIG, [MODULE_NAME]_API } from "./module.config";
// For DataTableShell:
// export { NewPage } from "./pages/new/page";
// export { EditPage } from "./pages/edit/page";
// export { ViewPage } from "./pages/view/page";
```

### app/admin/[module-slug]/page.tsx

```tsx
import { ListPage } from "@/modules/admin/[module-folder]";
export default ListPage;
```

---

## Important Notes

### Form Design Best Practices

1. **Logical Field Grouping** - Group related fields together (e.g., personal info, contact info, address)
2. **Proper Fill Pattern** - Order fields in the way users naturally think:
   - Name before email
   - Street before city before postal code
   - Start date before end date
3. **Use Grid Layouts** - Place related short fields side-by-side:
   ```tsx
   <Group grow>
     <TextInput label="First Name" {...form.getInputProps("firstName")} />
     <TextInput label="Last Name" {...form.getInputProps("lastName")} />
   </Group>
   ```
4. **Collapsible Sections** - Use `<Accordion>` for optional or advanced fields
5. **Required Fields First** - Place mandatory fields at the top
6. **Sensible Defaults** - Pre-fill common values where appropriate

### Multi-Step Form Guidelines

- **Step 1**: Essential/required information
- **Middle Steps**: Additional details, grouped logically
- **Final Step**: Review summary (read-only display of all values)
- Keep each step focused (5-8 fields max per step)

### Column Selection

- Don't show all fields as columns - pick 5-8 most important
- Always include: ID (or identifier), Name/Title, Status, Date
- Hide sensitive data (passwords, SSN, full card numbers)
- Use render functions for formatted display (dates, badges, avatars)

### API Considerations

- Ensure endpoint matches backend exactly (trailing slashes matter)
- Handle nested data in transforms if API expects different structure
- Consider what fields are editable vs read-only

### Common Mistakes to Avoid

- Don't generate password fields for edit forms (security risk)
- Don't expose sensitive fields in columns (mask or hide)
- Don't forget to add the route page in `app/admin/[slug]/page.tsx`
- Don't skip form validation - always use Zod schemas

---

## After Generation

1. Verify all files created
2. Check imports are correct
3. Run `pnpm build` to check types
4. Test in browser
5. Verify form fill pattern feels natural
6. Check column widths display correctly
