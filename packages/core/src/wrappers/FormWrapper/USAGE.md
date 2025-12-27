# FormWrapper Usage Guide

## Overview

`FormWrapper` is a powerful form management wrapper built on top of Mantine Form. It provides:
- **Multi-step form support** with step validation and navigation
- **Automatic form state management** using Mantine Form
- **API integration** with built-in mutation handling (React Query)
- **Error handling** with field-level error mapping from backend
- **Data transformation** before submission
- **Dirty checking** to track modified fields only
- **Custom validation** functions per step
- **Comprehensive notifications** for loading, success, and error states

FormWrapper is the recommended choice for complex forms that need backend integration and multi-step workflows.

## Key Features

✅ **Multi-Step Forms** - Navigate between form steps with validation at each step
✅ **Automatic State Management** - Mantine Form integration for field tracking
✅ **API Integration** - Built-in React Query mutations for form submission
✅ **Flexible Validation** - Schema-based + custom validation functions
✅ **Error Handling** - Automatic field error mapping from backend
✅ **Data Transformation** - Transform data before sending to API
✅ **Dirty Checking** - Track only modified fields (optional)
✅ **FormData Support** - Automatic conversion to FormData for file uploads
✅ **Test Mode** - Debug form data and validation in console
✅ **Lifecycle Hooks** - pre-submit, success, and error callbacks

## Basic Usage

### Minimal Example - Single Step Form

```tsx
import { FormWrapper } from "@settle/core";
import { TextInput, Button, Stack } from "@mantine/core";
import { triggerNotification } from "@settle/admin";

export function MyForm() {
  return (
    <FormWrapper
      formName="basic-form"
      initial={{ name: "", email: "" }}
      steps={1}
      validation={[{}]} // Empty validation object for step 1
      notifications={{
        isLoading: (props) => triggerNotification.form.isLoading(props),
        isSuccess: (props) => triggerNotification.form.isSuccess(props),
        isError: (props) => triggerNotification.form.isError(props),
        isValidationError: (props) => triggerNotification.form.isValidationError(props),
        isValidationStepError: (props) => triggerNotification.form.isValidationStepError(props),
        isWarning: (props) => triggerNotification.form.isWarning(props),
        isInfo: (props) => triggerNotification.form.isInfo(props),
      }}
      apiSubmitFn={async (data) => {
        const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(data),
        });
        return response.json();
      }}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
  const form = FormWrapper.useForm();
  const { isLoading, handleSubmit } = FormWrapper.useFormProps();

  return (
    <Stack gap="md">
      <TextInput
        label="Name"
        placeholder="Enter your name"
        {...form.getInputProps("name")}
        required
      />
      <TextInput
        label="Email"
        placeholder="Enter your email"
        {...form.getInputProps("email")}
        required
      />
      <Button onClick={handleSubmit} loading={isLoading}>
        Submit
      </Button>
    </Stack>
  );
}
```

### Multi-Step Form with Validation

