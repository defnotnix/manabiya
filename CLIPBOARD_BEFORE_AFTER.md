# Clipboard Integration - Before & After

## Example: StatementDrawer.tsx

### BEFORE (Original Code)

```tsx
"use client";

import { useEffect, useState } from "react";
import { Drawer, Stack, TextInput, ... } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Plus, Minus, Calculator, Warning } from "@phosphor-icons/react";
import { useDocContext, BANK_KEY_LABELS, BankStatementData } from "@/context/DocumentContext";
// ... other imports

interface StatementDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function StatementDrawer({ opened, onClose }: StatementDrawerProps) {
  const { addDocument, bankData, setBankData, documents, customGroupId, setCustomGroupId, studentId, activeDocument } = useDocContext();

  const [intrestStartIndex, setIntrestStartIndex] = useState(0);
  // ... other state

  return (
    <Drawer opened={opened} onClose={onClose} position="right" size="xl" title="Bank Statement Form">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        {/* Form content */}
      </form>

      <Modal /* ... */>
        {/* Modal content */}
      </Modal>
    </Drawer>
  );
}
```

### AFTER (With Clipboard)

```tsx
"use client";

import { useEffect, useState } from "react";
import { Drawer, Stack, TextInput, ... } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Plus, Minus, Calculator, Warning } from "@phosphor-icons/react";
import { useDocContext, BANK_KEY_LABELS, BankStatementData } from "@/context/DocumentContext";
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";  // ← NEW
// ... other imports

interface StatementDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export function StatementDrawer({ opened, onClose }: StatementDrawerProps) {
  const { addDocument, bankData, setBankData, documents, customGroupId, setCustomGroupId, studentId, activeDocument } = useDocContext();
  const clipboard = useClipboardPanel();  // ← NEW

  // ← NEW: Open clipboard when drawer opens
  useEffect(() => {
    if (opened) {
      clipboard.open();
    }
  }, [opened, clipboard]);

  const [intrestStartIndex, setIntrestStartIndex] = useState(0);
  // ... other state

  return (
    <>  {/* ← NEW: Wrap in fragment */}
      <Drawer opened={opened} onClose={onClose} position="right" size="xl" title="Bank Statement Form">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* Form content */}
        </form>

        <Modal /* ... */>
          {/* Modal content */}
        </Modal>
      </Drawer>

      {/* ← NEW: Add clipboard panel */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Key Changes

### 1. **Import**
```tsx
// Add this line
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";
```

### 2. **Initialize Hook**
```tsx
// Inside component function
const clipboard = useClipboardPanel();
```

### 3. **Open on Mount**
```tsx
// Add this useEffect
useEffect(() => {
  if (opened) {
    clipboard.open();
  }
}, [opened, clipboard]);
```

### 4. **Add Component**
```tsx
// In the JSX return statement
<ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
```

### 5. **Wrap in Fragment** (if needed)
```tsx
// Change:
return (
  <Drawer ...>...</Drawer>
);

// To:
return (
  <>
    <Drawer ...>...</Drawer>
    <ClipboardPanel ... />
  </>
);
```

## Summary of Changes

| Aspect | Changes |
|--------|---------|
| **Imports** | +1 new import line |
| **Hook Usage** | +1 `useClipboardPanel()` call |
| **useEffect** | +1 new effect to open clipboard |
| **JSX Structure** | +1 wrapper fragment (if needed) |
| **Components** | +1 `<ClipboardPanel />` component |
| **Total Lines Added** | ~10-15 lines |

## Impact

✅ **Minimal Code Changes**
- Only 10-15 lines added per file
- No existing functionality modified
- No breaking changes

✅ **Instant Benefits**
- Users get clipboard automatically
- No additional clicks needed
- Improved form filling experience

✅ **Easy to Maintain**
- Consistent pattern across all files
- Easy to remove if needed
- Standard React patterns

## All 7 Modified Files

The same pattern was applied to:
1. ✅ StatementDrawer.tsx
2. ✅ StudentCvDrawer.tsx
3. ✅ StudentCertificateDrawer.tsx
4. ✅ WodaDrawer.tsx
5. ✅ students/pages/new/page.tsx
6. ✅ students/pages/edit/page.tsx
7. ✅ students/pages/view/page.tsx

Each follows this exact same pattern for consistency.

## Verification

To verify the changes work:

```bash
# 1. Navigate to any form
# 2. Open it (click Create Student, Edit Student, or any doc form)
# 3. The clipboard panel should automatically open from the bottom
# 4. Test copying entries from clipboard into the form
# 5. Close and reopen to verify it works consistently
```

---

**Note:** All changes are additive and non-breaking. The forms work exactly as before, with the added benefit of the clipboard panel.
