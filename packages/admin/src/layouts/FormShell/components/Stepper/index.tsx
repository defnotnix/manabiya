"use client";

import {
  ActionIcon,
  Box,
  Container,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  Timeline,
} from "@mantine/core";

import { FormWrapper } from "@settle/core";
import { PropFormShellStepper } from "../../FormShell.type";
import { CaretUpDownIcon } from "@phosphor-icons/react";

export function FormShellStepper({
  steps,
  currentStep,
  disabledSteps = [],
  onStepChange,
  enableStepClick = false,
  enableStepCompleteClickOnly = false,
  enableStepTracking = false,
  iconActive,
  iconComplete,
  iconIncomplete,
}: PropFormShellStepper) {
  const { handleStepNext, handleStepBack, isLoading } =
    FormWrapper.useFormProps();

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const canGoNext = !disabledSteps.includes(currentStep + 1);
  const canGoBack = !disabledSteps.includes(currentStep - 1);

  const shouldAllowSelectStep = (index: number) => {
    if (!enableStepClick) return false;

    if (enableStepCompleteClickOnly) {
      return index <= currentStep;
    }

    return !disabledSteps.includes(index);
  };

  const getStepLabel = (
    step: string | { label: string; description?: string }
  ) => {
    return typeof step === "string" ? step : step.label;
  };

  const handleStepChange = (index: number) => {
    onStepChange?.(index);
  };

  return (
    <Container size="sm" pt="md">
      <Menu position="right-start" withArrow shadow="lg">
        <Menu.Target>
          <Paper
            withBorder
            bg="brand.0"
            p="xs"
            style={{
              cursor: "pointer",
            }}
          >
            <Group justify="space-between">
              <Text size="xs" fw={800}>
                <span
                  style={{
                    opacity: 0.5,
                  }}
                >
                  {" "}
                  Step {currentStep + 1} of {steps.length} :{" "}
                </span>
                {getStepLabel(steps[currentStep])}
              </Text>

              <Group>
                <Text size="xs" c="brand.6" fw={800}>
                  Next :{" "}
                  {currentStep + 1 < steps.length
                    ? getStepLabel(steps[currentStep + 1])
                    : ""}
                </Text>

                <CaretUpDownIcon />
              </Group>
            </Group>
          </Paper>
        </Menu.Target>
        <Menu.Dropdown>
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const getStepIcon = () => {
              if (isActive) return iconActive;
              if (isCompleted) return iconComplete;
              return iconIncomplete;
            };

            return (
              <Menu.Item
                key={index}
                onClick={() => handleStepChange(index)}
                disabled={!shouldAllowSelectStep(index)}
              >
                <Group gap="xs">
                  {getStepIcon()}
                  <Text
                    size="xs"
                    fw={800}
                    c={
                      enableStepTracking && isCompleted
                        ? "blue"
                        : isActive
                          ? "brand.6"
                          : ""
                    }
                  >
                    {index + 1}. {getStepLabel(step)}
                  </Text>
                </Group>
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Container>
  );
}
