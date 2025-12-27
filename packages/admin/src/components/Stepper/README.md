# Stepper Component

A versatile step indicator component for displaying multi-step workflows and forms.

## Files Created

```
packages/admin/src/components/Stepper/
├── Stepper.tsx                    # Main component
├── Stepper.type.ts                # TypeScript types
├── Stepper.module.css             # Styling
├── index.ts                       # Exports
├── Stepper.md                     # Detailed documentation
├── IMPLEMENTATION_GUIDE.md        # Integration guide
└── README.md                      # This file
```

## Features

✅ **Flexible Layout** - Horizontal (default) or vertical orientation
✅ **Multiple Sizes** - xs, sm, md (default), lg, xl
✅ **Step States** - Pending, Active, Completed, Error
✅ **Descriptions** - Optional per-step descriptions
✅ **Custom Icons** - Custom completion and error indicators
✅ **Interactive** - Optional step clicking and skipping
✅ **Smooth Styling** - CSS modules with Mantine integration
✅ **Accessible** - Semantic HTML and keyboard support
✅ **Well Documented** - Multiple guides and examples

## Quick Usage

```tsx
import { Stepper } from "@settle/admin";

export function MySteps() {
  const [active, setActive] = useState(0);

  return (
    <Stepper
      steps={["Step 1", "Step 2", "Step 3"]}
      active={active}
      onStepChange={setActive}
      allowStepClick
    />
  );
}
```

## Common Use Cases

### 1. Multi-Step Forms
```tsx
<Stepper
  steps={["Personal", "Address", "Confirm"]}
  active={formStep}
/>
```

### 2. Workflow Progress
```tsx
<Stepper
  steps={["Created", "Processing", "Completed"]}
  active={status}
  orientation="vertical"
/>
```

### 3. With Descriptions
```tsx
<Stepper
  steps={[
    { label: "Info", description: "Your details" },
    { label: "Address", description: "Location" },
    { label: "Review", description: "Verify" }
  ]}
  active={step}
/>
```

### 4. Error Handling
```tsx
<Stepper
  steps={[
    { label: "Valid" },
    { label: "Error", error: true },
    { label: "Pending" }
  ]}
  active={1}
/>
```

## Integration with FormShell

The Stepper is built-in to FormShell:

```tsx
import { FormShell } from "@settle/admin";

export function MyForm() {
  return (
    <FormShell
      steps={["Step 1", "Step 2", "Step 3"]}
      showStepper={true}
    >
      {/* Form content */}
    </FormShell>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | Step[] | Required | Array of steps |
| `active` | number | Required | Active step index (0-based) |
| `onStepChange` | (index) => void | - | Change handler |
| `orientation` | "horizontal" \| "vertical" | "horizontal" | Layout direction |
| `size` | "xs" \| "sm" \| "md" \| "lg" \| "xl" | "md" | Icon size |
| `allowStepClick` | boolean | false | Enable step clicking |
| `allowStepSkip` | boolean | false | Allow skipping ahead |

## Step Object

```typescript
interface StepperStep {
  label: string;              // Required
  description?: string;       // Optional
  icon?: React.ReactNode;     // Optional custom icon
  error?: boolean;            // Optional error state
}
```

## Examples

### Simple Horizontal
```tsx
<Stepper steps={["One", "Two", "Three"]} active={0} />
```

### Vertical with Descriptions
```tsx
<Stepper
  steps={[
    { label: "Step 1", description: "Enter details" },
    { label: "Step 2", description: "Confirm" }
  ]}
  active={0}
  orientation="vertical"
/>
```

### Interactive with Sizes
```tsx
<Stepper
  steps={["A", "B", "C"]}
  active={activeStep}
  size="lg"
  allowStepClick
  onStepChange={setActiveStep}
/>
```

## Styling

The component uses CSS modules with Mantine color variables:

- Blue (#2563eb) - Active steps
- Green (#16a34a) - Completed steps
- Red (#dc2626) - Error steps
- Gray (#6b7280) - Inactive steps

### Available CSS Classes

- `.root` - Main container
- `.step_container` - Individual step
- `.step_icon` - Step circle
- `.step_label` - Label and description
- `.step_connector` - Connecting line
- `.step_title` - Step label text
- `.step_description` - Optional description

## Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ WCAG color contrast
- ✅ Focus indicators

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Documentation

- **[Stepper.md](./Stepper.md)** - Complete API reference
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Integration patterns
- **[FormShell](../layouts/FormShell)** - Usage in context

## Related Components

- [FormShell](../layouts/FormShell/FormShell.tsx) - Form layout with Stepper
- [FormShellStepper](../layouts/FormShell/components/Stepper/index.tsx) - Wrapper component
- [Tabs](../Tabs/Tabs.tsx) - Tab navigation component

## Version History

### v1.0.0 (Initial)
- Horizontal and vertical orientation
- Multiple sizes (xs, sm, md, lg, xl)
- Step states (pending, active, completed, error)
- Optional descriptions
- Custom icons
- Click navigation
- CSS module styling

## License

Part of the @settle/admin package

## Support

For issues or questions:
1. Check the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. Review the examples in this README
3. See [Stepper.md](./Stepper.md) for API details
