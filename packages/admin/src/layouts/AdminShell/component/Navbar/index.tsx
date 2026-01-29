"use client";

import { ActionIcon, Group, Kbd, NavLink, Paper, Text } from "@mantine/core";
import { spotlight } from "@mantine/spotlight";
import { useMemo } from "react";
import { PropAdminNavItems, PropAdminNavSideNav } from "../../AdminShell.type";
import { NavConfig } from "../../AdminShell.nav.types";
import { NavProvider, useNav } from "../../context/NavContext";
import { migrateLegacyNavItems } from "../../utils/navMigration";
import { NavRail } from "./components/NavRail";
import { NavPanel } from "./components/NavPanel";
import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import classesNavLink from "./Navbar.NavLink.module.css";

function NavPanelContainer() {
  const { activeGroup } = useNav();

  return (
    <Paper
      radius={0}
      h="100%"
      flex={1}
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Group justify="space-between" p="sm">
        <Text size="sm">{activeGroup?.label ?? "Navigation"}</Text>

        <ActionIcon size="sm" variant="light">
          <CaretLeftIcon size={12} weight="bold" />
        </ActionIcon>
      </Group>

      {/* Search - Opens Spotlight */}
      <NavLink
        label="Search"
        leftSection={<MagnifyingGlassIcon weight="fill" size={16} />}
        rightSection={<Kbd size="xs">⌘K</Kbd>}
        onClick={() => spotlight.open()}
        classNames={classesNavLink}
        px="xs"
        py={6}
      />

      <NavPanel />
    </Paper>
  );
}

type AdminShellNavbarProps = PropAdminNavSideNav & {
  navItems?: PropAdminNavItems[];
  navConfig?: NavConfig;
};

export function AdminShellNavbar({
  navItems = [],
  navConfig,
  navModules,
  singleNavLayout = false,
}: AdminShellNavbarProps) {
  // Normalize configuration: Use provided navConfig or migrate legacy items
  const config = useMemo(() => {
    if (navConfig) return navConfig;
    return migrateLegacyNavItems(navItems);
  }, [navConfig, navItems]);

  return (
    <NavProvider config={config} singleNavLayout={singleNavLayout}>
      <Group
        gap={0}
        align="stretch"
        h="100%"
        wrap="nowrap"
        style={{ overflow: "hidden" }}
      >
        {/* Left Rail */}
        <NavRail />

        {/* Right Panel - Hidden in singleNavLayout mode */}
        {!singleNavLayout && <NavPanelContainer />}
      </Group>
    </NavProvider>
  );
}
