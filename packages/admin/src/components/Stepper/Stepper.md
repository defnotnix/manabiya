# Stepper Component

A flexible step indicator component for multi-step forms and workflows.

## Usage

### Basic Horizontal Stepper

```tsx
import { Stepper } from "@settle/admin";
import { useState } from "react";

export function MyForm() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Stepper
      steps={["Personal Info", "Address", "Confirmation"]}
      active={activeStep}
      onStepChange={setActiveStep}
      allowStepClick
    />
  );
}
```

### With Descriptions

```tsx
<Stepper
  steps={[
    { label: "Step 1", description: "Enter your details" },
    { label: "Step 2", description: "Verify address" },
    { label: "Step 3", description: "Complete" },
  ]}
  active={activeStep}
  onStepChange={setActiveStep}
  allowStepClick
/>
```

### Vertical Stepper

```tsx
<Stepper
  steps={["Step 1", "Step 2", "Step 3"]}
  active={activeStep}
  orientation="vertical"
  allowStepClick
/>
```

### With Error State

```tsx
<Stepper
  steps={[
    { label: "Step 1" },
    { label: "Step 2", error: true },
    { label: "Step 3" },
  ]}
  active={1}
  onStepChange={setActiveStep}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `(string \| StepperStep)[]` | - | Array of steps (strings or step objects) |
| `active` | `number` | - | Index of the active step (0-based) |
| `onStepChange` | `(index: number) => void` | - | Callback when step changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout direction |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` | Size of step icons |
| `iconSize` | `number` | `20` | Size of icons inside step circles |
| `completedIcon` | `React.ReactNode` | `<Check />` | Custom icon for completed steps |
| `errorIcon` | `React.ReactNode` | `<X />` | Custom icon for error steps |
| `allowStepClick` | `boolean` | `false` | Allow clicking on steps to navigate |
| `allowStepSkip` | `boolean` | `false` | Allow skipping ahead (requires `allowStepClick`) |

## StepperStep Type

```typescript
interface StepperStep {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  error?: boolean;
}
```

## Features

- ✅ Horizontal and vertical orientation
- ✅ Multiple size options
- ✅ Completed step indicators
- ✅ Error state support
- ✅ Custom icons
- ✅ Click navigation (optional)
- ✅ Step skipping (optional)
- ✅ Descriptions support
- ✅ Smooth transitions
- ✅ Fully styled with CSS modules

## Step States

1. **Pending** - Future steps (number indicator)
2. **Active** - Current step (highlighted in blue)
3. **Completed** - Past steps (green with checkmark)
4. **Error** - Steps with validation errors (red with X)

## Styling

The component uses CSS modules for styling with support for Mantine color variables.

### Classes Available

- `.root` - Container
- `.step_container` - Individual step wrapper
- `.step_content` - Step content wrapper
- `.step_icon` - Step icon circle
- `.step_label` - Step label and description
- `.step_connector` - Line connecting steps

## Example with Form

```tsx
import { Stepper } from "@settle/admin";
import { FormShell } from "@settle/admin";
import { useState } from "react";
import { Stack, TextInput, Button, Group } from "@mantine/core";

export function MultiStepForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const steps = [
    { label: "Personal", description: "Enter your name" },
    { label: "Address", description: "Enter your address" },
    { label: "Contact", description: "Enter your phone" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <FormShell
      steps={steps.map(s => s.label)}
      showStepper={true}
    >
      <Stack gap="lg">
        {activeStep === 0 && (
          <TextInput
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        )}

        {activeStep === 1 && (
          <TextInput
            label="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        )}

        {activeStep === 2 && (
          <TextInput
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        )}

        <Group justify="space-between" mt="lg">
          <Button
            variant="light"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? "Complete" : "Next"}
          </Button>
        </Group>
      </Stack>
    </FormShell>
  );
}
```

## Accessibility

- Proper semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meets WCAG standards
- Focus indicators on interactive steps

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
