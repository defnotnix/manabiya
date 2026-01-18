# RolePermsWrapper Usage Guide

## Overview

`RolePermsWrapper` is a role-based permission management system built on React Context. It provides:
- **Centralized permission management** with context-based state
- **Conditional rendering** based on user permissions
- **Module-level access control** with RolePermModule component
- **Custom hooks** for checking permissions in components
- **Dynamic permission updates** for runtime changes
- **Type-safe permissions** with TypeScript support

RolePermsWrapper is the recommended choice for implementing role-based access control (RBAC) in your application.

## Key Features

✅ **Context-Based** - Share permissions across entire component tree
✅ **Conditional Rendering** - Show/hide components based on permissions
✅ **Custom Hook** - `usePermissions` for permission checks
✅ **Module Component** - `RolePermModule` for declarative access control
✅ **Dynamic Updates** - Update permissions at runtime
✅ **Performance Optimized** - Memoized permission lookups
✅ **Fallback Support** - Custom fallback UI for denied access
✅ **Type-Safe** - Full TypeScript support

## Basic Usage

### Minimal Example - Setting Up Permissions

```tsx
import { RolePermsWrapper } from "@settle/core";

export function App() {
  return (
    <RolePermsWrapper
      defaultPermissions={{
        "users.view": true,
        "users.create": true,
        "users.edit": false,
        "users.delete": false,
        "settings.view": true,
        "settings.edit": false,
      }}
    >
      <Dashboard />
    </RolePermsWrapper>
  );
}
```

### Using usePermissions Hook

```tsx
import { usePermissions } from "@settle/core";

function UserManagement() {
  const { allowAccess: canEdit } = usePermissions("users.edit");
  const { allowAccess: canDelete } = usePermissions("users.delete");

  return (
    <div>
      <h1>User Management</h1>

      {canEdit && <button>Edit User</button>}
      {canDelete && <button>Delete User</button>}
    </div>
  );
}
```

### Using RolePermModule Component

```tsx
import { RolePermModule } from "@settle/core";

function UserActions() {
  return (
    <div>
      <RolePermModule moduleKey="users.create">
        <button>Create User</button>
      </RolePermModule>

      <RolePermModule
        moduleKey="users.delete"
        fallback={<button disabled>Delete (No Permission)</button>}
      >
        <button>Delete User</button>
      </RolePermModule>
    </div>
  );
}
```

## Props Reference

### RolePermsWrapper Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Child components to wrap |
| `defaultPermissions` | `Record<string, boolean>` | No | `{}` | Initial permission map |

### RolePermModule Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Content to render if permission granted |
| `moduleKey` | `string` | ✅ Yes | - | Permission key to check |
| `fallback` | `ReactNode` | No | `null` | Content to render if permission denied |

## usePermissions Hook API

```typescript
const {
  allowAccess,      // boolean - Permission status for moduleKey
  permissions,      // Record<string, boolean> - All permissions
  setPermissions,   // (perms: Record<string, boolean>) => void - Update permissions
} = usePermissions(moduleKey?: string);
```

### Hook Return Values

**allowAccess** - Permission status for the specified `moduleKey`
```typescript
const { allowAccess } = usePermissions("users.edit");
// allowAccess: true | false
```

**permissions** - All current permissions
```typescript
const { permissions } = usePermissions();
// permissions: { "users.view": true, "users.edit": false, ... }
```

**setPermissions** - Update permissions at runtime
```typescript
const { setPermissions } = usePermissions();

// Update single permission
setPermissions({ "users.edit": true });

// Update multiple permissions
setPermissions({
  "users.edit": true,
  "users.delete": true,
  "settings.edit": true,
});
```

## Permission Key Naming Conventions

Use dot notation for hierarchical permission structure:

```typescript
const permissions = {
  // Module-level permissions
  "users": true,              // Access to users module
  "settings": false,          // No access to settings

  // Action-level permissions
  "users.view": true,         // View users
  "users.create": true,       // Create users
  "users.edit": false,        // Cannot edit users
  "users.delete": false,      // Cannot delete users

  // Nested permissions
  "settings.general.view": true,
  "settings.general.edit": false,
  "settings.security.view": false,
  "settings.security.edit": false,
};
```

## Advanced Examples

### Example 1: Admin Dashboard with Role-Based Navigation

