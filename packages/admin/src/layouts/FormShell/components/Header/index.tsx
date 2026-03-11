"use client";

import {
  Box,
  Container,
  Breadcrumbs,
  Text,
  Stack,
  Group,
  ActionIcon,
  Button,
} from "@mantine/core";
import { PropFormShellHeader } from "../../FormShell.type";
import { ArrowLeftIcon, HouseIcon } from "@phosphor-icons/react";
import { modals } from "@mantine/modals";
import { useRouter } from "next/navigation";

export function FormShellHeader({
  bread,
  moduleInfo,
  title,
}: PropFormShellHeader) {
  const Router = useRouter();

  return (
    <>
      <Box
        bg="var(--mantine-color-gray-0)"
        style={{ borderBottom: "1px solid var(--mantine-color-gray-2)" }}
      >
        <Group pr="lg" h={40} justify="space-between">
          {/* Breadcrumbs */}

          <Group gap="xs" justify="space-between">
            <Button
              h={40}
              radius={0}
              variant="light"
              size="xs"
              leftSection={<ArrowLeftIcon />}
              onClick={() => {
                modals.openConfirmModal({
                  title: <Text size="sm">Continue back?</Text>,
                  withCloseButton: false,
                  children: (
                    <Text size="sm" >
                      All the filled data will be lost. Are you sure you want to continue?
                    </Text>
                  ),
                  confirmProps: { color: 'red', size: "xs" },
                  cancelProps: { size: "xs" },
                  onConfirm: () => Router.back(),
                  labels: { confirm: 'Continue', cancel: "Cancel" },
                  styles: {
                    body: {
                      padding: "var(--mantine-spacing-md)"
                    }
                  }
                })
              }}
            >
              Back
            </Button>
            <Text fw={800} size="xs">
              {title}
            </Text>
            <Text fw={800} size="xs" c="dimmed">
              Description for the page.
            </Text>
          </Group>

          <Text fw={800} size="xs" c="dimmed">
            Please make sure all fields are fielld with proper values.
          </Text>

          {/* Title & Module Info */}
        </Group>
      </Box>
    </>
  );
}
