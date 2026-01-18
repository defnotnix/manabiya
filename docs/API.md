# Settle Framework - Complete API Reference

Comprehensive API documentation for all components, wrappers, helpers, and utilities in the Settle framework.

## Table of Contents

### Core Package (@settle/core)
- [Wrappers](#wrappers)
  - [FormWrapper](#formwrapper)
  - [DataTableWrapper](#datatablewrapper)
  - [PreferenceWrapper](#preferencewrapper)
  - [RolePermsWrapper](#rolePermswrapper)
- [Helpers](#helpers)
  - [apiDispatch](#apiDispatch)
  - [formatJsonSubmit](#formatjsonsubmit)
  - [moduleApiCall](#moduleapicall)
  - [autoSearch](#autosearch)

### Admin Package (@settle/admin)
- [Layouts](#layouts)
  - [AdminShell](#adminshell)
  - [FormShell](#formshell)
  - [ConfigShell](#configshell)
  - [DataTableShell](#datatableshell)
  - [DataTableModalShell](#datatablemodalshell)
- [Components](#components)
  - [Stepper](#stepper)
  - [Tabs](#tabs)
  - [FormSubmitButton](#formsubmitbutton)
- [Helpers](#admin-helpers)
  - [triggerNotification](#triggernotification)
- [Pre-built Pages](#pre-built-pages)
  - [PageSignIn](#pagesignin)

---

# Core Package (@settle/core)

## Wrappers

### FormWrapper

Multi-step form management with API integration and validation.

#### Import

```typescript
import { FormWrapper } from "@settle/core";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Child components |
| `formName` | `string` | ✅ Yes | - | Unique form identifier |
| `initial` | `Record<string, any>` | ✅ Yes | - | Initial form values |
| `steps` | `number` | ✅ Yes | `1` | Number of form steps |
| `validation` | `object[]` | ✅ Yes | - | Validation rules per step |
| `notifications` | `object` | No | - | Notification callbacks |
| `apiSubmitFn` | `function` | No | - | API submission function |
| `onSuccess` | `function` | No | - | Success callback |
| `onError` | `function` | No | - | Error callback |
| `onPreSubmit` | `function` | No | - | Pre-submission transform |
| `dirtCheckKeyIgnore` | `string[]` | No | `[]` | Keys to ignore in dirty check |
| `formatToFormData` | `boolean` | No | `false` | Convert to FormData |
| `testMode` | `boolean` | No | `false` | Enable debug logging |

#### Hooks

**FormWrapper.useForm()**
```typescript
const form = FormWrapper.useForm();
// Returns: UseFormReturnType from Mantine Form
```

**FormWrapper.useFormProps()**
```typescript
const {
  isLoading,      // boolean
  handleSubmit,   // () => void
  errors,         // Record<string, string>
} = FormWrapper.useFormProps();
```

**FormWrapper.useFormStore()**
```typescript
const {
  currentStep,       // number
  totalSteps,        // number
  nextStep,          // () => void
  prevStep,          // () => void
  goToStep,          // (step: number) => void
  canGoNext,         // boolean
  canGoPrev,         // boolean
} = FormWrapper.useFormStore();
```

#### Full Documentation
- [FormWrapper Usage Guide](../packages/core/src/wrappers/FormWrapper/USAGE.md)

---

### DataTableWrapper

Data table management with React Query integration.

#### Import

```typescript
import { DataTableWrapper } from "@settle/core";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Child components |
| `queryKey` | `string` | ✅ Yes | - | React Query cache key |
| `queryGetFn` | `function` | No | - | Data fetching function |
| `enableServerQuery` | `boolean` | No | `false` | Server-side pagination |
| `dataKey` | `string` | No | - | Response data key |
| `paginationDataKey` | `string` | No | - | Pagination metadata key |
| `paginationResponseFn` | `function` | No | `() => {}` | Custom pagination extractor |
| `testMode` | `boolean` | No | `false` | Enable debug logging |

#### Hooks

**DataTableWrapper.useDataTableContext()**
```typescript
const {
  data,       // T[] - Current page data
  isLoading,  // boolean
  isError,    // boolean
  refetch,    // () => void
} = DataTableWrapper.useDataTableContext();
```

**DataTableWrapper.useDataTableWrapperStore()**
```typescript
const {
  page,              // number
  pageSize,          // number
  search,            // string
  filters,           // any
  paginationData,    // any

  setPage,           // (page: number) => void
  setPageSize,       // (size: number) => void
  setSearch,         // (search: string) => void
  setFilters,        // (filters: any) => void
  setPaginationData, // (data: any) => void
} = DataTableWrapper.useDataTableWrapperStore();
```

#### Full Documentation
- [DataTableWrapper Usage Guide](../packages/core/src/wrappers/DataTableWrapper/USAGE.md)

---

### PreferenceWrapper

User preferences management with cookie/backend sync.

#### Import

```typescript
import { PreferenceWrapper, usePreferences } from "@settle/core";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `appKey` | `string` | ✅ Yes | - | Application identifier |
| `userId` | `string \| number` | ✅ Yes | - | User identifier |
| `defaults` | `object` | ✅ Yes | `{}` | Default preferences |
| `version` | `string` | No | `"1.0"` | Preference schema version |
| `fetchPreferenceFn` | `function` | No | - | Server fetch function |
| `onVersionMismatch` | `function` | No | - | Migration function |
| `testMode` | `boolean` | No | `false` | Enable debug logging |

#### Hooks

**usePreferences()**
```typescript
const {
  preferences,         // Current preferences object
  updatePreference,    // (key, value) => void
  resetPreferences,    // () => void
  savePreferences,     // () => void
  initializePreferences, // (prefs, key, defaults) => void
} = usePreferences();
```

#### Full Documentation
- [PreferenceWrapper Usage Guide](../packages/core/src/wrappers/PreferenceWrapper/USAGE.md)

---

### RolePermsWrapper

Role-based permission management.

#### Import

```typescript
import { RolePermsWrapper, RolePermModule, usePermissions } from "@settle/core";
```

#### Props

**RolePermsWrapper**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Child components |
| `defaultPermissions` | `Record<string, boolean>` | No | `{}` | Initial permissions |

**RolePermModule**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Content to render if allowed |
| `moduleKey` | `string` | ✅ Yes | - | Permission key to check |
| `fallback` | `ReactNode` | No | `null` | Content when denied |

#### Hooks

**usePermissions()**
```typescript
const {
  allowAccess,      // boolean - Permission for specific module
  permissions,      // Record<string, boolean> - All permissions
  setPermissions,   // (perms: Record<string, boolean>) => void
} = usePermissions(moduleKey?: string);
```

#### Full Documentation
- [RolePermsWrapper Usage Guide](../packages/core/src/wrappers/RolePermsWrapper/USAGE.md)

---

## Helpers

### apiDispatch

HTTP client with authentication and token management.

#### Import

```typescript
import { apiDispatch } from "@settle/core";
```

#### Methods

**get()**
```typescript
const { err, data } = await apiDispatch.get({
  endpoint: string,
  params?: object
});
```

**post()**
```typescript
const { err, data } = await apiDispatch.post({
  endpoint: string,
  body: any,
  headers?: object
});
```

**patch()**
```typescript
const { err, data } = await apiDispatch.patch({
  endpoint: string,
  body: any,
  headers?: object
});
```

**del()**
```typescript
const { err, data } = await apiDispatch.del({
  endpoint: string,
  id: string,
  headers?: object
});
```

**login()**
```typescript
const { err, data } = await apiDispatch.login({
  endpoint: string,
  body: any
});
```

#### Return Type

```typescript
{
  err: boolean,      // true if error occurred
  data: any | null   // response data or null
}
```

#### Full Documentation
- [Core Helpers Guide](../packages/core/src/helpers/README.md)

---

### formatJsonSubmit

Form data formatting and transformation.

#### Import

```typescript
import { formatJsonSubmit } from "@settle/core";
```

#### Function Signature

```typescript
async function formatJsonSubmit({
  data?: Record<string, any>,
  keyIgnore?: string[],
  stringify?: string[],
  dirtCheckValues?: any,
  formatToFormData?: boolean
}): Promise<Record<string, any> | FormData>
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `Record<string, any>` | Form data to format |
| `keyIgnore` | `string[]` | Keys to exclude |
| `stringify` | `string[]` | Keys to JSON.stringify |
| `dirtCheckValues` | `object` | Original values for dirty check |
| `formatToFormData` | `boolean` | Convert to FormData |

#### Full Documentation
- [Core Helpers Guide](../packages/core/src/helpers/README.md)

---

### moduleApiCall

High-level CRUD operations for API resources.

#### Import

```typescript
import { moduleApiCall } from "@settle/core";
```

#### Methods

**getRecords()**
```typescript
const records = await moduleApiCall.getRecords({
  endpoint: string,
  params?: object,
  paginationProps?: object
});
// Returns: array (empty on error)
```

**getSingleRecord()**
```typescript
const record = await moduleApiCall.getSingleRecord({
  endpoint: string,
  id: string | number,
  params?: object
});
// Returns: object | null
```

**createRecord()**
```typescript
const created = await moduleApiCall.createRecord({
  endpoint: string,
  body: any,
  headers?: object
});
// Returns: object | null
```

**editRecord()**
```typescript
const updated = await moduleApiCall.editRecord({
  endpoint: string,
  id: string | number,
  body: any,
  headers?: object
});
// Returns: object | null
```

**deleteRecord()**
```typescript
const success = await moduleApiCall.deleteRecord({
  endpoint: string,
  id: string | number,
  headers?: object
});
// Returns: boolean
```

**createGroupRecords()**
```typescript
const created = await moduleApiCall.createGroupRecords({
  endpoint: string,
  body: any[],
  headers?: object
});
// Returns: array (empty on error)
```

#### Full Documentation
- [Core Helpers Guide](../packages/core/src/helpers/README.md)

---

### autoSearch

Client-side case-insensitive search.

#### Import

```typescript
import { autoSearch } from "@settle/core";
```

#### Function Signature

```typescript
function autoSearch<T>(
  data: T[],
  search: string
): T[]
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | `T[]` | Array of objects to search |
| `search` | `string` | Search term (case-insensitive) |

#### Returns

Filtered array of items matching the search term.

#### Full Documentation
- [Core Helpers Guide](../packages/core/src/helpers/README.md)

---

# Admin Package (@settle/admin)

## Layouts

### AdminShell

Main admin dashboard layout with navbar and header.

#### Import

```typescript
import { AdminShell } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Page content |
| `navItems` | `PropAdminNavItems[]` | No | `[]` | Navigation items |
| `navModules` | `object` | No | - | Navigation modules |
| `essentials` | `ReactNode` | No | - | Header essentials |
| `softwareInfo` | `object` | No | - | Software information |
| `onLogout` | `function` | No | - | Logout handler |

#### Nav Item Type

```typescript
interface PropAdminNavItems {
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  children?: PropAdminNavItems[];
}
```

#### Full Documentation
- [AdminShell Usage Guide](../packages/admin/src/layouts/AdminShell/USAGE.md)

---

### FormShell

Form layout with stepper and action buttons.

#### Import

```typescript
import { FormShell } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Form content |
| `title` | `string` | No | - | Form title |
| `description` | `string` | No | - | Form description |
| `stepperConfig` | `object` | No | - | Stepper configuration |
| `showStepper` | `boolean` | No | `true` | Show/hide stepper |
| `footerButtons` | `ReactNode` | No | - | Custom footer buttons |
| `headerContent` | `ReactNode` | No | - | Custom header content |

#### Full Documentation
- [FormShell Usage Guide](../packages/admin/src/layouts/FormShell/FORMSHELL_USAGE.md)

---

### ConfigShell

Configuration management layout with card-based UI.

#### Import

```typescript
import { ConfigShell } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `moduleInfo` | `object` | No | - | Module metadata |
| `bread` | `PropConfigBread[]` | No | - | Breadcrumb items |
| `fields` | `PropConfigField[]` | ✅ Yes | - | Field definitions |
| `idAccessor` | `string` | No | `"id"` | ID field name |
| `onCreateApi` | `function` | No | - | Create API handler |
| `onEditApi` | `function` | No | - | Edit API handler |
| `onDeleteApi` | `function` | No | - | Delete API handler |
| `validator` | `ZodSchema` | No | - | Zod validation schema |
| `renderCard` | `Component` | No | - | Custom card component |
| `renderNewCard` | `Component` | No | - | Custom new card component |

#### Full Documentation
- [ConfigShell Usage Guide](../packages/admin/src/layouts/ConfigShell/USAGE.md)

---

### DataTableShell

Complete data table layout with toolbar, filters, and actions.

#### Import

```typescript
import { DataTableShell } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `moduleInfo` | `object` | No | - | Module metadata |
| `idAccessor` | `string` | No | `"id"` | ID field name |
| `columns` | `DataTableColumn[]` | ✅ Yes | - | Table columns |
| `tabs` | `PropTabsTab[]` | No | `[]` | Tab configuration |
| `tableActions` | `object[]` | No | `[]` | Custom row actions |
| `sustained` | `boolean` | No | `false` | Persistent selection |
| `hasServerSearch` | `boolean` | No | `false` | Server-side search |
| `pageSizes` | `number[]` | No | `[10,20,50,100]` | Page size options |
| `hideFilters` | `boolean` | No | `false` | Hide filter toolbar |
| `filterList` | `object[]` | No | `[]` | Filter definitions |
| `newButtonHref` | `string` | No | - | Create button link |
| `onNewClick` | `function` | No | - | Create button handler |
| `onEditClick` | `function` | No | - | Edit row handler |
| `onDeleteClick` | `function` | No | - | Delete handler |
| `onReviewClick` | `function` | No | - | Review handler |
| `rowStyle` | `function` | No | - | Custom row styling |

#### Full Documentation
- [DataTableShell Usage Guide](../packages/admin/src/layouts/DataTableShell/USAGE.md)

---

### DataTableModalShell

Data table with modal CRUD operations.

#### Import

```typescript
import { DataTableModalShell } from "@settle/admin";
```

#### Props

Extends `DataTableShell` props plus:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `modalWidth` | `string` | No | `"md"` | Modal width |
| `modalFormConfig` | `object` | No | - | Form configuration |
| `onCreateApi` | `function` | No | - | Create API handler |
| `onEditApi` | `function` | No | - | Edit API handler |
| `onDeleteApi` | `function` | No | - | Delete API handler |
| `onEditTrigger` | `function` | No | - | Pre-edit data fetch |
| `transformOnCreate` | `function` | No | - | Create data transform |
| `transformOnEdit` | `function` | No | - | Edit data transform |
| `transformOnDelete` | `function` | No | - | Delete data transform |
| `createFormComponent` | `Component` | No | - | Custom create form |
| `editFormComponent` | `Component` | No | - | Custom edit form |
| `validator` | `ZodSchema` | No | - | Zod validation |

#### Context Hook

```typescript
const {
  isCreateModalOpen,
  isEditModalOpen,
  activeEditRecord,
  editLoading,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
} = useDataTableModalShellContext();
```

#### Full Documentation
- [DataTableModalShell Usage Guide](../packages/admin/src/layouts/DataTableModalShell/USAGE.md)

---

## Components

### Stepper

Multi-step form indicator with navigation.

#### Import

```typescript
import { Stepper } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `labels` | `string[]` | ✅ Yes | - | Step labels |
| `active` | `number` | ✅ Yes | - | Current step index |
| `onChange` | `function` | No | - | Step change handler |
| `allowStepSelect` | `boolean` | No | `true` | Allow clicking steps |
| `orientation` | `"horizontal" \| "vertical"` | No | `"horizontal"` | Layout orientation |
| `iconSize` | `number` | No | - | Icon size |
| `completedIcon` | `ReactNode` | No | - | Completed step icon |

#### Full Documentation
- [Stepper Documentation](../packages/admin/src/components/Stepper/README.md)

---

### Tabs

Tab navigation component.

#### Import

```typescript
import { Tabs } from "@settle/admin";
```

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `PropTabsTab[]` | ✅ Yes | - | Tab definitions |
| `active` | `number` | ✅ Yes | - | Active tab index |
| `onTabChange` | `function` | ✅ Yes | - | Tab change handler |

#### Tab Type

```typescript
interface PropTabsTab {
  label: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
}
```

#### Full Documentation
- [Tabs Usage Guide](../packages/admin/src/components/Tabs/USAGE.md)

---

### FormSubmitButton

Smart submit button with loading states.

#### Import

```typescript
import { FormSubmitButton } from "@settle/admin";
```

#### Props

Extends Mantine `GroupProps` plus:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isCreate` | `boolean` | No | `true` | Create vs update mode |
| `isLoading` | `boolean` | No | - | Override loading state |

#### Full Documentation
- [FormSubmitButton Usage Guide](../packages/admin/src/components/FormSubmitButton/USAGE.md)

---

## Admin Helpers

### triggerNotification

Context-aware notification system.

#### Import

```typescript
import { triggerNotification } from "@settle/admin";
```

#### Sub-modules

**Form Notifications**
```typescript
triggerNotification.form.isLoading({ title, message, ...props });
triggerNotification.form.isSuccess({ title, message, ...props });
triggerNotification.form.isError({ title, message, ...props });
triggerNotification.form.isWarning({ title, message, ...props });
triggerNotification.form.isValidationError({ title, message, ...props });
triggerNotification.form.isValidationStepError({ title, message, ...props });
triggerNotification.form.isInfo({ title, message, ...props });
```

**List Notifications**
```typescript
triggerNotification.list.isLoading({ title, message, ...props });
triggerNotification.list.isSuccess({ title, message, ...props });
triggerNotification.list.isError({ title, message, ...props });
triggerNotification.list.isWarning({ title, message, ...props });
triggerNotification.list.isInfo({ title, message, ...props });
```

**Auth Notifications**
```typescript
triggerNotification.auth.isLoading({ title, message, ...props });
triggerNotification.auth.isSuccess({ title, message, ...props });
triggerNotification.auth.isError({ title, message, ...props });
triggerNotification.auth.isWarning({ title, message, ...props });
triggerNotification.auth.isTokenExpired({ title, message, ...props });
triggerNotification.auth.isInfo({ title, message, ...props });
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `title` | `string` | Notification title |
| `message` | `string` | Notification message |
| `...props` | `object` | Additional Mantine notification props |

#### Full Documentation
- [Notification System Usage Guide](../packages/admin/src/helpers/triggerNotification/USAGE.md)

---

## Pre-built Pages

### PageSignIn

Production-ready authentication page.

#### Import

```typescript
import { PageSignIn } from "@settle/admin";
```

#### Features
- Email/password authentication
- OAuth providers (Google, Apple, Discord)
- Magic link authentication
- Token management
- Error handling
- Loading states

#### Full Documentation
- [PageSignIn Usage Guide](../packages/admin/src/pre-built/PageSignIn/docs/USAGE.md)

---

## Type Definitions

All components and functions are fully typed with TypeScript. Import types as needed:

```typescript
import type {
  PropFormWrapper,
  PropDataTableWrapper,
  PropAdminNavItems,
  PropConfigField,
  // ... and many more
} from "@settle/core" or "@settle/admin";
```

---

## Version Information

- **Current Version**: Beta 0.1.0
- **TypeScript**: 5.9.3
- **React**: 19.2.3
- **Mantine**: 8.3.10

---

## Additional Resources

- [Main Documentation](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Changelog](../CHANGELOG.md)
- [GitHub Repository](https://github.com/your-org/settle)

---

**Questions or Issues?** Please [open an issue](https://github.com/your-org/settle/issues) on GitHub.
