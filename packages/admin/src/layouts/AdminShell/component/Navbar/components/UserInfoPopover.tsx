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
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface UserInfoPopoverProps {
  disableSetAway?: boolean;
  disablePauseNotifications?: boolean;
  disableHelp?: boolean;
  disableSettings?: boolean;
  disableTheme?: boolean;
}

export function UserInfoPopover({
  disableSetAway = false,
  disablePauseNotifications = false,
  disableHelp = false,
  disableSettings = false,
  disableTheme = false,
}: UserInfoPopoverProps) {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const userContext = useUser();
  const router = useRouter();

  const user = userContext?.user;
  const logout = userContext?.logout;

  // Get user display name
  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.username
    : "User";
  const userEmail = user?.email || "";

  const handleLogout = () => {
    logout?.();
    router.push("/");
  };

  return (
    <Menu shadow="md" position="right-end" withArrow offset={8}>
      <Menu.Target>
        <Box style={{ cursor: "pointer" }}>
          <Indicator position="bottom-end" withBorder size={8} offset={2}>
            <Avatar
              radius="md"
              variant="filled"
              name={displayName}
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
              name={displayName}
              color="orange"
              size="sm"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="sm" truncate>
                {displayName}
              </Text>
              <Text size="xs" c="dimmed" truncate>
                {userEmail}
              </Text>
              {user?.roles && user.roles.length > 0 && (
                <Text size="xs" c="blue" fw={500} truncate>
                  {user.roles[0] === "admin" ? "👤 Administrator" : "👥 Data Entry Staff"}
                </Text>
              )}
            </div>
          </Group>
        </Menu.Item>

        <Menu.Divider />

        {/* Status Section */}
        {!disableSetAway && (
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
        )}

        {/* Notifications Section */}
        {!disablePauseNotifications && (
          <Menu.Item leftSection={<BellSlashIcon size={16} />}>
            <Text size="xs">Pause Notifications</Text>
          </Menu.Item>
        )}

        {(!disableSetAway || !disablePauseNotifications) && <Menu.Divider />}

        {/* Help Section */}
        {!disableHelp && (
          <Menu.Item leftSection={<QuestionIcon size={16} />}>
            <Text size="xs">Help</Text>
          </Menu.Item>
        )}

        {/* Settings Section */}
        {!disableSettings && (
          <Menu.Item leftSection={<GearIcon size={16} />}>
            <Text size="xs">Settings</Text>
          </Menu.Item>
        )}

        <Menu.Divider />

        {/* Theme Selection */}
        {!disableTheme && (
          <>
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
          </>
        )}

        <Menu.Divider />

        {/* Sign Out Section */}
        <Menu.Item
          leftSection={<SignOutIcon size={16} />}
          onClick={handleLogout}
        >
          <Text size="xs">Sign out</Text>
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
