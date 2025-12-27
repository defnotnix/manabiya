# PageSignIn Usage Guide

## Overview

`PageSignIn` is a pre-built, production-ready sign-in page component with support for multiple authentication methods:
- Email/password authentication
- Social OAuth logins (Google, Apple, Discord)
- Magic link authentication

The component handles form validation, API integration, token storage, and user notifications automatically.

## Key Features

✅ **Form Validation** - Built-in field validation using Mantine Form
✅ **Multiple Auth Methods** - Email/password, social logins, magic links
✅ **Error Handling** - Comprehensive error messages and notifications
✅ **Token Management** - Automatic token storage and retrieval
✅ **Hydration Safe** - Prevents SSR mismatches with Next.js
✅ **Accessible** - ARIA labels and semantic HTML
✅ **Responsive** - Mobile-friendly design

## Basic Usage

### Minimal Example

```tsx
import { PageSignIn } from "@settle/admin";

export function SignInPage() {
  return (
    <PageSignIn
      loginApi="/api/auth/login"
      successRedirectUrl="/dashboard"
      forgotRedirectUrl="/forgot-password"
    />
  );
}
```

### With All Auth Methods Enabled

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  hasGoogleLogin={true}
  hasAppleLogin={true}
  hasDiscordLogin={true}
  hasMagicLinkLogin={true}
  onGoogleLogin={() => {
    // Initiate Google OAuth flow
    window.location.href = "/api/auth/google";
  }}
  onAppleLogin={() => {
    // Initiate Apple OAuth flow
    window.location.href = "/api/auth/apple";
  }}
  onDiscordLogin={() => {
    // Initiate Discord OAuth flow
    window.location.href = "/api/auth/discord";
  }}
  onMagicLinkLogin={async (email) => {
    // Send magic link request to backend
    await fetch("/api/auth/magic-link", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }}
  onSuccess={(data) => {
    console.log("Login successful:", data);
  }}
  onError={(error) => {
    console.error("Login failed:", error);
  }}
  onForgotPassword={() => {
    // Handle forgot password navigation
  }}
/>
  );
}
```

## Props Reference

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `loginApi` | string | ✅ | - | API endpoint for email/password login (e.g., `/api/auth/login`) |
| `successRedirectUrl` | string | ✅ | - | URL to redirect to after successful login (e.g., `/dashboard`) |
| `forgotRedirectUrl` | string | ✅ | - | URL to redirect to when "Forgot Password" is clicked |
| `onSuccess` | function | ❌ | - | Callback fired on successful login before redirect |
| `onError` | function | ❌ | - | Callback fired on login error |
| `onForgotPassword` | function | ❌ | - | Callback fired when "Forgot Password" link is clicked |
| `hasGoogleLogin` | boolean | ❌ | false | Enable Google OAuth login |
| `hasAppleLogin` | boolean | ❌ | false | Enable Apple OAuth login |
| `hasDiscordLogin` | boolean | ❌ | false | Enable Discord OAuth login |
| `hasMagicLinkLogin` | boolean | ❌ | false | Enable magic link authentication |
| `onGoogleLogin` | function | ❌ | - | Callback to initiate Google OAuth flow |
| `onAppleLogin` | function | ❌ | - | Callback to initiate Apple OAuth flow |
| `onDiscordLogin` | function | ❌ | - | Callback to initiate Discord OAuth flow |
| `onMagicLinkLogin` | function | ❌ | - | Callback to send magic link (receives email as parameter) |

## API Request/Response Format

### Email/Password Login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIs...",
  "refresh": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

**Error Response:**
```json
{
  "err": true,
  "data": {
    "message": "Invalid email or password"
  }
}
```

### Token Storage

Tokens are automatically stored in `sessionStorage`:
- **Access Token**: `kcatoken`
- **Refresh Token**: `kcrtoken`

**⚠️ Security Note**: For production applications, consider using HTTP-only cookies instead of sessionStorage to protect against XSS attacks.

## Authentication Flow

### Email/Password Login

1. User enters email and password
2. Form validates required fields and email format
3. User clicks "Sign In"
4. Loading notification appears
5. Component sends POST request to `loginApi`
6. On success:
   - Tokens are stored in sessionStorage
   - Success callback is fired
   - Success notification displays
   - Page redirects after 1 second
7. On error:
   - Error notification displays with message
   - Error callback is fired

### Magic Link Login

1. User clicks "✨ Magic Link" button
2. User enters their email
3. User clicks "Send Magic Link"
4. Loading notification appears
5. Component calls `onMagicLinkLogin` callback with email
6. On success:
   - Success notification displays
   - Form is cleared
   - User sees message to check email
7. On error:
   - Error notification displays

### Social OAuth Login

1. User clicks provider button (Google, Apple, or Discord)
2. `onXxxLogin` callback is triggered
3. Your callback should handle OAuth flow (redirect to OAuth provider)

## Form Validation

The sign-in form includes built-in validation:

### Email Field
- ✅ Required
- ✅ Must be valid email format
- ✅ Validates on change and blur

### Password Field
- ✅ Required
- ✅ Validates on change and blur

Validation errors appear below each field automatically.

## Customization Examples

### Custom Success Handling

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  onSuccess={(data) => {
    // Custom logic before redirect
    console.log("User logged in:", data.user.email);
    // Update global state, analytics, etc.
    store.setUser(data.user);
    mixpanel.track("User Logged In", { email: data.user.email });
  }}
/>
```

