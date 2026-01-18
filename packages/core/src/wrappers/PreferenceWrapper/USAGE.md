# PreferenceWrapper Usage Guide

## Overview

`PreferenceWrapper` is a cookie-based preference management wrapper that provides:
- **Cookie-based persistence** with automatic save/load
- **Version control** for preference migration
- **Default values** fallback system
- **Optional server sync** with custom fetch function
- **Automatic preference initialization** on mount
- **Type-safe preferences** with TypeScript support

PreferenceWrapper is the recommended choice for managing user preferences that need to persist across sessions with version migration support.

## Key Features

✅ **Cookie-Based Storage** - Automatic persistence using js-cookie
✅ **Version Migration** - Handle preference schema changes gracefully
✅ **Default Values** - Fallback to defaults when no preferences exist
✅ **Server Sync** - Optional server-side preference fetching
✅ **Type-Safe** - Full TypeScript support with generics
✅ **Auto-Initialize** - Preferences loaded automatically on mount
✅ **Migration Hooks** - Custom migration logic for version changes
✅ **Test Mode** - Debug logging for development

## Basic Usage

### Minimal Example - Cookie-Based Preferences

```tsx
import { PreferenceWrapper } from "@settle/core";

export function App() {
  return (
    <>
      <PreferenceWrapper
        appKey="myapp"
        userId="user123"
        defaults={{
          theme: "light",
          language: "en",
          notifications: true,
        }}
        version="1.0"
      />

      {/* Your app content */}
      <Dashboard />
    </>
  );
}
```

### Accessing Preferences in Components

```tsx
import { usePreferences } from "@settle/core";

function ThemeToggle() {
  const { preferences, updatePreferences } = usePreferences();

  const toggleTheme = () => {
    updatePreferences({
      theme: preferences.theme === "light" ? "dark" : "light",
    });
  };

  return (
    <button onClick={toggleTheme}>
      Current theme: {preferences.theme}
    </button>
  );
}
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `appKey` | `string` | ✅ Yes | - | Unique application identifier |
| `userId` | `string` | ✅ Yes | - | User identifier for cookie namespacing |
| `defaults` | `object` | No | `{}` | Default preference values |
| `version` | `string` | No | `"1.0"` | Preference schema version |
| `fetchPreferenceFn` | `function` | No | `undefined` | Optional server fetch function |
| `onVersionMismatch` | `function` | No | `(pref) => pref` | Migration function for version changes |
| `testMode` | `boolean` | No | `false` | Enable debug logging |

## usePreferences Hook API

Access and update preferences from any component:

```typescript
const {
  preferences,        // Current preference values
  updatePreferences,  // Update one or more preferences
  resetPreferences,   // Reset to defaults
  initializePreferences, // Initialize with new values
} = usePreferences();
```

### Methods

**updatePreferences(updates: Partial<T>)**
```typescript
// Update single preference
updatePreferences({ theme: "dark" });

// Update multiple preferences
updatePreferences({
  theme: "dark",
  language: "es",
  notifications: false,
});
```

**resetPreferences()**
```typescript
// Reset all preferences to defaults
resetPreferences();
```

**initializePreferences(prefs: T, key: string, defaults: T)**
```typescript
// Manually initialize preferences (usually called internally)
initializePreferences(
  { theme: "dark", language: "en" },
  "myapp_user123",
  { theme: "light", language: "en" }
);
```

## Cookie Storage Format

Preferences are stored as JSON in cookies:

```typescript
// Cookie name format: {appKey}_{userId}
// Example: myapp_user123

// Cookie value (JSON string):
{
  "version": "1.0",
  "theme": "dark",
  "language": "en",
  "notifications": true
}
```

## Version Control and Migration

### Basic Version Control

```tsx
<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  version="2.0"  // Increment when schema changes
  defaults={{
    theme: "light",
    language: "en",
    layout: "grid",  // New field in v2.0
  }}
/>
```

### Migration Function

Handle preference migration when version changes:

```tsx
<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  version="2.0"
  defaults={{
    theme: "light",
    language: "en",
    layout: "grid",
  }}
  onVersionMismatch={async (oldPreferences) => {
    // Migrate from v1.0 to v2.0
    return {
      ...oldPreferences,
      layout: oldPreferences.viewMode === "list" ? "list" : "grid",
      // Remove old field
      viewMode: undefined,
    };
  }}
