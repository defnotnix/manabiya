# FormShell Architecture

## Component Hierarchy

```
FormShell
├── FormShellHeader
│   └── Breadcrumbs + Title + Info
│
├── FormShellStepper (optional)
│   └── Step indicators with progress
│
├── Container (flex-1)
│   └── Form Content (children)
│
└── FormShellFooter ← NEW
    ├── Previous Step Button (conditional)
    ├── Next Step Button (conditional)
    ├── Submit Button (conditional)
    └── Cancel Button (optional)
```

## Data Flow

```
FormHandler Hook
    ↓
useFormProps() gets current step
    ↓
FormShellFooter
    ├─ Reads: current step
    ├─ Determines: which buttons to show
    ├─ Applies: disabled states
    └─ Calls: callbacks (onCancel, onStepNext, etc.)
```

## Button Visibility Logic

```javascript
// Step 0 (First step)
├─ Previous: DISABLED
├─ Next: VISIBLE (if multi-step)
└─ Submit: HIDDEN (if multi-step)

// Step 1-N (Middle steps)
├─ Previous: ENABLED
├─ Next: VISIBLE (if not last)
└─ Submit: HIDDEN

// Step N (Last step)
├─ Previous: ENABLED
├─ Next: HIDDEN
└─ Submit: VISIBLE

// No stepper
├─ Previous: HIDDEN
├─ Next: HIDDEN
└─ Submit: VISIBLE
```

## State Management

FormShell uses React context from FormWrapper:

```tsx
const formProps = FormWrapper.useFormProps();
const current = formProps?.current || 0;  // Current step
```

The form state is managed by FormHandler/FormWrapper, FormShell just reads it.

## Layout Structure

```
┌─────────────────────────────────────┐
│        FormShellHeader              │  Fixed height
├─────────────────────────────────────┤
│      FormShellStepper (optional)    │  Fixed height
├─────────────────────────────────────┤
│                                     │
│    Form Content (children)          │  flex-1 (fills space)
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [Cancel]        [Prev] [Next] [✓]  │  FormShellFooter
└─────────────────────────────────────┘
```

## Responsive Design

The footer uses Mantine's Group component:

```tsx
<Group justify="space-between">
  {/* Left: Previous button */}
  {/* Right: Cancel, Next, Submit buttons */}
</Group>
```

This automatically handles mobile responsiveness.

## Styling

### Colors
- Background: `var(--mantine-color-gray-0)` (light gray)
- Border: `1px solid var(--mantine-color-gray-2)` (light border)

### Button Variants
- **Cancel**: `variant="default"` (gray)
- **Previous**: `variant="light"` (light background)
- **Next**: Default variant (teal/brand color)
- **Submit**: `color="teal"` (emphasizes importance)

### Icons
- **Previous**: `<ArrowLeft />` from @phosphor-icons
- **Next**: `<ArrowRight />`
- **Submit**: `<Check />`
- **Cancel**: `<X />`

## Props and Callbacks

### FormShell Props
```tsx
type PropFormShell = {
  bread?: Array<{ label: string; link?: string }>;
  moduleInfo?: any;
  title?: string;
  children: React.ReactNode;
  steps?: string[];
  disabledSteps?: number[];
  showStepper?: boolean;
  formName?: string;

  // Footer props ← NEW
  onStepBack?: () => void;
  onStepNext?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}
```

### FormShellFooter Props
```tsx
interface FooterProps {
  withStepper?: boolean;
  steps?: string[];
  onStepBack?: () => void;
  onStepNext?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}
```

## Integration Points

### With FormHandler
FormShellFooter uses `FormWrapper.useFormProps()` to:
- Get current step
- Determine button visibility
- Know if form is multi-step

```tsx
const formProps = FormWrapper.useFormProps();
const current = formProps?.current || 0;
const isLastStep = current + 1 === steps.length;
```

### With Callbacks
Parent component provides callbacks:

```tsx
<FormShell
  onCancel={() => router.back()}
  onStepNext={() => nextStep()}
  onStepBack={() => prevStep()}
/>
```

## Loading State

When `isLoading={true}`:
- All buttons show loading indicator
- All buttons become disabled (via `loading` prop)
- Prevents multiple submissions

```tsx
<Button loading={isLoading} disabled={isLoading} />
```

## Type Safety

Full TypeScript support:
- Props are fully typed via `PropFormShell`
- Callbacks are optional and properly typed
- Returns are inferred correctly

## Browser Compatibility

Uses standard React patterns:
- Mantine UI components (modern browsers)
- CSS variables for theming
- Responsive design via Mantine Grid

## Performance Considerations

- FormShellFooter is a pure component
- Only re-renders when props change
- Button visibility logic is O(1)
- No unnecessary re-renders of form content

## Future Enhancements

Potential improvements:
- [ ] Keyboard navigation (Enter/Escape)
- [ ] Confirm dialog before cancel
- [ ] Custom button labels
- [ ] Button size customization
- [ ] Alternative footer layouts
- [ ] Sticky vs scroll footer option

## References

- **Mantine**: https://mantine.dev
- **Phosphor Icons**: https://phosphoricons.com
- **FormWrapper**: @settle/core

## Files

- **Main**: `FormShell.tsx`
- **Types**: `FormShell.type.ts`
- **Footer**: `components/Footer/Footer.tsx`
- **Documentation**: `FORMSHELL_USAGE.md` (this file)
