# Contributing to Settle Framework

Thank you for your interest in contributing to Settle! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Component Development Rules](#component-development-rules)
- [Release Process](#release-process)

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and professional in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **pnpm** 9.0.0 or higher
- **Git** for version control
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/settle.git
cd settle
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/original-org/settle.git
```

## Development Setup

1. **Install dependencies:**

```bash
pnpm install
```

2. **Build all packages:**

```bash
pnpm build
```

3. **Start development mode:**

```bash
pnpm dev
```

4. **Run linting:**

```bash
pnpm lint
```

5. **Run type checking:**

```bash
pnpm check-types
```

## Project Structure

```
settle/
├── packages/
│   ├── @settle/core/          # Core business logic
│   │   ├── src/
│   │   │   ├── wrappers/      # Context-based wrappers
│   │   │   ├── helpers/       # Utility functions
│   │   │   └── handlers/      # Legacy handlers
│   │   └── package.json
│   │
│   ├── @settle/admin/         # UI components and layouts
│   │   ├── src/
│   │   │   ├── layouts/       # Layout shells
│   │   │   ├── components/    # Reusable components
│   │   │   ├── helpers/       # UI helpers
│   │   │   └── pre-built/     # Pre-built pages
│   │   └── package.json
│   │
│   ├── @repo/eslint-config/   # Shared ESLint config
│   └── @repo/typescript-config/ # Shared TypeScript config
│
├── apps/
│   └── admin-test/            # Test application
├── .claude/                   # Development rules and guides
├── docs/                      # Documentation
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # pnpm workspace config
└── turbo.json                 # Turborepo config
```

## Development Workflow

### Creating a New Feature

1. **Create a feature branch:**

```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
3. **Test your changes**
4. **Commit with descriptive messages**
5. **Push and create a Pull Request**

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or updates
- `chore/` - Maintenance tasks

### Commit Message Format

Follow conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(core): add PreferenceWrapper for user preferences
fix(admin): resolve DataTableShell pagination issue
docs(wrapper): update FormWrapper usage guide
refactor(helpers): improve autoSearch performance
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Provide proper type definitions
- Avoid `any` types when possible
- Use interfaces for object shapes
- Use type aliases for unions/intersections

**Example:**

```typescript
// Good
interface User {
  id: number;
  name: string;
  email: string;
}

function getUser(id: number): User | null {
  // ...
}

// Avoid
function getUser(id: any): any {
  // ...
}
```

### React Components

- Use functional components with hooks
- Prop types should be defined with TypeScript interfaces
- Use descriptive prop names
- Document complex props with JSDoc

**Example:**

```tsx
interface ButtonProps {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Button variant */
  variant?: "primary" | "secondary";
}

export function Button({
  label,
  onClick,
  isLoading = false,
  variant = "primary"
}: ButtonProps) {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? "Loading..." : label}
    </button>
  );
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `FormShell.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatJsonSubmit.ts`)
- Types: `ComponentName.type.ts` (e.g., `FormShell.type.ts`)
- Contexts: `ComponentName.context.ts`
- Stores: `ComponentName.store.ts`
- Styles: `ComponentName.module.css`

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use trailing commas
- Max line length: 100 characters (flexible)

**Format code with Prettier:**

```bash
pnpm format
```

## Testing Guidelines

### Unit Tests

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies

**Example:**

```typescript
import { autoSearch } from "@settle/core";

describe("autoSearch", () => {
  it("should filter data by search term", () => {
    const data = [
      { id: 1, name: "John" },
      { id: 2, name: "Jane" }
    ];
    const result = autoSearch(data, "john");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("John");
  });

  it("should return empty array for no matches", () => {
    const data = [{ id: 1, name: "John" }];
    const result = autoSearch(data, "nonexistent");
    expect(result).toHaveLength(0);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Documentation

### Code Documentation

- Add JSDoc comments to all exported functions and components
- Include parameter descriptions and examples
- Document complex logic with inline comments

**Example:**

```typescript
/**
 * Formats form data for API submission.
 *
 * @param data - The form data to format
 * @param keyIgnore - Keys to exclude from submission
 * @returns Formatted data ready for API
 *
 * @example
 * const formatted = await formatJsonSubmit({
 *   data: { name: "John", _id: "123" },
 *   keyIgnore: ["_id"]
 * });
 */
export async function formatJsonSubmit(params) {
  // ...
}
```

### Usage Documentation

When adding a new component or wrapper, create a `USAGE.md` file:

1. **Overview** - What it does and key features
2. **Basic Usage** - Minimal example
3. **Props Reference** - All props with types and descriptions
4. **Advanced Examples** - Real-world usage scenarios
5. **Best Practices** - Recommended patterns
6. **Troubleshooting** - Common issues and solutions

See existing USAGE.md files for reference:
- [FormWrapper USAGE.md](./packages/core/src/wrappers/FormWrapper/USAGE.md)
- [DataTableWrapper USAGE.md](./packages/core/src/wrappers/DataTableWrapper/USAGE.md)

## Pull Request Process

### Before Submitting

1. **Run linting:**
   ```bash
   pnpm lint
   ```

2. **Run type checking:**
   ```bash
   pnpm check-types
   ```

3. **Build all packages:**
   ```bash
   pnpm build
   ```

4. **Update documentation** if needed

5. **Add tests** for new features

### PR Checklist

- [ ] Code follows the style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated and passing
- [ ] PR title follows conventional commits
- [ ] PR description explains what and why

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Screenshots (if applicable)

## Related Issues
Closes #123
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. Resolve all review comments
4. Squash commits if requested
5. Maintainer will merge when ready

## Component Development Rules

Follow the `.claude/rules.md` for component development:

### Rule 1: Wrapper Pattern
- All state logic in wrappers using React Context
- Expose hooks for child components
- No prop drilling

### Rule 2: Layout Shells
- Compose wrappers with UI layouts
- Use context hooks from wrappers
- Keep shells presentational

### Rule 3: Documentation Required
- Every wrapper needs USAGE.md
- Include minimal and advanced examples
- Document all props with tables

### Rule 4: Export Pattern
```typescript
export { Component } from "./Component";
export type { PropComponent } from "./Component.type";
Component.useContext = useComponentContext;
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backwards compatible)
- **PATCH** - Bug fixes

### Publishing (Maintainers Only)

1. **Update version:**
   ```bash
   pnpm changeset
   ```

2. **Create changelog:**
   ```bash
   pnpm changeset version
   ```

3. **Build and publish:**
   ```bash
   pnpm build
   pnpm changeset publish
   ```

4. **Push tags:**
   ```bash
   git push --follow-tags
   ```

## Getting Help

- **Documentation:** [Main Docs](./README.md)
- **Issues:** [GitHub Issues](https://github.com/your-org/settle/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/settle/discussions)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Settle!** 🎉

Your contributions help make Settle better for everyone.
