"use client";

import { Box, Container, Stack } from "@mantine/core";
import { Stepper } from "@settle/admin";
import { FormWrapper } from "@settle/core";
import { PropFormShellStepper } from "../../FormShell.type";

export function FormShellStepper({
  steps,
  currentStep,
  disabledSteps = [],
}: PropFormShellStepper) {
  const { handleStepNext, handleStepBack, isLoading } =
    FormWrapper.useFormProps();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canGoNext = !disabledSteps.includes(currentStep + 1);
  const canGoBack = !disabledSteps.includes(currentStep - 1);

  const shouldAllowSelectStep = (index: number) => {
    return !disabledSteps.includes(index);
  };

  return (
    <Box
      bg="var(--mantine-color-gray-0)"
      style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
      py="md"
    >
      <Container size="xl">
        <Stack gap="md">
          {/* Stepper with compound component pattern */}
          <Stepper size="xs" active={currentStep}>
            {steps.map((label, index) => (
              <Stepper.Step
                key={index}
                label={label}
                allowStepSelect={shouldAllowSelectStep(index)}
              >
                <></>
              </Stepper.Step>
            ))}
          </Stepper>
        </Stack>
      </Container>
    </Box>
  );
}