/>
```

### Complex Migration Example

```tsx
<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  version="3.0"
  onVersionMismatch={async (oldPrefs) => {
    const oldVersion = oldPrefs?.version || "1.0";

    let migratedPrefs = { ...oldPrefs };

    // Migration from v1.0 to v2.0
    if (oldVersion === "1.0") {
      migratedPrefs = {
        ...migratedPrefs,
        layout: migratedPrefs.viewMode === "list" ? "list" : "grid",
      };
      delete migratedPrefs.viewMode;
    }

    // Migration from v2.0 to v3.0
    if (oldVersion === "2.0" || oldVersion === "1.0") {
      migratedPrefs = {
        ...migratedPrefs,
        colorScheme: migratedPrefs.theme === "dark" ? "dark" : "light",
      };
      delete migratedPrefs.theme;
    }

    return migratedPrefs;
  }}
/>
```

## Server-Side Preferences

### Fetching from Server

```tsx
<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  defaults={{
    theme: "light",
    language: "en",
  }}
  fetchPreferenceFn={async () => {
    const response = await fetch("/api/user/preferences");
    const data = await response.json();
    return JSON.stringify(data);  // Must return JSON string
  }}
  version="1.0"
/>
```

### Hybrid Approach (Server + Cookie)

```tsx
// Server preferences take priority, fallback to cookie
<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  defaults={{
    theme: "light",
    language: "en",
  }}
  fetchPreferenceFn={async () => {
    try {
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        return JSON.stringify(data);
      }
    } catch (error) {
      console.error("Failed to fetch server preferences:", error);
    }
    // Return undefined to fall back to cookie
    return undefined;
  }}
  version="1.0"
/>
```

## Advanced Examples

### Example 1: Theme Preferences

```tsx
import { PreferenceWrapper, usePreferences } from "@settle/core";
import { MantineProvider } from "@mantine/core";

type ThemePreferences = {
  colorScheme: "light" | "dark";
  primaryColor: string;
  fontSize: "sm" | "md" | "lg";
};

export function App() {
  return (
    <>
      <PreferenceWrapper
        appKey="myapp"
        userId="user123"
        defaults={{
          colorScheme: "light",
          primaryColor: "blue",
          fontSize: "md",
        }}
        version="1.0"
      />

      <ThemedApp />
    </>
  );
}

function ThemedApp() {
  const { preferences } = usePreferences<ThemePreferences>();

  return (
    <MantineProvider
      theme={{
        colorScheme: preferences.colorScheme,
        primaryColor: preferences.primaryColor,
        fontSizes: {
          md: preferences.fontSize === "lg" ? "18px" : "16px",
        },
      }}
    >
      <Dashboard />
    </MantineProvider>
  );
}
```

### Example 2: Multi-Language Support

```tsx
type LanguagePreferences = {
  language: "en" | "es" | "fr" | "de";
  dateFormat: string;
  timezone: string;
};

<PreferenceWrapper
  appKey="myapp"
  userId="user123"
  defaults={{
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timezone: "UTC",
  }}
  version="1.0"
/>

