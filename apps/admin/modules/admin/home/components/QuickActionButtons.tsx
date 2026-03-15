"use client";

import { useRouter } from "next/navigation";
import { Button, Group, Menu, Text } from "@mantine/core";
import {
  CaretDownIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";

export function QuickActionButtons() {
  const router = useRouter();

  return (
    <Group justify="space-between" gap="xs">
      <Group gap={4}>
        <Button
          size="sm"
          variant="light"
          leftSection={<UsersIcon />}
          onClick={() => router.push("/admin/students")}
        >
          Manage Students
        </Button>
      </Group>
      <Group gap={4}>
        <Button
          size="sm"
          color="dark"
          leftSection={<PlusIcon />}
          onClick={() => router.push("/admin/students/new")}
        >
          Student
        </Button>


        <Menu>
          <Menu.Target>
            <Button
              size="sm"
              leftSection={<PlusIcon />}
              rightSection={<CaretDownIcon />}
          
            >
              Document
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<PlusIcon />}>
              <Text size="xs">Student Certificate</Text>
            </Menu.Item>
            <Menu.Item leftSection={<PlusIcon />}>
              <Text size="xs">Student CV</Text>
            </Menu.Item>
            <Menu.Item leftSection={<PlusIcon />}>
              <Text size="xs">Woda Documents</Text>
            </Menu.Item>
            <Menu.Item leftSection={<PlusIcon />}>
              <Text size="xs">Bank Statement</Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
