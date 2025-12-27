"use client";

import { Center, Stack, Text } from "@mantine/core";
import { SmileyNervousIcon } from "@phosphor-icons/react";

export function DataTableEmptyState() {
  return (
    <Center>
      <Stack>
        <Center>
          <SmileyNervousIcon
            size={48}
            weight="duotone"
            color="var(--mantine-color-brand-2)"
          />
        </Center>

        <div>
          <Text size="lg" c="gray.4" ta="center">
            Seems like you have not added any record yet.
          </Text>
          <Text size="xs" c="gray.4" ta="center">
            Start by adding from "New " above
          </Text>
        </div>
      </Stack>
    </Center>
  );
}
