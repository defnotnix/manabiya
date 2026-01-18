# Notification System Usage Guide

## Overview

The `triggerNotification` system provides standardized notification functions for different contexts in your application. It's built on Mantine Notifications and provides:
- **Form notifications** for form submission states
- **List notifications** for data loading states
- **Auth notifications** for authentication flows
- **Consistent styling** across all notification types
- **Icon support** with Phosphor Icons
- **Customizable messages** for all notification types

The notification system is the recommended choice for showing user feedback across form submissions, data operations, and authentication flows.

## Key Features

✅ **Multiple Contexts** - Form, list, and auth notification sub-modules
✅ **Consistent API** - Same interface across all notification types
✅ **Loading States** - Show/update/dismiss pattern
✅ **Success/Error/Warning** - All notification types covered
✅ **Icon Support** - Built-in icons for each notification type
✅ **Customizable** - Override title, message, and other properties
✅ **Mantine Integration** - Built on @mantine/notifications

## Installation & Setup

### Import Mantine Notifications

```tsx
// In your app root (e.g., _app.tsx or layout.tsx)
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <>
      <Notifications />
      {/* Your app content */}
    </>
  );
}
```

### Import triggerNotification

```tsx
import { triggerNotification } from "@settle/admin";

// Access sub-modules:
triggerNotification.form.isLoading({ message: "Submitting..." });
triggerNotification.list.isSuccess({ message: "Data loaded!" });
triggerNotification.auth.isError({ message: "Login failed" });
```

## Notification Sub-Modules

### Form Notifications

For form submission states:

```typescript
triggerNotification.form.isLoading(props)          // Show loading notification
triggerNotification.form.isSuccess(props)          // Update to success
triggerNotification.form.isError(props)            // Update to error
triggerNotification.form.isWarning(props)          // Update to warning
triggerNotification.form.isValidationError(props)  // Validation failed
triggerNotification.form.isValidationStepError(props) // Step validation failed
triggerNotification.form.isInfo(props)             // Info message
```

### List Notifications

For data loading states:

```typescript
triggerNotification.list.isLoading(props)   // Show loading notification
triggerNotification.list.isSuccess(props)   // Update to success
triggerNotification.list.isError(props)     // Update to error
triggerNotification.list.isWarning(props)   // Update to warning
triggerNotification.list.isInfo(props)      // Info message
```

### Auth Notifications

For authentication flows:

```typescript
triggerNotification.auth.isLoading(props)      // Show loading notification
triggerNotification.auth.isSuccess(props)      // Update to success
triggerNotification.auth.isError(props)        // Update to error
triggerNotification.auth.isWarning(props)      // Update to warning
triggerNotification.auth.isInfo(props)         // Info message
triggerNotification.auth.isTokenExpired(props) // Token expiration
```

## Props Reference

All notification functions accept the same props:

```typescript
type propTriggerNotification = {
  title?: string;           // Notification title
  message?: string;         // Notification message
  autoClose?: number | false; // Auto-close after ms (false = no auto-close)
  onClose?: () => void;     // Callback when notification closes
};
```

## Form Notifications

### Basic Usage

```tsx
import { triggerNotification } from "@settle/admin";

// Show loading
triggerNotification.form.isLoading({
  title: "Submitting Form",
  message: "Please wait...",
  autoClose: false,
});

// Update to success
triggerNotification.form.isSuccess({
  title: "Form Submitted",
  message: "Your data has been saved successfully",
});

// Update to error
triggerNotification.form.isError({
  title: "Submission Failed",
  message: "Please try again later",
});
```

### With FormWrapper

```tsx
import { FormWrapper } from "@settle/core";
import { triggerNotification } from "@settle/admin";

<FormWrapper
  formName="user-form"
  initial={{ name: "", email: "" }}
  steps={1}
  validation={[{}]}
  notifications={{
    isLoading: (props) => triggerNotification.form.isLoading(props),
    isSuccess: (props) => triggerNotification.form.isSuccess(props),
    isError: (props) => triggerNotification.form.isError(props),
    isWarning: (props) => triggerNotification.form.isWarning(props),
    isValidationError: (props) => triggerNotification.form.isValidationError(props),
    isValidationStepError: (props) => triggerNotification.form.isValidationStepError(props),
    isInfo: (props) => triggerNotification.form.isInfo(props),
  }}
  apiSubmitFn={submitForm}
>
  <FormContent />
</FormWrapper>
```

### Default Messages

| Function | Default Title | Default Message |
|----------|---------------|-----------------|
| `isLoading` | "Processing!" | "Please wait while we process your request." |
| `isSuccess` | "Success!" | "Request has been processed successfully!" |
| `isError` | "Oh Snap!" | "Unfortunately your request was rejected. Please try again" |
| `isWarning` | "Invalid request!" | "The request is incorrect or invalid." |
| `isValidationError` | "Incomplete or Invalid Fields Detected!" | "Please ensure all fields are completed with accurate information." |
| `isValidationStepError` | "Incomplete or Invalid Fields Detected!" | "Please ensure all fields are completed with accurate information." |
| `isInfo` | "A Quick Note!" | "\<info description missing\>" |

