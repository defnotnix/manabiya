"use client";

import {
  Anchor,
  Button,
  Container,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { EnvelopeIcon } from "@phosphor-icons/react";
import { apiDispatch } from "@settle/core";
import { useState } from "react";
import { triggerNotification } from "../../helpers";
import { PageForgotPasswordProps } from "./PageForgotPassword.type";

export function PageForgotPassword({
  resetApi,
  successRedirectUrl,
  onSuccess,
  onError,
  onBack,
}: PageForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;

    setIsLoading(true);
    triggerNotification.auth.isLoading({
      title: "Sending Request",
      message: "Please wait...",
    });

    try {
      const response = await apiDispatch.post({
        endpoint: resetApi || "/api/auth/forgot-password",
        body: { email },
        noAuthorization: true,
      });

      if (response.err) {
        triggerNotification.auth.isError({
          title: "Request Failed",
          message:
            response.data?.message ||
            "Could not send reset link. Please try again.",
        });
        onError?.(response);
      } else {
        triggerNotification.auth.isSuccess({
          title: "Link Sent!",
          message: "Check your email for instructions.",
        });
        setIsSent(true);
        onSuccess?.(response.data);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      triggerNotification.auth.isError({
        title: "Request Failed",
        message: errorMessage,
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      size="xs"
      h="100vh"
      display="flex"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <Stack w="100%" maw={400} gap="xl">
        <Stack gap="xs" align="center">
          <Title order={2} ta="center" fw={900}>
            {isSent ? "Check your email" : "Forgot Password?"}
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            {isSent
              ? `We sent a password reset link to ${email}`
              : "Enter your email address and we'll send you a link to reset your password."}
          </Text>
        </Stack>

        <Paper p={0} bg="transparent">
          {!isSent ? (
            <Stack gap="lg">
              <TextInput
                size="md"
                radius="md"
                placeholder="email@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                disabled={isLoading}
                rightSection={
                  <EnvelopeIcon
                    size={16}
                    weight="duotone"
                    style={{ opacity: 0.5 }}
                  />
                }
              />

              <Button
                size="md"
                radius="xl"
                color="black"
                fullWidth
                h={50}
                onClick={handleSubmit}
                loading={isLoading}
                disabled={!email.trim()}
              >
                Send Reset Link
              </Button>

              <Anchor
                component="button"
                type="button"
                size="sm"
                c="dimmed"
                ta="center"
                 onClick={onBack}
                 style={{ display: "block", width: "100%" }}
              >
                &larr; Back to sign in
              </Anchor>
            </Stack>
          ) : (
            <Stack gap="md">
              <Button
                variant="outline"
                size="md"
                radius="xl"
                color="black"
                fullWidth
                 h={50}
                onClick={() => {
                  if (successRedirectUrl) {
                    window.location.href = successRedirectUrl;
                   } else if (onBack) {
                    onBack();
                   }
                }}
              >
                Back to Sign In
              </Button>
               <Button
                variant="subtle"
                 size="sm"
                 c="dimmed"
                 onClick={() => setIsSent(false)}
               >
                 Try another email
               </Button>
            </Stack>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
