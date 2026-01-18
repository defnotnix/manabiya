# Tabs Usage Guide

## Overview

`Tabs` is a simple tab navigation component for switching between different views or content sections. It provides:
- **Simple tab switching** with click handlers
- **Active state styling** for current tab
- **Icon support** with left/right sections
- **Badge support** for counts or status
- **Custom styling** via Mantine Group props
- **Keyboard accessible** tab navigation

Tabs is the recommended choice for simple tab navigation in data tables and content sections.

## Key Features

✅ **Simple API** - Easy to use with minimal configuration
✅ **Active State** - Visual indication of selected tab
✅ **Icon Support** - Add icons to the left or right of labels
✅ **Badge Support** - Show counts or status badges
✅ **Flexible Styling** - Customize via Mantine Group props
✅ **Accessible** - Keyboard navigation support
✅ **Lightweight** - Minimal component with focused functionality

## Basic Usage

### Minimal Example

```tsx
import { Tabs } from "@settle/admin";
import { useState } from "react";

export function MyTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs
      active={activeTab}
      onTabChange={setActiveTab}
      tabs={[
        { label: "All Items" },
        { label: "Active" },
        { label: "Inactive" },
      ]}
    />
  );
}
```

### With Icons

```tsx
import { Tabs } from "@settle/admin";
import { HouseIcon, UsersIcon, SettingsIcon } from "@phosphor-icons/react";

<Tabs
  active={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    {
      label: "Dashboard",
      leftSection: <HouseIcon size={16} />,
    },
    {
      label: "Users",
      leftSection: <UsersIcon size={16} />,
    },
    {
      label: "Settings",
      leftSection: <SettingsIcon size={16} />,
    },
  ]}
/>
```

### With Badges

```tsx
import { Badge } from "@mantine/core";

<Tabs
  active={activeTab}
  onTabChange={setActiveTab}
  tabs={[
    {
      label: "All",
      rightSection: <Badge size="sm">125</Badge>,
    },
    {
      label: "Active",
      rightSection: <Badge size="sm" color="green">89</Badge>,
    },
    {
      label: "Pending",
      rightSection: <Badge size="sm" color="yellow">36</Badge>,
    },
  ]}
/>
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `tabs` | `PropTabsTab[]` | ✅ Yes | - | Array of tab configurations |
| `active` | `number` | No | `undefined` | Index of active tab (0-based) |
| `onTabChange` | `function` | ✅ Yes | - | Callback when tab is clicked |
| `...GroupProps` | `GroupProps` | No | - | All Mantine Group props (gap, px, etc.) |

### Tab Configuration Type

```typescript
type PropTabsTab = {
  label: string;              // Tab label text
  leftSection?: ReactNode;    // Icon or element on left
  rightSection?: ReactNode;   // Badge or element on right
};
```

## Tab Configuration

### Basic Tabs

```tsx
const tabs = [
  { label: "Overview" },
  { label: "Details" },
  { label: "Settings" },
];

<Tabs
  active={activeTab}
  onTabChange={setActiveTab}
  tabs={tabs}
/>
```

### With Icons Only

```tsx
import {
  ListIcon,
  GridIcon,
  MapIcon,
} from "@phosphor-icons/react";

const tabs = [
  { label: "List", leftSection: <ListIcon size={16} /> },
  { label: "Grid", leftSection: <GridIcon size={16} /> },
  { label: "Map", leftSection: <MapIcon size={16} /> },
];
```

### With Badges

```tsx
import { Badge } from "@mantine/core";

const tabs = [
  {
    label: "Inbox",
    rightSection: <Badge size="sm" color="blue">12</Badge>,
  },
  {
    label: "Sent",
    rightSection: <Badge size="sm">45</Badge>,
  },
  {
    label: "Drafts",
    rightSection: <Badge size="sm" color="gray">3</Badge>,
  },
];
```

### With Both Icons and Badges

```tsx
const tabs = [
  {
    label: "All Orders",
    leftSection: <ShoppingCartIcon size={16} />,
    rightSection: <Badge size="sm">156</Badge>,
  },
  {
    label: "Pending",
    leftSection: <ClockIcon size={16} />,
    rightSection: <Badge size="sm" color="yellow">23</Badge>,
  },
  {
    label: "Completed",
    leftSection: <CheckIcon size={16} />,
    rightSection: <Badge size="sm" color="green">133</Badge>,
  },
];
```

## Advanced Examples

### Example 1: Data Table Filtering

```tsx
import { Tabs } from "@settle/admin";
import { DataTable } from "mantine-datatable";
import { useState, useMemo } from "react";

