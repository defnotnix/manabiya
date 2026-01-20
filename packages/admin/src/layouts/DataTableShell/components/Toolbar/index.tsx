"use client";

import { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Divider,
  Group,
  Popover,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  CaretDownIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";

import { useDebouncedValue } from "@mantine/hooks";
import { Tabs } from "@settle/admin";
import { DataTableWrapper } from "@settle/core";
import { PropDataTableToolbar } from "../../DataTableShell.type";
import { DataTableShellFilter } from "../TableFilters";
import { DataTableShellSearchFilters } from "../SearchFilters";

export function DataTableShellToolbar({
  moduleInfo,
  tabs,
  activeTab,
  onTabChange,
  filterList,
  hideFilters,
  customColumns,
  onToggleColumn,
  onResetColumns,
}: PropDataTableToolbar) {
  // * CONTEXT

  const { setSearch } = DataTableWrapper.useDataTableWrapperStore();

  // * STATE

  const [svalue, setSValue] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(svalue, 200);

  // * EFFECT

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  // * FUNCTIONS

  return (
    <>
      <Group gap="xs" justify="space-between" h={40}>
        {tabs.length > 0 ? (
          <Tabs tabs={tabs} active={activeTab} onTabChange={onTabChange} />
        ) : (
          <Button variant="light" size="xs">
            All {moduleInfo.name}
          </Button>
        )}

        <Group gap={4}>
          <DataTableShellFilter filterList={filterList} />

          {/* Search */}
          <div suppressHydrationWarning>
            <TextInput
              miw={300}
              leftSection={<MagnifyingGlassIcon />}
              //  rightSection={<Loader size={12}/>}
              size="xs"
              placeholder="Search ..."
              value={svalue}
              onChange={(e) => setSValue(e.target.value)}
            />
          </div>

          <div suppressHydrationWarning>
            <Popover withArrow shadow="md">
              <Popover.Target>
                <Button
                  color="dark"
                  variant="white"
                  style={{
                    border: "1px solid var(--mantine-color-gray-3)",
                  }}
                  size="xs"
                  leftSection={<GearSixIcon />}
                  rightSection={<CaretDownIcon />}
                >
                  Columns
                </Button>
              </Popover.Target>
              <Popover.Dropdown p={0} w={200}>
                <Stack gap={0}>
                  <Text px="sm" py="xs" size="xs" opacity={0.5}>
                    Select columns to view
                  </Text>

                  <Divider />

                  {customColumns.map((column: any, index: number) => {
                    const checked = column.visible;

                    return (
                      <Button
                        c="dark.9"
                        justify="left"
                        radius={0}
                        variant="subtle"
                        key={column.accessor ?? index}
                        size="xs"
                        leftSection={<Checkbox checked={checked} size="xs" />}
                        onClick={() => onToggleColumn(index)}
                      >
                        {column.title}
                      </Button>
                    );
                  })}

                  <Divider />

                  <Button
                    size="xs"
                    variant="subtle"
                    justify="left"
                    leftSection={<XIcon weight="bold" />}
                    styles={{
                      label: {
                        paddingLeft: 4,
                      },
                    }}
                    onClick={onResetColumns}
                  >
                    Reset to default.
                  </Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>
          </div>
        </Group>
      </Group>
    </>
  );
}