```tsx
<FormWrapper
  formName="multi-step-form"
  initial={{
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  }}
  steps={3}
  disabledSteps={[]} // All steps enabled
  validation={[
    // Step 1 validation
    {
      firstName: (value) => (!value ? "First name is required" : null),
      lastName: (value) => (!value ? "Last name is required" : null),
    },
    // Step 2 validation
    {
      email: (value) =>
        !value ? "Email is required" : !value.includes("@") ? "Invalid email" : null,
    },
    // Step 3 validation (review step - no validation needed)
    {},
  ]}
  notifications={notificationConfig}
  apiSubmitFn={async (data) => {
    return fetch("/api/users", { method: "POST", body: JSON.stringify(data) });
  }}
>
  <FormContent />
</FormWrapper>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **Core Configuration** |
| `formName` | string | "general-form" | Unique form identifier |
| `mode` | "uncontrolled" \| "controlled" | "uncontrolled" | Form mode (uncontrolled is recommended) |
| `initial` | object | - | Initial form values |
| `children` | ReactNode | - | Form content/fields |
| **Step Configuration** |
| `steps` | number | 1 | Total number of form steps |
| `disabledSteps` | number[] | [] | Array of step indices to disable |
| `validation` | object[] | [] | Validation rules per step (Mantine Form validators) |
| `stepValidationFn` | async function | `() => false` | Custom validation function per step |
| **Submission Configuration** |
| `primaryKey` | string | "id" | Primary key field name (used for edit requests) |
| `apiSubmitFn` | function | `() => {}` | API function to call on form submission |
| `transformFnSubmit` | function | `(data) => data` | Transform form data before sending |
| `submitFormat` | "json" \| "formdata" | "json" | Format for sending data |
| `hasDirtCheck` | boolean | false | Track only modified fields |
| `formatJsonSubmitConfig` | object | - | Config for JSON formatting |
| `formClearOnSuccess` | boolean | true | Clear form after successful submission |
| **Notification Configuration** |
| `notifications` | object | - | Notification callbacks object |
| **Lifecycle Hooks** |
| `preSubmitFn` | async function | `() => {}` | Called before API submission |
| `submitSuccessFn` | function | `(res, formdata) => {}` | Called on successful submission |
| `submitErrorFn` | function | `(err, formdata) => {}` | Called on submission error |
| **Debug** |
| `testMode` | boolean | false | Enable console debugging |
| `queryKey` | string | "general" | React Query key for mutations |

## Notification Configuration

The `notifications` prop must include these callback functions:

```typescript
type PropFormNotifications = {
  isLoading: (props: PropTriggerNotification) => void;      // Show during API call
  isSuccess: (props: PropTriggerNotification) => void;      // Show on success
  isWarning: (props: PropTriggerNotification) => void;      // Show warnings
  isError: (props: PropTriggerNotification) => void;        // Show API errors
  isValidationError: (props: PropTriggerNotification) => void;  // Form validation error
  isValidationStepError: (props: PropTriggerNotification) => void; // Step validation error
  isInfo: (props: PropTriggerNotification) => void;         // Show info message
};

type PropTriggerNotification = {
  title?: string;        // Notification title
  message?: string;      // Notification message
  autoClose?: number | false; // Auto close after ms
  onClose?: () => void;  // Callback on close
};
```

## Using FormWrapper Hooks

### FormWrapper.useForm()

Access Mantine Form instance to manage field values and errors:

```tsx
const form = FormWrapper.useForm();

// Get all form values
const values = form.getValues();

// Get single field value
const email = form.getValues("email");

// Set field value
form.setFieldValue("email", "user@example.com");

// Validate form
const { hasErrors, errors } = form.validate();

// Get field input props
<TextInput {...form.getInputProps("email")} />

// Reset form
form.reset();

// Set field errors
form.setErrors({ email: "Invalid email" });
```

### FormWrapper.useFormProps()

Access form state and navigation methods:

```tsx
const { current, isLoading, handleStepNext, handleStepBack, handleSubmit } =
  FormWrapper.useFormProps();

// current: number - Current step index (0-based)
// isLoading: boolean - Is API call in progress
// handleStepNext: () => Promise<void> - Move to next step with validation
// handleStepBack: () => Promise<void> - Move to previous step
// handleSubmit: () => Promise<void> - Submit form
```

## Form Validation

### Schema-Based Validation (Mantine Form)

```tsx
const validation = [
  // Step 1
  {
    firstName: (value) => (!value ? "First name is required" : null),
    email: (value) =>
      !value
        ? "Email is required"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? "Invalid email format"
        : null,
  },
  // Step 2
  {
    phone: (value) =>
      !value
        ? "Phone is required"
        : !/^\d{10}$/.test(value.replace(/\D/g, ""))
        ? "Phone must be 10 digits"
        : null,
  },
];

<FormWrapper
  validation={validation}
  // ...other props
