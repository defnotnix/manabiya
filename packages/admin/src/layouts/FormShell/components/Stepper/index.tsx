"use client";

import { Box, Container, Group, Button, Text, Stack } from "@mantine/core";
import { Stepper } from "@settle/admin";
import { FormWrapper } from "@settle/core";
import { PropFormShellStepper } from "../../FormShell.type";

export function FormShellStepper({ steps, currentStep, disabledSteps = [] }: PropFormShellStepper) {
  const { handleStepNext, handleStepBack, isLoading } = FormWrapper.useFormProps();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canGoNext = !disabledSteps.includes(currentStep + 1);
  const canGoBack = !disabledSteps.includes(currentStep - 1);

  return (
    <Box bg="var(--mantine-color-gray-0)" style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }} py="md">
      <Container size="xl">
        <Stack gap="md">
          {/* Stepper */}
          <Stepper active={currentStep} steps={steps.map((label) => ({ label }))} />

          {/* Navigation Buttons */}
          <Group justify="space-between">
            <Button
              variant="light"
              onClick={handleStepBack}
              disabled={isFirstStep || !canGoBack || isLoading}
            >
              Back
            </Button>

            <Text size="sm" opacity={0.7}>
              Step {currentStep + 1} of {steps.length}
            </Text>

            <Button
              onClick={handleStepNext}
              disabled={isLastStep || !canGoNext || isLoading}
              loading={isLoading}
            >
              {isLastStep ? "Complete" : "Next"}
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}
