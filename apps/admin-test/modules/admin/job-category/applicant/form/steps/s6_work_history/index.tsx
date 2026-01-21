"use client";

import { Button, Stack, Text } from "@mantine/core";

export function StepWorkHistory() {
  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Work History</b>
          <br />
        </Text>
        <Text size="xs">
          Add your work experience and employment history.
        </Text>
      </div>

      <Text size="sm" c="dimmed">
        Work experience records will be displayed here. You can add, edit, or
        remove work records.
      </Text>

      <Button variant="light">
        Add Work Experience
      </Button>
    </Stack>
  );
}
