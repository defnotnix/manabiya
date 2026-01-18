# AdminShell Navbar Architecture

## Overview

A flexible, hierarchical navigation architecture for AdminShell that supports:
- **NavGroups**: Top-level groupings (e.g., Reporting, Inventory, Accounting)
- **NavModules**: Logical sections within groups
- **NavElements**: Individual navigation items with full nesting support

---

## Type Hierarchy

```
NavConfig (root)
├── groups: NavGroup[]             # Top-level groups
├── standaloneItems?: NavElement[] # Items outside groups (shown at top)
├── footerItems?: NavElement[]     # Always-visible footer items
└── settings?: NavSettings         # Global configuration

NavGroup
├── id, label, icon, color, roles
├── defaultCollapsed?: boolean
└── modules: NavModule[]

NavModule
├── id, label, icon (optional)
├── showHeader?: boolean           # Show as section title
└── items: NavElement[]

NavElement (discriminated union)
├── NavItemLink     (type: "link")     - Clickable route
├── NavItemDivider  (type: "divider")  - Visual separator
├── NavItemHeader   (type: "header")   - Section title (non-clickable)
├── NavItemAction   (type: "action")   - Callback trigger
└── NavItemCustom   (type: "custom")   - Custom render function
```

---

## Type Definitions

### NavGroup

```typescript
type NavGroup = {
  id: string;
  label: string;
  description?: string;
  icon: Icon;
  color?: MantineColor;
  roles?: string[];
  defaultCollapsed?: boolean;
  order?: number;
  modules: NavModule[];
};
```

### NavModule

```typescript
type NavModule = {
  id: string;
  label: string;
  description?: string;
  icon?: Icon;
  color?: MantineColor;
  roles?: string[];
  showHeader?: boolean;
  items: NavElement[];
};
```

### NavElement (Discriminated Union)

```typescript
// Clickable navigation link
type NavItemLink = {
  type: "link";
  id?: string;
  label: string;
  href: string;
  icon?: Icon;
  badge?: NavBadge;
  shortcut?: string;
  external?: boolean;
  children?: NavElement[];
  defaultExpanded?: boolean;
  activeMatch?: "exact" | "prefix" | "none";
  roles?: string[];
};

// Visual separator
type NavItemDivider = {
  type: "divider";
  id?: string;
  label?: string;
  margin?: "xs" | "sm" | "md" | "lg";
};

// Non-clickable section header
type NavItemHeader = {
  type: "header";
  id?: string;
  label: string;
  icon?: Icon;
  variant?: "default" | "subtle" | "highlighted";
  roles?: string[];
};

// Callback action (not a route)
type NavItemAction = {
  type: "action";
  id?: string;
  label: string;
  icon?: Icon;
  actionId: string;
  badge?: NavBadge;
  roles?: string[];
};

// Custom render function
type NavItemCustom = {
  type: "custom";
  id?: string;
  render: () => ReactNode;
  roles?: string[];
};

// Union type
type NavElement =
  | NavItemLink
  | NavItemDivider
  | NavItemHeader
  | NavItemAction
  | NavItemCustom;
```

### NavBadge

```typescript
type NavBadge = {
  content?: ReactNode;
  color?: MantineColor;
  variant?: "filled" | "light" | "outline" | "dot";
  size?: "xs" | "sm" | "md";
  visible?: boolean;
  animated?: boolean;
};
```

### NavConfig

```typescript
type NavConfig = {
  groups: NavGroup[];
  standaloneItems?: NavElement[];
  footerItems?: NavElement[];
  settings?: NavSettings;
};

type NavSettings = {
  searchEnabled?: boolean;
  searchShortcut?: string;       // Default: "mod+k"
  accordion?: boolean;           // Only one group open at a time
  persistState?: boolean;        // Save collapsed state to localStorage
  storageKey?: string;
};
```

---

## Component Architecture