### Custom Error Handling

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  onError={(error) => {
    // Handle specific error types
    if (error.response?.status === 401) {
      console.error("Invalid credentials");
    } else if (error.response?.status === 429) {
      console.error("Too many login attempts. Please try again later.");
    }
  }}
/>
```

### Forgot Password Navigation

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  onForgotPassword={() => {
    // Custom navigation logic
    router.push("/auth/reset-password");
  }}
/>
```

### Social Logins Integration

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  hasGoogleLogin={true}
  hasAppleLogin={true}
  hasDiscordLogin={true}
  onGoogleLogin={() => {
    // Use a library like @react-oauth/google
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  }}
  onAppleLogin={() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/apple`;
  }}
  onDiscordLogin={() => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/discord`;
  }}
/>
```

### Magic Link Integration

```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
  hasMagicLinkLogin={true}
  onMagicLinkLogin={async (email) => {
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send magic link");
    }
  }}
/>
```

## Component Architecture

### Internal Components

**GoogleIcon**
- Renders Google's official SVG logo
- Used in the Google OAuth button

**SignInForm**
- Handles email/password form with validation
- Uses Mantine Form's `useForm` hook for state management
- Hydration-safe rendering for Next.js compatibility
- Includes client-side email validation

**PageSignIn** (Main)
- Main component that orchestrates all authentication flows
- Manages magic link form state
- Handles API calls and notifications
- Manages token storage
- Renders conditional UI based on auth method

## Form Validation Details

### Email Validation
```typescript
// Regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Checks:
// - At least one character before @
// - @ symbol present
// - At least one character after @ before dot
// - Dot and domain extension present

