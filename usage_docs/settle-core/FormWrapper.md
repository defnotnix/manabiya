# FormWrapper Usage

## Overview
`FormWrapper` is a core wrapper component from `@settle/core` that manages form state, validation, submission, and multi-step form workflows. It uses Mantine's useForm hook and React Query for mutations.

## Location
`@settle/core/src/wrappers/FormWrapper/`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `testMode` | `boolean` | `false` | Enable console logging for debugging |
| `children` | `ReactNode` | Required | Child components that use the form |
| `queryKey` | `string` | `"general"` | Unique key for React Query mutations |
| `formName` | `string` | `"general-form"` | Internal form identifier |
| `mode` | `string` | `"uncontrolled"` | Form mode: "controlled" or "uncontrolled" |
| `initial` | `object` | - | Initial form values |
| `steps` | `number` | `1` | Number of form steps for multi-step forms |
| `disabledSteps` | `number[]` | `[]` | Array of step indices to disable |
| `validation` | `array` | `[]` | Validation rules per step |
| `stepValidationFn` | `async function` | `() => false` | Custom validation function for steps |
| `primaryKey` | `string` | `"id"` | Key used to identify records for updates |
| `apiSubmitFn` | `async function` | Required | Function to submit form data to API |
| `transformFnSubmit` | `function` | `(data) => data` | Transform data before submission |
| `submitFormat` | `string` | `"json"` | Submission format: "json" or "formdata" |
| `hasDirtCheck` | `boolean` | `false` | Track which fields have changed |
| `formatJsonSubmitConfig` | `object` | - | Configuration for JSON formatting |
| `formClearOnSuccess` | `boolean` | `true` | Clear form after successful submission |
| `preSubmitFn` | `async function` | `() => {}` | Hook before submission |
| `submitSuccessFn` | `function` | `() => {}` | Callback on success |
| `submitErrorFn` | `function` | `() => {}` | Callback on error |
| `notifications` | `object` | - | Notification callbacks for different states |

## Basic Usage

```tsx
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";

<FormWrapper
  queryKey="applicant.new"
  formName="applicant-form"
  initial={{
    fullName: "",
    email: "",
    phone: "",
    status: "pending",
  }}
  apiSubmitFn={async (data) => {
    return APPLICANT_API.createApplicant(data);
  }}
  submitSuccessFn={() => {
    router.push("/admin/applicant");
  }}
>
  <FormShell
    moduleInfo={MODULE_CONFIG}
    title="Create New Applicant"
  >
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

## Form Field Access

Use the form hook inside children:

```tsx
export function ApplicantForm() {
  const form = FormWrapper.useForm();

  return (
    <TextInput
      label="Full Name"
      {...form.getInputProps("fullName")}
    />
  );
}
```

## Form Props Access

Access form state and handlers:

```tsx
export function ApplicantForm() {
  const { handleSubmit, isLoading, current } =
    FormWrapper.useFormProps();

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Saving..." : "Submit"}
    </button>
  );
}
```

## Single-Step Form (Create/Edit)

```tsx
<FormWrapper
  queryKey="applicant.create"
  initial={{
    fullName: "",
    email: "",
  }}
  apiSubmitFn={async (data) => {
    return APPLICANT_API.createApplicant(data);
  }}
  submitSuccessFn={() => router.push("/applicants")}
>
  <FormShell title="Create Applicant">
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

## Multi-Step Form

```tsx
<FormWrapper
  queryKey="application.multistep"
  initial={{
    personalInfo: { fullName: "", email: "" },
    educationInfo: { school: "", degree: "" },
    documents: { resume: "", coverLetter: "" },
  }}
  steps={3}
  validation={[
    personalValidation,
    educationValidation,
    documentsValidation,
  ]}
  apiSubmitFn={async (data) => {
    return APPLICATION_API.submit(data);
  }}
>
  <FormShell
    title="Application Form"
    steps={[
      "Personal Info",
      "Education",
      "Documents",
    ]}
  >
    <Step1PersonalInfo />
    {/* Step content rendered based on current step */}
  </FormShell>
</FormWrapper>
```

## Step Navigation

Handle multi-step progression:

```tsx
export function FormFooter() {
  const {
    current,
    handleStepNext,
    handleStepBack,
    handleSubmit
  } = FormWrapper.useFormProps();
  const totalSteps = 3;

  return (
    <Group>
      {current > 0 && (
        <Button onClick={handleStepBack}>Back</Button>
      )}
      {current < totalSteps - 1 ? (
        <Button onClick={handleStepNext}>Next</Button>
      ) : (
        <Button onClick={handleSubmit}>Submit</Button>
      )}
    </Group>
  );
}
```

