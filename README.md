# Settle Framework

A comprehensive TypeScript-based React/Next.js component library and admin UI framework for building powerful admin dashboards and data-driven applications with ease.

## Overview

**Settle** is a production-ready monorepo framework that provides reusable form management, data table handling, and admin dashboard components. Built on modern technologies including React 19, Next.js 16, Mantine 8, and managed with Turborepo, Settle accelerates development of complex admin interfaces and form-heavy applications.

## Key Features

- **Multi-Step Form Management** - Advanced form handling with step validation, error mapping, and API integration
- **Data Table Management** - Powerful data tables with filtering, pagination, sorting, and CRUD operations
- **Admin Dashboard Layouts** - Pre-built shells for admin interfaces, configuration pages, and data tables
- **User Preferences Management** - Automatic preference syncing with cookies and backend
- **Role-Based Permissions** - Simple permission system for controlling module access
- **Notification System** - Context-aware notifications for forms, lists, and authentication
- **Type-Safe** - Full TypeScript support with comprehensive type definitions
- **Modular Architecture** - Use only what you need with tree-shakable exports

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | 5.9.3 | Type-safe development |
| **React** | 19.2.3 | UI library |
| **Next.js** | 16.1.0 | React framework |
| **Mantine** | 8.3.10 | Component library |
| **Turborepo** | 2.7.1 | Monorepo build system |
| **pnpm** | 9.0.0 | Package manager |
| **React Query** | 5.90.12 | Server state management |
| **Zustand** | 5.0.9 | Client state management |
| **Zod** | 4.2.1 | Schema validation |
| **Axios** | 1.13.2 | HTTP client |

## Project Structure

```
settle/
├── packages/
│   ├── @settle/core      - Core business logic, wrappers, and helpers
│   ├── @settle/admin     - UI components, layouts, and pre-built pages
│   ├── @repo/eslint-config       - Shared ESLint configuration
│   └── @repo/typescript-config   - Shared TypeScript configuration
├── apps/
│   └── admin-test        - Test application
├── package.json          - Root workspace configuration
├── pnpm-workspace.yaml   - pnpm monorepo setup
├── turbo.json            - Turborepo build configuration
└── README.md             - This file
```

## Installation

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd settle

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development mode
pnpm dev
```

## Quick Start

### 1. Multi-Step Form with FormWrapper

```tsx
import { FormWrapper } from "@settle/core";
import { FormShell } from "@settle/admin";
import { triggerNotification } from "@settle/admin";

export function MyForm() {
  return (
    <FormWrapper
      formName="user-form"
      initial={{ firstName: "", lastName: "", email: "" }}
      steps={2}
      validation={[
        { firstName: (val) => val.length > 0 },
        { email: (val) => val.includes("@") }
      ]}
      notifications={{
        isLoading: (props) => triggerNotification.form.isLoading(props),
        isSuccess: (props) => triggerNotification.form.isSuccess(props),
        isError: (props) => triggerNotification.form.isError(props),
      }}
      apiSubmitFn={async (data) => {
        const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify(data),
        });
        return response.json();
      }}
    >
      <FormShell
        title="Create User"
        description="Fill in the user details"
        stepperConfig={{
          labels: ["Personal Info", "Contact Info"],
        }}
      >
        {/* Your form fields here */}
      </FormShell>
    </FormWrapper>
  );
}
```

### 2. Data Table with DataTableWrapper

```tsx
import { DataTableWrapper } from "@settle/core";
import { DataTableShell } from "@settle/admin";

export function UsersTable() {
  return (
    <DataTableWrapper
      queryKey="users.list"
      queryGetFn={async () => {
        const response = await fetch("/api/users");
        return response.json();
      }}
      dataKey="results"
    >
      <DataTableShell
        moduleInfo={{ name: "Users", term: "User" }}
        idAccessor="id"
        columns={[
          { accessor: "firstName", title: "First Name" },
          { accessor: "lastName", title: "Last Name" },
          { accessor: "email", title: "Email" },
        ]}
        onEditClick={(record) => console.log("Edit", record)}
        onDeleteClick={(ids) => console.log("Delete", ids)}
      />
    </DataTableWrapper>
  );
}
```

### 3. Admin Layout with AdminShell

```tsx
import { AdminShell } from "@settle/admin";

