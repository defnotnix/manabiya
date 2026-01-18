# AdminShell Usage Guide

## Overview

`AdminShell` is a complete admin layout shell built on Mantine's AppShell. It provides:
- **Responsive navigation sidebar** with nested menu support
- **Top header** with module indicators
- **Auto-collapsing sidebar** on mobile devices
- **Role-based navigation** with permission integration
- **Customizable branding** with software info
- **Logout functionality** built-in

AdminShell is the recommended choice for building admin dashboards and management interfaces.

## Key Features

✅ **Mantine AppShell** - Built on Mantine's responsive layout system
✅ **Nested Navigation** - Support for multi-level menu items
✅ **Icon Support** - Phosphor Icons integration
✅ **Mobile Responsive** - Auto-collapsing sidebar on small screens
✅ **Module Header** - Visual module indicators in header
✅ **Custom Branding** - Software name and description support
✅ **Permission-Ready** - Integrates with RolePermsWrapper
✅ **Logout Callback** - Built-in logout handler

## Basic Usage

### Minimal Example

```tsx
import { AdminShell } from "@settle/admin";
import { UsersIcon, SettingsIcon } from "@phosphor-icons/react";

export function App() {
  return (
    <AdminShell
      navItems={[
        {
          label: "Dashboard",
          value: "/dashboard",
          icon: DashboardIcon,
        },
        {
          label: "Users",
          value: "/users",
          icon: UsersIcon,
        },
        {
          label: "Settings",
          value: "/settings",
          icon: SettingsIcon,
        },
      ]}
    >
      <YourPageContent />
    </AdminShell>
  );
}
```

### With Nested Navigation

```tsx
<AdminShell
  navItems={[
    {
      label: "Dashboard",
      value: "/dashboard",
      icon: DashboardIcon,
    },
    {
      label: "User Management",
      icon: UsersIcon,
      children: [
        {
          label: "All Users",
          value: "/users",
        },
        {
          label: "Roles",
          value: "/users/roles",
        },
        {
          label: "Permissions",
          value: "/users/permissions",
        },
      ],
    },
    {
      label: "Settings",
      icon: SettingsIcon,
      children: [
        {
          label: "General",
          value: "/settings/general",
        },
        {
          label: "Security",
          value: "/settings/security",
        },
      ],
    },
  ]}
  onLogout={async () => {
    await signOut();
    router.push("/login");
  }}
>
  <PageContent />
</AdminShell>
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ Yes | - | Main content area |
| `navItems` | `PropAdminNavItems[]` | No | `[]` | Navigation menu items |
| `navModules` | `PropAdminNavModule[]` | No | `undefined` | Module indicators for header |
| `essentials` | `JSX.Element` | No | `undefined` | Additional UI elements (user profile, etc.) |
| `softwareInfo` | `object` | No | `undefined` | Branding information |
| `onLogout` | `function` | No | `undefined` | Logout callback handler |

### NavItems Type

```typescript
type PropAdminNavItems = {
  label: string;              // Menu item label
  value?: string;             // Route path (if leaf node)
  divider?: boolean;          // Show divider above item
  roles?: string[];           // Required roles (for permission filtering)
  icon?: Icon;                // Phosphor icon component
  children?: PropAdminNavItems[]; // Nested menu items
};
```

### NavModules Type

```typescript
type PropAdminNavModule = {
  icon: Icon;                 // Module icon
  label?: string;             // Module label
  description?: string;       // Module description
  color?: MantineColor;       // Icon color
};
```

### SoftwareInfo Type

```typescript
type SoftwareInfo = {
  org?: string;               // Organization name
  module?: string;            // Module/app name
  moduleDescription?: string; // Module description
};
```

## Navigation Structure

### Basic Navigation

```tsx
const navItems = [
  {
    label: "Dashboard",
    value: "/dashboard",
    icon: HouseIcon,
  },
  {
    label: "Users",
    value: "/users",
    icon: UsersIcon,
  },
  {
    label: "Reports",
    value: "/reports",
    icon: ChartLineIcon,
  },
];

<AdminShell navItems={navItems}>
  {/* Content */}
