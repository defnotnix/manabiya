"use client";

import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PinInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { apiDispatch } from "@settle/core";
import { useState } from "react";
import { triggerNotification } from "../../helpers";
import { PageOTPProps } from "./PageOTP.type";

export function PageOTP({
  verifyApi,
  resendApi,
  onSuccess,
  onError,
  otpLength = 6,
  sentTo,
  successRedirectUrl,
  onBack,
}: PageOTPProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== otpLength) return;

    setIsLoading(true);
    triggerNotification.auth.isLoading({
      title: "Verifying Code",
      message: "Please wait while we verify your code...",
    });

    try {
      const response = await apiDispatch.post({
        endpoint: verifyApi || "/api/auth/verify-otp",
        body: { code },
        noAuthorization: true,
      });

      if (response.err) {
        triggerNotification.auth.isError({
          title: "Verification Failed",
          message: response.data?.message || "Invalid code. Please try again.",
        });
        onError?.(response);
      } else {
        triggerNotification.auth.isSuccess({
          title: "Verified!",
          message: "Redirecting...",
        });
        onSuccess?.(response.data);

        if (successRedirectUrl) {
          setTimeout(() => {
            window.location.href = successRedirectUrl;
          }, 1000);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      triggerNotification.auth.isError({
        title: "Verification Failed",
        message: errorMessage,
      });
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Simulate API call or use provided endpoint
      if (resendApi) {
        await apiDispatch.post({
          endpoint: resendApi,
          body: { email: sentTo }, // Assuming email is needed
          noAuthorization: true,
        });
      } else {
        // Mock delay if no API provided
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      
      triggerNotification.auth.isSuccess({
        title: "Code Resent",
        message: "A new code has been sent to your device.",
      });
    } catch (error) {
       triggerNotification.auth.isError({
        title: "Failed to Resend",
        message: "Please try again later.",
      });
    } finally {
      setIsResending(false);
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
            Check your email
          </Title>
          <Text c="dimmed" size="sm" ta="center">
            We sent a verification code to {sentTo || "your email"}.
          </Text>
        </Stack>

        <Paper p={0} bg="transparent">
          <Stack gap="xl" align="center">
             <Group justify="center">
              <PinInput
                length={otpLength}
                size="md"
                placeholder=""
                type="number"
                value={code}
                onChange={setCode}
                disabled={isLoading}
                radius="md"
              />
            </Group>

            <Button
              size="md"
              radius="xl"
              color="black"
              fullWidth
              h={50}
              onClick={handleVerify}
              loading={isLoading}
              disabled={code.length !== otpLength}
            >
              Verify Email
            </Button>
            
            <Stack gap="xs" align="center">
               <Text size="sm" c="dimmed">
                Didn't receive the email?{" "}
                 <Anchor component="button" size="sm" onClick={handleResend} disabled={isResending}>
                  Click to resend
                </Anchor>
               </Text>
               
               {onBack && (
                 <Anchor component="button" size="sm" c="dimmed" onClick={onBack}>
                   &larr; Back to log in
                 </Anchor>
               )}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
