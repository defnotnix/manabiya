"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Text,
  Anchor,
  Divider,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AppleLogo, DiscordLogo } from "@phosphor-icons/react";
import { apiDispatch } from "@settle/core";
import { triggerNotification } from "../../helpers";
import { PageSignInProps } from "./PageSignIn.type";

/**
 * Storage keys for authentication tokens
 * NOTE: In production, consider using HTTP-only cookies instead of sessionStorage
 * for better security against XSS attacks. These keys should match backend expectations.
 */
const AUTH_TOKEN_KEYS = {
  ACCESS_TOKEN: "kcatoken",
  REFRESH_TOKEN: "kcrtoken",
} as const;

/**
 * GoogleIcon Component
 *
 * Renders the Google logo as an SVG icon.
 * Used in the Google OAuth sign-in button.
 *
 * @returns SVG element with Google's official colors
 */
function GoogleIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/**
 * SignInForm Component
 *
 * Handles email and password authentication form using Mantine's useForm hook.
 * Features:
 * - Built-in form state management via Mantine Form
 * - Automatic field-level validation
 * - Hydration-safe rendering to prevent SSR mismatches
 *
 * @param onSubmit - Callback fired when form is submitted with valid credentials
 * @param isLoading - Loading state to disable inputs during submission
 */
function SignInForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  /**
   * Initialize form using Mantine Form's useForm hook
   * Provides built-in state management, validation, and error handling
   *
   * Features:
   * - Automatic field value tracking
   * - Validation on change/submit
   * - Error state management
   * - Form reset capability
   */
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      /**
       * Email field validation
       * Checks:
       * 1. Required field
       * 2. Valid email format
       */
      email: (value: string) => {
        if (!value.trim()) {
          return "Email is required";
        }
        // Basic email validation regex
        // For production, consider using a more robust email validation library
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return "Please enter a valid email address";
        }
        return null;
      },
      /**
       * Password field validation
       * Checks: Required field
       */
      password: (value: string) => {
        if (!value) {
          return "Password is required";
        }
        return null;
      },
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  /**
   * Ensures client-side rendering only to avoid hydration mismatch with Mantine's useId hook.
   * Mantine Form uses useId internally, which can cause SSR hydration issues if rendered
   * with different IDs on server vs client. We render a disabled placeholder on initial mount.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Handles form submission.
   * Validates all fields before calling the onSubmit callback.
   * Validation is handled automatically by Mantine Form's validate object.
   */
  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values.email, values.password);
  });

  /**
   * Server-side placeholder rendering.
   * Renders a disabled form during server rendering to prevent hydration mismatches.
   * The actual interactive form is shown only after client-side hydration.
   */
  if (!mounted) {
    return (
      <form>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
            disabled
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            disabled
          />
          <Button type="submit" disabled fullWidth>
            Sign In
          </Button>
        </Stack>
      </form>
    );
  }

  /**
   * Client-side form rendering with full interactivity.
   * Uses Mantine Form's form bindings for state management and validation.
   * All inputs are connected to form state automatically.
   */
  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Email Input Field */}
        <TextInput
          label="Email"
          placeholder="Enter your email"
          type="email"
          required
          {...form.getInputProps("email")}
          disabled={isLoading}
          aria-label="Email address input"
        />

        {/* Password Input Field */}
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          required
          {...form.getInputProps("password")}
          disabled={isLoading}
          aria-label="Password input"
        />

        {/* Submit Button */}
        <Button type="submit" loading={isLoading} disabled={isLoading} fullWidth>
          Sign In
        </Button>
      </Stack>
    </form>
  );
}

/**
 * PageSignIn Component
 *
 * Pre-built sign-in page component with support for:
 * - Email/password authentication
 * - Social OAuth logins (Google, Apple, Discord)
 * - Magic link authentication
 *
 * The component handles UI rendering, form validation, and authentication API calls.
 * Success/error handling and redirects are managed through the provided callbacks.
 */
