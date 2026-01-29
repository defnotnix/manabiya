"use client";

import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  AppleLogoIcon,
  DiscordLogoIcon,
  EnvelopeIcon,
  KeyIcon,
  BowlSteamIcon,
} from "@phosphor-icons/react";
import { apiDispatch } from "@settle/core";
import { useState } from "react";
import { triggerNotification } from "../../helpers";
import { PageSignInProps } from "./PageSignIn.type";

/**
 * Storage keys for authentication tokens
 */
const AUTH_TOKEN_KEYS = {
  ACCESS_TOKEN: "kcatoken",
  REFRESH_TOKEN: "kcrtoken",
} as const;

/**
 * GoogleIcon Component
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
 */
function SignInForm({
  onSubmit,
  isLoading,
  onForgotPassword,
}: {
  onSubmit: (email: string, password: string) => void;
  isLoading: boolean;
  onForgotPassword?: () => void;
}) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) => {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return null;
      },
      password: (value: string) => {
        if (!value) return "Password is required";
        return null;
      },
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values.email, values.password);
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          size="md"
          radius="md"
          placeholder="email@example.com"
          type="email"
          required
          {...form.getInputProps("email")}
          disabled={isLoading}
          rightSection={
            <EnvelopeIcon size={16} weight="duotone" style={{ opacity: 0.5 }} />
          }
        />

        <PasswordInput
          size="md"
          radius="md"
          placeholder="Password"
          required
          {...form.getInputProps("password")}
          disabled={isLoading}
          leftSection={
            <KeyIcon size={16} weight="duotone" style={{ opacity: 0.5 }} />
          }
        />

        <Group justify="space-between" my="xs">
          <Text size="xs" c="dimmed">
            No account?{" "}
            <Anchor size="xs" href="/register">
              Sign up
            </Anchor>
          </Text>
          <Anchor
            component="button"
            type="button"
            size="xs"
            c="dimmed"
            onClick={() => onForgotPassword?.()}
          >
            Forgot Password?
          </Anchor>
        </Group>

        <Button
          type="submit"
          loading={isLoading}
          fullWidth
          size="md"
          radius="md"
          color="black"
          h={50}
        >
          Continue
        </Button>
      </Stack>
    </form>
  );
}

/**
 * PageSignIn Component
 */
