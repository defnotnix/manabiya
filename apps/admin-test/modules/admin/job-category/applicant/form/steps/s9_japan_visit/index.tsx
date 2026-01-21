"use client";

import { Button, Stack, Text } from "@mantine/core";

export function StepJapanVisit() {
  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Japan Visit History</b>
          <br />
        </Text>
        <Text size="xs">
          Add your visit history to Japan.
        </Text>
      </div>

      <Text size="sm" c="dimmed">
        Japan visit records will be displayed here. You can add, edit, or
        remove visit records.
      </Text>

      <Button variant="light">
        Add Visit Record
      </Button>
    </Stack>
  );
}
