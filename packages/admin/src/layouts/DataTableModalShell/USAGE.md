# DataTableModalShell Usage Guide

## Overview

`DataTableModalShell` is a complete data table layout with built-in modal-based CRUD operations. It extends `DataTableShell` with:
- **Modal create forms** for adding new records
- **Modal edit forms** for updating records
- **Delete confirmation modals** for safe deletion
- **Bulk delete support** with confirmation
- **API integration** with automatic refetch
- **Validation support** with Zod schemas
- **Custom form components** for create/edit
- **Transform functions** for data manipulation

DataTableModalShell is the recommended choice for full CRUD data tables where create and edit operations happen in modals.

## Key Features

✅ **Modal CRUD** - Create, edit, delete in modal dialogs
✅ **Complete Table Layout** - All DataTableShell features included
✅ **API Integration** - Built-in create, edit, delete API calls
✅ **Validation** - Zod schema validation support
✅ **Delete Confirmation** - Safety modal before deletion
✅ **Bulk Operations** - Select and delete multiple records
✅ **Custom Forms** - Use your own form components
✅ **Transform Functions** - Modify data before API calls
✅ **Auto Refetch** - Table updates after operations

## Basic Usage

### Minimal Example

```tsx
import { DataTableModalShell } from "@settle/admin";
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
      <DataTableModalShell
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
        onCreateApi={async (data) => {
          const res = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onEditApi={async (id, data) => {
          const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onDeleteApi={async (id) => {
          await fetch(`/api/users/${id}`, { method: "DELETE" });
        }}
        createFormComponent={<UserForm isCreate />}
        editFormComponent={<UserForm isCreate={false} />}
      />
    </DataTableWrapper>
  );
}
```

### With Custom Form Component

```tsx
import { FormWrapper } from "@settle/core";

function UserForm({ isCreate }) {
  const form = FormWrapper.useForm();
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <Stack gap="md">
      <TextInput
        label="First Name"
        {...form.getInputProps("firstName")}
        required
      />
      <TextInput
        label="Last Name"
        {...form.getInputProps("lastName")}
        required
      />
      <TextInput
        label="Email"
        type="email"
        {...form.getInputProps("email")}
        required
      />
      <FormSubmitButton isCreate={isCreate} isLoading={isLoading} />
    </Stack>
  );
}

<DataTableModalShell
  moduleInfo={{ name: "Users", term: "User" }}
  columns={columns}
  createFormComponent={<UserForm isCreate />}
  editFormComponent={<UserForm isCreate={false} />}
  onCreateApi={createUser}
  onEditApi={updateUser}
  onDeleteApi={deleteUser}
/>
```

## Props Reference

DataTableModalShell extends DataTableShell, so all DataTableShell props are available plus:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| **API Functions** |
| `onCreateApi` | `function` | No | `undefined` | API call for creating records |
| `onEditApi` | `function` | No | `undefined` | API call for updating records |
| `onDeleteApi` | `function` | No | `undefined` | API call for deleting records |
| **Callbacks** |
| `onCreateSuccess` | `function` | No | `undefined` | Called after successful create |
| `onEditSuccess` | `function` | No | `undefined` | Called after successful edit |
| `onDeleteSuccess` | `function` | No | `undefined` | Called after successful delete |
| `onEditTrigger` | `function` | No | `(row) => row` | Fetch full record before edit modal |
| **Transform Functions** |
| `transformOnCreate` | `function` | No | `(data) => data` | Transform data before create API |
| `transformOnEdit` | `function` | No | `(data) => data` | Transform data before edit API |
| `transformOnDelete` | `function` | No | `(id) => id` | Transform ID before delete API |
| **Form Components** |
| `createFormComponent` | `ReactNode \| function` | No | `undefined` | Custom create form |
| `editFormComponent` | `ReactNode \| function` | No | `undefined` | Custom edit form |
| **Modal Configuration** |
| `modalWidth` | `string \| number` | No | `"md"` | Modal width (xs, sm, md, lg, xl) |
| `validator` | `ZodSchema` | No | `undefined` | Zod validation schema |

### API Function Signatures

