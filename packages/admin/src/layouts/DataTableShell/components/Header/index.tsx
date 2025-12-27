"use client";

import { usePathname } from "next/navigation";
import { Button, ButtonGroup, Group, Menu, Stack, Text } from "@mantine/core";
import {
  ArrowClockwiseIcon,
  CaretDownIcon,
  PlusIcon,
} from "@phosphor-icons/react";

import { DataTableWrapper } from "@settle/core";
import { PropDataTableHeader } from "../../DataTableShell.type";
import { useModalForm } from "../../context/ModalFormContext";

export function DataTableShellHeader({
  moduleInfo,
  newButtonHref,
  sustained = false,
  onNewClick,
}: PropDataTableHeader) {
  // * CONTEXT

  const pathname = usePathname();
  const { refetch } = DataTableWrapper.useDataTableContext();
  const finalHref = newButtonHref || `${pathname}/new`;

  let modalContext: ReturnType<typeof useModalForm> | undefined;
  try {
    modalContext = useModalForm();
  } catch (e) {
    // Modal context not available
    modalContext = undefined;
  }

  // let dataTableModalContext: ReturnType<typeof useDataTableModalShellContext> | undefined;
  // try {
  //   dataTableModalContext = useDataTableModalShellContext();
  // } catch (e) {
  //   // DataTableModalShell context not available
  //   dataTableModalContext = undefined;
  // }

  const handleNewClick = sustained
    ? onNewClick ||
      // dataTableModalContext?.openCreateModal ||
      modalContext?.openModal
    : undefined;

  return (
    <div suppressHydrationWarning>
      <Stack p="md" gap="sm">
        <Group justify="space-between">
          <div>
            <Text size="xl">{moduleInfo.label}</Text>
            <Text size="xs" opacity={0.5}>
              {moduleInfo.description}
            </Text>
          </div>

          <Group gap={4} suppressHydrationWarning>
            <div suppressHydrationWarning>
              <Menu>
                <Menu.Target>
                  <Button
                    rightSection={<CaretDownIcon />}
                    size="xs"
                    variant="subtle"
                    color="dark"
                  >
                    More Actions
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>{/* future actions */}</Menu.Dropdown>
              </Menu>
            </div>

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

            <ButtonGroup>
              {sustained && handleNewClick ? (
                <Button
                  onClick={handleNewClick}
                  size="xs"
                  leftSection={<PlusIcon />}
                >
                  New {moduleInfo.label}
                </Button>
              ) : (
                <Button
                  component="a"
                  href={finalHref}
                  size="xs"
                  leftSection={<PlusIcon />}
                >
                  New {moduleInfo.label}
                </Button>
              )}

              <div suppressHydrationWarning>
                <Menu>
                  <Menu.Target>
                    <Button size="xs" px={8} ml={1}>
                      <CaretDownIcon />
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>{/* future actions */}</Menu.Dropdown>
                </Menu>
              </div>
            </ButtonGroup>
          </Group>
        </Group>
      </Stack>
    </div>
  );
}
