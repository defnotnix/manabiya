# Clipboard Floating Button - Quick Start

## TL;DR - One Line Setup

Add this to your main layout file:

```tsx
<FloatingClipboardButton />
```

That's it! ✅

## Where to Add It

**File:** `apps/admin/layouts/app/index.tsx` (or your main layout)

```tsx
import { FloatingClipboardButton } from "@/modules/clipboard";

export function AppLayout({ children }) {
  return (
    <div>
      {children}
      <FloatingClipboardButton />  {/* ← Add here */}
    </div>
  );
}
```

## What Users See

### Without Clicking
```
[Normal Page Layout]

                          📋  ← Floating Button
```

### When Clicking the Button
```
[Drawer Opens from Bottom]

┌─────────────────────────────────┐
│ Clipboard Manager               │
├─────────────────────────────────┤
│ + Add New Clipboard Entry       │
├─────────────────────────────────┤
│ [Search bar]                    │
├─────────────────────────────────┤
│ [Categories Tabs]               │
│ ├─ All Entries                  │
│ ├─ Visa Application             │
│ ├─ Bank Forms                   │
│ └─ Add Category                 │
├─────────────────────────────────┤
│ [Entries List]                  │
│ ├─ Entry 1  [Copy][Pin][...]   │
│ ├─ Entry 2  [Copy][Pin][...]   │
│ └─ Entry 3  [Copy][Pin][...]   │
└─────────────────────────────────┘
```

## Features

✅ **Search** - Find entries by text
✅ **Copy** - One-click copy to clipboard
✅ **Pin** - Mark frequently used entries
✅ **Archive** - Hide old entries
✅ **Categories** - Organize by groups
✅ **Create** - Add new entries on the fly
✅ **Edit** - Modify existing entries
✅ **Delete** - Remove unwanted entries
✅ **Track Usage** - See when/how often used

## How It Works

1. User sees blue button on bottom-right
2. User clicks button → Drawer opens
3. User can search/filter entries
4. User clicks copy icon → Entry goes to clipboard
5. User pastes in their form
6. User closes drawer (button stays visible)

## Forms (No Longer Need Setup!)

These forms now have clipboard automatically:
- ✅ Bank Statement Form
- ✅ Student CV Form
- ✅ Student Certificate Form
- ✅ WODA Documents Form
- ✅ Create Student Form
- ✅ Edit Student Form
- ✅ View Student Form

**No code changes needed in any form!**

## What Changed

### Removed From Forms
```typescript
// ❌ NO LONGER NEEDED:
import { useClipboardPanel, ClipboardPanel } from "@/modules/clipboard";
const clipboard = useClipboardPanel();
useEffect(() => { clipboard.open(); }, [opened, clipboard]);
<ClipboardPanel opened={clipboard.opened} onClose={clipboard.close} />
```

### Added to Layout (One Time)
```typescript
// ✅ JUST ADD THIS ONCE:
<FloatingClipboardButton />
```

## Visual Architecture

### Before
```
Form 1 → needs clipboard code
Form 2 → needs clipboard code
Form 3 → needs clipboard code
Form 4 → needs clipboard code
```

### After
```
Layout
  └─ <FloatingClipboardButton />
     └─ Serves all forms on page
```

## Features Highlights

### Quick Copy
```
User sees entry:
"東京都新宿区..."

Clicks copy →
Automatically in clipboard →
Paste in form field
```

### Organization
```
Categories:
- Visa Application (5 entries)
- Bank Forms (3 entries)
- Personal Data (7 entries)

All searchable, all accessible!
```

### Smart Pinning
```
Pin frequent entries → appear at top
Other entries → sorted by last used date
Archive old entries → hidden from view
```

## Mobile Friendly

Works perfectly on:
- ✅ Desktop (1920px+)
- ✅ Tablet (768px+)
- ✅ Mobile (320px+)

Button adjusts position for mobile automatically.

## Browser Support

Works in all modern browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Performance

- Button loads instantly
- Drawer data fetches on open
- Search is instant (client-side)
- Zero impact on form performance

## Customization

### Change Button Color
```tsx
<ActionIcon color="red"> ← Change this
```

### Change Button Position
```css
/* FloatingClipboardButton.module.css */
bottom: 24px;  ← Adjust these
right: 24px;   ← values
```

### Change Button Size
```tsx
<ActionIcon size="lg"> ← Change this
```

## Troubleshooting

### Button Not Showing?
- Add `<FloatingClipboardButton />` to layout
- Check that component is exported from index.ts
- Verify z-index isn't conflicting (it's 999)

### Drawer Won't Open?
- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token

### Copy Not Working?
- Browser needs clipboard API support
- Check browser permissions
- Try in a different browser

## Common Questions

**Q: Does it work in all forms?**
A: Yes! Anywhere on the page where FloatingClipboardButton is rendered.

**Q: Can I hide it?**
A: Currently always visible. Can be customized if needed.

**Q: Does it save my entries?**
A: Yes! Everything is saved to the backend API.

**Q: Can I share entries between users?**
A: No, entries are user-scoped (owner-only access).

**Q: What happens when I close the drawer?**
A: Button stays visible, all data is saved automatically.

## Next Steps

1. Find your main layout file
2. Import `FloatingClipboardButton`
3. Add `<FloatingClipboardButton />` to JSX
4. Save and test
5. Done! 🎉

## Files Involved

- **Component:** `apps/admin/modules/clipboard/components/FloatingClipboardButton.tsx`
- **Styles:** `apps/admin/modules/clipboard/components/FloatingClipboardButton.module.css`
- **Drawer:** `apps/admin/modules/clipboard/components/ClipboardPanel.tsx`
- **API:** `apps/admin/modules/clipboard/hooks/useClipboardApi.ts`

## Support

For issues or questions:
1. Check `CLIPBOARD_FLOATING_BUTTON_SETUP.md` for detailed setup
2. Check `CLIPBOARD_REFACTOR_COMPLETE.md` for architecture
3. Check `CLIPBOARD_BEFORE_AFTER.md` for code examples

---

**Status: Ready to use!** 🚀

Just add the button to your layout and enjoy clipboard management on every page!
