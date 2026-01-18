# ConfigShell Usage Guide

## Overview

`ConfigShell` is a card-based configuration management layout that provides:
- **Card-based UI** for displaying configuration items
- **Inline editing** with save/cancel functionality
- **Search functionality** with auto-filtering
- **CRUD operations** built-in (Create, Read, Update, Delete)
- **API integration** with automatic refetch
- **Validation support** with Zod schema integration
- **Custom components** for cards and forms
- **Transform functions** for data manipulation

ConfigShell is the recommended choice for managing key-value configurations, settings, and simple data collections.

## Key Features

✅ **Card-Based Layout** - Visual card grid for configuration items
✅ **Inline Editing** - Edit items directly in cards
✅ **Search & Filter** - Auto-search through configurations
✅ **CRUD Operations** - Create, update, delete with API calls
✅ **Validation** - Zod schema validation support
✅ **DataTableWrapper** - Built on React Query for data fetching
✅ **Custom Components** - Customize card and form rendering
✅ **Transform Functions** - Transform data before API calls
✅ **Notifications** - Built-in success/error notifications

## Basic Usage

### Minimal Example - Simple Configuration

```tsx
import { ConfigShell } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";

export function AppSettings() {
  return (
    <DataTableWrapper
      queryKey="settings.list"
      queryGetFn={async () => {
        const response = await fetch("/api/settings");
        return response.json();
      }}
    >
      <ConfigShell
        moduleInfo={{
          label: "Application Settings",
          description: "Manage your app configuration",
        }}
        fields={[
          {
            name: "key",
            label: "Setting Name",
            type: "text",
            required: true,
          },
          {
            name: "value",
            label: "Value",
            type: "text",
            required: true,
          },
        ]}
        idAccessor="id"
        onCreateApi={async (data) => {
          const res = await fetch("/api/settings", {
            method: "POST",
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onEditApi={async (id, data) => {
          const res = await fetch(`/api/settings/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
          });
          return res.json();
        }}
        onDeleteApi={async (id) => {
          await fetch(`/api/settings/${id}`, {
            method: "DELETE",
          });
        }}
      />
    </DataTableWrapper>
  );
}
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| **Core Configuration** |
| `moduleInfo` | `object` | ✅ Yes | - | Module label and description |
| `bread` | `PropConfigBread[]` | No | `undefined` | Breadcrumb navigation |
| `fields` | `PropConfigField[]` | ✅ Yes | - | Field definitions for forms/cards |
| `idAccessor` | `string` | No | `"id"` | Primary key field name |
| **API Functions** |
| `onCreateApi` | `function` | No | `undefined` | API call for creating items |
| `onEditApi` | `function` | No | `undefined` | API call for editing items |
| `onDeleteApi` | `function` | No | `undefined` | API call for deleting items |
| **Legacy Callbacks** |
| `onCreate` | `function` | No | `undefined` | Legacy create callback |
| `onEdit` | `function` | No | `undefined` | Legacy edit callback |
| `onDelete` | `function` | No | `undefined` | Legacy delete callback |
| **Transform Functions** |
| `transformOnCreate` | `function` | No | `(data) => data` | Transform data before create |
| `transformOnEdit` | `function` | No | `(data) => data` | Transform data before edit |
| `transformOnDelete` | `function` | No | `(id) => id` | Transform id before delete |
| **Custom Components** |
| `renderCard` | `Component` | No | `ConfigShellCard` | Custom card component |
| `renderNewCard` | `Component` | No | `ConfigShellCardNew` | Custom create form component |
| **UI Customization** |
| `searchPlaceholder` | `string` | No | `"Search..."` | Search input placeholder |
| `createButtonLabel` | `string` | No | `"Create New"` | Create button text |
| `emptyStateMessage` | `string` | No | `"No items found"` | Empty state text |
| `isLoading` | `boolean` | No | `false` | External loading state |
| `validator` | `ZodSchema` | No | `undefined` | Zod validation schema |

### Field Definition Type

```typescript
type PropConfigField = {
  name: string;                               // Field name/key
  label: string;                              // Display label
  placeholder?: string;                       // Input placeholder
  type?: "text" | "email" | "number" | "textarea"; // Input type
  required?: boolean;                         // Is required
};
```

### Breadcrumb Type

```typescript
type PropConfigBread = {
  label: string;      // Breadcrumb label
  link?: string;      // Optional link
};
```

## Field Configuration

### Basic Fields

```tsx
const fields = [
  {
    name: "key",
    label: "Setting Key",
    type: "text",
    placeholder: "e.g., app.theme",
    required: true,
  },
  {
    name: "value",
    label: "Setting Value",
    type: "text",
    placeholder: "e.g., dark",
    required: true,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Optional description",
    required: false,
  },
];
```

### Field Types

```tsx
const fields = [
  // Text input
  {
    name: "name",
    label: "Name",
    type: "text",
  },
  // Email input
  {
    name: "email",
    label: "Email",
    type: "email",
  },
  // Number input
  {
    name: "maxUsers",
    label: "Max Users",
    type: "number",
  },
  // Textarea
  {
    name: "description",
    label: "Description",
    type: "textarea",
  },
];
```

