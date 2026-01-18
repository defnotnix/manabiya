# FormSubmitButton Usage Guide

## Overview

`FormSubmitButton` is a smart submit button component designed for use with FormWrapper. It provides:
- **Automatic loading state** from FormWrapper context
- **Dynamic button text** based on create vs update mode
- **Loading spinner** during form submission
- **Disabled state** during submission
- **Flexible positioning** via Mantine Group props
- **Type-safe integration** with FormWrapper

FormSubmitButton is the recommended choice for submit buttons in FormWrapper-based forms.

## Key Features

✅ **Context-Aware** - Automatically detects FormWrapper loading state
✅ **Dynamic Text** - Changes text based on create/update mode
✅ **Loading States** - Shows spinner during submission
✅ **Auto-Submit** - Calls FormWrapper's handleSubmit on click
✅ **Customizable** - Accepts all Mantine Group props
✅ **Type-Safe** - Full TypeScript support

## Basic Usage

### Minimal Example

```tsx
import { FormWrapper } from "@settle/core";
import { FormSubmitButton } from "@settle/admin";
import { TextInput, Stack } from "@mantine/core";

function MyForm() {
  return (
    <FormWrapper
      formName="my-form"
      initial={{ name: "", email: "" }}
      steps={1}
      validation={[{}]}
      apiSubmitFn={async (data) => {
        const res = await fetch("/api/submit", {
          method: "POST",
          body: JSON.stringify(data),
        });
        return res.json();
      }}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <TextInput
        label="Name"
        {...form.getInputProps("name")}
        required
      />
      <TextInput
        label="Email"
        {...form.getInputProps("email")}
        required
      />

      {/* Submit button - automatically handles loading */}
      <FormSubmitButton isCreate />
    </Stack>
  );
}
```

### Create Mode

```tsx
// Shows "Create" when not loading, "Creating..." when loading
<FormSubmitButton isCreate />
```

### Update Mode

```tsx
// Shows "Save Changes" when not loading, "Updating..." when loading
<FormSubmitButton isCreate={false} />
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isCreate` | `boolean` | No | `true` | Whether this is a create or update operation |
| `isLoading` | `boolean` | No | FormWrapper state | Override loading state |
| `...GroupProps` | `GroupProps` | No | - | All Mantine Group props (justify, mt, etc.) |

### FormSubmitButton Extends GroupProps

Since FormSubmitButton wraps a Mantine Group, you can use any Group props:

```tsx
<FormSubmitButton
  isCreate
  justify="flex-end"    // Align button to right
  mt="md"               // Margin top
  px="lg"               // Padding horizontal
/>
```

## Button States

### Create Mode States

```tsx
// Not loading
<FormSubmitButton isCreate />
// Button text: "Create"

// Loading (during submission)
<FormSubmitButton isCreate />
// Button text: "Creating..."
// Button shows spinner
// Button is disabled
```

### Update Mode States

```tsx
// Not loading
<FormSubmitButton isCreate={false} />
// Button text: "Save Changes"

// Loading (during submission)
<FormSubmitButton isCreate={false} />
// Button text: "Updating..."
// Button shows spinner
// Button is disabled
```

## Advanced Examples

### Example 1: Create User Form

```tsx
import { FormWrapper } from "@settle/core";
import { FormSubmitButton } from "@settle/admin";

function CreateUserForm() {
  return (
    <FormWrapper
      formName="create-user"
      initial={{
        firstName: "",
        lastName: "",
        email: "",
      }}
      steps={1}
      validation={[
        {
          firstName: (val) => (!val ? "Required" : null),
          lastName: (val) => (!val ? "Required" : null),
          email: (val) => (!val ? "Required" : null),
        },
      ]}
      apiSubmitFn={createUser}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
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
        {...form.getInputProps("email")}
        required
      />

      <FormSubmitButton isCreate />
    </Stack>
  );
}
```

### Example 2: Edit User Form

