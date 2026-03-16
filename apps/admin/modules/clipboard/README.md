# Clipboard Module

A comprehensive clipboard management system for form-based applications. Allows users to save, organize, and quickly insert frequently used text snippets organized into categories.

## Features

### Core Features
- 📁 **Category Management**: Organize clipboard entries into user-defined categories
- 📋 **Clipboard Entries**: Store text snippets with title, content, and notes
- 🔍 **Search & Filter**: Quickly find entries by title, content, or notes
- 📌 **Pin Entries**: Keep frequently used snippets at the top
- 🏷️ **Archive**: Hide entries without deleting them
- 📊 **Usage Tracking**: Track how many times and when each entry was used
- 📋 **Copy to Clipboard**: One-click copying with automatic usage tracking
- 🎯 **Auto-Open**: Can auto-open when a form is displayed

### UI/UX
- Bottom-up drawer panel (can be customized to any position)
- Responsive design with mobile support
- Smooth animations and transitions
- Toast notifications for all operations
- Tabbed interface for category navigation

## Installation

No additional installation needed. The module is part of the project.

## Quick Start

### Basic Usage

```tsx
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function MyComponent() {
  const clipboard = useClipboardPanel();

  return (
    <>
      <button onClick={clipboard.open}>Open Clipboard</button>
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

### With Form Integration

```tsx
import { useEffect } from "react";
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";

export function FormComponent() {
  const clipboard = useClipboardPanel();

  // Auto-open clipboard when form is visible
  useEffect(() => {
    clipboard.open();
    return () => clipboard.close();
  }, [clipboard]);

  return (
    <>
      {/* Your form here */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## API Reference

### Components

#### ClipboardPanel

Main drawer component that displays all categories and clipboard entries.

**Props:**
```typescript
interface ClipboardPanelProps {
  opened: boolean;        // Whether drawer is open
  onClose: () => void;    // Called when user closes drawer
}
```

**Usage:**
```tsx
<ClipboardPanel opened={opened} onClose={handleClose} />
```

#### CategoryForm

Form for creating new categories.

**Props:**
```typescript
interface CategoryFormProps {
  onSubmit: (data: {
    name: string;
    description: string;
  }) => Promise<void>;
  onCancel: () => void;
}
```

#### ClipboardEntryForm

Form for creating and editing clipboard entries.

**Props:**
```typescript
interface ClipboardEntryFormProps {
  category: Category;
  entry?: ClipboardEntry | null;
  onSubmit: (data: {
    title: string;
    content: string;
    notes: string;
    is_pinned: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}
```

### Hooks

#### useClipboardPanel

State management hook for controlling the clipboard panel.

**Returns:**
```typescript
{
  opened: boolean;      // Current state
  open: () => void;     // Open panel
  close: () => void;    // Close panel
  toggle: () => void;   // Toggle state
}
```

**Usage:**
```tsx
const clipboard = useClipboardPanel();
clipboard.open();
clipboard.close();
```

#### useClipboardApi

Direct API access for clipboard operations.

**Methods:**
```typescript
// Categories
fetchCategories(): Promise<Category[]>
createCategory(data): Promise<Category | null>
updateCategory(id, data): Promise<Category | null>
deleteCategory(id): Promise<boolean>

// Clipboard Entries
fetchClipboardEntries(): Promise<ClipboardEntry[]>
createClipboardEntry(data): Promise<ClipboardEntry | null>
updateClipboardEntry(id, data): Promise<ClipboardEntry | null>
deleteClipboardEntry(id): Promise<boolean>
markClipboardAsUsed(id): Promise<ClipboardEntry | null>
```

**Usage:**
```tsx
const api = useClipboardApi();
const categories = await api.fetchCategories();
const entry = await api.createClipboardEntry({
  category: 1,
  title: "My Snippet",
  content: "Some text",
});
```

### Types

#### Category
```typescript
interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  owner: number;
  created_at: string;
  updated_at: string;
}
```

#### ClipboardEntry
```typescript
interface ClipboardEntry {
  id: number;
  category: number;
  category_name: string;
  title: string;
  content: string;
  notes: string;
  is_pinned: boolean;
  is_archived: boolean;
  usage_count: number;
  last_used_at: string | null;
  owner: number;
  created_at: string;
  updated_at: string;
}
```

## API Endpoints

Base URL: `/api/features`

### Categories
- `GET /api/features/categories/` - List all categories
- `POST /api/features/categories/` - Create category
- `GET /api/features/categories/{id}/` - Get single category
- `PUT /api/features/categories/{id}/` - Update category
- `PATCH /api/features/categories/{id}/` - Partial update
- `DELETE /api/features/categories/{id}/` - Delete category

### Clipboard Entries
- `GET /api/features/clipboards/` - List all entries
- `POST /api/features/clipboards/` - Create entry
- `GET /api/features/clipboards/{id}/` - Get single entry
- `PUT /api/features/clipboards/{id}/` - Update entry
- `PATCH /api/features/clipboards/{id}/` - Partial update
- `DELETE /api/features/clipboards/{id}/` - Delete entry
- `POST /api/features/clipboards/{id}/use/` - Mark as used

All endpoints require Bearer token authentication.

## Customization

### Change Panel Position

Edit `ClipboardPanel.module.css`:

```css
.clipboardDrawer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  /* adjust as needed */
}
```

### Customize Styling

Modify the CSS classes:
- `.clipboardDrawer` - Main drawer container
- `.entryCard` - Individual entry card styling
- `.modalOverlay` - Form modal background
- `.modalContent` - Form modal content

### Add Custom Fields

1. Update the `Category` or `ClipboardEntry` interface
2. Modify the form components to include new fields
3. Update the API hooks to send new data

## Examples

See [example/ClipboardExample.tsx](./example/ClipboardExample.tsx) for complete usage examples.

## Architecture

```
clipboard/
├── components/
│   ├── ClipboardPanel.tsx      # Main drawer component
│   ├── CategoryForm.tsx         # Category form
│   ├── ClipboardEntryForm.tsx   # Entry form
│   ├── ClipboardPanel.module.css
│   └── index.ts
├── hooks/
│   ├── useClipboardApi.ts       # API integration
│   ├── useClipboardPanel.ts     # State management
│   └── index.ts
├── example/
│   └── ClipboardExample.tsx     # Usage examples
├── README.md
└── INTEGRATION.md
```

## State Management

The module uses React hooks for state management:
- `useState` for categories, entries, and UI state
- `useEffect` for loading data when drawer opens
- `useClipboardApi` for all API operations

All data is refetched when the drawer opens, ensuring fresh data without additional complexity.

## Error Handling

All API operations include:
- Try-catch blocks for error handling
- Toast notifications for user feedback
- Fallback values for failed operations
- Console logging for debugging

## Performance

- Data is only loaded when drawer opens
- Search is performed client-side (instant results)
- Copy operations are optimized with `navigator.clipboard`
- Pins and archives filter without API calls

## Browser Support

Works on all modern browsers with:
- `navigator.clipboard` API support
- ES6+ JavaScript support
- CSS Grid/Flexbox support

## Contributing

To extend the module:

1. Add new types to `useClipboardApi.ts`
2. Add new API methods to the hook
3. Create new components as needed
4. Update exports in `index.ts`
5. Document changes in README

## License

Part of the project codebase.