// In component:
function LanguageSelector() {
  const { preferences, updatePreferences } = usePreferences<LanguagePreferences>();

  return (
    <select
      value={preferences.language}
      onChange={(e) => updatePreferences({ language: e.target.value })}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
```

### Example 3: Dashboard Layout Preferences

```tsx
type DashboardPreferences = {
  layout: "grid" | "list";
  cardsPerRow: 2 | 3 | 4;
  showSidebar: boolean;
  compactMode: boolean;
};

<PreferenceWrapper
  appKey="dashboard"
  userId="user123"
  defaults={{
    layout: "grid",
    cardsPerRow: 3,
    showSidebar: true,
    compactMode: false,
  }}
  version="1.0"
/>

// In component:
function Dashboard() {
  const { preferences, updatePreferences } = usePreferences<DashboardPreferences>();

  return (
    <div className={preferences.compactMode ? "compact" : "normal"}>
      {preferences.showSidebar && <Sidebar />}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${preferences.cardsPerRow}, 1fr)`,
        }}
      >
        {/* Cards */}
      </div>
    </div>
  );
}
```

## TypeScript Usage

### Type-Safe Preferences

```typescript
interface UserPreferences {
  theme: "light" | "dark";
  language: "en" | "es" | "fr";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: "grid" | "list";
    itemsPerPage: number;
  };
}

// In component:
const { preferences, updatePreferences } = usePreferences<UserPreferences>();

// Type-safe updates
updatePreferences({
  theme: "dark",  // ✅ Valid
  // theme: "blue",  // ❌ Type error
});

// Nested updates
updatePreferences({
  notifications: {
    ...preferences.notifications,
    email: false,
  },
});
```

## Test Mode

Enable debug logging to see preference operations:

```tsx
<PreferenceWrapper
  testMode={true}
  appKey="myapp"
  userId="user123"
  defaults={{ theme: "light" }}
  version="1.0"
/>
```

Console output:
```
PreferenceWrapper_Cookie Latest Version:1.0 { theme: 'light', version: '1.0' }
```

When version mismatch detected:
```
Outdated Preferences, Initiating Migration 2.0->1.0
```

## Best Practices

1. **Use Semantic Versioning**: Increment version when preference schema changes
2. **Provide Default Values**: Always provide defaults for all preference fields
3. **Handle Migration Gracefully**: Use `onVersionMismatch` for schema migrations
4. **Keep Keys Unique**: Use unique `appKey` per application/module
5. **Type Your Preferences**: Use TypeScript interfaces for type safety
6. **Avoid Sensitive Data**: Don't store passwords or tokens in preferences
7. **Keep It Small**: Cookies have size limits (~4KB), keep preferences minimal
8. **Test Migrations**: Test version migrations thoroughly before deploying

## Common Use Cases

### Use Case 1: User Theme Preferences

```tsx
<PreferenceWrapper
  appKey="theme"
  userId={user.id}
  defaults={{ colorScheme: "light", accentColor: "blue" }}
  version="1.0"
/>
```

### Use Case 2: Table Display Preferences

```tsx
<PreferenceWrapper
  appKey="datatable"
  userId={user.id}
  defaults={{
    pageSize: 20,
    sortBy: "name",
    sortOrder: "asc",
    visibleColumns: ["name", "email", "role"],
  }}
  version="1.0"
/>
```

### Use Case 3: Form Field Defaults

```tsx
<PreferenceWrapper
  appKey="form_defaults"
  userId={user.id}
  defaults={{
    country: "US",
    currency: "USD",
    timezone: "America/New_York",
  }}
  version="1.0"
/>
```

## Troubleshooting

### Issue: Preferences not persisting

**Solution**: Check that cookies are enabled and `appKey` + `userId` are consistent:

```tsx
// ❌ Bad - userId changes on each render
<PreferenceWrapper appKey="myapp" userId={Math.random().toString()} />

// ✅ Good - Stable userId
<PreferenceWrapper appKey="myapp" userId={user.id} />
```

### Issue: Migration not running

**Solution**: Ensure version is incremented and `onVersionMismatch` is provided:

```tsx
// ❌ Bad - Same version
<PreferenceWrapper version="1.0" />

// ✅ Good - Increment version
<PreferenceWrapper
  version="2.0"
  onVersionMismatch={async (old) => ({ ...old, newField: "value" })}
/>
```

### Issue: Preferences reset on every load

**Solution**: Make sure cookie domain/path settings allow cookie persistence:

```tsx
// Check if cookies are being set correctly
const { preferences } = usePreferences();
console.log(Cookies.get("myapp_user123"));  // Should show JSON string
```

### Issue: TypeScript errors with usePreferences

**Solution**: Provide type parameter:

```tsx
// ❌ Bad - No types
const { preferences } = usePreferences();

// ✅ Good - With types
const { preferences } = usePreferences<UserPreferences>();
```

## Related Documentation

- [usePreferences Hook](../../hooks/usePreferences.ts) - Zustand store implementation
- [FormWrapper Usage](../FormWrapper/USAGE.md) - Form state management
- [DataTableWrapper Usage](../DataTableWrapper/USAGE.md) - Table data management
- [js-cookie Documentation](https://github.com/js-cookie/js-cookie) - Cookie library used

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
