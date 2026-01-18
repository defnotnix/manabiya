"use client";

import {
  ActionIcon,
  Anchor,
  Avatar,
  Breadcrumbs,
  Card,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import {
  CaretUpDownIcon,
  AvocadoIcon,
  HouseIcon,
  HouseSimpleIcon,
} from "@phosphor-icons/react";
import { usePathname, useRouter } from "next/navigation";
import type { PropAdminNavModule } from "../../AdminShell.type";
import classes from "./Header.module.css";

interface AdminShellHeaderProps {
  navModules?: PropAdminNavModule[];
}

// Helper function to format pathname segments to readable labels
function formatSegmentLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AdminShellHeader({ navModules }: AdminShellHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Generate breadcrumb items from pathname
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbItems = segments.map((segment, index) => ({
    label: formatSegmentLabel(segment),
    href: "/" + segments.slice(0, index + 1).join("/"),
    isLast: index === segments.length - 1,
  }));

  const breadcrumbs = breadcrumbItems.map((item) =>
    item.isLast ? (
      <Text fw={600} key={item.href} size="xs" c="gray.7">
        {item.label}
      </Text>
    ) : (
      <Anchor
        key={item.href}
        href={item.href}
        onClick={(e) => {
          e.preventDefault();
          router.push(item.href);
        }}
        size="xs"
        c="gray.6"
        className={classes.breadcrumbLink}
      >
        {item.label}
      </Anchor>
    )
  );

  return (
    <Group gap={0} h={50} wrap="nowrap" style={{ width: "100%" }}>
      {/* Left Section: Logo */}
      <Group
        px="lg"
        h={50}
        gap={4}
        w={300}
        style={{
          borderRight:
            "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-gray-8))",
          flexShrink: 0,
        }}
      >
        <Text fw={900} size="sm" c="brand.6">
          settle
        </Text>
        <Text fw={800} size="sm">
          framework
        </Text>
        <Text fw={800} size="sm" c="dimmed">
          alpha 1.0.1
        </Text>
      </Group>

      {/* Center Section: Breadcrumbs */}
      <Group
        h={50}
        pl="sm"
        justify="space-between"
        gap="md"
        wrap="nowrap"
        style={{ flex: 1, minWidth: 0 }}
      >
        <Text size="xs" fw={800} c="dimmed">
          settle.admin - the framework built to build.
        </Text>

        <Breadcrumbs separatorMargin={8}>
          <HouseSimpleIcon
            color="var(--mantine-color-brand-6)"
            size={12}
            weight="fill"
          />
          {breadcrumbs}
        </Breadcrumbs>

        {/* Right Section: Module Selector */}
        <Card bg="none" radius="md" h={50} className={classes.moduleSelector}>
          <Group wrap="nowrap" justify="space-between" gap="xs">
            <Group gap="xs">
              <Avatar size="xs" variant="filled" color="dark.9">
                <AvocadoIcon weight="fill" />
              </Avatar>
              <div>
                <Text fw={600} size="xs">
                  General Admin
                </Text>
              </div>
            </Group>
            <ActionIcon size="xs" variant="subtle">
              <CaretUpDownIcon />
            </ActionIcon>
          </Group>
        </Card>
      </Group>
    </Group>
  );
}
