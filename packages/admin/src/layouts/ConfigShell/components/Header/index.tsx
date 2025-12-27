"use client";

import { Anchor, Breadcrumbs, Button, Group, Stack, Text } from "@mantine/core";
import { ArrowClockwiseIcon, PlusIcon } from "@phosphor-icons/react";

import { DataTableWrapper } from "@settle/core";
import { PropConfigShellHeader } from "../../ConfigShell.type";

export function ConfigShellHeader({
  bread,
  moduleInfo,
}: PropConfigShellHeader) {
  const { refetch } = DataTableWrapper.useDataTableContext();

  return (
    <Stack p="lg" gap="sm">
      <Group justify="space-between">
        <div>
          <Text size="xl">{moduleInfo.label}</Text>
          {moduleInfo.description && (
            <Text size="xs" opacity={0.5}>
              {moduleInfo.description}
            </Text>
          )}
        </div>

        <Group gap={4}>
          <Button
            leftSection={<ArrowClockwiseIcon />}
            size="xs"
            variant="light"
            color="dark"
            onClick={() => {
              refetch();
            }}
          >
            Reload Data
          </Button>
        </Group>
      </Group>
    </Stack>
  );
}
