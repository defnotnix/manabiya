# FormShell

A layout component for page-based forms with optional stepper navigation. Used with `FormWrapper` for multi-step or single-step forms on dedicated pages.

## When to Use

- Page-based create/edit forms (not modals)
- Multi-step form workflows
- When you need a stepper UI for form progress

## Basic Usage

```tsx
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="module.new"
      formName="module-form"
      initial={{ name: "", email: "" }}
      steps={1}
      validation={[zodResolver(schema)]}
      apiSubmitFn={async (data) => API.create(data)}
      submitSuccessFn={() => router.push("/admin/module")}
    >
      <FormShell
        moduleInfo={MODULE_CONFIG}
        title="Create New Item"
        bread={[{ label: "Items" }, { label: "New" }]}
      >
        <ModuleForm />
      </FormShell>
    </FormWrapper>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `moduleInfo` | `object` | - | Module configuration |
| `title` | `string` | - | Page title |
| `bread` | `array` | - | Breadcrumb items |
| `children` | `ReactNode` | - | Form content |
| `steps` | `(string \| Step)[]` | `[]` | Step labels |
| `showStepper` | `boolean` | `true` | Show/hide stepper |
| `disabledSteps` | `number[]` | `[]` | Steps to disable |
| `isLoading` | `boolean` | `false` | Loading state |

### Stepper Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableStepClick` | `boolean` | `false` | Allow clicking steps to navigate |
| `enableStepCompleteClickOnly` | `boolean` | `false` | Only allow clicking completed steps |
| `enableStepTracking` | `boolean` | `false` | Track completed steps |
| `iconActive` | `ReactNode` | - | Custom active step icon |
| `iconComplete` | `ReactNode` | - | Custom completed step icon |
| `iconIncomplete` | `ReactNode` | - | Custom incomplete step icon |

### Navigation Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onStepBack` | `() => void` | Custom back button handler |
| `onStepNext` | `() => void` | Custom next button handler |
| `onCancel` | `() => void` | Custom cancel button handler |

## Step Labels

Steps can be strings or objects with descriptions:

```tsx
// Simple strings
steps={["Basic Info", "Contact", "Review"]}

// With descriptions
steps={[
  { label: "Basic Info", description: "Enter your name and email" },
  { label: "Contact", description: "Add your phone and address" },
  { label: "Review", description: "Review and submit" },
]}

// Mixed
steps={[
  "Basic Info",
  { label: "Contact", description: "Optional contact details" },
  "Review",
]}
```

## Multi-Step Form Example

```tsx
"use client";

import { useRouter } from "next/navigation";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { MODULE_CONFIG, MODULE_API } from "../../module.config";
import { ModuleForm, STEPS } from "../../form/ModuleForm";
import { moduleFormConfig } from "../../form/form.config";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="module.new"
      formName="module-form"
      initial={moduleFormConfig.initial}
      steps={moduleFormConfig.steps}
      validation={moduleFormConfig.validation}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return MODULE_API.create(data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/module");
      }}
    >
      <FormShell
        moduleInfo={MODULE_CONFIG}
        title="Create New Item"
        bread={[{ label: "Items" }, { label: "New" }]}
        steps={STEPS}
        showStepper={true}
      >
        <ModuleForm />
      </FormShell>
    </FormWrapper>
  );
}
```

## Edit Page Example

```tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FormWrapper } from "@settle/core";
import { FormShell, triggerNotification } from "@settle/admin";
import { Loader, Center } from "@mantine/core";
import { MODULE_CONFIG, MODULE_API } from "../../module.config";
import { ModuleForm, STEPS } from "../../form/ModuleForm";
import { moduleFormConfig } from "../../form/form.config";

export function EditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data: record, isLoading } = useQuery({
    queryKey: ["module", id],
    queryFn: () => MODULE_API.get(id),
  });

  if (isLoading) {
    return <Center h="100vh"><Loader /></Center>;
  }

  return (
    <FormWrapper
      queryKey={`module.edit.${id}`}
      formName="module-form"
      initial={record || moduleFormConfig.initial}
      primaryKey="id"
      steps={moduleFormConfig.steps}
      validation={moduleFormConfig.validation}
      notifications={triggerNotification.form}
      apiSubmitFn={async (data) => {
        return MODULE_API.update(id, data);
      }}
      submitSuccessFn={() => {
        router.push("/admin/module");
      }}
    >
      <FormShell
        moduleInfo={MODULE_CONFIG}
        title="Edit Item"
        bread={[
          { label: "Items" },
          { label: record?.name || "Edit" },
        ]}
        steps={STEPS}
        showStepper={moduleFormConfig.steps > 1}
      >
        <ModuleForm isCreate={false} />
      </FormShell>
    </FormWrapper>
  );
}
```

## Form Component with Steps

```tsx
// form/ModuleForm.tsx
"use client";

import { Stack, TextInput, Select } from "@mantine/core";
import { FormWrapper } from "@settle/core";

interface ModuleFormProps {
  currentStep?: number;
  isCreate?: boolean;
}

export function ModuleForm({ currentStep = 0, isCreate = true }: ModuleFormProps) {
  const form = FormWrapper.useForm();

  // Step 1: Basic Info
  if (currentStep === 0) {
    return (
      <Stack gap="md">
        <TextInput
          label="Name"
          {...form.getInputProps("name")}
          required
        />
        <TextInput
          label="Email"
          type="email"
          {...form.getInputProps("email")}
          required
        />
      </Stack>
    );
  }

  // Step 2: Details
  if (currentStep === 1) {
    return (
      <Stack gap="md">
        <TextInput
          label="Phone"
          {...form.getInputProps("phone")}
        />
        <Select
          label="Category"
          data={["A", "B", "C"]}
          {...form.getInputProps("category")}
        />
      </Stack>
    );
  }

  // Step 3: Review
  return (
    <Stack gap="md">
      <Text><b>Name:</b> {form.values.name}</Text>
      <Text><b>Email:</b> {form.values.email}</Text>
      <Text><b>Phone:</b> {form.values.phone}</Text>
      <Text><b>Category:</b> {form.values.category}</Text>
    </Stack>
  );
}

// Export step labels
export const STEPS = ["Basic Info", "Details", "Review"];
```

## Single-Step Form (No Stepper)

```tsx
<FormShell
  moduleInfo={MODULE_CONFIG}
  title="Create Item"
  bread={[{ label: "Items" }, { label: "New" }]}
  showStepper={false}  // Hide stepper for single-step forms
>
  <ModuleForm />
</FormShell>
```

## Breadcrumb Configuration

```tsx
bread={[
  { label: "Dashboard", link: "/admin" },
  { label: "Users", link: "/admin/users" },
  { label: "New" },  // No link = current page
]}
```

## With Disabled Steps

```tsx
<FormWrapper
  steps={4}
  disabledSteps={[2]}  // Skip step index 2
  // ...
>
  <FormShell
    steps={["Step 1", "Step 2", "Step 3 (Skipped)", "Step 4"]}
    disabledSteps={[2]}
    // ...
  >
    <Form />
  </FormShell>
</FormWrapper>
```

## Related Components

- [FormWrapper](../../../core/src/wrappers/FormWrapper/USAGE.md) - Form state management
- [DataTableShell](../DataTableShell/USAGE.md) - Page-based data tables
- [DataTableModalShell](../DataTableModalShell/USAGE.md) - Modal-based forms