```tsx
function EditUserForm({ user }) {
  return (
    <FormWrapper
      formName="edit-user"
      initial={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }}
      steps={1}
      validation={[
        {
          firstName: (val) => (!val ? "Required" : null),
          lastName: (val) => (!val ? "Required" : null),
          email: (val) => (!val ? "Required" : null),
        },
      ]}
      apiSubmitFn={(data) => updateUser(user.id, data)}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
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
        {...form.getInputProps("email")}
        required
      />

      {/* Update mode */}
      <FormSubmitButton isCreate={false} />
    </Stack>
  );
}
```

### Example 3: With Custom Positioning

```tsx
function FormContent() {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      {/* Form fields */}
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Email" {...form.getInputProps("email")} />

      {/* Right-aligned submit button */}
      <FormSubmitButton
        isCreate
        justify="flex-end"
        mt="xl"
      />
    </Stack>
  );
}
```

### Example 4: With Cancel Button

```tsx
function FormContent({ onCancel }) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Email" {...form.getInputProps("email")} />

      {/* Submit and Cancel buttons */}
      <Group justify="space-between" mt="md">
        <Button variant="light" onClick={onCancel}>
          Cancel
        </Button>
        <FormSubmitButton isCreate />
      </Group>
    </Stack>
  );
}
```

### Example 5: Override Loading State

```tsx
function FormContent() {
  const form = FormWrapper.useForm();
  const [customLoading, setCustomLoading] = useState(false);

  const handleCustomSubmit = async () => {
    setCustomLoading(true);
    // Custom logic
    await someAsyncOperation();
    setCustomLoading(false);
  };

  return (
    <Stack gap="md">
      <TextInput label="Name" {...form.getInputProps("name")} />

      {/* Override loading state */}
      <FormSubmitButton
        isCreate
        isLoading={customLoading}
      />
    </Stack>
  );
}
```

### Example 6: Multi-Step Form

```tsx
function MultiStepForm() {
  return (
    <FormWrapper
      formName="multi-step"
      initial={{
        // Step 1
        firstName: "",
        lastName: "",
        // Step 2
        email: "",
        phone: "",
      }}
      steps={2}
      validation={[
        { firstName: (v) => (!v ? "Required" : null) },
        { email: (v) => (!v ? "Required" : null) },
      ]}
      apiSubmitFn={submitForm}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
  const form = FormWrapper.useForm();
  const { current, handleStepNext, handleStepBack } = FormWrapper.useFormProps();

  return (
    <Stack gap="md">
      {current === 0 && (
        <>
          <TextInput label="First Name" {...form.getInputProps("firstName")} />
          <TextInput label="Last Name" {...form.getInputProps("lastName")} />
          <Group justify="flex-end">
            <Button onClick={handleStepNext}>Next</Button>
          </Group>
        </>
      )}

      {current === 1 && (
        <>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <TextInput label="Phone" {...form.getInputProps("phone")} />
          <Group justify="space-between">
            <Button variant="light" onClick={handleStepBack}>
              Back
            </Button>
            <FormSubmitButton isCreate />
          </Group>
        </>
      )}
    </Stack>
  );
}
```

## Integration with DataTableModalShell

FormSubmitButton is designed to work with modal forms:

```tsx
import { DataTableModalShell } from "@settle/admin";
import { FormSubmitButton } from "@settle/admin";

function UserForm({ isCreate }) {
  const form = FormWrapper.useForm();

  return (
    <Stack gap="md">
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Email" {...form.getInputProps("email")} />

      <FormSubmitButton isCreate={isCreate} />
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
/>
```

## Button Text Customization

The component automatically determines button text:

| Mode | Loading | Button Text |
|------|---------|-------------|
| Create (isCreate=true) | false | "Create" |
| Create (isCreate=true) | true | "Creating..." |
| Update (isCreate=false) | false | "Save Changes" |
| Update (isCreate=false) | true | "Updating..." |

