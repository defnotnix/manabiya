"use client";

import { Button, Center, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { CheckCircleIcon } from "@phosphor-icons/react";

export function StepCompleted() {
  return (
    <Center>
      <Stack align="center" gap="lg" py={100}>
        <ThemeIcon size={80} radius="50%" color="teal" variant="light">
          <CheckCircleIcon size={50} />
        </ThemeIcon>

        <div style={{ textAlign: "center" }}>
          <Text size="2rem" lh="2.3rem" fw={800}>
            Congratulations!
          </Text>
          <Text size="xs" c="dimmed">
            Your applicant profile has been successfully created.
          </Text>
        </div>

        <Group>
          <Button>View Profile</Button>
          <Button variant="light">Go to Dashboard</Button>
        </Group>
      </Stack>
    </Center>
  );
}
