# FormShell Usage Guide

## Overview

`FormShell` is a layout component that provides a complete form structure with built-in navigation buttons. It handles:
- Header with breadcrumbs
- Multi-step form stepper (optional)
- Form content area
- Footer with submit, cancel, and navigation buttons

## Key Improvement

Previously, you had to manually add buttons to every form. Now, `FormShell` includes them automatically!

## Basic Usage

### Simple Form (No Steps)

```tsx
import { FormShell } from "@settle/admin";
import { FormHandler } from "@settle/core";

export function MyForm() {
  return (
    <FormShell
      bread={[
        { label: "Admin" },
        { label: "Module", link: "/admin/module" },
        { label: "New Item" },
      ]}
      moduleInfo={{ label: "Item" }}
      title="Create New Item"
      onCancel={() => router.back()}
    >
      <Stack gap="md">
        <TextInput name="title" label="Title" />
        <TextInput name="description" label="Description" />
        {/* Submit button is automatically included! */}
      </Stack>
    </FormShell>
  );
}
```

### Multi-Step Form (With Stepper)

```tsx
<FormShell
  bread={breadcrumbs}
  moduleInfo={moduleInfo}
  title="Create Item"
  steps={["Basic Info", "Details", "Review"]}
  showStepper={true}
  onCancel={handleCancel}
>
  {/* Form content */}
</FormShell>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bread` | Array | - | Breadcrumb navigation items |
| `moduleInfo` | Object | - | Module information |
| `title` | string | - | Form title |
| `children` | ReactNode | - | Form content |
| `steps` | string[] | [] | Step labels for multi-step forms |
| `disabledSteps` | number[] | [] | Indices of disabled steps |
| `showStepper` | boolean | true | Whether to show step indicator |
| `onCancel` | () => void | - | Callback when cancel is clicked |
| `onStepBack` | () => void | - | Callback for previous step |
| `onStepNext` | () => void | - | Callback for next step |
| `isLoading` | boolean | false | Show loading state on buttons |
| `formName` | string | - | Form identifier |

## Built-in Buttons

### For Simple Forms
- **Submit**: Submits the form
- **Cancel**: Calls `onCancel` callback

### For Multi-Step Forms
- **Previous Step**: Navigates to previous step (disabled on first step)
- **Next Step**: Navigates to next step (shown until last step)
- **Submit**: Submits on last step
- **Cancel**: Always available

## Form Integration with FormHandler

```tsx
<FormShell {...shellProps}>
  <FormHandler {...formConfig} formType="new" onSubmitSuccess={handleSuccess}>
    <Stack gap="md">
      <TextInput name="title" label="Title" />
      <Textarea name="description" label="Description" />
      {/* FormShell provides the submit button automatically */}
    </Stack>
  </FormHandler>
</FormShell>
```

## Button States

Buttons automatically handle:
- **Disabled**: Previous button on first step
- **Loading**: All buttons show loading state when `isLoading={true}`
- **Visibility**: Next/Previous/Submit buttons show based on form type and step

## Styling

The footer uses Mantine colors:
- Background: `var(--mantine-color-gray-0)`
- Border: `1px solid var(--mantine-color-gray-2)`

Buttons follow Mantine's button styling:
- Cancel: `variant="default"`
- Previous: `variant="light"`
- Next: Default (teal)
- Submit: `color="teal"`

## Example: Complete Multi-Step Form

```tsx
<FormShell
  bread={[
    { label: "Admin" },
    { label: "Projects" },
    { label: "New Project" },
  ]}
  moduleInfo={{ label: "Project" }}
  title="Create New Project"
  steps={["Project Info", "Team Members", "Settings", "Confirmation"]}
  showStepper={true}
  isLoading={isLoading}
  onCancel={handleCancel}
>
  <FormHandler {...projectFormConfig} formType="new">
    <Stack gap="md">
      {currentStep === 0 && (
        <>
          <TextInput name="name" label="Project Name" required />
          <Textarea name="description" label="Description" />
        </>
      )}

      {currentStep === 1 && (
        <>
          {/* Team member fields */}
        </>
      )}

      {currentStep === 2 && (
        <>
          {/* Settings fields */}
        </>
      )}

      {currentStep === 3 && (
        <>
          {/* Review/Confirmation */}
        </>
      )}
    </Stack>
  </FormHandler>
</FormShell>
```

## No More Manual Buttons!

### ❌ Before (Manual)
```tsx
<Modal>
  <FormHandler {...config}>
    <Stack gap="md">
      <TextInput name="title" />
      <Group justify="flex-end">
        <Button variant="default" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Submit</Button>  {/* Manual! */}
      </Group>
    </Stack>
  </FormHandler>
</Modal>
```

### ✅ After (Automatic)
```tsx
<FormShell onCancel={onCancel}>
  <FormHandler {...config}>
    <Stack gap="md">
      <TextInput name="title" />
      {/* Buttons are built-in! */}
    </Stack>
  </FormHandler>
</FormShell>
```

## Tips

1. **Always use FormHandler inside FormShell** for proper form submission
2. **Set `isLoading={true}`** when submitting to disable buttons
3. **Use `onCancel`** to handle navigation when cancel is clicked
4. **For steppers**, provide step names in the `steps` array
5. **Buttons are automatically wired** - no onClick handlers needed!