```
AdminShellNavbar
├── NavSearch (Cmd+K focus)
├── NavContent (ScrollArea)
│   ├── standaloneItems → NavElementRenderer
│   └── NavGroupList
│       └── NavGroupItem (collapsible header + content)
│           └── NavModuleList
│               └── NavModuleItem
│                   ├── NavModuleHeader (optional section title)
│                   └── NavElementRenderer (for each item)
│                       ├── NavLinkItem
│                       ├── NavDividerItem
│                       ├── NavHeaderItem
│                       ├── NavActionItem
│                       └── NavCustomItem
└── NavFooter
    ├── footerItems → NavElementRenderer
    └── UserInfoPopover (existing)
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `AdminShell.nav.types.ts` | All navigation type definitions |
| `context/NavContext.tsx` | Navigation state management (search, collapsed, etc.) |
| `utils/navMigration.ts` | Legacy navItems → NavConfig conversion |
| `utils/navFilter.ts` | Search & role-based filtering |
| `components/NavElementRenderer.tsx` | Discriminated union renderer |
| `components/NavGroupList.tsx` | Renders list of NavGroups |
| `components/NavGroupItem.tsx` | Single group with collapse toggle |
| `components/NavModuleList.tsx` | Renders list of NavModules |
| `components/NavLinkItem.tsx` | Link element with nested support |
| `components/NavDividerItem.tsx` | Divider element |
| `components/NavHeaderItem.tsx` | Section header element |
| `components/NavActionItem.tsx` | Action callback element |

---

## Files to Modify

| File | Changes |
|------|---------|
| `AdminShell.type.ts` | Add `navConfig?: NavConfig` prop |
| `Navbar/index.tsx` | Support both legacy `navItems` and new `navConfig` |
| `index.ts` | Export new types |

---

## Backwards Compatibility

Existing `navItems` and `navModules` props will continue to work:

```typescript
type PropAdminNavSideNav = {
  // NEW - preferred
  navConfig?: NavConfig;

  // LEGACY - deprecated but functional
  navItems?: PropAdminNavItems[];
  navModules?: PropAdminNavModule[];
};
```

Migration utility automatically converts legacy format:

```typescript
function migrateLegacyNavItems(items: PropAdminNavItems[]): NavElement[];
```

---

## Usage Examples

### Simple (Single Module)

```typescript
const navConfig: NavConfig = {
  groups: [{
    id: "main",
    label: "Main",
    icon: HouseIcon,
    modules: [{
      id: "nav",
      label: "Navigation",
      showHeader: false,
      items: [
        { type: "link", label: "Dashboard", href: "/dashboard", icon: ChartIcon },
        { type: "link", label: "Users", href: "/users", icon: UsersIcon },
        { type: "divider" },
        { type: "header", label: "Settings" },
        { type: "link", label: "Preferences", href: "/settings", icon: GearIcon },
      ],
    }],
  }],
};
```

### With Nested Items

```typescript
const navConfig: NavConfig = {
  groups: [{
    id: "main",
    label: "Main",
    icon: HouseIcon,
    modules: [{
      id: "nav",
      label: "Navigation",
      items: [
        {
          type: "link",
          label: "Users",
          href: "/users",
          icon: UsersIcon,
          children: [
            { type: "link", label: "All Users", href: "/users" },
            { type: "link", label: "Roles", href: "/users/roles" },
            { type: "link", label: "Permissions", href: "/users/permissions" },
          ],
        },
      ],
    }],
  }],
};
```

### With Badges

```typescript
{
  type: "link",
  label: "Notifications",
  href: "/notifications",
  icon: BellIcon,
  badge: {
    content: "12",
    color: "red",
    variant: "filled",
    animated: true,
  },
}
```

### Enterprise (Multiple Groups)

```typescript
const navConfig: NavConfig = {
  groups: [
    {
      id: "reporting",
      label: "Reporting",
      icon: ChartBarIcon,
      color: "blue",
      modules: [
        {
          id: "analytics",
          label: "Analytics",
          items: [
            { type: "link", label: "Dashboard", href: "/reporting/dashboard", icon: ChartLineIcon },
            { type: "link", label: "Sales Reports", href: "/reporting/sales", icon: CurrencyIcon },
          ],
        },
        {
          id: "exports",
          label: "Exports",
          showHeader: true,
          items: [
            { type: "link", label: "Generate Report", href: "/reporting/export", icon: FileIcon },
          ],
        },
      ],
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: PackageIcon,
      color: "orange",
      defaultCollapsed: true,
      modules: [
        {
          id: "products",
          label: "Products",
          items: [
            { type: "link", label: "All Products", href: "/inventory/products", icon: TagIcon },
            { type: "link", label: "Categories", href: "/inventory/categories", icon: FolderIcon },
          ],
        },
      ],
    },
    {
      id: "accounting",
      label: "Accounting",
      icon: CalculatorIcon,
      color: "teal",
      defaultCollapsed: true,
      modules: [
        {
          id: "transactions",
          label: "Transactions",
          items: [
            { type: "link", label: "Invoices", href: "/accounting/invoices", icon: FileTextIcon },
            { type: "link", label: "Payments", href: "/accounting/payments", icon: CreditCardIcon },
          ],
        },
      ],
    },
  ],
  settings: {
    accordion: true,      // Only one group open at a time
    searchEnabled: true,
    persistState: true,
    storageKey: "admin-nav-state",
  },
};
```

---

## Implementation Order

1. [ ] Create `AdminShell.nav.types.ts` with all type definitions
2. [ ] Create `utils/navMigration.ts` for legacy support
3. [ ] Create `utils/navFilter.ts` for search/role filtering
4. [ ] Create `context/NavContext.tsx` for state management
5. [ ] Create individual NavElement components (Link, Divider, Header, Action)
6. [ ] Create NavElementRenderer (discriminated union handler)
7. [ ] Create NavGroupList and NavGroupItem components
8. [ ] Create NavModuleList component
9. [ ] Update `Navbar/index.tsx` to use new architecture
10. [ ] Update `AdminShell.type.ts` with navConfig prop
11. [ ] Update exports in `index.ts`
12. [ ] Test with existing `navItems` (backwards compat)
13. [ ] Test with new `navConfig` format

---

## Features Supported

| Feature | Status |
|---------|--------|
| Nested navigation (unlimited depth) | ✅ |
| Section headers (non-clickable) | ✅ |
| Visual dividers | ✅ |
| Icons (Phosphor) | ✅ |
| Badges/notifications | ✅ |
| Role-based visibility | ✅ |
| Keyboard shortcuts | ✅ |
| Search filtering | ✅ |
| Collapsible groups | ✅ |
| Accordion mode | ✅ |
| External links | ✅ |
| Action callbacks | ✅ |
| Custom render | ✅ |
| Active state detection | ✅ |
| State persistence | ✅ |
| Backwards compatibility | ✅ |
