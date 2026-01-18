"use client";

import { Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { Step } from "../../layouts/FormShell/FormShell.type";

interface StepperProps {
  steps?: (string | Step)[];
}

function getStepLabel(step: string | Step): string {
  return typeof step === "string" ? step : step.label;
}

function getStepDescription(step: string | Step): string | undefined {
  return typeof step === "string" ? undefined : step.description;
}

export function Stepper({ steps = [] }: StepperProps) {
  return (
    <>
      <SimpleGrid spacing={0} cols={steps.length}>
        {steps.map((step, index) => (
          <Paper bg="none" key={index} px="md">
            <Text fw={600} size="10px" opacity={0.5}>
              STEP {index + 1}
            </Text>

            <Text fw={600} size="xs" mt={4}>
              {getStepLabel(step)}
            </Text>

            {getStepDescription(step) && (
              <Text size="xs" c="dimmed" mt={2}>
                {getStepDescription(step)}
              </Text>
            )}
          </Paper>
        ))}
      </SimpleGrid>
    </>
  );
}