```typescript
onCreateApi: (data: any) => Promise<any>
onEditApi: (id: string | number, data: any) => Promise<any>
onDeleteApi: (id: string | number) => Promise<void>
```

### Callback Signatures

```typescript
onCreateSuccess: (response: any) => void
onEditSuccess: (response: any) => void
onDeleteSuccess: (id: string | number) => void
onEditTrigger: (row: any) => Promise<any>
```

## Modal Form Integration

### Using FormWrapper in Modal Forms

```tsx
import { FormWrapper } from "@settle/core";
import { FormSubmitButton } from "@settle/admin";

function UserFormContent({ isCreate }) {
  const form = FormWrapper.useForm();

  return (
    <Stack>
      <TextInput
        label="First Name"
        placeholder="John"
        {...form.getInputProps("firstName")}
        required
      />
      <TextInput
        label="Last Name"
        placeholder="Doe"
        {...form.getInputProps("lastName")}
        required
      />
      <TextInput
        label="Email"
        placeholder="john@example.com"
        {...form.getInputProps("email")}
        required
      />
      <Select
        label="Role"
        data={["admin", "user", "guest"]}
        {...form.getInputProps("role")}
        required
      />
      <FormSubmitButton isCreate={isCreate} />
    </Stack>
  );
}

<DataTableModalShell
  moduleInfo={{ name: "Users", term: "User" }}
  columns={columns}
  createFormComponent={<UserFormContent isCreate />}
  editFormComponent={<UserFormContent isCreate={false} />}
  onCreateApi={createUser}
  onEditApi={updateUser}
  onDeleteApi={deleteUser}
/>
```

### Form Component as Function

```tsx
const renderForm = ({ isCreate }) => {
  const form = FormWrapper.useForm();

  return (
    <Stack>
      {/* Form fields */}
      <FormSubmitButton isCreate={isCreate} />
    </Stack>
  );
};

<DataTableModalShell
  createFormComponent={renderForm}
  editFormComponent={renderForm}
  onCreateApi={createUser}
  onEditApi={updateUser}
/>
```

## Validation with Zod

### Basic Validation

```tsx
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "user", "guest"]),
});

<DataTableModalShell
  moduleInfo={{ name: "Users", term: "User" }}
  columns={columns}
  validator={userSchema}
  createFormComponent={<UserForm isCreate />}
  editFormComponent={<UserForm isCreate={false} />}
  onCreateApi={createUser}
  onEditApi={updateUser}
  onDeleteApi={deleteUser}
/>
```

### Advanced Validation

```tsx
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  sku: z
    .string()
    .regex(/^[A-Z0-9-]+$/, "SKU must be uppercase alphanumeric"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
});

<DataTableModalShell
  validator={productSchema}
  // ... other props
/>
```

## Data Transformation

### Transform Before API Calls

```tsx
<DataTableModalShell
  moduleInfo={{ name: "Users", term: "User" }}
  columns={columns}
  transformOnCreate={(data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
    createdAt: new Date().toISOString(),
    status: "active",
  })}
  transformOnEdit={(data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
    updatedAt: new Date().toISOString(),
  })}
  transformOnDelete={(id) => parseInt(id, 10)}
  createFormComponent={<UserForm isCreate />}
  editFormComponent={<UserForm isCreate={false} />}
  onCreateApi={createUser}
  onEditApi={updateUser}
  onDeleteApi={deleteUser}
/>
```

## Advanced Examples

### Example 1: Complete User Management

