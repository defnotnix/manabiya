"use client";

import {
  ActionIcon,
  Group,
  Kbd,
  NavLink,
  Paper,
  Text,
  Divider,
} from "@mantine/core";
import { Spotlight, spotlight, SpotlightActionData } from "@mantine/spotlight";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PropAdminNavItems, PropAdminNavSideNav } from "../../AdminShell.type";
import {
  NavConfig,
  NavElement,
  NavGroup,
  NavItemLink,
  NavModule,
  NavRailItem,
} from "../../AdminShell.nav.types";
import { NavProvider, useNav } from "../../context/NavContext";
import { migrateLegacyNavItems } from "../../utils/navMigration";
import { NavRail } from "./components/NavRail";
import { NavPanel } from "./components/NavPanel";
import { CaretLeftIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import classesNavLink from "./Navbar.NavLink.module.css";

function useSpotlightActions(config: NavConfig): SpotlightActionData[] {
  const router = useRouter();

  return useMemo(() => {
    const actions: SpotlightActionData[] = [];

    const processNavElement = (
      element: NavElement,
      groupLabel?: string,
      moduleLabel?: string
    ) => {
      if (element.type === "link") {
        const link = element as NavItemLink;
        const description = [groupLabel, moduleLabel]
          .filter(Boolean)
          .join(" > ");

        actions.push({
          id: link.id || link.href,
          label: link.label,
          description: description || undefined,
          leftSection: link.icon ? <link.icon size={18} /> : undefined,
          keywords: [link.label, groupLabel, moduleLabel].filter(
            Boolean
          ) as string[],
          onClick: () => {
            if (link.external) {
              window.open(link.href, "_blank");
            } else {
              router.push(link.href);
            }
          },
        });

        // Process nested children
        if (link.children) {
          link.children.forEach((child) =>
            processNavElement(child, groupLabel, link.label)
          );
        }
      }
    };

    const processModule = (module: NavModule, groupLabel?: string) => {
      module.items.forEach((item) =>
        processNavElement(item, groupLabel, module.label)
      );
    };

    const processGroup = (group: NavGroup) => {
      // If group has a direct href, add it as an action
      if (group.href) {
        actions.push({
          id: group.id,
          label: group.label,
          description: group.description,
          leftSection: group.icon ? <group.icon size={18} /> : undefined,
          keywords: [group.label],
          onClick: () => router.push(group.href!),
        });
      }

      // Process all modules in the group
      group.modules.forEach((module) => processModule(module, group.label));
    };

    // Process groups
    config.groups.forEach((item: NavRailItem) => {
      if (item.type !== "divider") {
        processGroup(item as NavGroup);
      }
    });

    // Process standalone items
    config.standaloneItems?.forEach((item) => processNavElement(item));

    // Process footer items
    config.footerItems?.forEach((item) => processNavElement(item));

    return actions;
  }, [config, router]);
}

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
      <Divider />
      <NavLink
        label="Search"
        leftSection={<MagnifyingGlassIcon weight="fill" size={16} />}
        rightSection={<Kbd size="xs">⌘K</Kbd>}
        onClick={() => spotlight.open()}
        classNames={classesNavLink}
        px="xs"
        py={6}
      />
      <Divider />

      <NavPanel />
    </Paper>
  );
}

/** Observes nav context and reports effective navbar width back to AdminShell */
function NavWidthObserver({
  onNavbarWidthChange,
  singleNavLayout,
}: {
  onNavbarWidthChange?: (width: number) => void;
  singleNavLayout: boolean;
}) {
  const { activeGroupHasPanel } = useNav();

  useEffect(() => {
    const width = singleNavLayout || !activeGroupHasPanel ? 45 : 300;
    onNavbarWidthChange?.(width);
  }, [activeGroupHasPanel, singleNavLayout, onNavbarWidthChange]);

  return null;
}

type AdminShellNavbarProps = PropAdminNavSideNav & {
  navItems?: PropAdminNavItems[];
  navConfig?: NavConfig;
};

/** Inner component that reads NavContext to conditionally render the panel */
function NavbarContent({
  singleNavLayout,
}: {
  singleNavLayout: boolean;
}) {
  const { activeGroupHasPanel } = useNav();
  const showPanel = !singleNavLayout && activeGroupHasPanel;

  return (
    <Group
      gap={0}
      align="stretch"
      h="100%"
      wrap="nowrap"
      style={{ overflow: "hidden" }}
    >
      {/* Left Rail */}
      <NavRail />

      {/* Right Panel - Hidden when singleNavLayout or active group has no children */}
      {showPanel && <NavPanelContainer />}
    </Group>
  );
}

export function AdminShellNavbar({
  navItems = [],
  navConfig,
  navModules,
  singleNavLayout = false,
  onNavbarWidthChange,
}: AdminShellNavbarProps) {
  // Normalize configuration: Use provided navConfig or migrate legacy items
  const config = useMemo(() => {
    if (navConfig) return navConfig;
    return migrateLegacyNavItems(navItems);
  }, [navConfig, navItems]);

  const spotlightActions = useSpotlightActions(config);

  return (
    <NavProvider config={config} singleNavLayout={singleNavLayout}>
      <NavWidthObserver
        onNavbarWidthChange={onNavbarWidthChange}
        singleNavLayout={singleNavLayout}
      />

      <Spotlight
        actions={spotlightActions}
        nothingFound="No matching pages found"
        highlightQuery
        searchProps={{
          leftSection: <MagnifyingGlassIcon size={20} />,
          placeholder: "Search pages...",
        }}
        shortcut={["mod + K", "mod + P"]}
      />

      <NavbarContent singleNavLayout={singleNavLayout} />
    </NavProvider>
  );
}