## Edit Form (Update)

```tsx
const { data: applicant } = useQuery({
  queryKey: ["applicant", id],
  queryFn: () => APPLICANT_API.getApplicant(id),
});

<FormWrapper
  queryKey={`applicant.edit.${id}`}
  initial={applicant}
  primaryKey="id"
  apiSubmitFn={async (data) => {
    return APPLICANT_API.updateApplicant(id, data);
  }}
  submitSuccessFn={() => router.push("/applicants")}
>
  <FormShell title="Edit Applicant">
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

## Data Transformation

Transform data before API submission:

```tsx
<FormWrapper
  transformFnSubmit={(formData) => {
    return {
      ...formData,
      fullName: formData.fullName.toUpperCase(),
      tags: formData.tags?.split(",") || [],
    };
  }}
  apiSubmitFn={async (transformedData) => {
    return API.create(transformedData);
  }}
>
  {/* Form content */}
</FormWrapper>
```

## File Upload (FormData)

```tsx
<FormWrapper
  submitFormat="formdata"
  initial={{
    fullName: "",
    resume: null,
  }}
  apiSubmitFn={async (formData) => {
    return API.uploadApplicant(formData);
  }}
>
  <FormShell>
    <TextInput {...form.getInputProps("fullName")} />
    <FileInput {...form.getInputProps("resume")} />
  </FormShell>
</FormWrapper>
```

## Validation

### Field Validation
```tsx
<FormWrapper
  initial={{ email: "" }}
  validation={[
    {
      email: (value) => {
        if (!value) return "Email is required";
        if (!value.includes("@")) return "Invalid email";
        return null;
      },
    },
  ]}
>
  {/* Form */}
</FormWrapper>
```

### Custom Step Validation
```tsx
<FormWrapper
  steps={2}
  stepValidationFn={async (currentStep, formValues) => {
    if (currentStep === 0) {
      const isEmailUnique = await checkEmailUnique(formValues.email);
      if (!isEmailUnique) {
        return { email: "Email already registered" };
      }
    }
    return null;
  }}
>
  {/* Form */}
</FormWrapper>
```

## Notifications

Handle form state notifications:

```tsx
<FormWrapper
  notifications={{
    isLoading: () => showNotification({
      title: "Saving...",
      loading: true,
    }),
    isSuccess: () => showNotification({
      title: "Saved successfully",
      color: "green",
    }),
    isError: () => showNotification({
      title: "Error occurred",
      color: "red",
    }),
  }}
  apiSubmitFn={async (data) => {
    return API.create(data);
  }}
>
  {/* Form */}
</FormWrapper>
```

## Testing Mode

Enable debug logging:

```tsx
<FormWrapper
  testMode={true}
  queryKey="applicant.test"
  initial={{ fullName: "" }}
  apiSubmitFn={() => Promise.resolve()}
>
  {/* Logs form values and submission data */}
</FormWrapper>
```

## Dirty Field Tracking

Track which fields changed:

```tsx
<FormWrapper
  hasDirtCheck={true}
  initial={{ fullName: "", email: "" }}
  apiSubmitFn={async (data, id, initialValues) => {
    // data._dirt_check contains only changed fields
    return API.update(id, data);
  }}
>
  {/* Form */}
</FormWrapper>
```

## Common Patterns

### Pattern 1: Simple Create Form
```tsx
<FormWrapper
  queryKey="item.create"
  initial={{ name: "", description: "" }}
  apiSubmitFn={(data) => API.create(data)}
  submitSuccessFn={() => router.push("/items")}
>
  <FormShell title="Create Item">
    <ItemForm />
  </FormShell>
</FormWrapper>
```

### Pattern 2: Multi-Step Application
```tsx
<FormWrapper
  queryKey="application.submit"
  steps={3}
  initial={applicationData}
  apiSubmitFn={(data) => API.submitApplication(data)}
>
  <FormShell steps={["Personal", "Education", "Documents"]}>
    {currentStep === 0 && <PersonalStep />}
    {currentStep === 1 && <EducationStep />}
    {currentStep === 2 && <DocumentsStep />}
  </FormShell>
</FormWrapper>
```

## Notes

- Form must be wrapped with `FormWrapper` before using hooks
- Use `FormWrapper.useForm()` to access form instance
- Use `FormWrapper.useFormProps()` to access submission handlers
- Multi-step forms reset on success automatically
- Validation runs before step navigation and submission
- Error messages are set automatically from API responses