## API Integration

### Create, Update, Delete

```tsx
<ConfigShell
  fields={fields}
  onCreateApi={async (data) => {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }}
  onEditApi={async (id, data) => {
    const response = await fetch(`/api/settings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return response.json();
  }}
  onDeleteApi={async (id) => {
    const response = await fetch(`/api/settings/${id}`, {
      method: "DELETE",
    });
    return response.json();
  }}
/>
```

### With Transform Functions

```tsx
<ConfigShell
  fields={fields}
  transformOnCreate={(data) => ({
    ...data,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.id,
  })}
  transformOnEdit={(data) => ({
    ...data,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser.id,
  })}
  transformOnDelete={(id) => {
    // Can transform or validate ID before deletion
    return parseInt(id);
  }}
  onCreateApi={createSetting}
  onEditApi={updateSetting}
  onDeleteApi={deleteSetting}
/>
```

## Validation with Zod

### Schema Validation

```tsx
import { z } from "zod";

const settingSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
});

<ConfigShell
  fields={fields}
  validator={settingSchema}
  onCreateApi={async (data) => {
    // Data is validated before this function runs
    return createSetting(data);
  }}
  onEditApi={async (id, data) => {
    // Data is validated before this function runs
    return updateSetting(id, data);
  }}
/>
```

### Complex Validation

```tsx
const configSchema = z.object({
  key: z
    .string()
    .min(3, "Key must be at least 3 characters")
    .regex(/^[a-z0-9_.]+$/, "Key must be lowercase alphanumeric with dots/underscores"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["string", "number", "boolean"]),
  isPublic: z.boolean().default(false),
});

<ConfigShell
  fields={fields}
  validator={configSchema}
  onCreateApi={createConfig}
  onEditApi={updateConfig}
/>
```

## Advanced Examples

### Example 1: API Key Management

```tsx
import { ConfigShell } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";
import { z } from "zod";

const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z.string().min(32, "API key must be at least 32 characters"),
  permissions: z.string().min(1, "Permissions required"),
});

export function ApiKeyManager() {
  return (
    <DataTableWrapper
      queryKey="apikeys.list"
      queryGetFn={fetchApiKeys}
    >
      <ConfigShell
        moduleInfo={{
          label: "API Keys",
          description: "Manage your API access keys",
        }}
        bread={[
          { label: "Settings", link: "/settings" },
          { label: "API Keys" },
        ]}
        fields={[
          {
            name: "name",
            label: "Key Name",
            type: "text",
            placeholder: "e.g., Production API",
            required: true,
          },
          {
            name: "key",
            label: "API Key",
            type: "text",
            placeholder: "Auto-generated or enter manually",
            required: true,
          },
          {
            name: "permissions",
            label: "Permissions",
            type: "text",
            placeholder: "read, write, delete",
            required: true,
          },
        ]}
        validator={apiKeySchema}
        transformOnCreate={(data) => ({
          ...data,
          key: data.key || generateApiKey(),
          createdAt: new Date().toISOString(),
        })}
        onCreateApi={createApiKey}
        onEditApi={updateApiKey}
        onDeleteApi={deleteApiKey}
        searchPlaceholder="Search API keys..."
        createButtonLabel="Generate New Key"
      />
    </DataTableWrapper>
  );
}
```

### Example 2: Environment Variables

```tsx
const envVarSchema = z.object({
  key: z
    .string()
    .regex(/^[A-Z_]+$/, "Must be uppercase with underscores"),
  value: z.string().min(1),
  environment: z.enum(["development", "staging", "production"]),
});

export function EnvironmentVariables() {
  return (
    <DataTableWrapper
      queryKey="envvars.list"
      queryGetFn={fetchEnvVars}
    >
      <ConfigShell
        moduleInfo={{
          label: "Environment Variables",
          description: "Manage environment-specific configuration",
        }}
        fields={[
          {
            name: "key",
            label: "Variable Name",
            type: "text",
            placeholder: "DATABASE_URL",
            required: true,
          },
          {
            name: "value",
            label: "Value",
            type: "text",
            placeholder: "postgres://...",
            required: true,
          },
          {
            name: "environment",
            label: "Environment",
            type: "text",
            placeholder: "production",
            required: true,
          },
        ]}
        validator={envVarSchema}
        onCreateApi={createEnvVar}
        onEditApi={updateEnvVar}
        onDeleteApi={deleteEnvVar}
      />
    </DataTableWrapper>
  );
}
```

### Example 3: Feature Flags

```tsx
export function FeatureFlags() {
  return (
    <DataTableWrapper
      queryKey="features.list"
      queryGetFn={fetchFeatureFlags}
    >
      <ConfigShell
        moduleInfo={{
          label: "Feature Flags",
          description: "Enable or disable features across your app",
        }}
        fields={[
          {
            name: "featureName",
            label: "Feature Name",
            type: "text",
            placeholder: "new_dashboard",
            required: true,
          },
          {
            name: "enabled",
            label: "Enabled",
            type: "text",
            placeholder: "true or false",
            required: true,
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
            placeholder: "What does this feature do?",
            required: false,
          },
        ]}
        transformOnCreate={(data) => ({
          ...data,
          enabled: data.enabled === "true",
        })}
        transformOnEdit={(data) => ({
          ...data,
          enabled: data.enabled === "true",
        })}
        onCreateApi={createFeatureFlag}
        onEditApi={updateFeatureFlag}
        onDeleteApi={deleteFeatureFlag}
      />
    </DataTableWrapper>
  );
}
```

### Example 4: Custom Card Component

```tsx
import { ConfigShellCard } from "@settle/admin";