// Valid: user@example.com ✅
// Invalid: user@.com ❌
// Invalid: user.com ❌
```

⚠️ **Note**: Client-side validation is for UX only. Always implement server-side validation for security.

## Error Messages

The component displays user-friendly error messages:

| Scenario | Message |
|----------|---------|
| Empty email | "Email is required" |
| Invalid email format | "Please enter a valid email address" |
| Empty password | "Password is required" |
| API returns error | Message from API (fallback: "Invalid email or password") |
| Network error | "An unexpected error occurred. Please try again." |
| Magic link empty email | "Please enter a valid email address." |
| Magic link API error | "Failed to send magic link. Please try again or use another sign-in method." |

## Loading States

When authenticating, all form inputs are disabled and buttons show loading state:

```tsx
// Email/password form inputs: disabled={isLoading}
// Magic link email input: disabled (manual state management)
// All submit buttons: loading={isLoading} disabled={isLoading}
```

## Accessibility

The component includes accessibility features:

- ✅ `aria-label` attributes on all interactive elements
- ✅ Semantic form elements (`<form>`, `<input>`, etc.)
- ✅ Error messages associated with inputs
- ✅ Keyboard navigation support
- ✅ Loading states announced to screen readers

## Performance Considerations

1. **Hydration Safety**: Component uses hydration check to prevent SSR mismatches
2. **Client-side Only**: Form rendering is deferred until client-side hydration
3. **Token Storage**: Uses fast sessionStorage access
4. **Minimal Re-renders**: Mantine Form optimizes field re-renders

## Security Considerations

### Token Storage
- ⚠️ **Current**: Tokens stored in `sessionStorage` (vulnerable to XSS)
- 🔒 **Recommended**: Use HTTP-only cookies instead

### Password Validation
- ⚠️ Client-side validation is for UX only
- 🔒 Always implement password requirements on server-side
- 🔒 Use HTTPS in production
- 🔒 Implement rate limiting on login API

### Email Validation
- Basic regex validation for user experience
- Server-side validation is required for security

## Common Issues & Solutions

### Issue: Form doesn't show after page load
**Solution**: This is expected due to hydration-safe rendering. Placeholder form shows on server, real form appears after client hydration.

### Issue: Tokens not persisting
**Solution**: Tokens are stored in sessionStorage (cleared on browser close). For persistent login, use refresh tokens and HTTP-only cookies.

### Issue: Magic link not working
**Solution**: Ensure `onMagicLinkLogin` callback properly handles the async API call and returns a Promise.

### Issue: Social login redirects not working
**Solution**: Verify OAuth endpoints are correctly configured and `onXxxLogin` callbacks properly redirect to OAuth providers.

## Testing

### Unit Testing Example
```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PageSignIn } from "@settle/admin";

test("renders login form", () => {
  render(
    <PageSignIn
      loginApi="/api/auth/login"
      successRedirectUrl="/dashboard"
      forgotRedirectUrl="/forgot-password"
    />
  );

  expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
  expect(screen.getByRole("textbox", { name: /password/i })).toBeInTheDocument();
});

test("shows email validation error", async () => {
  render(
    <PageSignIn
      loginApi="/api/auth/login"
      successRedirectUrl="/dashboard"
      forgotRedirectUrl="/forgot-password"
    />
  );

  const submitButton = screen.getByRole("button", { name: /sign in/i });
  fireEvent.click(submitButton);

  expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
});
```

## Examples

### Next.js App Router (with API Route)

```tsx
// app/auth/signin/page.tsx
"use client";

import { PageSignIn } from "@settle/admin";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <PageSignIn
      loginApi="/api/auth/login"
      successRedirectUrl="/dashboard"
      forgotRedirectUrl="/auth/forgot-password"
      hasGoogleLogin={true}
      onGoogleLogin={() => {
        router.push("/api/auth/google");
      }}
      onForgotPassword={() => {
        router.push("/auth/forgot-password");
      }}
      onSuccess={(data) => {
        // Optional: Store additional user data
        localStorage.setItem("userName", data.user.name);
      }}
      onError={(error) => {
        console.error("Login error:", error);
      }}
    />
  );
}
```

## Migration Guide

### From Custom Form to PageSignIn

**Before:**
```tsx
// Your custom sign-in form with manual state management
function CustomSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ... 50+ lines of custom code
}
```

**After:**
```tsx
<PageSignIn
  loginApi="/api/auth/login"
  successRedirectUrl="/dashboard"
  forgotRedirectUrl="/forgot-password"
/>
```

Just 6 lines instead of 50+! The component handles everything automatically.

## Support & Troubleshooting

For issues or questions:
1. Check the [component source code](./index.tsx) comments
2. Review [type definitions](./PageSignIn.type.ts)
3. Check API response format matches expected structure
4. Verify all required props are provided
