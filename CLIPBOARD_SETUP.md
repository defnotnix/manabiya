# Clipboard Component - Setup & Integration Guide

## ✅ What Was Created

A complete clipboard management module with the following structure:

```
apps/admin/modules/clipboard/
├── components/
│   ├── ClipboardPanel.tsx           # Main drawer (bottom-up panel)
│   ├── CategoryForm.tsx              # Create/edit categories
│   ├── ClipboardEntryForm.tsx        # Create/edit entries
│   ├── ClipboardPanel.module.css     # Styling
│   └── index.ts                      # Component exports
├── hooks/
│   ├── useClipboardApi.ts            # API integration
│   ├── useClipboardPanel.ts          # State management
│   └── index.ts                      # Hook exports
├── example/
│   └── ClipboardExample.tsx          # Usage examples
├── index.ts                          # Main exports
├── README.md                         # Full documentation
└── INTEGRATION.md                    # Integration guide
```

## 🚀 Quick Start (3 Steps)

### Step 1: Import and Use

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function MyForm() {
  const clipboard = useClipboardPanel();

  return (
    <>
      <button onClick={clipboard.open}>Open Clipboard</button>
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

### Step 2: Auto-Open with Forms

```tsx
import { useEffect } from "react";
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function FormWithClipboard({ formIsOpen }) {
  const clipboard = useClipboardPanel();

  useEffect(() => {
    if (formIsOpen) clipboard.open();
    else clipboard.close();
  }, [formIsOpen, clipboard]);

  return (
    <>
      {/* Your form */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

### Step 3: (Optional) Customize Position

Edit `ClipboardPanel.module.css` to position at bottom-right:

```css
.clipboardDrawer {
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  left: auto !important;
  top: auto !important;
}
```

## 📋 Features Included

- ✅ **Category Management** - Create, update, delete categories
- ✅ **Clipboard Entries** - Full CRUD operations
- ✅ **Search & Filter** - Real-time search by title/content/notes
- ✅ **Pin/Archive** - Pin frequent entries, archive old ones
- ✅ **One-Click Copy** - Copy to clipboard with usage tracking
- ✅ **Usage Stats** - Track when and how often entries are used
- ✅ **Responsive UI** - Works on all screen sizes
- ✅ **Auto-Notifications** - Toast notifications for all operations
- ✅ **Tabbed Navigation** - Easy category switching
- ✅ **Owner-Scoped** - Each user has their own data

## 🔗 Integration Examples

### With StatementDrawer (Similar Forms)

```tsx
import { StatementDrawer } from "@/modules/docs/drawers/StatementDrawer";
import { ClipboardPanel } from "@/modules/clipboard";
import { useClipboardPanel } from "@/modules/clipboard";

export function DocumentForm() {
  const clipboard = useClipboardPanel();
  const [statementOpened, setStatementOpened] = useState(false);

  return (
    <>
      <button onClick={() => setStatementOpened(true)}>
        Edit Bank Statement
      </button>

      <StatementDrawer
        opened={statementOpened}
        onClose={() => {
          setStatementOpened(false);
          clipboard.close();
        }}
      />

      <ClipboardPanel
        opened={clipboard.opened}
        onClose={clipboard.close}
      />
    </>
  );
}
```

### In Page Layout

```tsx
// In your main layout or page component
import { ClipboardPanel } from "@/modules/clipboard";
import { useClipboardPanel } from "@/modules/clipboard";

export function MainLayout({ children }) {
  const clipboard = useClipboardPanel();

  return (
    <>
      <div>{children}</div>
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## 📡 API Endpoints Used

All requests are automatically authenticated with Bearer token:

```
Base: /api/features

Categories:
- GET    /categories/
- POST   /categories/
- GET    /categories/{id}/
- PUT    /categories/{id}/
- DELETE /categories/{id}/

Clipboard Entries:
- GET    /clipboards/
- POST   /clipboards/
- GET    /clipboards/{id}/
- PUT    /clipboards/{id}/
- DELETE /clipboards/{id}/
- POST   /clipboards/{id}/use/     (mark as used)
```

## 🎨 Customization Options

### Change Drawer Size
```tsx
// In ClipboardPanel.module.css
.clipboardDrawer {
  --drawer-size: 70vh;  /* Default: 80vh */
}
```

### Modify Card Styling
```css
/* ClipboardPanel.module.css */
.entryCard {
  /* Add your custom styles */
  background: #f5f5f5;
  border: 2px solid #ccc;
}
```

### Add More Fields
1. Extend API types in `useClipboardApi.ts`
2. Update form components to include new fields
3. Form components handle submission automatically

## 📚 File Reference

| File | Purpose |
|------|---------|
| `ClipboardPanel.tsx` | Main drawer component with all logic |
| `CategoryForm.tsx` | Form for creating categories |
| `ClipboardEntryForm.tsx` | Form for creating/editing entries |
| `useClipboardApi.ts` | All API calls + type definitions |
| `useClipboardPanel.ts` | State management (open/close) |
| `ClipboardPanel.module.css` | All styling |

## 🔧 Common Patterns

### Open on Button Click
```tsx
<button onClick={() => clipboard.open()}>Show Clipboard</button>
```

### Auto-Open with Modal
```tsx
useEffect(() => {
  if (modalIsOpen) clipboard.open();
}, [modalIsOpen, clipboard]);
```

### Handle Entry Selection
```tsx
// The component automatically copies to clipboard
// No additional handling needed - usage is auto-tracked
```

### Refresh Data
```tsx
// Data refreshes automatically when drawer opens
// No manual refresh needed
```

## 🐛 Debugging

Enable console logs in `useClipboardApi.ts` to debug API calls:

```typescript
console.log("API Call:", endpoint, method, body);
```

All error notifications are shown as toast messages. Check browser console for detailed errors.

## 📱 Mobile Responsive

The component is fully responsive:
- Mobile: Full-width drawer with adjusted padding
- Tablet: Optimized spacing
- Desktop: Full features

## ⚙️ Setup Checklist

- [ ] Files created in `/modules/clipboard/`
- [ ] Import statements use correct paths
- [ ] `moduleApiCall` from `@settle/core` is available
- [ ] `@mantine/core` and `@mantine/form` are installed
- [ ] Bearer token authentication is configured

## 🎯 Next Steps

1. **Import** the component in your form/page
2. **Test** with the example in `example/ClipboardExample.tsx`
3. **Customize** positioning and styling as needed
4. **Integrate** with your existing forms

## 📖 Full Documentation

- **README.md** - Complete API documentation and features
- **INTEGRATION.md** - Detailed integration guide
- **ClipboardExample.tsx** - 3 working examples

---

**Ready to use!** Start by adding the component to any form with:

```tsx
<ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
```
