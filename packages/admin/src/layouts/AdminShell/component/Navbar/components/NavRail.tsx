"use client";

import {
  ActionIcon,
  Box,
  Divider,
  Space,
  Stack,
  ThemeIcon,
  Tooltip,
} from "@mantine/core";
import { BowlSteamIcon, GearSixIcon, InfoIcon } from "@phosphor-icons/react";
import { NavRailItem } from "../../../AdminShell.nav.types";
import { useNav } from "../../../context/NavContext";
import { UserInfoPopover } from "./UserInfoPopover";

export function NavRail() {
  const { config, activeGroupId, setActiveGroupId } = useNav();

  const renderRailItem = (item: NavRailItem, index: number) => {
    // Handle divider
    if (item.type === "divider") {
      return (
        <Divider
          key={item.id || `divider-${index}`}
          my={item.margin || "xs"}
          w="60%"
        />
      );
    }

    // Handle group (type is optional, defaults to group)
    const group = item;
    const isActive = activeGroupId === group.id;
    const Icon = group.icon;

    return (
      <Tooltip key={group.id} label={group.label} position="right" withArrow>
        <ActionIcon
          variant={isActive ? "light" : "subtle"}
          color={isActive ? "brand" : "dark"}
          size="md"
          radius="sm"
          onClick={() => setActiveGroupId(group.id)}
          aria-label={group.label}
        >
          <Icon weight={isActive ? "fill" : "bold"} size={16} />
        </ActionIcon>
      </Tooltip>
    );
  };

  return (
    <Stack
      w={45}
      h="100%"
      align="center"
      py="xs"
      gap={0}
      className="nav-rail"
      bg="var(--mantine-color-body)"
      style={{
        borderRight: "1px solid var(--mantine-color-default-border)",
        flexShrink: 0,
        zIndex: 101,
      }}
    >
      <ThemeIcon variant="fill" size="md" radius="md">
        <BowlSteamIcon size={16} />
      </ThemeIcon>

      <Space h="md" />

      {config.groups.map(renderRailItem)}

      {/* Spacer to push user popover to bottom */}
      <Box style={{ flex: 1 }} />

      {/* User Avatar at bottom */}

      <Stack gap={4}>
        <ActionIcon color="dark" variant="subtle">
          <InfoIcon size={16} weight="bold" />
        </ActionIcon>
        <ActionIcon color="dark" variant="subtle">
          <GearSixIcon size={16} weight="bold" />
        </ActionIcon>
        <Divider my={4} />

        <UserInfoPopover />
      </Stack>
    </Stack>
  );
}