```tsx
import { DataTableModalShell } from "@settle/admin";
import { DataTableWrapper, FormWrapper } from "@settle/core";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin", "user", "guest"]),
});

function UserForm({ isCreate }) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <TextInput
        label="First Name"
        {...form.getInputProps("firstName")}
        required
      />
      <TextInput
        label="Last Name"
        {...form.getInputProps("lastName")}
        required
      />
      <TextInput
        label="Email"
        type="email"
        {...form.getInputProps("email")}
        required
      />
      <Select
        label="Role"
        data={[
          { value: "admin", label: "Administrator" },
          { value: "user", label: "User" },
          { value: "guest", label: "Guest" },
        ]}
        {...form.getInputProps("role")}
        required
      />
      <FormSubmitButton isCreate={isCreate} />
    </Stack>
  );
}

export function UsersPage() {
  const router = useRouter();

  const columns = [
    { accessor: "id", title: "ID", width: 80 },
    { accessor: "firstName", title: "First Name" },
    { accessor: "lastName", title: "Last Name" },
    { accessor: "email", title: "Email" },
    {
      accessor: "role",
      title: "Role",
      render: (record) => (
        <Badge variant="light">{record.role}</Badge>
      ),
    },
  ];

  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={async () => {
        const res = await fetch("/api/users");
        return res.json();
      }}
    >
      <DataTableModalShell
        moduleInfo={{ name: "Users", term: "User" }}
        idAccessor="id"
        columns={columns}
        validator={userSchema}
        createFormComponent={<UserForm isCreate />}
        editFormComponent={<UserForm isCreate={false} />}
        onCreateApi={async (data) => {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onEditApi={async (id, data) => {
          const res = await fetch(`/api/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onDeleteApi={async (id) => {
          await fetch(`/api/users/${id}`, { method: "DELETE" });
        }}
        onCreateSuccess={(res) => {
          console.log("User created:", res);
        }}
        onReviewClick={(record) => router.push(`/users/${record.id}`)}
      />
    </DataTableWrapper>
  );
}
```

### Example 2: Products with onEditTrigger

```tsx
export function ProductsPage() {
  const columns = [
    { accessor: "id", title: "ID" },
    { accessor: "name", title: "Product Name" },
    { accessor: "sku", title: "SKU" },
    { accessor: "price", title: "Price" },
  ];

  return (
    <DataTableWrapper queryKey="products.list" queryGetFn={fetchProducts}>
      <DataTableModalShell
        moduleInfo={{ name: "Products", term: "Product" }}
        columns={columns}
        createFormComponent={<ProductForm isCreate />}
        editFormComponent={<ProductForm isCreate={false} />}
        onCreateApi={createProduct}
        onEditApi={updateProduct}
        onDeleteApi={deleteProduct}
        // Fetch full product data before opening edit modal
        onEditTrigger={async (row) => {
          const res = await fetch(`/api/products/${row.id}`);
          return res.json();
        }}
      />
    </DataTableWrapper>
  );
}
```

### Example 3: With Custom Modal Width

```tsx
<DataTableModalShell
  moduleInfo={{ name: "Settings", term: "Setting" }}
  columns={columns}
  modalWidth="lg"  // Larger modal for complex forms
  createFormComponent={<SettingsForm isCreate />}
  editFormComponent={<SettingsForm isCreate={false} />}
  onCreateApi={createSetting}
  onEditApi={updateSetting}
  onDeleteApi={deleteSetting}
/>
```

### Example 4: With Success Callbacks

```tsx
import { notifications } from "@mantine/notifications";

<DataTableModalShell
  moduleInfo={{ name: "Orders", term: "Order" }}
  columns={columns}
  createFormComponent={<OrderForm isCreate />}
  editFormComponent={<OrderForm isCreate={false} />}
  onCreateApi={createOrder}
  onEditApi={updateOrder}
  onDeleteApi={deleteOrder}
  onCreateSuccess={(res) => {
    notifications.show({
      title: "Order Created",
      message: `Order #${res.orderNumber} created successfully`,
      color: "green",
    });
    // Additional actions (e.g., send email, update analytics)
    sendOrderConfirmationEmail(res.id);
  }}
  onEditSuccess={(res) => {
    notifications.show({
      title: "Order Updated",
      message: `Order #${res.orderNumber} updated`,
      color: "blue",
    });
  }}
  onDeleteSuccess={(id) => {
    notifications.show({
      title: "Order Deleted",
      message: `Order deleted successfully`,
      color: "red",
    });
  }}
