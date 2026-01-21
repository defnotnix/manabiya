"use client";

import { Button, Stack, Text } from "@mantine/core";
import { FormHandler } from "@settle/core";

export function StepAcademics() {
  const form = FormHandler.useForm();

  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Academics</b>
          <br />
        </Text>
        <Text size="xs">
          Add your academic qualifications and educational history.
        </Text>
      </div>

      <Text size="sm" c="dimmed">
        Academic records will be displayed here. You can add, edit, or remove
        educational records.
      </Text>

      <Button variant="light">
        Add Education Record
      </Button>
    </Stack>
  );
}
