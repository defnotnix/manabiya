"use client";

import { Button, Stack, Text } from "@mantine/core";

export function StepCertifications() {
  return (
    <Stack gap="md">
      <div>
        <Text size="2rem" lh="2.3rem">
          <b>Certifications & Licenses</b>
          <br />
        </Text>
        <Text size="xs">
          Add your professional certifications and licenses.
        </Text>
      </div>

      <Text size="sm" c="dimmed">
        Certification records will be displayed here. You can add, edit, or
        remove certification records.
      </Text>

      <Button variant="light">
        Add Certification
      </Button>
    </Stack>
  );
}
