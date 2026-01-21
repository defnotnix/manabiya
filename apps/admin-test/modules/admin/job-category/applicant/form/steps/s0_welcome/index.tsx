"use client";

import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { ExclamationMarkIcon as ExclamationMark } from "@phosphor-icons/react";

export function StepWelcome() {
  return (
    <Stack maw={550}>
      <Text size="2rem" lh="2.3rem" fw={800}>
        You are building a new applicant profile. Please enter applicant details
        carefully.
      </Text>
      <Group>
        <ThemeIcon variant="light">
          <ExclamationMark />
        </ThemeIcon>
        <Text size="sm" fw={600} c="brand.6">
          Please <b>READ</b> before you proceed.
        </Text>
      </Group>
      <Text size="xs" fw={600} maw={700}>
        You'll go through a few steps to complete your onboarding process. This
        may take a little time, so make sure you're in a comfortable place
        before you begin.
        <br />
        <br />
        Before you begin, You will need to be prepared with:{" "}
        <b>
          General Details, Medical Details like your Eye Examination,
          Orthodontic Appliances, Academics, Work History, and Official
          Documents (e.g. Citizenship/Passport/License).
        </b>
      </Text>
    </Stack>
  );
}