/>
```

### Custom Validation Function

```tsx
<FormWrapper
  stepValidationFn={async (currentStep, formData) => {
    // Step 0: Check if email exists
    if (currentStep === 0) {
      const response = await fetch(`/api/check-email?email=${formData.email}`);
      const { exists } = await response.json();
      if (exists) {
        return { email: "Email already registered" };
      }
    }
    // Step 1: Validate phone number format
    if (currentStep === 1) {
      // Custom validation logic
    }
    return null; // No errors
  }}
  // ...other props
/>
```

### Combined Validation

Use both schema validation and custom validation together:

```tsx
<FormWrapper
  validation={[
    {
      email: (value) =>
        !value ? "Email is required" : null,
    },
    {},
  ]}
  stepValidationFn={async (step, data) => {
    // Additional async validation
    if (step === 0) {
      const exists = await checkEmailExists(data.email);
      if (exists) return { email: "Email already exists" };
    }
    return null;
  }}
  // ...other props
/>
```

## Data Transformation

### Before Submission

Transform form data before sending to API:

```tsx
<FormWrapper
  transformFnSubmit={(formData) => {
    return {
      // Transform nested objects
      user: {
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      // Format dates
      birthDate: new Date(formData.birthDate).toISOString(),
      // Map field names
      contactEmail: formData.email,
      // Remove fields
      // ...omit password, confirmPassword, etc.
    };
  }}
  // ...other props
/>
```

### Dirty Checking (Only Modified Fields)

Track and send only modified fields:

```tsx
<FormWrapper
  hasDirtCheck={true}
  transformFnSubmit={(formData) => {
    // formData._dirt_check contains only modified fields
    const modifiedFields = formData._dirt_check || {};
    return {
      ...modifiedFields,
      updatedAt: new Date().toISOString(),
    };
  }}
  // ...other props
/>
```

## Format Configuration

### JSON Format with Key Filtering

```tsx
<FormWrapper
  submitFormat="json"
  formatJsonSubmitConfig={{
    keyIgnore: ["_dirt_check", "confirmPassword", "agreeToTerms"],
    stringify: ["metadata", "settings"],
  }}
  // ...other props
/>
```

### FormData Format (for File Uploads)

```tsx
<FormWrapper
  submitFormat="formdata"
  initial={{ name: "", avatar: null, bio: "" }}
  // ...other props
/>

// In your component:
const form = FormWrapper.useForm();

<input
  type="file"
  onChange={(e) => {
    const file = e.currentTarget.files?.[0];
    form.setFieldValue("avatar", file);
  }}
/>
```

## Lifecycle Hooks

### Pre-Submit Hook

Called before API submission:

```tsx
<FormWrapper
  preSubmitFn={async (formData) => {
    // Validate against other sources
    const isValid = await validateBusinessLogic(formData);
    if (!isValid) {
      throw new Error("Business validation failed");
    }
    // Side effects before submit
    analytics.track("Form Submitting", { form: "user-registration" });
  }}
  // ...other props
/>
```

### Success Hook

Called after successful API response:

```tsx
<FormWrapper
  submitSuccessFn={(response, formData) => {
    // Handle success
    console.log("Form submitted successfully:", response.data);
    // Navigate
    router.push(`/users/${response.data.id}`);
    // Update global state
    store.addUser(response.data);
  }}
  // ...other props
/>
```

### Error Hook

Called when API submission fails:

```tsx
<FormWrapper
  submitErrorFn={(error, formData) => {
    // Handle error
    console.error("Submission failed:", error);
    // Update state
    store.setError(error.message);
    // Trigger retry logic
    maybeRetry(formData);
  }}
  // ...other props
/>
```

## Complete Multi-Step Form Example

```tsx
import { FormWrapper } from "@settle/core";
import { TextInput, Textarea, Button, Stack, Group, Stepper } from "@mantine/core";
import { triggerNotification } from "@settle/admin";
import { useRouter } from "next/navigation";

export function UserRegistrationForm() {
  const router = useRouter();

  return (
    <FormWrapper
      formName="user-registration"
      initial={{
        // Step 1
        firstName: "",
        lastName: "",
        // Step 2
        email: "",
        phone: "",
        // Step 3
        bio: "",
        website: "",
      }}
      steps={3}
      validation={[
        // Step 1: Personal Info
        {
          firstName: (value) => (!value ? "First name required" : null),
          lastName: (value) => (!value ? "Last name required" : null),
        },
        // Step 2: Contact Info
        {
          email: (value) =>
            !value
              ? "Email required"
              : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
              ? "Invalid email"
              : null,
          phone: (value) =>
            !value
              ? "Phone required"
              : !/^\d{10}$/.test(value.replace(/\D/g, ""))
              ? "Invalid phone"
              : null,
        },
        // Step 3: Profile (optional)
        {},
      ]}
      stepValidationFn={async (step, data) => {
        // Check email uniqueness on step 2
        if (step === 1) {
          const exists = await checkEmailExists(data.email);
          if (exists) return { email: "Email already registered" };
        }
        return null;
      }}
      notifications={{
        isLoading: (props) => triggerNotification.form.isLoading(props),
        isSuccess: (props) => triggerNotification.form.isSuccess(props),
        isError: (props) => triggerNotification.form.isError(props),
        isValidationError: (props) => triggerNotification.form.isValidationError(props),
        isValidationStepError: (props) => triggerNotification.form.isValidationStepError(props),
        isWarning: (props) => triggerNotification.form.isWarning(props),
        isInfo: (props) => triggerNotification.form.isInfo(props),
      }}
      transformFnSubmit={(data) => ({
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        profile: {
          bio: data.bio,
          website: data.website,
        },
      })}
      apiSubmitFn={async (data) => {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to create user");
        return response.json();
      }}
      submitSuccessFn={(response) => {
        router.push(`/users/${response.id}`);
      }}
    >
      <FormContent />
    </FormWrapper>
  );
}

function FormContent() {
  const form = FormWrapper.useForm();
  const { current, isLoading, handleStepNext, handleStepBack, handleSubmit } =
    FormWrapper.useFormProps();

  return (
    <Stack gap="lg">
      <Stepper active={current} onStepClick={() => {}} allowNextStepsSelect={false}>
        <Stepper.Step label="Personal Info" description="Your name" />
        <Stepper.Step label="Contact Info" description="Email & phone" />
        <Stepper.Step label="Profile" description="Optional details" />
      </Stepper>

      {/* Step 1: Personal Info */}
      {current === 0 && (
        <Stack gap="md">
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
        </Stack>
      )}

      {/* Step 2: Contact Info */}
      {current === 1 && (
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="john@example.com"
            {...form.getInputProps("email")}
            required
          />
          <TextInput
            label="Phone"
            placeholder="1234567890"
            {...form.getInputProps("phone")}
            required
          />
        </Stack>
      )}

      {/* Step 3: Profile */}
      {current === 2 && (
        <Stack gap="md">
          <Textarea
            label="Bio"
            placeholder="Tell us about yourself"
            {...form.getInputProps("bio")}
          />
          <TextInput
            label="Website"
            placeholder="https://example.com"
            {...form.getInputProps("website")}
          />
        </Stack>
      )}

      {/* Navigation Buttons */}
      <Group justify="space-between">
        <Button
          variant="light"
          onClick={handleStepBack}
          disabled={current === 0}
        >
          Previous
        </Button>
        <Group gap="xs">
          {current < 2 && (
            <Button onClick={handleStepNext}>Next</Button>
          )}
          {current === 2 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Submit
            </Button>
          )}
        </Group>
      </Group>
    </Stack>
  );
}
```

## Error Handling

### Backend Error Response Mapping

FormWrapper automatically maps backend errors to form fields:

```tsx
// Backend error response:
{
  "error": {
    "type": "VALIDATION_ERROR",
    "fields": {
      "email": "Email already exists",
      "phone": "Invalid phone number"
    }
  }
}

