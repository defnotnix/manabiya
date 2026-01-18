# FormShell Usage

## Overview
`FormShell` is a layout component from `@settle/admin` that provides the complete UI shell for form pages. It includes header, stepper for multi-step forms, form content area, and footer with action buttons.

## Location
`@settle/admin/src/layouts/FormShell/`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bread` | `array` | - | Breadcrumb navigation items |
| `moduleInfo` | `object` | Required | Module configuration with name, description |
| `title` | `string` | Required | Page title/heading |
| `children` | `ReactNode` | Required | Form content |
| `steps` | `string[]` | `[]` | Step labels for multi-step forms |
| `disabledSteps` | `number[]` | `[]` | Indices of steps to disable |
| `showStepper` | `boolean` | `true` | Show stepper component for multi-step forms |
| `onStepBack` | `function` | - | Callback when back button clicked |
| `onStepNext` | `function` | - | Callback when next button clicked |
| `onCancel` | `function` | - | Callback when cancel button clicked |
| `isLoading` | `boolean` | `false` | Show loading state on submit button |

### Stepper Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableStepClick` | `boolean` | `false` | Enable/disable clicking on steps in the stepper menu |
| `enableStepCompleteClickOnly` | `boolean` | `false` | Only allow clicking on completed steps (requires `enableStepClick={true}`) |
| `enableStepTracking` | `boolean` | `false` | Mark completed steps in blue text for visual tracking |
| `iconActive` | `ReactNode` | `null` | Icon to display next to the active/current step |
| `iconComplete` | `ReactNode` | `null` | Icon to display next to completed steps |
| `iconIncomplete` | `ReactNode` | `null` | Icon to display next to incomplete steps |

## Basic Usage

```tsx
import { FormShell } from "@settle/admin";
import { FormWrapper } from "@settle/core";

<FormWrapper
  queryKey="applicant.new"
  initial={{ fullName: "", email: "" }}
  apiSubmitFn={(data) => APPLICANT_API.create(data)}
  submitSuccessFn={() => router.push("/applicants")}
>
  <FormShell
    moduleInfo={{
      name: "Applicant",
      label: "Applicants",
      description: "Manage applicants",
    }}
    title="Create New Applicant"
    bread={[
      { label: "Applicants", href: "/admin/applicant" },
      { label: "New" },
    ]}
  >
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

## Single-Step Form (Create/Edit)

```tsx
<FormShell
  moduleInfo={MODULE_CONFIG}
  title="Edit Applicant"
  bread={[
    { label: "Applicants", href: "/admin/applicant" },
    { label: applicant.fullName },
  ]}
>
  <ApplicantForm />
</FormShell>
```

## Multi-Step Form

Define steps and show stepper:

```tsx
<FormShell
  moduleInfo={MODULE_CONFIG}
  title="Application Form"
  steps={["Personal Info", "Education", "Documents"]}
  showStepper={true}
>
  <Step1PersonalInfo />
  <Step2Education />
  <Step3Documents />
</FormShell>
```

## Breadcrumb Navigation

Structure breadcrumbs:

```tsx
<FormShell
  bread={[
    { label: "Dashboard", href: "/admin" },
    { label: "Applicants", href: "/admin/applicant" },
    { label: "New Application" },
  ]}
>
  {/* Form content */}
</FormShell>
```

## Step Navigation

Control step progression:

```tsx
<FormWrapper
  steps={3}
  onStepNext={() => {
    // Handled by FormWrapper, but you can customize
  }}
  onStepBack={() => {
    // Handled by FormWrapper, but you can customize
  }}
>
  <FormShell
    steps={["Step 1", "Step 2", "Step 3"]}
    disabledSteps={[2]} // Step 3 is disabled
  >
    {/* Form content */}
  </FormShell>
</FormWrapper>
```

## Stepper Configuration

### Controlling Step Navigation

By default, steps cannot be clicked (navigation via Next/Back only):

```tsx
<FormShell
  steps={["Step 1", "Step 2", "Step 3"]}
  enableStepClick={false} // Default - steps are not clickable
>
  {/* Form content */}
</FormShell>
```

Enable clicking to allow direct step navigation:

```tsx
<FormShell
  steps={["Step 1", "Step 2", "Step 3"]}
  enableStepClick={true} // Users can click any enabled step
  enableStepCompleteClickOnly={false}
>
  {/* Form content */}
</FormShell>
```

Restrict clicking to only completed steps:

```tsx
<FormShell
  steps={["Step 1", "Step 2", "Step 3"]}
  enableStepClick={true}
  enableStepCompleteClickOnly={true} // Only steps 0 and current are clickable