```tsx
import { RolePermsWrapper, RolePermModule } from "@settle/core";

type UserRole = "admin" | "editor" | "viewer";

function App() {
  const [userRole, setUserRole] = useState<UserRole>("viewer");

  // Generate permissions based on role
  const permissions = useMemo(() => {
    if (userRole === "admin") {
      return {
        "dashboard.view": true,
        "users.view": true,
        "users.create": true,
        "users.edit": true,
        "users.delete": true,
        "settings.view": true,
        "settings.edit": true,
      };
    } else if (userRole === "editor") {
      return {
        "dashboard.view": true,
        "users.view": true,
        "users.create": true,
        "users.edit": true,
        "users.delete": false,
        "settings.view": true,
        "settings.edit": false,
      };
    } else {
      return {
        "dashboard.view": true,
        "users.view": true,
        "users.create": false,
        "users.edit": false,
        "users.delete": false,
        "settings.view": false,
        "settings.edit": false,
      };
    }
  }, [userRole]);

  return (
    <RolePermsWrapper defaultPermissions={permissions}>
      <Navigation />
      <Routes />
    </RolePermsWrapper>
  );
}

function Navigation() {
  return (
    <nav>
      <RolePermModule moduleKey="dashboard.view">
        <NavLink to="/dashboard">Dashboard</NavLink>
      </RolePermModule>

      <RolePermModule moduleKey="users.view">
        <NavLink to="/users">Users</NavLink>
      </RolePermModule>

      <RolePermModule moduleKey="settings.view">
        <NavLink to="/settings">Settings</NavLink>
      </RolePermModule>
    </nav>
  );
}
```

### Example 2: Dynamic Permission Updates

```tsx
import { RolePermsWrapper, usePermissions } from "@settle/core";

function App() {
  return (
    <RolePermsWrapper
      defaultPermissions={{
        "feature.beta": false,
        "feature.premium": false,
      }}
    >
      <PermissionManager />
      <FeatureGates />
    </RolePermsWrapper>
  );
}

function PermissionManager() {
  const { permissions, setPermissions } = usePermissions();

  const handleUpgrade = async () => {
    // Update permissions after subscription upgrade
    const response = await fetch("/api/user/upgrade", { method: "POST" });
    const { newPermissions } = await response.json();

    setPermissions(newPermissions);
  };

  return (
    <div>
      <h2>Current Permissions</h2>
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
      <button onClick={handleUpgrade}>Upgrade to Premium</button>
    </div>
  );
}

function FeatureGates() {
  return (
    <div>
      <RolePermModule
        moduleKey="feature.beta"
        fallback={<p>Beta features coming soon!</p>}
      >
        <BetaFeatures />
      </RolePermModule>

      <RolePermModule
        moduleKey="feature.premium"
        fallback={<UpgradePrompt />}
      >
        <PremiumFeatures />
      </RolePermModule>
    </div>
  );
}
```

### Example 3: Conditional Button Rendering

```tsx
import { usePermissions } from "@settle/core";

function UserActions({ user }) {
  const { allowAccess: canEdit } = usePermissions("users.edit");
  const { allowAccess: canDelete } = usePermissions("users.delete");
  const { allowAccess: canResetPassword } = usePermissions("users.resetPassword");

  return (
    <Group>
      {canEdit && (
        <Button onClick={() => handleEdit(user)}>Edit</Button>
      )}

      {canDelete && (
        <Button color="red" onClick={() => handleDelete(user)}>
          Delete
        </Button>
      )}

      {canResetPassword && (
        <Button variant="light" onClick={() => handleResetPassword(user)}>
          Reset Password
        </Button>
      )}

      {/* Always visible */}
      <Button variant="subtle" onClick={() => handleView(user)}>
        View Details
      </Button>
    </Group>
  );
}
```

### Example 4: Form Field Permissions

```tsx
import { usePermissions, RolePermModule } from "@settle/core";

function UserProfileForm() {
  const { allowAccess: canEditEmail } = usePermissions("profile.email.edit");
  const { allowAccess: canEditRole } = usePermissions("profile.role.edit");

  return (
    <form>
      <TextInput
        label="Name"
        // Always editable
      />

      <TextInput
        label="Email"
        disabled={!canEditEmail}
      />

      <RolePermModule moduleKey="profile.role.edit">
        <Select
          label="Role"
          data={["admin", "editor", "viewer"]}
        />
      </RolePermModule>

      <RolePermModule
        moduleKey="profile.advanced.edit"
        fallback={<Text size="sm" c="dimmed">Advanced settings require admin access</Text>}
      >
        <AdvancedSettings />
      </RolePermModule>
    </form>
  );
}
```

### Example 5: API Integration

```tsx
import { RolePermsWrapper } from "@settle/core";
import { useEffect, useState } from "react";

function AppWithServerPermissions() {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch permissions from server
    fetch("/api/user/permissions")
      .then(res => res.json())
      .then(data => {
        setPermissions(data.permissions);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading permissions...</div>;
  }

  return (
    <RolePermsWrapper defaultPermissions={permissions}>
      <App />
    </RolePermsWrapper>
  );
}
```

## TypeScript Usage

### Type-Safe Permissions