// FormWrapper automatically sets field errors:
form.setErrors({
  email: "Email already exists",
  phone: "Invalid phone number"
});
```

### Manual Error Handling

```tsx
const form = FormWrapper.useForm();

// Set specific field error
form.setFieldError("email", "Email validation failed");

// Set multiple errors
form.setErrors({
  email: "Invalid email",
  password: "Password too weak",
});

// Clear field error
form.clearFieldError("email");

// Clear all errors
form.clearErrors();
```

## Testing with testMode

Enable debug mode to log form data and validation:

```tsx
<FormWrapper
  testMode={true}
  // ...other props
/>

// Console output:
// FormWrapper_FormValues: { firstName: "John", ... }
// FormWrapper_DatatoSend: { fullName: "John Doe", ... }
// FormWrapper_ValidationCheck_err: false
// FormWrapper_ValidationCheck_fn: null
```

## Integration with FormShell

Use FormWrapper inside FormShell for complete form UI:

```tsx
import { FormShell } from "@settle/admin";

<FormShell
  bread={breadcrumbs}
  moduleInfo={{ label: "User" }}
  title="Create User"
  onCancel={handleCancel}
>
  <FormWrapper
    formName="create-user"
    initial={{ name: "", email: "" }}
    steps={1}
    validation={[{}]}
    notifications={notificationConfig}
    apiSubmitFn={createUser}
  >
    <FormContent />
  </FormWrapper>
