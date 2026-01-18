# Changelog

All notable changes to the Settle framework will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation for all components and wrappers
- JSDoc comments for core helper functions
- CONTRIBUTING.md with development guidelines
- API reference documentation

### Changed
- Updated root README.md with project-specific content
- Improved code documentation across all packages

## [0.1.0] - Beta Release

### Added

#### Core Package (@settle/core)
- **FormWrapper** - Multi-step form management with API integration
  - Multi-step support with validation
  - Automatic error handling and field mapping
  - Data transformation before submission
  - Dirty checking for modified fields
  - FormData support for file uploads
  - React Query integration

- **DataTableWrapper** - Data table state and query management
  - Client-side and server-side pagination
  - Auto-search functionality
  - React Query integration
  - Flexible data extraction from API responses
  - Context-based data sharing

- **PreferenceWrapper** - User preferences management
  - Cookie-based preference storage
  - Version migration support
  - Server sync capability
  - Default values system

- **RolePermsWrapper** - Role-based permission system
  - Simple permission management
  - Conditional component rendering
  - Module-level access control

- **Core Helpers**
  - `apiDispatch` - HTTP client with automatic authentication
  - `formatJsonSubmit` - Form data formatting utility
  - `moduleApiCall` - High-level CRUD operations
  - `autoSearch` - Client-side search functionality

#### Admin Package (@settle/admin)

- **Layouts**
  - **AdminShell** - Main admin dashboard layout with navbar and header
  - **FormShell** - Form layout with stepper and action buttons
  - **ConfigShell** - Configuration management with card-based UI
  - **DataTableShell** - Complete data table layout with toolbar and filters
  - **DataTableModalShell** - Data table with modal CRUD operations

- **Components**
  - **Stepper** - Multi-step form indicator with navigation
  - **Tabs** - Tab navigation component
  - **FormSubmitButton** - Smart submit button with loading states

- **Pre-built Pages**
  - **PageSignIn** - Production-ready authentication page
    - Email/password login
    - OAuth support (Google, Apple, Discord)
    - Magic link authentication
    - Token management

- **Notification System**
  - Form notifications (loading, success, error, validation)
  - List notifications
  - Authentication notifications
  - Customizable notification messages

#### Configuration Packages
- **@repo/eslint-config** - Shared ESLint configuration
- **@repo/typescript-config** - Shared TypeScript configuration

### Developer Experience
- Turborepo monorepo setup
- pnpm workspace configuration
- TypeScript 5.9.3 support
- ESLint and Prettier integration
- Hot module replacement in dev mode

### Documentation
- FormWrapper comprehensive usage guide
- FormShell architecture documentation
- Stepper component documentation
- PageSignIn implementation guide
- Development rules and guidelines

## Version History

### Beta Releases

#### Beta 0.1.0 - Initial Release
- Core framework architecture
- Essential wrappers and components
- Basic documentation
- Test application setup

---

## Migration Guides

### From Legacy Handlers to Wrappers

If you're using legacy `FormHandler` or `ListHandler`, we recommend migrating to the new wrapper-based architecture:

**FormHandler → FormWrapper**
```typescript
// Before (FormHandler)
const { form, handleSubmit } = useFormHandler({...});

// After (FormWrapper)
<FormWrapper {...props}>
  <MyFormContent />
</FormWrapper>

function MyFormContent() {
  const form = FormWrapper.useForm();
  const { handleSubmit } = FormWrapper.useFormProps();
  // ...
}
```

**ListHandler → DataTableWrapper**
```typescript
// Before (ListHandler)
const { data, isLoading } = useListHandler({...});

// After (DataTableWrapper)
<DataTableWrapper {...props}>
  <MyTableContent />
</DataTableWrapper>

function MyTableContent() {
  const { data, isLoading } = DataTableWrapper.useDataTableContext();
  // ...
}
```

---

## Breaking Changes

### Beta to v1.0.0 (Planned)

Potential breaking changes for v1.0.0 release:

- [ ] Deprecation of legacy handlers
- [ ] API response format standardization
- [ ] Preference storage key format changes
- [ ] Authentication token storage updates

Migration guides will be provided for each breaking change.

---

## Deprecations

### Current Deprecations

- **FormHandler** - Use `FormWrapper` instead
- **ListHandler** - Use `DataTableWrapper` instead

These will be maintained for backward compatibility but will be removed in v2.0.0.

---

## Security

### Security Updates

No security vulnerabilities reported.

For security issues, please email [security@your-org.com](mailto:security@your-org.com).

---

## Contributors

Thank you to all contributors who helped build Settle!

### Core Team
- [Add core team members]

### Contributors
- [Add contributors]

---

## Links

- [Documentation](./README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [GitHub Repository](https://github.com/your-org/settle)
- [Issue Tracker](https://github.com/your-org/settle/issues)

---

## Notes

### Versioning Strategy

- **Major versions** (x.0.0) - Breaking changes
- **Minor versions** (0.x.0) - New features, backwards compatible
- **Patch versions** (0.0.x) - Bug fixes, backwards compatible

### Release Schedule

- **Beta releases** - As needed during development
- **Minor releases** - Monthly (planned)
- **Major releases** - Annually or as needed for breaking changes

### Feedback

We welcome feedback! Please:
- Open issues for bugs
- Start discussions for feature requests
- Submit PRs for contributions

---

*Keep building with Settle!* 🚀
