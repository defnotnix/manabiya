# Stepper Implementation Guide

## Integration with FormShell

The Stepper component is used by `FormShellStepper` in the FormShell layout.

### Current Implementation

[FormShellStepper](../layouts/FormShell/components/Stepper/index.tsx):

```tsx
import { Stepper } from "@settle/admin";

export function FormShellStepper({
  steps,
  currentStep,
  disabledSteps = []
}: PropFormShellStepper) {
  // ... navigation logic ...

  return (
    <Box>
      <Stepper
        active={currentStep}
        steps={steps.map((label) => ({ label }))}
      />
      {/* Navigation buttons */}
    </Box>
  );
}
```

## Quick Start Examples

### Example 1: Simple Multi-Step Form

```tsx
"use client";

import { FormShell } from "@settle/admin";
import { FormWrapper } from "@settle/core";
import { Stack, TextInput } from "@mantine/core";

export function MyMultiStepForm() {
  const steps = ["Basic Info", "Address", "Review"];

  return (
    <FormWrapper>
      <FormShell steps={steps} showStepper>
        <Stack gap="lg">
          {/* Form content based on current step */}
          <TextInput label="Field 1" />
          <TextInput label="Field 2" />
        </Stack>
      </FormShell>
    </FormWrapper>
  );
}
```

### Example 2: With Disabled Steps

```tsx
<FormShell
  steps={["Step 1", "Step 2", "Step 3"]}
  disabledSteps={[2]} // Can't access step 3 until step 1 is complete
  showStepper
>
  {/* form content */}
</FormShell>
```

### Example 3: Custom Step Descriptions

```tsx
const steps = [
  { label: "Personal", description: "Enter your details" },
  { label: "Address", description: "Confirm location" },
  { label: "Review", description: "Verify information" },
];

// Note: FormShell expects string[] for steps prop
// To use descriptions, use FormShellStepper directly:

<FormShellStepper
  steps={steps}
  currentStep={0}
/>
```

## Stepper Features Used in FormShell

✅ **Step Indicators** - Shows current position in workflow
✅ **Step Connectors** - Visual line between steps
✅ **Progress Tracking** - Shows X of Y steps
✅ **Navigation** - Back/Next buttons
✅ **Status Display** - Completed/Active/Pending states

## Customization

### Changing Step Size

If you want larger/smaller step indicators, modify FormShellStepper:

```tsx
<Stepper
  active={currentStep}
  steps={steps.map((label) => ({ label }))}
  size="lg" // or "sm", "xs", "xl"
/>
```

### Vertical Layout

For a vertical stepper (not typically used in forms):

```tsx
<Stepper
  active={currentStep}
  steps={steps.map((label) => ({ label }))}
  orientation="vertical"
/>
```

### Custom Icons

```tsx
<Stepper
  active={currentStep}
  steps={steps}
  completedIcon={<CheckCircle weight="fill" />}
  errorIcon={<XCircle weight="fill" />}
/>
```

## Working with Form State

The Stepper integrates with FormWrapper's state:

```tsx
import { FormWrapper } from "@settle/core";

export function StepForm() {
  const { current: currentStep, ...formProps } = FormWrapper.useFormProps();

  return (
    <FormShell steps={["Step 1", "Step 2"]} showStepper>
      {/* currentStep automatically updates as form progresses */}
    </FormShell>
  );
}
```

## API Reference

### Stepper Props

```typescript
interface PropStepper {
  steps: (string | StepperStep)[];
  active: number;
  onStepChange?: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  iconSize?: number;
  completedIcon?: React.ReactNode;
  errorIcon?: React.ReactNode;
  allowStepClick?: boolean;
  allowStepSkip?: boolean;
}

interface StepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
}
```

### FormShellStepper Props

```typescript
interface PropFormShellStepper {
  steps: string[];
  currentStep: number;
  disabledSteps?: number[];
  onStepChange?: (step: number) => void;
}
```

## Common Patterns

### Pattern 1: Disabling Future Steps Until Current Is Valid

```tsx
<FormShell
  steps={steps}
  disabledSteps={isCurrentStepValid ? [] : [1, 2, 3]}
  showStepper
>
  {/* form content */}
</FormShell>
```

### Pattern 2: Skip Steps Based on Condition

```tsx
const getDisabledSteps = () => {
  if (userType === "individual") {
    return [1]; // Skip company step
  }
  return [];
};

<FormShell
  steps={steps}
  disabledSteps={getDisabledSteps()}
  showStepper
>
  {/* form content */}
</FormShell>
```

### Pattern 3: Adding Error Indicators

To show error states, you can enhance the component:

```tsx
const stepStates = [
  { label: "Step 1", error: !step1Valid },
  { label: "Step 2", error: !step2Valid },
  { label: "Step 3", error: false },
];

// Then use directly:
<Stepper steps={stepStates} active={currentStep} />
```

## Styling Customization

The component uses CSS modules with Mantine color variables. To customize:

### Add Custom Class

```tsx
<Stepper
  steps={steps}
  active={currentStep}
  className="my-custom-stepper"
/>
```

Then in your CSS:

```css
.my-custom-stepper :global(.step_icon_active) {
  background-color: var(--my-custom-color);
}
```

### Override Colors

Modify `Stepper.module.css`:

```css
.step_icon_active {
  background-color: your-color; /* instead of var(--mantine-color-blue-6) */
}

.step_connector_completed {
  background-color: your-color;
}
```

## Browser Support

- ✅ Chrome (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Edge (Latest)

## Troubleshooting

### Stepper not appearing

**Issue**: `Export Stepper doesn't exist`

**Solution**: Make sure to import from `@settle/admin`:
```tsx
import { Stepper } from "@settle/admin";
```

### Steps not advancing

**Issue**: Click on Next button but step doesn't change

**Solution**: Make sure you're using FormShell or manually handling `onStepChange` callback

### Styling looks broken

**Issue**: Colors or layout incorrect

**Solution**: Ensure Mantine provider is wrapping your app and CSS modules are processed correctly

## Next Steps

- See [Stepper.md](./Stepper.md) for detailed component documentation
- Check [FormShell](../layouts/FormShell/FormShell.tsx) for integration example
- Review test files for usage examples (if available)