export function PageSignIn({
  loginApi,
  successRedirectUrl,
  forgotRedirectUrl,
  onSuccess,
  onError,
  onForgotPassword,
  hasGoogleLogin = false,
  hasAppleLogin = false,
  hasDiscordLogin = false,
  hasMagicLinkLogin = false,
  onGoogleLogin,
  onAppleLogin,
  onDiscordLogin,
  onMagicLinkLogin,
}: PageSignInProps) {
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles email/password sign-in flow.
   *
   * Process:
   * 1. Shows loading notification
   * 2. Calls login API with credentials
   * 3. Stores tokens if successful
   * 4. Fires success callback and redirects
   * 5. Shows error notification on failure
   *
   * @param email - User's email address
   * @param password - User's password
   */
  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    triggerNotification.auth.isLoading({
      title: "Processing Authentication",
      message: "Please wait while we authenticate your credentials...",
    });

    try {
      const response = await apiDispatch.post({
        endpoint: loginApi,
        body: { email, password },
      });

      // Handle API error response
      if (response.err) {
        triggerNotification.auth.isError({
          title: "Authentication Failed",
          message:
            response.data?.message ||
            "Invalid email or password. Please try again.",
        });
        onError?.(response);
      } else {
        // Store authentication tokens in sessionStorage
        // NOTE: For security-sensitive applications, prefer HTTP-only cookies
        if (response.data?.access) {
          sessionStorage.setItem(AUTH_TOKEN_KEYS.ACCESS_TOKEN, response.data.access);
        }
        if (response.data?.refresh) {
          sessionStorage.setItem(AUTH_TOKEN_KEYS.REFRESH_TOKEN, response.data.refresh);
        }

        // Fire custom success handler before redirecting
        onSuccess?.(response.data);

        // Show success notification
        triggerNotification.auth.isSuccess({
          title: "Sign In Successful!",
          message: "Redirecting to dashboard...",
        });

        // Redirect after a short delay to allow notification display
        setTimeout(() => {
          window.location.href = successRedirectUrl;
        }, 1000);
      }
    } catch (error: unknown) {
      // Handle unexpected errors (network issues, parsing errors, etc.)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      triggerNotification.auth.isError({
        title: "Authentication Failed",
        message: errorMessage,
      });
      onError?.(error);
    } finally {
      // Always reset loading state, except when redirecting
      setIsLoading(false);
    }
  };

  /**
   * Handles social authentication login initiation.
   *
   * Triggers the provider-specific OAuth flow via the callback.
   * The provider parameter documents which service is being used but isn't
   * strictly needed since each button has its own callback.
   *
   * @param provider - OAuth provider type (google, apple, or discord)
   * @param callback - Callback function to initiate provider's OAuth flow
   */
  const handleSocialLogin = (
    provider: "google" | "apple" | "discord",
    callback?: () => void
  ): void => {
    // Trigger the provider-specific callback
    // The provider name can be used for analytics/logging if needed
    callback?.();
  };

  /**
   * Handles magic link sign-in flow.
   *
   * Process:
   * 1. Validates email format
   * 2. Shows loading notification
   * 3. Calls magic link handler with email
   * 4. Shows success/error notification based on result
   * 5. Clears form on success
   *
   * NOTE: The callback is expected to handle the actual API call.
   * Consider awaiting the callback and catching errors properly.
   */
  const handleMagicLinkSubmit = async (): Promise<void> => {
    // Validate email before submission
    if (!magicLinkEmail.trim()) {
      triggerNotification.auth.isError({
        title: "Invalid Email",
        message: "Please enter a valid email address.",
      });
      return;
    }

    triggerNotification.auth.isLoading({
      title: "Sending Magic Link",
      message: "Please wait while we send a magic link to your email...",
    });

    try {
      // Call the magic link handler
      // If this is an async function, it should be properly awaited
      await Promise.resolve(onMagicLinkLogin?.(magicLinkEmail));

      triggerNotification.auth.isSuccess({
        title: "Magic Link Sent!",
        message: "Check your email for the sign-in link.",
      });
      setMagicLinkEmail("");
    } catch (error: unknown) {
      // Handle magic link submission errors
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Please try again or use another sign-in method.";

      triggerNotification.auth.isError({
        title: "Failed to Send Magic Link",
        message: errorMessage,
      });
    }
  };

  return (
    <Container
      size="sm"
      h="100vh"
      display="flex"
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack w="100%" maw={400} gap="lg">
        {/* Page Header */}
        <Stack gap={0} mb="md">
          <Text component="h1" fw={700} size="xl">
            Sign In
          </Text>
          <Text c="dimmed" size="sm">
            Welcome back! Please sign in to your account
          </Text>
        </Stack>

        {/* Conditional rendering: Show standard auth or magic link form */}
        {!showMagicLink ? (
          <>
            {/* Email/Password Authentication Form */}
            <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />

            {/* Forgot Password Link */}
            <Center>
              <Anchor
                component="button"
                type="button"
                size="sm"
                onClick={() => onForgotPassword?.()}
              >
                Forgot Password?
              </Anchor>
            </Center>

            {/* Social OAuth Login Options */}
            {/* Only render if at least one social login method is enabled */}
            {(hasGoogleLogin ||
              hasAppleLogin ||
              hasDiscordLogin ||
              hasMagicLinkLogin) && (
              <>
                <Divider label="Or continue with" />

                <Stack gap="sm">
                  {/* Social Provider Buttons */}
                  <Group grow>
                    {/* Google OAuth Button */}
                    {hasGoogleLogin && (
                      <Button
                        variant="default"
                        leftSection={<GoogleIcon />}
                        onClick={() =>
                          handleSocialLogin("google", onGoogleLogin)
                        }
                        fullWidth
                      >
                        Google
                      </Button>
                    )}
                    {/* Apple OAuth Button */}
                    {hasAppleLogin && (
                      <Button
                        variant="default"
                        leftSection={<AppleLogo size={20} />}
                        onClick={() => handleSocialLogin("apple", onAppleLogin)}
                        fullWidth
                      >
                        Apple
                      </Button>
                    )}
                    {/* Discord OAuth Button */}
                    {hasDiscordLogin && (
                      <Button
                        variant="default"
                        leftSection={<DiscordLogo size={20} />}
                        onClick={() =>
                          handleSocialLogin("discord", onDiscordLogin)
                        }
                        fullWidth
                      >
                        Discord
                      </Button>
                    )}
                  </Group>

                  {/* Magic Link Button - Alternative authentication method */}
                  {hasMagicLinkLogin && (
                    <Button
                      variant="light"
                      onClick={() => setShowMagicLink(true)}
                      fullWidth
                      aria-label="Sign in with a magic link sent to your email"
                    >
                      ✨ Magic Link
                    </Button>
                  )}
                </Stack>
              </>
            )}
          </>
        ) : (
          /* Magic Link Authentication Form */
          /* Shown when user clicks "Magic Link" button */
          <Stack gap="md">
            {/* Magic Link Form Header */}
            <Stack gap={0}>
              <Text fw={600} size="sm">
                Sign in with Magic Link
              </Text>
              <Text c="dimmed" size="xs">
                Enter your email and we'll send you a sign-in link
              </Text>
            </Stack>

            {/* Email Input for Magic Link */}
            <TextInput
              label="Email"
              placeholder="Enter your email"
              type="email"
              required
              value={magicLinkEmail}
              onChange={(e) => setMagicLinkEmail(e.currentTarget.value)}
              aria-label="Email address for magic link sign-in"
            />

            {/* Action Buttons: Send Magic Link and Back */}
            <Group grow>
              <Button
                onClick={handleMagicLinkSubmit}
                disabled={!magicLinkEmail.trim()}
              >
                Send Magic Link
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setShowMagicLink(false);
                  setMagicLinkEmail("");
                }}
              >
                Back
              </Button>
            </Group>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
