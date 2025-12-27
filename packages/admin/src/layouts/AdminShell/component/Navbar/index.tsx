"use client";

import {
  ActionIcon,
  Badge,
  Highlight,
  Kbd,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  LineVerticalIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";

import { PropAdminNavItems, PropAdminNavSideNav } from "../../AdminShell.type";
import { UserInfoPopover } from "./components/UserInfoPopover";

// styles
import classes from "./Navbar.module.css";
import classesNavLink from "./Navbar.NavLink.module.css";

type IconComponent = ComponentType<{ size?: number; weight?: string }>;

type AdminShellNavbarProps = PropAdminNavSideNav & {
  navItems?: PropAdminNavItems[];
};

type AdminNavbarItemProps = {
  item: PropAdminNavItems;
  isChild?: boolean;
  pathname: string;
  renderNavItems: (items: PropAdminNavItems[], isChild?: boolean) => ReactNode;
  searchQuery?: string;
  shouldShow?: boolean;
};

const AdminNavbarItem = memo(function AdminNavbarItem({
  item,
  isChild = false,
  pathname,
  renderNavItems,
  searchQuery = "",
  shouldShow = true,
}: AdminNavbarItemProps) {
  const Router = useRouter();
  const { hovered, ref } = useHover<HTMLDivElement>();

  const active = item.value ? pathname === item.value : false;
  const isParentActive =
    item.value && !isChild ? pathname.includes(item.value) : active;

  // Check if item matches search query
  const matchesSearch =
    !searchQuery || item.label.toLowerCase().includes(searchQuery);

  // Section label (no link, no value)
  if (!item.value) {
    if (!matchesSearch && !shouldShow) return null;

    return (
      <div
        style={{
          position: "relative",
        }}
      >
        {isChild && <div className={classes.navLabelDot} />}

        <Text
          px="xs"
          pl={isChild ? "36px" : "xs"}
          my="xs"
          opacity={0.3}
          fw={500}
          size="xs"
        >
          {item.label || ""}
        </Text>
      </div>
    );
  }

  const hasChildren = !!item.children && item.children.length > 0;

  // Check if any children match the search
  const hasMatchingChildren =
    hasChildren &&
    item.children!.some((child) => {
      const childMatches = child.label.toLowerCase().includes(searchQuery);
      if (childMatches) return true;
      if (child.children) {
        return child.children.some((grandchild) =>
          grandchild.label.toLowerCase().includes(searchQuery)
        );
      }
      return false;
    });

  // Show item if: no search query, item matches, any children match, or it's active
  const shouldDisplay =
    !searchQuery || matchesSearch || hasMatchingChildren || isParentActive;

  if (!shouldDisplay) return null;

  return (
    <NavLink
      active={isChild ? active : isParentActive}
      onClick={() => {
        if (!item.children) {
          Router.push(item.value || "");
        }
      }}
      label={
        searchQuery && matchesSearch ? (
          <Highlight
            highlight={searchQuery}
            size="xs"
            fw={600}
            component="span"
          >
            {item.label || ""}
          </Highlight>
        ) : (
          item.label || ""
        )
      }
      leftSection={
        isChild ? (
          <LineVerticalIcon
            weight="bold"
            color={
              active || hovered ? "var(--mantine-color-brand-5)" : "transparent"
            }
            size={14}
          />
        ) : (
          item.icon && (
            <item.icon
              color={
                active
                  ? `var(--mantine-color-brand-6)`
                  : "var(--mantine-color-gray-6)"
              }
              weight="fill"
              size={14}
            />
          )
        )
      }
      classNames={classesNavLink}
      childrenOffset={0}
      px="xs"
      py={6}
      styles={{
        root: {
          // parent with active child list shouldn't show the default active bg
          ...(!isChild &&
            isParentActive &&
            hasChildren && {
              background: "none",
              borderColor: "transparent",
            }),
        },
      }}
    >
      {hasChildren && (
        <>
          <div className={classes.navLeftLine} />
          {renderNavItems(item.children!, true)}
        </>
      )}
    </NavLink>
  );
});

export function AdminShellNavbar({
  navItems = [],
  navModules: _navModules, // kept for type compatibility if needed
}: AdminShellNavbarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lowerSearchQuery = searchQuery.toLowerCase();

  const renderNavItems = useCallback(
    (items: PropAdminNavItems[], isChild = false): ReactNode =>
      items.map((item, index) => (
        <AdminNavbarItem
          key={`${item.value || item.label}-${index}`}
          item={item}
          isChild={isChild}
          pathname={pathname}
          renderNavItems={renderNavItems}
          searchQuery={lowerSearchQuery}
        />
      )),
    [pathname, lowerSearchQuery]
  );

  // Handle ⌘+K (or Ctrl+K) keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Stack gap={0} className={classes.navContainer}>
      {/* Top Section */}
      <Paper radius={0} py={4}>
        <TextInput
          ref={searchInputRef}
          variant="unstyled"
          radius={0}
          size="xs"
          placeholder="Navigation Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          leftSection={<MagnifyingGlassIcon />}
          rightSectionWidth={55}
          rightSection={
            searchQuery ? (
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={() => {
                  setSearchQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                <XIcon />
              </ActionIcon>
            ) : (
              <></>
            )
          }
          px="sm"
        />
      </Paper>

      {/* Middle Section with Scrollbar */}
      <ScrollArea py="sm" className={classes.navScrollArea}>
        <Stack px="sm" gap={0} pb="md">
          {renderNavItems(navItems)}
        </Stack>
      </ScrollArea>

      {/* Bottom Section */}
      <Stack gap={0} className={classes.navBottomSection}>
    
        <UserInfoPopover />
      </Stack>
    </Stack>
  );
}
