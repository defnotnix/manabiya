"use client";

import { Button, Group, ThemeIcon } from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import { DataTableWrapper } from "@settle/core";

export function DataTableShellSearchFilters() {
  const { filters, removeFilter } = DataTableWrapper.useDataTableWrapperStore();

  if (filters.length <= 0) {
    return null;
  }

  return (
    <Group gap={4} px="lg" pb="sm">
      {filters.map((filter: any, index: number) => {
        return (
          <Button
            key={index}
            variant="light"
            size="xs"
            rightSection={
              <ThemeIcon
                size="sm"
                variant="subtle"
                onClick={() => {
                  removeFilter(index);
                }}
              >
                <XIcon weight="bold" />
              </ThemeIcon>
            }
          >
            {filter.label} : asfdasfasd
          </Button>
        );
      })}
    </Group>
  );
}
