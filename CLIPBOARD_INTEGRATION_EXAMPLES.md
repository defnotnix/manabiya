# Clipboard Integration - Real-World Examples

## Example 1: Add to StatementDrawer (Bank Statement Form)

**Location:** `apps/admin/modules/docs/drawers/StatementDrawer.tsx`

```tsx
// At the top of the file
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

// Inside StatementDrawer component
export function StatementDrawer({ opened, onClose }: StatementDrawerProps) {
  // ... existing code ...
  const clipboard = useClipboardPanel();

  // Open clipboard when statement drawer opens
  useEffect(() => {
    if (opened) {
      clipboard.open();
    }
  }, [opened, clipboard]);

  return (
    <>
      <Drawer opened={opened} onClose={onClose} /* existing props */>
        {/* existing drawer content */}
      </Drawer>

      {/* Add clipboard panel */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Example 2: Add to WodaDrawer

**Location:** `apps/admin/modules/docs/drawers/WodaDrawer.tsx`

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function WodaDrawer({ opened, onClose }: WodaDrawerProps) {
  const clipboard = useClipboardPanel();

  useEffect(() => {
    if (opened) clipboard.open();
  }, [opened, clipboard]);

  return (
    <>
      <Drawer opened={opened} onClose={onClose}>
        {/* form content */}
      </Drawer>
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Example 3: Add to StudentForm

**Location:** `apps/admin/modules/admin/students/form/StudentsForm.tsx`

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function StudentsForm() {
  const clipboard = useClipboardPanel();
  const [formOpen, setFormOpen] = useState(true);

  useEffect(() => {
    if (formOpen) clipboard.open();
  }, [formOpen, clipboard]);

  return (
    <>
      {/* Your form */}
      <form>
        {/* form fields */}
      </form>

      {/* Clipboard panel */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Example 4: Global Clipboard Available on Any Page

**Location:** `apps/admin/layouts/app/index.tsx`

```tsx
import { ClipboardPanel } from "@/modules/clipboard";
import { useClipboardPanel } from "@/modules/clipboard";

export function AppLayout({ children }) {
  const clipboard = useClipboardPanel();

  return (
    <div>
      <Header>
        {/* Add button to open clipboard anywhere */}
        <Button
          size="sm"
          onClick={clipboard.open}
          leftSection={<Copy size={16} />}
        >
          Clipboard
        </Button>
      </Header>

      <main>{children}</main>

      {/* Always available */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </div>
  );
}
```

## Example 5: With Keyboard Shortcut

```tsx
import { useEffect } from "react";
import { useClipboardPanel } from "@/modules/clipboard";

export function useClipboardShortcut() {
  const clipboard = useClipboardPanel();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+C or Cmd+Shift+C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyC") {
        e.preventDefault();
        clipboard.toggle();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [clipboard]);

  return clipboard;
}

// Usage in component:
export function FormWithShortcut() {
  const clipboard = useClipboardShortcut(); // Opens with Ctrl+Shift+C
  // ... rest of component
}
```

## Example 6: Auto-Open Based on Form Type

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function DynamicForm({ formType, isOpen }) {
  const clipboard = useClipboardPanel();

  // Open clipboard only for text-heavy forms
  useEffect(() => {
    const textHeavyForms = ["bank_statement", "visa_form", "address_form"];
    if (isOpen && textHeavyForms.includes(formType)) {
      clipboard.open();
    }
  }, [isOpen, formType, clipboard]);

  return (
    <>
      {/* form content */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Example 7: Context Provider (App-Wide)

Create a new context file:

```tsx
// apps/admin/context/ClipboardContext.tsx
import React from "react";
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export const ClipboardContext = React.createContext(null);

export function ClipboardProvider({ children }) {
  const clipboard = useClipboardPanel();

  return (
    <ClipboardContext.Provider value={clipboard}>
      {children}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </ClipboardContext.Provider>
  );
}

// Usage anywhere:
export function useClipboard() {
  const context = React.useContext(ClipboardContext);
  if (!context) {
    throw new Error("useClipboard must be used within ClipboardProvider");
  }
  return context;
}
```

Then use it:
```tsx
// In any component
const clipboard = useClipboard();
clipboard.open();
```

## Example 8: With Form Validation

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";
import { useForm } from "@mantine/form";

export function ValidatedForm() {
  const clipboard = useClipboardPanel();
  const form = useForm({
    initialValues: { email: "", message: "" },
    validate: {
      email: (val) => (!val ? "Email is required" : null),
    },
  });

  // Open clipboard when there are validation errors
  useEffect(() => {
    if (Object.keys(form.errors).length > 0) {
      clipboard.open();
    }
  }, [form.errors, clipboard]);

  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        {/* form fields with errors */}
      </form>

      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Example 9: Multiple Forms with Clipboard

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function MultiFormPage() {
  const clipboard = useClipboardPanel();
  const [activeForm, setActiveForm] = useState<"bank" | "visa" | null>(null);

  // Show clipboard when any form is active
  useEffect(() => {
    if (activeForm) clipboard.open();
    else clipboard.close();
  }, [activeForm, clipboard]);

  return (
    <div>
      <Tabs value={activeForm} onTabChange={setActiveForm}>
        <Tabs.List>
          <Tabs.Tab value="bank">Bank Form</Tabs.Tab>
          <Tabs.Tab value="visa">Visa Form</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bank">
          <BankStatementForm />
        </Tabs.Panel>

        <Tabs.Panel value="visa">
          <VisaApplicationForm />
        </Tabs.Panel>
      </Tabs>

      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </div>
  );
}
```

## Example 10: Clipboard with Custom Styling

```tsx
import { Box } from "@mantine/core";
import { ClipboardPanel } from "@/modules/clipboard";
import { useClipboardPanel } from "@/modules/clipboard";

export function StyledClipboardForm() {
  const clipboard = useClipboardPanel();

  return (
    <Box>
      <button onClick={clipboard.open}>
        📋 Open Clipboard
      </button>

      {/* Custom wrapper for positioning */}
      <Box
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 100,
        }}
      >
        <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
      </Box>
    </Box>
  );
}
```

## Quick Copy-Paste Template

Use this template to add clipboard to any form:

```tsx
"use client";

import { useEffect } from "react";
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function MyFormComponent() {
  const clipboard = useClipboardPanel();

  // Auto-open clipboard when form is visible
  useEffect(() => {
    clipboard.open();
    return () => clipboard.close();
  }, [clipboard]);

  return (
    <>
      {/* Your form JSX */}
      <form>
        {/* form fields */}
      </form>

      {/* Clipboard panel - copy this to any component */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Integration Checklist

- [ ] Import `useClipboardPanel` and `ClipboardPanel`
- [ ] Call `useClipboardPanel()` hook
- [ ] Add `useEffect` to open/close based on form state
- [ ] Add `<ClipboardPanel>` component
- [ ] Test copy functionality
- [ ] Test category switching
- [ ] Verify notifications appear

## Notes

- The clipboard automatically syncs with your user account
- Data is fetched fresh each time drawer opens
- Search is instant (client-side)
- All changes are saved to API immediately
- Usage tracking is automatic

---

Ready to integrate? Pick the example that matches your use case and add it to your form!