## List Notifications

### Basic Usage

```tsx
import { triggerNotification } from "@settle/admin";

// Show loading
triggerNotification.list.isLoading({
  title: "Loading Data",
  message: "Fetching records...",
  autoClose: false,
});

// Update to success
triggerNotification.list.isSuccess({
  title: "Data Loaded",
  message: "All records loaded successfully",
});

// Update to error
triggerNotification.list.isError({
  title: "Loading Failed",
  message: "Could not fetch records",
});
```

### Default Messages

| Function | Default Title | Default Message |
|----------|---------------|-----------------|
| `isLoading` | "Loading Records" | "Please wait while we grab the records" |
| `isSuccess` | "Records Loaded Successfully!" | "All records have been loaded and are now ready for view." |
| `isError` | "Oh Snap!" | "We're sorry, but we couldn't process your request at this time. Please try again later." |
| `isWarning` | "Request Rejected!" | "The server has rejected your request. Please reach out to the support team for assistance." |
| `isInfo` | "A Quick Note!" | "\<info description missing\>" |

## Auth Notifications

### Basic Usage

```tsx
import { triggerNotification } from "@settle/admin";

// Show loading
triggerNotification.auth.isLoading({
  title: "Authenticating",
  message: "Verifying credentials...",
  autoClose: false,
});

// Update to success
triggerNotification.auth.isSuccess({
  title: "Login Successful",
  message: "Welcome back!",
});

// Update to error
triggerNotification.auth.isError({
  title: "Login Failed",
  message: "Invalid username or password",
});

// Token expired
triggerNotification.auth.isTokenExpired({
  title: "Session Expired",
  message: "Please log in again to continue",
});
```

### Default Messages

| Function | Default Title | Default Message |
|----------|---------------|-----------------|
| `isLoading` | "Processing Authentication" | "Please wait while we process your pass" |
| `isSuccess` | "Authenticated Successfully!" | "You have been successfully authenticated." |
| `isError` | "Authentication Failed!" | "We are" (Note: message appears incomplete in source) |
| `isWarning` | "Authentication Failed!" | "We're sorry, but we couldn't process your request at this time. Please try again later." |
| `isInfo` | "A Quick Note!" | "\<info description missing\>" |
| `isTokenExpired` | "Your Token Has Expired!" | "Your token has expired. Please log in again to continue." |

## Advanced Examples

### Example 1: Form Submission Flow

```tsx
import { triggerNotification } from "@settle/admin";

async function handleSubmit(formData) {
  // Show loading notification
  triggerNotification.form.isLoading({
    title: "Creating User",
    message: "Please wait while we create the user account...",
    autoClose: false,
  });

  try {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const result = await response.json();

    // Show success notification
    triggerNotification.form.isSuccess({
      title: "User Created!",
      message: `User ${result.name} has been created successfully`,
      autoClose: 5000,
    });

    // Navigate or perform other actions
    router.push("/users");
  } catch (error) {
    // Show error notification
    triggerNotification.form.isError({
      title: "Creation Failed",
      message: error.message || "Failed to create user",
      autoClose: 7000,
    });
  }
}
```

### Example 2: Data Loading with Retries

```tsx
import { triggerNotification } from "@settle/admin";

async function loadUsers() {
  triggerNotification.list.isLoading({
    title: "Loading Users",
    message: "Fetching user records...",
    autoClose: false,
  });

  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();

    triggerNotification.list.isSuccess({
      title: "Users Loaded",
      message: `Loaded ${users.length} users successfully`,
      autoClose: 3000,
    });

    return users;
  } catch (error) {
    triggerNotification.list.isError({
      title: "Loading Failed",
      message: "Could not load users. Click to retry.",
      autoClose: false,
      onClose: () => {
        // Retry on close
        loadUsers();
      },
    });
  }
}
```

### Example 3: Authentication Flow

```tsx
import { triggerNotification } from "@settle/admin";

async function handleLogin(credentials) {
  triggerNotification.auth.isLoading({
    title: "Logging In",
    message: "Verifying your credentials...",
    autoClose: false,
  });

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (response.status === 401) {
      triggerNotification.auth.isError({
        title: "Login Failed",
        message: "Invalid username or password",
        autoClose: 5000,
      });
      return;
    }

    if (response.status === 403) {
      triggerNotification.auth.isWarning({
        title: "Account Locked",
        message: "Your account has been temporarily locked. Please contact support.",
        autoClose: false,
      });
      return;
    }

    const result = await response.json();

    triggerNotification.auth.isSuccess({
      title: "Welcome Back!",
      message: `Logged in as ${result.user.name}`,
      autoClose: 3000,
    });

    // Redirect
    router.push("/dashboard");
  } catch (error) {
    triggerNotification.auth.isError({
      title: "Login Error",
      message: "An unexpected error occurred. Please try again.",
      autoClose: 7000,
    });
  }
}
```

### Example 4: Token Expiration Handling

