# Clipboard Module Integration Guide

The clipboard module provides a bottom-up drawer component that allows users to manage clipboard entries organized by categories.

## Quick Start

### 1. Add the Clipboard Panel to Your Form

```tsx
"use client";

import { useClipboardPanel } from "@/modules/clipboard/hooks";
import { ClipboardPanel } from "@/modules/clipboard/components";
import { Button } from "@mantine/core";

export function MyForm() {
  const clipboard = useClipboardPanel();

  return (
    <>
      <Button onClick={clipboard.open}>Open Clipboard</Button>

      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

### 2. Fix Position at Bottom Right

To position the clipboard panel at the bottom right of your page, add this to your layout CSS:

```css
/* Position the drawer at bottom right */
.clipboardDrawer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: auto;
  top: auto;
}
```

### 3. Auto-Open When Form Opens

```tsx
import { useEffect } from "react";
import { useClipboardPanel } from "@/modules/clipboard/hooks";
import { ClipboardPanel } from "@/modules/clipboard/components";

export function FormWithClipboard({ formIsOpen }) {
  const clipboard = useClipboardPanel();

  useEffect(() => {
    if (formIsOpen) {
      clipboard.open();
    }
  }, [formIsOpen, clipboard]);

  return (
    <>
      {/* Your form */}
      <ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
    </>
  );
}
```

## Features

### Categories
- Create, read, update, and delete categories
- Each category groups related clipboard entries
- Owner-scoped (users only see their own categories)

### Clipboard Entries
- **Create**: Add new clipboard entries with title, content, notes
- **Copy**: Click to copy content to clipboard (auto-tracks usage)
- **Pin**: Pin frequently used entries to the top
- **Archive**: Hide entries without deleting them
- **Search**: Filter entries by title, content, or notes
- **Usage Tracking**: See how many times and when each entry was used

### UI Components
- **ClipboardPanel**: Main drawer component
- **CategoryForm**: Form for creating categories
- **ClipboardEntryForm**: Form for creating/editing entries

### Hooks
- **useClipboardApi**: Direct API access for clipboard operations
- **useClipboardPanel**: State management hook for panel open/close

## API Integration

The module uses these endpoints:

```
GET  /api/features/categories/
POST /api/features/categories/
GET  /api/features/categories/{id}/
PUT  /api/features/categories/{id}/
PATCH /api/features/categories/{id}/
DELETE /api/features/categories/{id}/

GET  /api/features/clipboards/
POST /api/features/clipboards/
GET  /api/features/clipboards/{id}/
PUT  /api/features/clipboards/{id}/
PATCH /api/features/clipboards/{id}/
DELETE /api/features/clipboards/{id}/
POST /api/features/clipboards/{id}/use/
```

Authentication: Bearer token required for all endpoints (handled automatically by `moduleApiCall`)

## Customization

### Modify Panel Position

Edit `ClipboardPanel.module.css` to change the drawer position:

```css
.clipboardDrawer {
  --drawer-size: 90vh; /* Adjust height */
  position: fixed;
  bottom: 20px;
  right: 20px;
}
```

### Customize Entry Card Styling

Modify `.entryCard` in `ClipboardPanel.module.css` to change how entries appear.

### Add More Metadata

Extend the `ClipboardEntry` interface in `useClipboardApi.ts` to track additional fields.

## Error Handling

All API operations include built-in notification feedback:
- Success notifications show when operations complete
- Error notifications display if something goes wrong

These use Mantine's `notifications` system and will appear as toast messages.

## State Management

- **Categories**: Fetched once when drawer opens
- **Entries**: Fetched once when drawer opens
- **Search**: Client-side filtering (instant results)
- **Usage Tracking**: Updated when entry is copied

All operations trigger automatic UI updates via React state.
