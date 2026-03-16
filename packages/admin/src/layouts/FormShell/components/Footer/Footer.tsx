"use client";

import { Group, Button, Box, CheckIcon, Divider } from "@mantine/core";
import {
  ArrowLeft,
  ArrowRight,
  ArrowRightIcon,
  Check,
  X,
  XIcon,
} from "@phosphor-icons/react";
import { FormWrapper } from "@settle/core";
import { Step } from "../../FormShell.type";

interface FooterProps {
  withStepper?: boolean;
  steps?: (string | Step)[];
  onStepBack?: () => void;
  onStepNext?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function FormShellFooter({
  withStepper = false,
  steps = [],
  onStepBack,
  onStepNext,
  onSubmit,
  onCancel,
  isLoading = false,
}: FooterProps) {
  const formProps = FormWrapper.useFormProps();
  const current = formProps?.current || 0;
  const isLastStep = current + 1 === steps.length;

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    } else if (formProps?.handleSubmit) {
      formProps.handleSubmit();
    }
  };

  const handleStepBack = () => {
    if (onStepBack) {
      onStepBack();
    }
  };

  const handleStepNext = () => {
    if (onStepNext) {
      onStepNext();
    }
  };

  return (
    <Box

      py="md"
      mt="md"
    >
      <Divider mb="md" />
      <Group justify="space-between">
        {/* Left side - Back button for stepper */}
        {withStepper ? (
          <Button
            variant="light"
            leftSection={<ArrowLeft size={16} />}
            onClick={handleStepBack}
            disabled={current === 0 || isLoading}
          >
            Previous Step
          </Button>
        ) : (
          <div />
        )}

        {/* Right side - Cancel, Next/Submit buttons */}
        <Group gap="sm">
          {onCancel && (
            <Button
              size="xs"
              variant="default"
              leftSection={<XIcon size={16} />}
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}

          {withStepper && !isLastStep && (
            <Button
              size="xs"
              rightSection={<ArrowRightIcon size={16} />}
              onClick={handleStepNext}
              loading={isLoading}
            >
              Next Step
            </Button>
          )}

          {(isLastStep || !withStepper) && (
            <Button
              size="xs"
              color="teal"
              leftSection={<CheckIcon size={16} />}
              onClick={handleSubmit}
              type="submit"
              loading={isLoading}
            >
              Submit
            </Button>
          )}
        </Group>
      </Group>
    </Box>
  );
}
