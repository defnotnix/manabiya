import {
  Avatar,
  Box,
  Group,
  Indicator,
  Menu,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import {
  BellSlashIcon,
  CircleIcon,
  GearIcon,
  MoonIcon,
  PlanetIcon,
  QuestionIcon,
  SignOutIcon,
  SunIcon,
} from "@phosphor-icons/react";

export function UserInfoPopover() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Menu shadow="md" position="right-end" withArrow offset={8}>
      <Menu.Target>
        <Box style={{ cursor: "pointer" }}>
          <Indicator position="bottom-end" withBorder size={8} offset={2}>
            <Avatar
              radius="md"
              variant="filled"
              name="Kevin Dukkon"
              color="orange"
              size="sm"
            />
          </Indicator>
        </Box>
      </Menu.Target>

      <Menu.Dropdown miw={220}>
        {/* User Info Header */}
        <Menu.Item closeMenuOnClick={false} style={{ cursor: "default" }}>
          <Group gap="sm" wrap="nowrap">
            <Avatar
              radius="sm"
              variant="filled"
              name="Kevin Dukkon"
              color="orange"
              size="sm"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="sm" truncate>
                Kevin Dukkon
              </Text>
              <Text size="xs" c="dimmed" truncate>
                kevin@strove.io
              </Text>
            </div>
          </Group>
        </Menu.Item>

        <Menu.Divider />

        {/* Status Section */}
        <Menu.Item
          leftSection={
            <CircleIcon
              size={16}
              weight="fill"
              style={{ color: "var(--mantine-color-yellow-6)" }}
            />
          }
        >
          <Text size="xs">Set yourself as away</Text>
        </Menu.Item>

        {/* Notifications Section */}
        <Menu.Item leftSection={<BellSlashIcon size={16} />}>
          <Text size="xs">Pause Notifications</Text>
        </Menu.Item>

        <Menu.Divider />

        {/* Help Section */}
        <Menu.Item leftSection={<QuestionIcon size={16} />}>
          <Text size="xs">Help</Text>
        </Menu.Item>

        {/* Settings Section */}
        <Menu.Item leftSection={<GearIcon size={16} />}>
          <Text size="xs">Settings</Text>
        </Menu.Item>

        <Menu.Divider />

        {/* Theme Selection */}
        <Menu.Label>
          <Text size="xs">Theme</Text>
        </Menu.Label>

        <Menu.Item
          onClick={() => setColorScheme("light")}
          rightSection={colorScheme === "light" ? "✓" : undefined}
        >
          <Group gap="xs" justify="space-between">
            <Text size="xs">Light</Text>
            <SunIcon size={14} />
          </Group>
        </Menu.Item>

        <Menu.Item
          onClick={() => setColorScheme("dark")}
          rightSection={colorScheme === "dark" ? "✓" : undefined}
        >
          <Group gap="xs" justify="space-between">
            <Text size="xs">Dark</Text>
            <MoonIcon size={14} />
          </Group>
        </Menu.Item>

        <Menu.Item
          onClick={() => setColorScheme("auto")}
          rightSection={colorScheme === "auto" ? "✓" : undefined}
        >
          <Group gap="xs" justify="space-between">
            <Text size="xs">System</Text>
            <PlanetIcon size={14} />
          </Group>
        </Menu.Item>

        <Menu.Divider />

        {/* Sign Out Section */}
        <Menu.Item leftSection={<SignOutIcon size={16} />}>
          <Text size="xs">Sign out</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