</AdminShell>
```

### Nested Navigation

```tsx
const navItems = [
  {
    label: "Dashboard",
    value: "/dashboard",
    icon: HouseIcon,
  },
  {
    label: "User Management",
    icon: UsersIcon,
    children: [
      {
        label: "All Users",
        value: "/users",
      },
      {
        label: "Teams",
        value: "/users/teams",
      },
      {
        label: "Roles & Permissions",
        value: "/users/roles",
      },
    ],
  },
  {
    label: "Content",
    icon: FileTextIcon,
    children: [
      {
        label: "Posts",
        value: "/content/posts",
      },
      {
        label: "Pages",
        value: "/content/pages",
      },
    ],
  },
];
```

### Navigation with Dividers

```tsx
const navItems = [
  {
    label: "Dashboard",
    value: "/dashboard",
    icon: HouseIcon,
  },
  {
    label: "Users",
    value: "/users",
    icon: UsersIcon,
  },
  {
    label: "Settings",
    value: "/settings",
    icon: SettingsIcon,
    divider: true,  // Shows divider above this item
  },
  {
    label: "Logout",
    value: "/logout",
    icon: SignOutIcon,
  },
];
```

## Advanced Examples

### Example 1: Complete Admin Dashboard

```tsx
import { AdminShell } from "@settle/admin";
import {
  HouseIcon,
  UsersIcon,
  ShoppingCartIcon,
  ChartLineIcon,
  SettingsIcon,
  BellIcon,
} from "@phosphor-icons/react";

export function AdminDashboard({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <AdminShell
      navItems={[
        {
          label: "Dashboard",
          value: "/dashboard",
          icon: HouseIcon,
        },
        {
          label: "E-commerce",
          icon: ShoppingCartIcon,
          children: [
            {
              label: "Products",
              value: "/products",
            },
            {
              label: "Orders",
              value: "/orders",
            },
            {
              label: "Customers",
              value: "/customers",
            },
          ],
        },
        {
          label: "User Management",
          icon: UsersIcon,
          children: [
            {
              label: "Users",
              value: "/users",
            },
            {
              label: "Roles",
              value: "/users/roles",
            },
          ],
        },
        {
          label: "Analytics",
          value: "/analytics",
          icon: ChartLineIcon,
        },
        {
          label: "Settings",
          value: "/settings",
          icon: SettingsIcon,
          divider: true,
        },
      ]}
      navModules={[
        {
          icon: ShoppingCartIcon,
          label: "E-commerce",
          description: "Product & Order Management",
          color: "blue",
        },
      ]}
      softwareInfo={{
        org: "Acme Corp",
        module: "Admin Panel",
        moduleDescription: "Business Management System",
      }}
      onLogout={handleLogout}
    >
      {children}
    </AdminShell>
  );
}
```

### Example 2: Multi-Tenant Application

```tsx
import { AdminShell } from "@settle/admin";
import { useTenant } from "@/hooks/useTenant";

export function TenantAdminShell({ children }) {
  const { tenant } = useTenant();

  return (
    <AdminShell
      navItems={[
        {
          label: "Overview",
          value: `/tenant/${tenant.id}/overview`,
          icon: HouseIcon,
        },
        {
          label: "Team",
          value: `/tenant/${tenant.id}/team`,
          icon: UsersIcon,
        },
        {
          label: "Billing",
          value: `/tenant/${tenant.id}/billing`,
          icon: CreditCardIcon,
        },
      ]}
      softwareInfo={{
        org: tenant.name,
        module: "Admin Console",
        moduleDescription: tenant.plan,
      }}
      essentials={
        <Group gap="xs">
          <NotificationBell />
          <UserMenu />
        </Group>
      }
    >
      {children}
    </AdminShell>
  );
}
```

### Example 3: Role-Based Navigation

```tsx
import { AdminShell } from "@settle/admin";
import { RolePermsWrapper, usePermissions } from "@settle/core";

export function App() {
  return (
    <RolePermsWrapper
      defaultPermissions={{
        "dashboard.view": true,
        "users.view": true,
        "users.manage": false,
        "settings.view": false,
      }}
    >
      <AdminLayout />
    </RolePermsWrapper>
  );
}

function AdminLayout() {
  const { permissions } = usePermissions();

  // Filter navigation items based on permissions
  const navItems = [
    {
      label: "Dashboard",
      value: "/dashboard",
      icon: HouseIcon,
      roles: ["dashboard.view"],
    },
    {
      label: "Users",
      value: "/users",
      icon: UsersIcon,
      roles: ["users.view"],
    },
    {
      label: "Settings",
      value: "/settings",
      icon: SettingsIcon,
      roles: ["settings.view"],
    },
  ].filter(item => {
    // Filter items based on user permissions
    return item.roles?.every(role => permissions[role]) ?? true;
  });

  return (
    <AdminShell navItems={navItems}>
      <PageContent />
    </AdminShell>
  );
}
```

### Example 4: With Custom Essentials

```tsx
import { AdminShell } from "@settle/admin";
import { Avatar, Menu, Group, Text } from "@mantine/core";
import { BellIcon, GearIcon, SignOutIcon } from "@phosphor-icons/react";