function CustomSettingCard({ item, ...props }) {
  return (
    <Card>
      <Stack gap="xs">
        <Group justify="space-between">
          <Text fw={600}>{item.key}</Text>
          <Badge color={item.isActive ? "green" : "gray"}>
            {item.isActive ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">{item.value}</Text>

        {props.isEditing ? (
          <EditForm item={item} {...props} />
        ) : (
          <Group gap="xs">
            <Button size="xs" onClick={() => props.onEdit(item)}>
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              onClick={() => props.onDelete(item.id)}
            >
              Delete
            </Button>
          </Group>
        )}
      </Stack>
    </Card>
  );
}

<ConfigShell
  fields={fields}
  renderCard={CustomSettingCard}
  onCreateApi={createSetting}
  onEditApi={updateSetting}
  onDeleteApi={deleteSetting}
/>
```

## Custom Components

### Custom Card Component

```tsx
// Custom card with advanced UI
function CustomCard({ item, isEditing, onEdit, onDelete, onSave, onCancel, fields, idAccessor }) {
  if (isEditing) {
    return <EditMode item={item} onSave={onSave} onCancel={onCancel} />;
  }

  return (
    <Card>
      {/* Custom rendering */}
      <div>{item.key}: {item.value}</div>
      <Button onClick={() => onEdit(item)}>Edit</Button>
      <Button onClick={() => onDelete(item[idAccessor])}>Delete</Button>
    </Card>
  );
}

<ConfigShell renderCard={CustomCard} />
```

### Custom Create Form

```tsx
function CustomNewCard({ onCreate, isLoading, fields }) {
  const [formData, setFormData] = useState({});

  return (
    <Card>
      <Stack>
        {/* Custom form fields */}
        <TextInput
          label="Custom Field"
          onChange={(e) => setFormData({ ...formData, custom: e.target.value })}
        />
        <Button onClick={() => onCreate(formData)} loading={isLoading}>
          Create
        </Button>
      </Stack>
    </Card>
  );
}

<ConfigShell renderNewCard={CustomNewCard} />
```

## TypeScript Usage

```typescript
import { PropConfigField, PropConfigShell } from "@settle/admin";

const fields: PropConfigField[] = [
  {
    name: "key",
    label: "Setting Key",
    type: "text",
    required: true,
  },
  {
    name: "value",
    label: "Setting Value",
    type: "text",
    required: true,
  },
];

interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
}

// Type-safe API functions
const createSetting = async (data: Omit<Setting, "id">): Promise<Setting> => {
  const res = await fetch("/api/settings", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.json();
};
```

## Best Practices

1. **Use Validation**: Always validate data with Zod schemas
2. **Transform Data**: Use transform functions for data manipulation
3. **Provide Defaults**: Set default values for optional fields
4. **Handle Errors**: API errors are automatically shown as notifications
5. **Type Your Data**: Use TypeScript interfaces for settings
6. **Keep Fields Simple**: ConfigShell works best with simple key-value pairs
7. **Use DataTableWrapper**: Always wrap ConfigShell in DataTableWrapper
8. **Descriptive Labels**: Use clear field labels and placeholders

## Troubleshooting

### Issue: Data not refreshing after create/edit/delete

**Solution**: ConfigShell automatically calls `refetch()` from DataTableWrapper context. Ensure you're wrapping it properly:

```tsx
// ✅ Good
<DataTableWrapper queryKey="settings.list" queryGetFn={fetchSettings}>
  <ConfigShell {...props} />
</DataTableWrapper>

// ❌ Bad - No DataTableWrapper
<ConfigShell {...props} />
```

### Issue: Validation errors not showing

**Solution**: Ensure Zod schema is provided and Mantine notifications are set up:

```tsx
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

<Notifications />
```

### Issue: Create button not showing form

**Solution**: Click the button to toggle the form. The button text changes when form is open.

### Issue: Cards not displaying fields

**Solution**: Ensure fields array matches your data structure:

```tsx
// Data: { id: 1, settingKey: "theme", settingValue: "dark" }

// ❌ Bad - Field names don't match
fields={[{ name: "key" }, { name: "value" }]}

// ✅ Good - Field names match data
fields={[{ name: "settingKey" }, { name: "settingValue" }]}
```

## Related Documentation

- [DataTableWrapper Usage](../../../../core/src/wrappers/DataTableWrapper/USAGE.md) - Data fetching wrapper
- [DataTableShell Usage](../DataTableShell/USAGE.md) - Full table layout
- [AdminShell Usage](../AdminShell/USAGE.md) - Admin layout shell
- [Zod Documentation](https://zod.dev/) - Validation library

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
