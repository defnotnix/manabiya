"use client";

import {
  ActionIcon,
  Box,
  Divider,
  Space,
  Stack,
  Tooltip,
} from "@mantine/core";
import { BowlSteamIcon, GearSixIcon, InfoIcon } from "@phosphor-icons/react";
import { useRouter, usePathname } from "next/navigation";
import { NavRailItem } from "../../../AdminShell.nav.types";
import { useNav } from "../../../context/NavContext";
import { UserInfoPopover } from "./UserInfoPopover";

interface NavRailProps {
  disableSetAway?: boolean;
  disablePauseNotifications?: boolean;
  disableHelp?: boolean;
  disableSettings?: boolean;
  disableTheme?: boolean;
  navIcon?: React.ComponentType<any>;
}

export function NavRail({
  disableSetAway,
  disablePauseNotifications,
  disableHelp,
  disableSettings,
  disableTheme,
  navIcon,
}: NavRailProps = {}) {
  const { config, activeGroupId, setActiveGroupId, singleNavLayout } = useNav();
  const router = useRouter();
  const pathname = usePathname();
  const NavIcon = navIcon;

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
    const Icon = group.icon;

    // Check if this is a direct link (has href but no sub-navigation)
    const isDirectLink = group.href && group.modules.length === 0;

    // Check if active: for direct links or singleNavLayout, check path; otherwise check activeGroupId
    const isActive = (singleNavLayout || isDirectLink)
      ? group.href ? pathname.startsWith(group.href) : false
      : activeGroupId === group.id;

    const handleClick = () => {
      setActiveGroupId(group.id);
      if ((singleNavLayout || isDirectLink) && group.href) {
        router.push(group.href);
      }
    };

    return (
      <Tooltip key={group.id} label={group.label} position="right" withArrow>
        <ActionIcon
          variant={isActive ? "light" : "subtle"}
          color={isActive ? "brand" : "dark"}
          size="md"
          radius="sm"
          onClick={handleClick}
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
      <ActionIcon
        color="brand"

        size="md"
        radius="md"
        onClick={() => router.push("/admin")}
      >
        {NavIcon ? <NavIcon size={16} /> : <BowlSteamIcon size={16} />}
      </ActionIcon>

      <Space h="md" />

      {config.groups.map(renderRailItem)}

      {/* Spacer to push user popover to bottom */}
      <Box style={{ flex: 1 }} />

      {/* User Avatar at bottom */}

      <Stack gap={4}>
        {/* <ActionIcon color="dark" variant="subtle">
          <InfoIcon size={16} weight="bold" />
        </ActionIcon>
        <ActionIcon color="dark" variant="subtle">
          <GearSixIcon size={16} weight="bold" />
        </ActionIcon> */}
        <Divider my={4} />

        <UserInfoPopover
          disableSetAway={disableSetAway}
          disablePauseNotifications={disablePauseNotifications}
          disableHelp={disableHelp}
          disableSettings={disableSettings}
          disableTheme={disableTheme}
        />
      </Stack>
    </Stack>
  );
}