function UserEssentials() {
  const { user } = useAuth();

  return (
    <Group gap="md">
      {/* Notifications */}
      <Menu>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <BellIcon size={20} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item>No new notifications</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* User Menu */}
      <Menu>
        <Menu.Target>
          <Group gap="xs" style={{ cursor: "pointer" }}>
            <Avatar src={user.avatar} size="sm" />
            <Text size="sm">{user.name}</Text>
          </Group>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<GearIcon />}>
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<SignOutIcon />} color="red">
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

<AdminShell
  navItems={navItems}
  essentials={<UserEssentials />}
>
  {children}
</AdminShell>
```

## Layout Customization

### Navbar Width

The navbar is fixed at 300px width by default. This is set in the component:

```tsx
// Default configuration
<AppShell
  navbar={{
    width: 300,
    breakpoint: "sm",
  }}
  header={{ height: 50 }}
>
```

### Header Height

The header is fixed at 50px height. Adjust if needed by modifying the component.

### Background Colors

All backgrounds are set to `bg="none"` for transparency:

```tsx
<AppShell.Header bg="none">
  {/* Header content */}
</AppShell.Header>

<AppShell.Navbar bg="none">
  {/* Navbar content */}
</AppShell.Navbar>

<AppShell.Main bg="none">
  {children}
</AppShell.Main>
```

## Integration with Next.js

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { AdminShell } from "@settle/admin";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AdminShell navItems={navItems}>
          {children}
        </AdminShell>
      </body>
    </html>
  );
}
```

### Pages Router (Next.js 12)

```tsx
// pages/_app.tsx
import { AdminShell } from "@settle/admin";

function MyApp({ Component, pageProps }) {
  return (
    <AdminShell navItems={navItems}>
      <Component {...pageProps} />
    </AdminShell>
  );
}
```

## TypeScript Usage

### Typed Navigation

```typescript
import { PropAdminNavItems } from "@settle/admin";

const navItems: PropAdminNavItems[] = [
  {
    label: "Dashboard",
    value: "/dashboard",
    icon: HouseIcon,
  },
  {
    label: "Users",
    icon: UsersIcon,
    children: [
      {
        label: "All Users",
        value: "/users",
      },
    ],
  },
];
```

### Typed Module Configuration

```typescript
import { PropAdminNavModule } from "@settle/admin";

const modules: PropAdminNavModule[] = [
  {
    icon: ShoppingCartIcon,
    label: "E-commerce",
    description: "Manage products and orders",
    color: "blue",
  },
];
```

## Best Practices

1. **Use Semantic Navigation**: Organize menu items logically by feature area
2. **Keep Nesting Shallow**: Limit navigation depth to 2-3 levels max
3. **Use Icons Consistently**: Provide icons for all top-level items
4. **Implement Logout**: Always provide a logout mechanism
5. **Filter by Permissions**: Show only menu items user has access to
6. **Mobile-First**: Test navigation on mobile devices
7. **Use Dividers Sparingly**: Separate logical groups, not every item
8. **Type Your Props**: Use TypeScript for better development experience

## Troubleshooting

### Issue: Navbar not showing on mobile

**Solution**: Check that Mantine's responsive styles are loaded:

```tsx
// Ensure Mantine styles are imported
import "@mantine/core/styles.css";
```

### Issue: Navigation items not clickable

**Solution**: Ensure you're using a routing library and handling clicks:

```tsx
import { useRouter } from "next/navigation";

const router = useRouter();

// Click handler in navigation component
const handleNavClick = (path: string) => {
  router.push(path);
};
```

### Issue: Module header not displaying

**Solution**: Provide `navModules` prop:

```tsx
<AdminShell
  navModules={[
    {
      icon: HouseIcon,
      label: "Dashboard",
      color: "blue",
    },
  ]}
>
  {children}
</AdminShell>
```

### Issue: Logout not working

**Solution**: Implement `onLogout` callback:

```tsx
<AdminShell
  onLogout={async () => {
    await signOut();
    router.push("/login");
  }}
>
  {children}
</AdminShell>
```

## Related Documentation

- [ConfigShell Usage](../ConfigShell/USAGE.md) - Configuration management layout
- [DataTableShell Usage](../DataTableShell/USAGE.md) - Data table layout
- [RolePermsWrapper Usage](../../../../core/src/wrappers/RolePermsWrapper/USAGE.md) - Permission management
- [Mantine AppShell](https://mantine.dev/core/app-shell/) - Underlying component

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