export function PageSignIn({
  heading = ["Welcome Back!", "to your organize-it-better portal."],
  subheading = "Enter your credentials to access your account.",
  icon,
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
        noAuthorization: true,
      });

      if (response.err) {
        triggerNotification.auth.isError({
          title: "Authentication Failed",
          message:
            response.data?.message ||
            "Invalid email or password. Please try again.",
        });
        onError?.(response);
      } else {
        if (response.data?.access) {
          sessionStorage.setItem(
            AUTH_TOKEN_KEYS.ACCESS_TOKEN,
            response.data.access,
          );
        }
        if (response.data?.refresh) {
          sessionStorage.setItem(
            AUTH_TOKEN_KEYS.REFRESH_TOKEN,
            response.data.refresh,
          );
        }

        onSuccess?.(response.data);

        triggerNotification.auth.isSuccess({
          title: "Sign In Successful!",
          message: "Redirecting to dashboard...",
        });

        setTimeout(() => {
          window.location.href = successRedirectUrl;
        }, 1000);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      triggerNotification.auth.isError({
        title: "Authentication Failed",
        message: errorMessage,
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (
    provider: "google" | "apple" | "discord",
    callback?: () => void,
  ) => {
    callback?.();
  };

  const handleMagicLinkSubmit = async (): Promise<void> => {
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
      await Promise.resolve(onMagicLinkLogin?.(magicLinkEmail));
      triggerNotification.auth.isSuccess({
        title: "Magic Link Sent!",
        message: "Check your email for the sign-in link.",
      });
      setMagicLinkEmail("");
    } catch (error: unknown) {
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

  const hasAnySocial =
    hasGoogleLogin || hasAppleLogin || hasDiscordLogin || hasMagicLinkLogin;

  return (
    <Container
      size="xs"
      h="100vh"
      display="flex"
      style={{ alignItems: "center" }}
    >
      <Paper w="100%" withBorder p={{ base: "xl", lg: "4rem" }} radius="md">
        <Stack gap="md" w="100%">
          <Center>
            {icon || <BowlSteamIcon weight="fill" size={32} />}
          </Center>

          {/* Header */}
          <Stack gap="xs" align="center">
            <Title order={2} ta="center" fw={900} lh="100%">
              {heading[0]}
              <br />
              <span style={{ opacity: 0.5 }}> {heading[1]}</span>
            </Title>
            <Text c="dimmed" size="xs" ta="center" maw={400}>
              {subheading}
            </Text>
          </Stack>

          <Paper p={0} bg="transparent">
            <Stack gap="lg">
              {!showMagicLink ? (
                <>
                  {/* Social OAuth Login Options at Top */}
                  {hasAnySocial && (
                    <SimpleGrid cols={3} spacing="xs">
                      {hasGoogleLogin && (
                        <Button
                          variant="default"
                          size="md"
                          radius="md"
                          leftSection={<GoogleIcon />}
                          onClick={() =>
                            handleSocialLogin("google", onGoogleLogin)
                          }
                          fullWidth
                          styles={{
                            inner: { justifyContent: "center" },
                            label: { fontWeight: 600 },
                          }}
                        >
                          Google
                        </Button>
                      )}
                      {hasAppleLogin && (
                        <Button
                          variant="default"
                          size="md"
                          radius="md"
                          leftSection={
                            <AppleLogoIcon weight="fill" size={20} />
                          }
                          onClick={() =>
                            handleSocialLogin("apple", onAppleLogin)
                          }
                          fullWidth
                        >
                          Apple
                        </Button>
                      )}
                      {hasDiscordLogin && (
                        <Button
                          variant="default"
                          size="md"
                          radius="md"
                          leftSection={
                            <DiscordLogoIcon
                              color="var(--mantine-color-indigo-6)"
                              weight="fill"
                              size={20}
                            />
                          }
                          onClick={() =>
                            handleSocialLogin("discord", onDiscordLogin)
                          }
                          fullWidth
                        >
                          Discord
                        </Button>
                      )}
                      {hasMagicLinkLogin && (
                        <Button
                          variant="light"
                          size="md"
                          radius="md"
                          h={50}
                          onClick={() => setShowMagicLink(true)}
                          fullWidth
                        >
                          Sign in with Magic Link
                        </Button>
                      )}
                    </SimpleGrid>
                  )}

                  <Divider label="or" labelPosition="center" my="xs" />

                  <SignInForm
                    onSubmit={handleSignIn}
                    isLoading={isLoading}
                    onForgotPassword={onForgotPassword}
                  />
                </>
              ) : (
                <Stack gap="md">
                  <Stack gap={0} mb="xs">
                    <Text fw={600} size="lg" ta="center">
                      Magic Link
                    </Text>
                    <Text c="dimmed" size="sm" ta="center">
                      We'll email you a link to sign in instantly.
                    </Text>
                  </Stack>

                  <TextInput
                    size="md"
                    radius="md"
                    label="Email"
                    placeholder="name@example.com"
                    type="email"
                    required
                    value={magicLinkEmail}
                    onChange={(e) => setMagicLinkEmail(e.currentTarget.value)}
                  />

                  <Button
                    size="md"
                    radius="md"
                    color="black"
                    onClick={handleMagicLinkSubmit}
                    disabled={!magicLinkEmail.trim()}
                    fullWidth
                    h={50}
                  >
                    Send Magic Link
                  </Button>

                  <Button
                    variant="subtle"
                    size="sm"
                    radius="md"
                    c="dimmed"
                    onClick={() => {
                      setShowMagicLink(false);
                      setMagicLinkEmail("");
                    }}
                    fullWidth
                  >
                    Back to Sign In
                  </Button>
                </Stack>
              )}
            </Stack>
          </Paper>

          <Text ta="center" size="xs" c="dimmed" mt="auto">
            By signing in, you agree to our{" "}
            <Anchor href="/terms">Terms of Service</Anchor> and{" "}
            <Anchor href="/privacy">Privacy Policy</Anchor>.
            {/* Add logos here if available */}
          </Text>
        </Stack>
      </Paper>
    </Container>
  );
}