function UsersTable() {
  const [activeTab, setActiveTab] = useState(0);
  const { data } = DataTableWrapper.useDataTableContext();

  const filteredData = useMemo(() => {
    if (activeTab === 0) return data; // All
    if (activeTab === 1) return data.filter(u => u.status === "active");
    if (activeTab === 2) return data.filter(u => u.status === "inactive");
    return data;
  }, [data, activeTab]);

  const tabs = [
    {
      label: "All Users",
      rightSection: <Badge size="sm">{data.length}</Badge>,
    },
    {
      label: "Active",
      rightSection: (
        <Badge size="sm" color="green">
          {data.filter(u => u.status === "active").length}
        </Badge>
      ),
    },
    {
      label: "Inactive",
      rightSection: (
        <Badge size="sm" color="gray">
          {data.filter(u => u.status === "inactive").length}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        active={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      <DataTable
        records={filteredData}
        columns={columns}
      />
    </div>
  );
}
```

### Example 2: Content Sections

```tsx
function ProductDetails() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Overview", leftSection: <InfoIcon size={16} /> },
    { label: "Specifications", leftSection: <ListIcon size={16} /> },
    { label: "Reviews", leftSection: <StarIcon size={16} /> },
    { label: "Related", leftSection: <GridIcon size={16} /> },
  ];

  return (
    <div>
      <Tabs
        active={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {activeTab === 0 && <ProductOverview />}
      {activeTab === 1 && <ProductSpecs />}
      {activeTab === 2 && <ProductReviews />}
      {activeTab === 3 && <RelatedProducts />}
    </div>
  );
}
```

### Example 3: Status-Based Tabs

```tsx
function OrdersPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { orders } = useOrders();

  const statusCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }), [orders]);

  const tabs = [
    {
      label: "All Orders",
      rightSection: <Badge>{statusCounts.all}</Badge>,
    },
    {
      label: "Pending",
      leftSection: <ClockIcon size={16} />,
      rightSection: <Badge color="yellow">{statusCounts.pending}</Badge>,
    },
    {
      label: "Processing",
      leftSection: <SpinnerIcon size={16} />,
      rightSection: <Badge color="blue">{statusCounts.processing}</Badge>,
    },
    {
      label: "Completed",
      leftSection: <CheckIcon size={16} />,
      rightSection: <Badge color="green">{statusCounts.completed}</Badge>,
    },
    {
      label: "Cancelled",
      leftSection: <XIcon size={16} />,
      rightSection: <Badge color="red">{statusCounts.cancelled}</Badge>,
    },
  ];

  return (
    <div>
      <Tabs
        active={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />
      <OrdersList filter={getFilterForTab(activeTab)} />
    </div>
  );
}
```

### Example 4: With Custom Spacing

```tsx
<Tabs
  active={activeTab}
  onTabChange={setActiveTab}
  tabs={tabs}
  gap="lg"        // Larger gap between tabs
  px="md"         // Horizontal padding
/>
```

### Example 5: Dynamic Tab Generation

```tsx
function CategoryTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const { categories } = useCategories();

  const tabs = categories.map(category => ({
    label: category.name,
    leftSection: <FolderIcon size={16} />,
    rightSection: (
      <Badge size="sm" color={category.color}>
        {category.itemCount}
      </Badge>
    ),
  }));

  return (
    <Tabs
      active={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs}
    />
  );
}
```

## Styling and Customization

### Custom Gap

```tsx
<Tabs
  tabs={tabs}
  gap={0}        // No gap between tabs
  // or
  gap="xs"       // Extra small gap
  gap="sm"       // Small gap
  gap="md"       // Medium gap (default)
  gap="lg"       // Large gap
  gap="xl"       // Extra large gap
/>
```

### Custom Padding

```tsx
<Tabs
  tabs={tabs}
  px="lg"        // Horizontal padding
  py="sm"        // Vertical padding
/>
```

### Using CSS Classes

```tsx
<Tabs
  tabs={tabs}
  className="my-custom-tabs"
  style={{ backgroundColor: "white" }}
/>
```

## Integration with DataTableShell

Tabs are built into DataTableShell:

```tsx
import { DataTableShell } from "@settle/admin";

<DataTableShell
  tabs={[
    { label: "All Users" },
    { label: "Active" },
    { label: "Inactive" },
  ]}
  // ... other props
/>
```

## State Management

### Controlled Component

```tsx
const [activeTab, setActiveTab] = useState(0);