>
  {/* Form content */}
</FormShell>
```

### Visual Step Tracking

Mark completed steps in blue text:

```tsx
<FormShell
  steps={["Step 1", "Step 2", "Step 3"]}
  enableStepTracking={true} // Completed steps appear in blue
>
  {/* Form content */}
</FormShell>
```

### Step Icons

Add icons to indicate step status:

```tsx
import { CheckCircle, Circle } from "@phosphor-icons/react";

<FormShell
  steps={["Personal", "Documents", "Review"]}
  iconActive={<Circle size={20} weight="fill" color="blue" />}
  iconComplete={<CheckCircle size={20} weight="fill" color="green" />}
  iconIncomplete={<Circle size={20} />}
>
  {/* Form content */}
</FormShell>
```

**Icon Display:**
- `iconActive` - Shows for the current step
- `iconComplete` - Shows for steps before the current step
- `iconIncomplete` - Shows for steps after the current step
- All icons are optional (null by default)

## Loading State

Show loading during submission:

```tsx
export function FormPage() {
  const { isLoading } = FormWrapper.useFormProps();

  return (
    <FormShell
      isLoading={isLoading}
      title="Create Applicant"
    >
      <ApplicantForm />
    </FormShell>
  );
}
```

## Cancel & Reset

Handle form cancellation:

```tsx
<FormShell
  title="Create Applicant"
  onCancel={() => {
    router.back();
  }}
>
  {/* Form content */}
</FormShell>
```

## Layout Structure

The FormShell provides this layout structure:

```
┌─────────────────────────────────────┐
│        FormShell Header              │ ← Title & Breadcrumbs
├─────────────────────────────────────┤
│          Stepper (optional)          │ ← Multi-step indicator
├─────────────────────────────────────┤
│                                     │
│        Form Content (children)       │ ← Your form fields
│                                     │
├─────────────────────────────────────┤
│    Footer with Action Buttons        │ ← Back, Next, Submit, Cancel
└─────────────────────────────────────┘
```

## Conditional Step Display

Show different form content based on current step:

```tsx
export function ApplicationForm() {
  const { current } = FormWrapper.useFormProps();

  return (
    <FormShell steps={["Info", "Documents", "Review"]}>
      {current === 0 && <PersonalInfoForm />}
      {current === 1 && <DocumentsForm />}
      {current === 2 && <ReviewForm />}
    </FormShell>
  );
}
```

## Module Info

Pass module configuration to header:

```tsx
const MODULE_CONFIG = {
  name: "Applicant",
  label: "Applicants",
  description: "Manage applicant profiles",
  icon: "Users",
};

<FormShell
  moduleInfo={MODULE_CONFIG}
  title="Create Applicant"
>
  {/* Form */}
</FormShell>
```

## Common Patterns

### Pattern 1: Simple Create Form
```tsx
<FormWrapper
  queryKey="applicant.create"
  initial={{ fullName: "", email: "" }}
  apiSubmitFn={(data) => API.createApplicant(data)}
  submitSuccessFn={() => router.push("/applicants")}
>
  <FormShell
    moduleInfo={APPLICANT_CONFIG}
    title="Create New Applicant"
    bread={[
      { label: "Applicants", href: "/admin/applicant" },
      { label: "New" },
    ]}
  >
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

### Pattern 2: Edit Form
```tsx
<FormWrapper
  queryKey={`applicant.edit.${id}`}
  initial={applicant}
  apiSubmitFn={(data) => API.updateApplicant(id, data)}
  submitSuccessFn={() => router.push("/applicants")}
>
  <FormShell
    moduleInfo={APPLICANT_CONFIG}
    title="Edit Applicant"
    bread={[
      { label: "Applicants", href: "/admin/applicant" },
      { label: applicant.fullName },
    ]}
  >
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

### Pattern 3: Multi-Step Application
```tsx
<FormWrapper
  queryKey="application.submit"
  steps={3}
  initial={initialData}
  apiSubmitFn={(data) => API.submitApplication(data)}
  submitSuccessFn={() => router.push("/success")}
>
  <FormShell
    moduleInfo={APPLICATION_CONFIG}
    title="Submit Application"
    steps={["Personal Info", "Education", "Documents"]}
    showStepper={true}
    bread={[
      { label: "Applications", href: "/applications" },
      { label: "New Application" },
    ]}
  >
    {/* Step-based form content */}
  </FormShell>
</FormWrapper>
```

### Pattern 3b: Stepper Configuration (Step Click & Icons)

Enable step clicking and customize step icons:

```tsx
import { CheckCircle, Circle, CaretRight } from "@phosphor-icons/react";