/>
```

### Example 5: Nested Data with Transform

```tsx
<DataTableModalShell
  moduleInfo={{ name: "Customers", term: "Customer" }}
  columns={columns}
  createFormComponent={<CustomerForm isCreate />}
  editFormComponent={<CustomerForm isCreate={false} />}
  transformOnCreate={(data) => ({
    profile: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
    address: {
      street: data.street,
      city: data.city,
      zip: data.zip,
    },
    preferences: {
      newsletter: data.newsletter || false,
    },
  })}
  transformOnEdit={(data) => ({
    profile: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    },
    address: {
      street: data.street,
      city: data.city,
      zip: data.zip,
    },
  })}
  onCreateApi={createCustomer}
  onEditApi={updateCustomer}
  onDeleteApi={deleteCustomer}
/>
```

## Delete Confirmation

DataTableModalShell automatically shows a confirmation modal before deletion:

```tsx
// Triggered when user clicks delete
// Shows modal with:
// - Title: "Confirm deletion"
// - Warning icon (red)
// - Message: "This action cannot be undone. Are you sure?"
// - Confirm button (red)
// - Cancel button

// For bulk delete:
// - Message: "Are you sure you want to delete {n} items?"
```

## TypeScript Usage

```typescript
import { DataTableModalShell } from "@settle/admin";
import type { DataTableColumn } from "mantine-datatable";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "guest";
}

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user" | "guest";
}

const columns: DataTableColumn<User>[] = [
  { accessor: "id", title: "ID" },
  { accessor: "firstName", title: "First Name" },
  { accessor: "lastName", title: "Last Name" },
  { accessor: "email", title: "Email" },
];

const createUser = async (data: UserFormData): Promise<User> => {
  const res = await fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};

const updateUser = async (id: number, data: UserFormData): Promise<User> => {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return res.json();
};

const deleteUser = async (id: number): Promise<void> => {
  await fetch(`/api/users/${id}`, { method: "DELETE" });
};
```

## Best Practices

1. **Use FormWrapper**: Build modal forms with FormWrapper for consistency
2. **Validate Data**: Always use Zod schemas for validation
3. **Transform Wisely**: Use transform functions to match API requirements
4. **Handle Success**: Provide success callbacks for notifications
5. **Fetch Full Data**: Use `onEditTrigger` to fetch complete record data
6. **Type Everything**: Use TypeScript for API functions and data types
7. **Keep Forms Simple**: Break complex forms into multiple steps
8. **Test Delete**: Always test bulk delete functionality

## Troubleshooting

### Issue: Modal not opening

**Solution**: Ensure `onCreateApi` or `onEditApi` is provided:

```tsx
// ❌ Bad - No API functions
<DataTableModalShell createFormComponent={<Form />} />

// ✅ Good - API functions provided
<DataTableModalShell
  createFormComponent={<Form />}
  onCreateApi={createRecord}
/>
```

### Issue: Form not submitting

**Solution**: Ensure form component uses `FormSubmitButton`:

```tsx
import { FormSubmitButton } from "@settle/admin";

function MyForm({ isCreate }) {
  return (
    <Stack>
      {/* Fields */}
      <FormSubmitButton isCreate={isCreate} />
    </Stack>
  );
}
```

### Issue: Validation errors not showing

**Solution**: Ensure Mantine notifications are set up and Zod schema is correct:

```tsx
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

// In app root
<Notifications />
```

### Issue: Data not refreshing after CRUD

**Solution**: DataTableModalShell automatically calls `refetch()` after operations. Ensure DataTableWrapper is set up correctly.

### Issue: Edit modal shows stale data

**Solution**: Use `onEditTrigger` to fetch fresh data:

```tsx
<DataTableModalShell
  onEditTrigger={async (row) => {
    const res = await fetch(`/api/items/${row.id}`);
    return res.json();
  }}
/>
```

## Related Documentation

- [DataTableShell Usage](../DataTableShell/USAGE.md) - Base table layout
- [DataTableWrapper Usage](../../../../core/src/wrappers/DataTableWrapper/USAGE.md) - Data fetching
- [FormWrapper Usage](../../../../core/src/wrappers/FormWrapper/USAGE.md) - Form management
- [FormSubmitButton Usage](../../components/FormSubmitButton/USAGE.md) - Submit button component

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