<Tabs
  active={activeTab}
  onTabChange={setActiveTab}
  tabs={tabs}
/>

// Access activeTab anywhere in component
console.log("Current tab:", activeTab);
```

### URL-Based State

```tsx
import { useSearchParams } from "next/navigation";

function TabsWithURL() {
  const searchParams = useSearchParams();
  const tabFromURL = parseInt(searchParams.get("tab") || "0");
  const [activeTab, setActiveTab] = useState(tabFromURL);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    router.push(`?tab=${index}`);
  };

  return (
    <Tabs
      active={activeTab}
      onTabChange={handleTabChange}
      tabs={tabs}
    />
  );
}
```

### Local Storage Persistence

```tsx
function TabsWithPersistence() {
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem("activeTab");
    return saved ? parseInt(saved) : 0;
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", String(index));
  };

  return (
    <Tabs
      active={activeTab}
      onTabChange={handleTabChange}
      tabs={tabs}
    />
  );
}
```

## TypeScript Usage

```typescript
import { Tabs } from "@settle/admin";
import type { PropTabsTab } from "@settle/admin";

const tabs: PropTabsTab[] = [
  {
    label: "Overview",
    leftSection: <InfoIcon size={16} />,
  },
  {
    label: "Settings",
    leftSection: <SettingsIcon size={16} />,
  },
];

// Type-safe handler
const handleTabChange = (index: number) => {
  console.log("Tab changed to:", index);
};
```

## Best Practices

1. **Use Meaningful Labels**: Tab labels should clearly describe content
2. **Limit Tab Count**: Keep to 3-7 tabs for best UX
3. **Show Counts**: Use badges to show item counts per tab
4. **Use Icons**: Icons help with quick visual scanning
5. **Manage State**: Always use controlled state for active tab
6. **Keyboard Support**: Component handles keyboard navigation automatically
7. **Mobile Responsive**: Test tabs on mobile devices

## Accessibility

The Tabs component is keyboard accessible:
- **Arrow Keys**: Navigate between tabs
- **Enter/Space**: Activate tab
- **Tab Key**: Move focus to/from tab group

## Common Patterns

### Pattern 1: Status Filtering

```tsx
const tabs = [
  { label: "All" },
  { label: "Active", leftSection: <CheckIcon /> },
  { label: "Pending", leftSection: <ClockIcon /> },
  { label: "Archived", leftSection: <ArchiveIcon /> },
];
```

### Pattern 2: Time-Based Views

```tsx
const tabs = [
  { label: "Today" },
  { label: "This Week" },
  { label: "This Month" },
  { label: "All Time" },
];
```

### Pattern 3: Category Navigation

```tsx
const tabs = [
  { label: "Electronics", leftSection: <LaptopIcon /> },
  { label: "Clothing", leftSection: <ShirtIcon /> },
  { label: "Food", leftSection: <AppleIcon /> },
];
```

## Troubleshooting

### Issue: Active tab not highlighting

**Solution**: Ensure `active` prop is set:

```tsx
// ❌ Bad - No active prop
<Tabs tabs={tabs} onTabChange={setActiveTab} />

// ✅ Good - Active prop set
<Tabs
  active={activeTab}
  tabs={tabs}
  onTabChange={setActiveTab}
/>
```

### Issue: Tabs not switching

**Solution**: Ensure `onTabChange` updates state:

```tsx
// ❌ Bad - Handler doesn't update state
<Tabs onTabChange={() => console.log("changed")} />

// ✅ Good - Handler updates state
<Tabs onTabChange={setActiveTab} />
```

### Issue: Icons not showing

**Solution**: Check icon import and size:

```tsx
import { UsersIcon } from "@phosphor-icons/react";

<Tabs
  tabs={[
    {
      label: "Users",
      leftSection: <UsersIcon size={16} />,  // Set size
    },
  ]}
/>
```

### Issue: Badges not aligned

**Solution**: Use consistent badge sizes:

```tsx
// ✅ Good - Consistent badge sizes
const tabs = [
  { label: "Tab 1", rightSection: <Badge size="sm">5</Badge> },
  { label: "Tab 2", rightSection: <Badge size="sm">10</Badge> },
];
```

## Related Documentation

- [DataTableShell Usage](../../layouts/DataTableShell/USAGE.md) - Uses Tabs component
- [Mantine Group](https://mantine.dev/core/group/) - Base component
- [Phosphor Icons](https://phosphoricons.com/) - Icon library

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