To customize text, you'll need to use a regular Button:

```tsx
import { Button } from "@mantine/core";
import { FormWrapper } from "@settle/core";

function CustomSubmitButton() {
  const { handleSubmit, isLoading } = FormWrapper.useFormProps();

  return (
    <Button onClick={handleSubmit} loading={isLoading}>
      {isLoading ? "Submitting..." : "Submit Form"}
    </Button>
  );
}
```

## TypeScript Usage

```typescript
import { FormSubmitButton } from "@settle/admin";
import type { GroupProps } from "@mantine/core";

// FormSubmitButton accepts GroupProps
const groupProps: GroupProps = {
  justify: "flex-end",
  mt: "md",
};

<FormSubmitButton
  isCreate={true}
  {...groupProps}
/>
```

## Best Practices

1. **Use isCreate Correctly**: Set `isCreate={true}` for new records, `isCreate={false}` for editing
2. **Let FormWrapper Handle Loading**: Don't override `isLoading` unless necessary
3. **Position with Group Props**: Use `justify` and spacing props for positioning
4. **Combine with Cancel**: Provide a cancel button alongside submit
5. **Multi-Step Forms**: Use regular buttons for step navigation, FormSubmitButton for final submit
6. **Consistent UX**: Use the same button component across all forms

## Common Patterns

### Pattern 1: Right-Aligned Submit

```tsx
<FormSubmitButton isCreate justify="flex-end" mt="md" />
```

### Pattern 2: Submit and Cancel

```tsx
<Group justify="space-between" mt="md">
  <Button variant="light" onClick={onCancel}>Cancel</Button>
  <FormSubmitButton isCreate />
</Group>
```

### Pattern 3: Modal Footer

```tsx
<Modal.Footer>
  <Group justify="flex-end">
    <Button variant="light" onClick={closeModal}>Close</Button>
    <FormSubmitButton isCreate />
  </Group>
</Modal.Footer>
```

### Pattern 4: Multi-Button Layout

```tsx
<Group justify="flex-end" gap="xs" mt="md">
  <Button variant="subtle" onClick={saveAsDraft}>Save Draft</Button>
  <Button variant="light" onClick={onCancel}>Cancel</Button>
  <FormSubmitButton isCreate />
</Group>
```

## Troubleshooting

### Issue: Button not submitting form

**Solution**: Ensure component is inside FormWrapper:

```tsx
// ❌ Bad - No FormWrapper
<FormSubmitButton isCreate />

// ✅ Good - Inside FormWrapper
<FormWrapper {...props}>
  <FormContent />
</FormWrapper>

function FormContent() {
  return <FormSubmitButton isCreate />;
}
```

### Issue: Loading state not working

**Solution**: FormSubmitButton automatically uses FormWrapper's loading state. If not working, check that FormWrapper's `apiSubmitFn` is provided:

```tsx
<FormWrapper
  apiSubmitFn={async (data) => {
    // This must be provided for loading state to work
    return submitData(data);
  }}
>
  <FormContent />
</FormWrapper>
```

### Issue: Button text not changing

**Solution**: Verify `isCreate` prop is set correctly:

```tsx
// Create mode
<FormSubmitButton isCreate={true} />

// Update mode
<FormSubmitButton isCreate={false} />
```

### Issue: Custom loading state not working

**Solution**: Pass `isLoading` prop to override:

```tsx
<FormSubmitButton
  isCreate
  isLoading={myCustomLoadingState}
/>
```

## Related Documentation

- [FormWrapper Usage](../../../../core/src/wrappers/FormWrapper/USAGE.md) - Form management wrapper
- [DataTableModalShell Usage](../../layouts/DataTableModalShell/USAGE.md) - Modal CRUD operations
- [Mantine Button](https://mantine.dev/core/button/) - Button component docs
- [Mantine Group](https://mantine.dev/core/group/) - Group component docs

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