```typescript
// Define permission keys as a type
type PermissionKey =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "settings.view"
  | "settings.edit"
  | "reports.view"
  | "reports.export";

type PermissionMap = Record<PermissionKey, boolean>;

// Use in component
const permissions: PermissionMap = {
  "users.view": true,
  "users.create": true,
  "users.edit": false,
  "users.delete": false,
  "settings.view": true,
  "settings.edit": false,
  "reports.view": true,
  "reports.export": false,
};

<RolePermsWrapper defaultPermissions={permissions}>
  <App />
</RolePermsWrapper>
```

### Type-Safe Hook Usage

```typescript
// Custom hook with typed permissions
function useTypedPermission(key: PermissionKey) {
  return usePermissions(key);
}

// Usage
const { allowAccess } = useTypedPermission("users.edit");
```

## Common Permission Patterns

### Pattern 1: CRUD Permissions

```typescript
const crudPermissions = {
  "resource.create": true,
  "resource.read": true,
  "resource.update": false,
  "resource.delete": false,
};
```

### Pattern 2: Hierarchical Permissions

```typescript
const hierarchicalPermissions = {
  // Module-level
  "admin": true,
  "admin.users": true,
  "admin.users.view": true,
  "admin.users.manage": false,
  "admin.settings": true,
  "admin.settings.general": true,
  "admin.settings.security": false,
};
```

### Pattern 3: Feature Flags

```typescript
const featureFlags = {
  "feature.darkMode": true,
  "feature.analytics": false,
  "feature.experimental": false,
  "feature.beta.newEditor": true,
};
```

## Best Practices

1. **Use Descriptive Keys**: Use clear, hierarchical permission keys (e.g., `users.edit`, not `ue`)
2. **Centralize Permission Logic**: Define permissions at the app root
3. **Fetch from Server**: Load permissions from backend for security
4. **Default to Deny**: Default all permissions to `false` for safety
5. **Use Memoization**: Memoize permission calculations to avoid re-renders
6. **Combine with Authentication**: Use alongside auth system for complete security
7. **Don't Rely on Client-Side Only**: Always verify permissions on the server
8. **Use TypeScript**: Define permission keys as types for autocomplete

## Security Considerations

### Client-Side Security Limitations

```tsx
// ⚠️ IMPORTANT: Client-side permissions are for UX only
// Always verify permissions on the server!

// Client-side (UX)
<RolePermModule moduleKey="users.delete">
  <button onClick={deleteUser}>Delete</button>
</RolePermModule>

// Server-side (Security) - REQUIRED!
app.delete("/api/users/:id", async (req, res) => {
  // Check permissions on server
  if (!req.user.permissions.includes("users.delete")) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Proceed with deletion
  await deleteUser(req.params.id);
  res.json({ success: true });
});
```

### Secure Implementation

```tsx
function SecureUserManagement() {
  const { allowAccess: canDelete } = usePermissions("users.delete");

  const handleDelete = async (userId: string) => {
    if (!canDelete) {
      // Client-side check for UX
      toast.error("You don't have permission to delete users");
      return;
    }

    try {
      // Server validates permission again
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.status === 403) {
        toast.error("Permission denied");
        return;
      }

      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      {canDelete && (
        <button onClick={() => handleDelete(user.id)}>Delete</button>
      )}
    </div>
  );
}
```

## Troubleshooting

### Issue: Permissions not updating

**Solution**: Ensure `setPermissions` is called correctly:

```tsx
// ❌ Bad - Creating new object reference every render
const { setPermissions } = usePermissions();
setPermissions({ "users.edit": true });

// ✅ Good - Update in effect or callback
useEffect(() => {
  setPermissions({ "users.edit": true });
}, [setPermissions]);
```

### Issue: RolePermModule not rendering children

**Solution**: Check permission key and value:

```tsx
// Debug permissions
const { permissions } = usePermissions();
console.log(permissions);  // Check if key exists and is true

<RolePermModule moduleKey="users.edit">  {/* Ensure this key exists */}
  <button>Edit</button>
</RolePermModule>
```

### Issue: Permission checks always return false

**Solution**: Verify permissions are set in RolePermsWrapper:

```tsx
// ❌ Bad - No permissions set
<RolePermsWrapper>
  <App />
</RolePermsWrapper>

// ✅ Good - Permissions provided
<RolePermsWrapper defaultPermissions={{ "users.view": true }}>
  <App />
</RolePermsWrapper>
```

## Related Documentation

- [PreferenceWrapper Usage](../PreferenceWrapper/USAGE.md) - User preference management
- [FormWrapper Usage](../FormWrapper/USAGE.md) - Form state management
- [AdminShell Usage](../../../admin/src/layouts/AdminShell/USAGE.md) - Admin layout with navigation

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
