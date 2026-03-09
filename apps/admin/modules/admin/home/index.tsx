"use client";

import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Menu,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  ArrowRightIcon,
  CalendarIcon,
  CaretDownIcon,
  CircleIcon,
  MagnifyingGlassIcon,
  Plus,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react";

export function ModuleAdminHome() {
  return (
    <Container size="md">
      <Stack gap={0}>
        <Group justify="center" my="md">
          <Text size="xs" tt="uppercase" fw={900} opacity={0.5}>
            MANABIYA ADMIN
          </Text>
        </Group>

        <Stack gap="md" my="2rem">
          <h1
            style={{
              textAlign: "center",
            }}
          >
            Manabiya quick access
          </h1>

          <Text size="xs" c="dimmed" ta="center">
            You have 1123 Students | 332 Documents | 12 Intakes
          </Text>

          <Autocomplete
            styles={{
              input: {
                fontSize: "var(--mantine-font-size-xs)",
              },
            }}
            size="lg"
            placeholder="Search Student"
            rightSection={<MagnifyingGlassIcon />}
          />

          <Group justify="space-between" gap="xs">
            <Group gap={4}>
              <Button size="sm" variant="light" leftSection={<UsersIcon />}>
                Manage Students
              </Button>
              <Button size="sm" variant="light" leftSection={<CalendarIcon />}>
                Manage Intakes
              </Button>
            </Group>
            <Group gap={4}>
              <Button size="sm" color="dark" leftSection={<PlusIcon />}>
                Student
              </Button>
              <Button size="sm" color="dark" leftSection={<PlusIcon />}>
                Intake
              </Button>

              <Menu>
                <Menu.Target>
                  <Button
                    size="sm"
                    leftSection={<PlusIcon />}
                    rightSection={<CaretDownIcon />}
                  >
                    Custom Document
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
        </Stack>

        <Divider my="xl" label="Active Intakes" />

        <SimpleGrid cols={3}>
          <Paper withBorder>
            <Box p="md">
              <Group justify="space-between">
                <Text size="xs">127 Days</Text>
              </Group>
              <Text size="md" fw={800}>
                April Intake
              </Text>
            </Box>

            <Paper bg="teal.0" p="md" radius={0}>
              <Group justify="space-between">
                <Group gap={8}>
                  <CircleIcon
                    size={8}
                    weight="fill"
                    color="var(--mantine-color-teal-7)"
                  />
                  <Text size="xs">ACTIVE</Text>
                </Group>
                <ArrowRightIcon />
              </Group>
            </Paper>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Container>
  );
}