<FormWrapper
  queryKey="applicant.new"
  steps={STEPS.length}
  initial={initialData}
  apiSubmitFn={async (data) => APPLICANT_API.createApplicant(data)}
  submitSuccessFn={() => router.push("/admin/applicant")}
>
  <FormShell
    moduleInfo={APPLICANT_MODULE_CONFIG}
    title="Create New Applicant"
    steps={STEPS}
    showStepper={true}
    // Enable step clicking
    enableStepClick={true}
    // Only allow clicking on completed steps
    enableStepCompleteClickOnly={true}
    // Visual tracking of completed steps
    enableStepTracking={true}
    // Step icons
    iconActive={<CaretRight size={16} weight="bold" />}
    iconComplete={<CheckCircle size={16} weight="fill" />}
    iconIncomplete={<Circle size={16} />}
  >
    <ApplicantForm />
  </FormShell>
</FormWrapper>
```

**Stepper Behavior:**
- `enableStepClick={false}` (default) - Steps cannot be clicked, navigation only via Next/Back buttons
- `enableStepClick={true}` + `enableStepCompleteClickOnly={false}` - All steps (except disabled ones) are clickable
- `enableStepClick={true}` + `enableStepCompleteClickOnly={true}` - Only steps up to and including current step are clickable
- `enableStepTracking={true}` - Completed steps are highlighted in blue text
- Icons display in the stepper menu next to each step label

### Pattern 4: Multi-Step Form with Multiple Steps (11+ Steps)
For forms with multiple steps, pass the steps array directly from your form component:

```tsx
// ApplicantForm.tsx
export const STEPS = [
  "Welcome",
  "Identity & Contact",
  "Background & Legal Status",
  "Physical & Emergency Contact",
  "Personal Story",
  "Academics",
  "Work History",
  "Certifications",
  "Identifications",
  "Japan Visit History",
  "Completed",
];

export const STEP_COMPONENTS = [
  StepWelcome,
  StepIdentityContact,
  StepBackgroundLegal,
  StepPhysicalEmergency,
  StepPersonalStory,
  StepAcademics,
  StepWorkHistory,
  StepCertifications,
  StepIdentifications,
  StepJapanVisit,
  StepCompleted,
];

export function ApplicantForm() {
  const CurrentStep = STEP_COMPONENTS[0];
  return <CurrentStep />;
}

// NewPage.tsx - Usage
import { ApplicantForm, STEPS } from "../../form/ApplicantForm";

export function NewPage() {
  const router = useRouter();

  return (
    <FormWrapper
      queryKey="applicant.new"
      formName="applicant-form"
      initial={{
        // All form field initial values
        first_name: "",
        // ... other fields
      }}
      steps={STEPS.length}
      apiSubmitFn={async (data) => APPLICANT_API.createApplicant(data)}
      submitSuccessFn={() => router.push("/admin/applicant")}
    >
      <FormShell
        moduleInfo={APPLICANT_MODULE_CONFIG}
        title="Create New Applicant"
        bread={[{ label: "Applicants" }, { label: "New" }]}
        steps={STEPS}
        showStepper={true}
      >
        <ApplicantForm />
      </FormShell>
    </FormWrapper>
  );
}
```

**Key points for stepper forms:**
- Import `STEPS` array from your form component
- Pass `steps={STEPS}` to FormShell to display the stepper
- Pass `steps={STEPS.length}` to FormWrapper to set the number of steps
- Set `showStepper={true}` to display the stepper component
- Each step component should use `FormHandler.useForm()` to access form state
- FormWrapper automatically manages step navigation and data across all steps

## Context Usage

Access form shell context:

```tsx
import { useContext } from "react";
import { Context as FormShellContext } from "@settle/admin";

const context = useContext(FormShellContext);
// Contains selectedRecords, setSelectedRecords
```

## Integration with FormWrapper

FormShell automatically integrates with FormWrapper's handlers:

```tsx
// FormWrapper manages:
// - Form submission (handleSubmit)
// - Step navigation (handleStepNext, handleStepBack)
// - Loading state (isLoading)

// FormShell displays:
// - Stepper based on FormWrapper.useFormProps().current
// - Footer with integrated buttons
```

## Notes

- Always wrap FormShell with FormWrapper
- Stepper is hidden if steps array is empty or showStepper={false}
- Breadcrumbs help users navigate module hierarchy
- Footer buttons are automatically managed by FormWrapper
- Loading state propagates from FormWrapper to FormShell
- Mobile responsive layout automatically adjusts