</FormShell>
```

## Dirty Checking Example (Edit Form)

Track only modified fields when editing:

```tsx
<FormWrapper
  initial={{
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
  }}
  hasDirtCheck={true}
  transformFnSubmit={(data) => {
    // Only send modified fields
    return {
      ...data._dirt_check,
      id: data.id,
    };
  }}
  apiSubmitFn={async (data) => {
    return fetch(`/api/users/${data.id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }}
  // ...other props
/>
```

## Performance Tips

1. **Use uncontrolled mode** (default) for better performance
2. **Enable hasDirtCheck** only when needed (edit forms)
3. **Use stepValidationFn** for async validation (email exists, etc.)
4. **Memoize notification callbacks** to prevent re-renders
5. **Use FormWrapper.useForm()** only in child components that need it

## Common Issues & Solutions

### Issue: Field errors not showing
**Solution**: Ensure validation object is provided for the current step, not earlier steps

### Issue: Form doesn't validate on next step
**Solution**: Add validation rules to validation array, or implement stepValidationFn

### Issue: Data not sent correctly to API
**Solution**: Check transformFnSubmit - it might be removing required fields

### Issue: Dirty check not working
**Solution**: Ensure hasDirtCheck={true} and use _dirt_check in transformFnSubmit

### Issue: Custom validation not running
**Solution**: stepValidationFn must return error object or null, not throw errors

## Migration from FormHandler to FormWrapper

**FormHandler** (older):
- Basic form handling
- Limited validation options
- Manual step management

**FormWrapper** (recommended):
- Advanced form management
- Flexible validation (schema + custom)
- Automatic step management
- Better error handling
- Cleaner API

```tsx
// Before (FormHandler)
<FormHandler initial={{}} steps={["Step 1"]} validation={[{}]}>
  {/* Content */}
</FormHandler>

// After (FormWrapper - recommended)
<FormWrapper initial={{}} steps={1} validation={[{}]}>
  {/* Content */}
</FormWrapper>
```

## Support & Resources

- Check [FormWrapper source](./FormWrapper.tsx) for detailed implementation
- Review [type definitions](./FormWrapper.type.ts) for prop types
- See [error handler](./FormWrapper.errorhandleer.ts) for error mapping
- Check [store](./FormWrapper.store.ts) for step management