```tsx
import { triggerNotification } from "@settle/admin";

// Intercept API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      triggerNotification.auth.isTokenExpired({
        title: "Session Expired",
        message: "Your session has expired. Redirecting to login...",
        autoClose: 3000,
        onClose: () => {
          router.push("/login");
        },
      });
    }
    return Promise.reject(error);
  }
);
```

### Example 5: Custom Messages and Auto-Close

```tsx
import { triggerNotification } from "@settle/admin";

// Custom message with auto-close
triggerNotification.form.isSuccess({
  title: "Profile Updated",
  message: "Your profile changes have been saved",
  autoClose: 4000, // Close after 4 seconds
});

// No auto-close (requires manual dismiss)
triggerNotification.form.isError({
  title: "Critical Error",
  message: "Please contact support immediately",
  autoClose: false, // Will not auto-close
});

// With onClose callback
triggerNotification.list.isSuccess({
  title: "Import Complete",
  message: "All records imported successfully",
  autoClose: 3000,
  onClose: () => {
    console.log("Notification closed");
    refetchData();
  },
});
```

## Notification Patterns

### Pattern 1: Loading → Success/Error

```tsx
// Start with loading
triggerNotification.form.isLoading({
  title: "Processing",
  autoClose: false,
});

try {
  await performAction();
  // Update to success
  triggerNotification.form.isSuccess({
    title: "Complete",
    message: "Action completed successfully",
  });
} catch (error) {
  // Update to error
  triggerNotification.form.isError({
    title: "Failed",
    message: error.message,
  });
}
```

### Pattern 2: Validation Errors

```tsx
// Show validation error
triggerNotification.form.isValidationError({
  title: "Form Validation Failed",
  message: "Please check the highlighted fields and try again",
});
```

### Pattern 3: Multi-Step Validation

```tsx
// Step validation error
triggerNotification.form.isValidationStepError({
  title: "Step 2 Incomplete",
  message: "Please complete all required fields in this step",
});
```

## TypeScript Usage

```typescript
import { triggerNotification } from "@settle/admin";
import type { propTriggerNotification } from "@settle/admin";

const notificationProps: propTriggerNotification = {
  title: "Custom Title",
  message: "Custom message",
  autoClose: 5000,
  onClose: () => console.log("Closed"),
};

triggerNotification.form.isSuccess(notificationProps);
```

## Best Practices

1. **Use Appropriate Context**: Use `form` for forms, `list` for data, `auth` for authentication
2. **Provide Clear Messages**: Write descriptive titles and messages
3. **Set Auto-Close Wisely**: Use `autoClose: false` for errors requiring user attention
4. **Use Loading States**: Always show loading for async operations
5. **Handle Errors Gracefully**: Show error notifications with helpful messages
6. **Use onClose Callbacks**: Trigger actions when notifications are dismissed
7. **Consistent Wording**: Use consistent language across similar notifications

## Customization

### Override Default Messages

```tsx
// Override default success message
triggerNotification.form.isSuccess({
  message: "Your custom success message",
});

// Override both title and message
triggerNotification.form.isSuccess({
  title: "Custom Title",
  message: "Custom message",
});
```

### Custom Auto-Close Duration

```tsx
// Quick notification (2 seconds)
triggerNotification.form.isSuccess({
  message: "Saved!",
  autoClose: 2000,
});

// Long notification (10 seconds)
triggerNotification.form.isWarning({
  message: "Important warning",
  autoClose: 10000,
});

// No auto-close (manual dismiss only)
triggerNotification.form.isError({
  message: "Critical error",
  autoClose: false,
});
```

## Icons

Each notification type has a built-in icon from Phosphor Icons:

| Notification Type | Icon |
|------------------|------|
| Success | Check |
| Error | ExclamationMark |
| Warning | Warning |
| Info | Info |
| Loading | (Spinner) |

## Troubleshooting

### Issue: Notifications not showing

**Solution**: Ensure Mantine Notifications is set up:

```tsx
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

<Notifications />
```

### Issue: Notifications not updating

**Solution**: The update functions (isSuccess, isError) update the most recently shown notification. If you need to update a specific notification, use Mantine's notification ID system:

```tsx
import { notifications } from "@mantine/notifications";

const id = "my-notification";

notifications.show({
  id,
  title: "Loading",
  message: "Please wait...",
  loading: true,
  autoClose: false,
});

// Later, update it
notifications.update({
  id,
  title: "Success",
  message: "Done!",
  loading: false,
});
```

### Issue: Multiple notifications stacking

**Solution**: This is expected behavior. To prevent stacking, use notification IDs or clean notifications:

```tsx
import { notifications } from "@mantine/notifications";

// Clear all notifications first
notifications.clean();

// Then show new notification
triggerNotification.form.isSuccess({ message: "Done" });
```

## Related Documentation

- [FormWrapper Usage](../../../core/src/wrappers/FormWrapper/USAGE.md) - Form management with notifications
- [Mantine Notifications](https://mantine.dev/others/notifications/) - Underlying notification system
- [Phosphor Icons](https://phosphoricons.com/) - Icon library

---

**Need Help?** Check the [API Reference](../../../../docs/API.md) or [open an issue](https://github.com/your-org/settle/issues).