export function AdminLayout({ children }) {
  return (
    <AdminShell
      navItems={[
        { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
        { label: "Users", href: "/users", icon: <UsersIcon /> },
        { label: "Settings", href: "/settings", icon: <SettingsIcon /> },
      ]}
    >
      {children}
    </AdminShell>
  );
}
```

## Core Packages

### @settle/core

Core business logic and wrappers for form and data management:

- **FormWrapper** - Multi-step form management with API integration
- **DataTableWrapper** - Data table state and query management
- **PreferenceWrapper** - User preferences with cookie/backend sync
- **RolePermsWrapper** - Role-based permission management
- **Helpers** - Utility functions for API calls, data formatting, and search

📖 [Full Core Documentation](./packages/core/README.md)

### @settle/admin

UI components, layouts, and pre-built pages:

- **Layouts** - FormShell, AdminShell, ConfigShell, DataTableShell
- **Components** - Stepper, Tabs, FormSubmitButton
- **Pre-built Pages** - PageSignIn (with OAuth support)
- **Notification System** - Context-aware notifications

📖 [Full Admin Documentation](./packages/admin/README.md)

## Documentation

### Core Package Documentation
- [FormWrapper Usage Guide](./packages/core/src/wrappers/FormWrapper/USAGE.md)
- [DataTableWrapper Usage Guide](./packages/core/src/wrappers/DataTableWrapper/USAGE.md)
- [PreferenceWrapper Usage Guide](./packages/core/src/wrappers/PreferenceWrapper/USAGE.md)
- [RolePermsWrapper Usage Guide](./packages/core/src/wrappers/RolePermsWrapper/USAGE.md)
- [Core Helpers Documentation](./packages/core/src/helpers/README.md)

### Admin Package Documentation
- [AdminShell Documentation](./packages/admin/src/layouts/AdminShell/USAGE.md)
- [ConfigShell Documentation](./packages/admin/src/layouts/ConfigShell/USAGE.md)
- [DataTableShell Documentation](./packages/admin/src/layouts/DataTableShell/USAGE.md)
- [DataTableModalShell Documentation](./packages/admin/src/layouts/DataTableModalShell/USAGE.md)
- [FormShell Documentation](./packages/admin/src/layouts/FormShell/FORMSHELL_USAGE.md)
- [Stepper Component](./packages/admin/src/components/Stepper/README.md)
- [Tabs Component](./packages/admin/src/components/Tabs/USAGE.md)
- [FormSubmitButton Component](./packages/admin/src/components/FormSubmitButton/USAGE.md)
- [Notification System](./packages/admin/src/helpers/triggerNotification/USAGE.md)
- [PageSignIn](./packages/admin/src/pre-built/PageSignIn/docs/USAGE.md)

### API Reference
- [Complete API Reference](./docs/API.md)

### Contributing
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Development Rules](./.claude/rules.md)

### Changelog
- [Version History](./CHANGELOG.md)

## Development

### Available Scripts

```bash
# Build all packages
pnpm build

# Start development mode
pnpm dev

# Run linting
pnpm lint

# Format code
pnpm format

# Type checking
pnpm check-types
```

### Working with Specific Packages

```bash
# Build only core package
pnpm build --filter=@settle/core

# Develop only admin package
pnpm dev --filter=@settle/admin

# Type check core package
pnpm check-types --filter=@settle/core
```

## Architecture

Settle follows a **Context-Based Wrapper Pattern** for state management:

1. **Wrappers** provide React Context for state management
2. **Custom Hooks** access wrapper context and state
3. **Layout Shells** compose wrappers with pre-built UI
4. **Components** are modular and tree-shakable

### Example Architecture Flow

```
FormWrapper (State + Context)
    ↓
FormShell (Layout)
    ↓
Stepper + Form Fields (Components)
    ↓
FormSubmitButton (Component using context)
```

## Key Architectural Patterns

1. **Context-Based Wrappers** - React Context for state sharing
2. **Store Management** - Zustand for persistent state
3. **Hook-Based APIs** - Custom hooks for accessing wrapper data
4. **Component Composition** - Layout shells that compose smaller components
5. **Notification Callbacks** - Centralized notification handling
6. **Type Safety** - Full TypeScript with Zod schemas

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

[Add your license here]

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for details.

## Support

- Documentation: [Full Documentation](./docs/)
- Issues: [GitHub Issues](https://github.com/your-org/settle/issues)
- Discussions: [GitHub Discussions](https://github.com/your-org/settle/discussions)

## Acknowledgments

Built with:
- [Mantine](https://mantine.dev) - React Component Library
- [React Query](https://tanstack.com/query) - Data Fetching
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [Turborepo](https://turbo.build/repo) - Monorepo Build System

---

**Made with ❤️ by the Settle Team**
