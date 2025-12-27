"use client";

//mantine
import {
  ActionIcon,
  AppShell,
  Breadcrumbs,
  Card,
  Divider,
  Group,
  Paper,
  Text,
} from "@mantine/core";
//hooks
import { useDisclosure } from "@mantine/hooks";
import { AdminShellNavbarWrapper } from "./component/Navbar/Navbar.dynamic";
//props
import { PropAdminNavLayout } from "./AdminShell.type";

import "mantine-datatable/styles.layer.css";
import { AdminShellHeader } from "./component/Header";
import { CaretLeftIcon } from "@phosphor-icons/react";

export function AdminShell({
  children,
  navItems = [],
  navModules,
  essentials,
  softwareInfo,
  onLogout,
}: PropAdminNavLayout) {
  // * STATES

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <AppShell
        navbar={{
          width: 300,
          breakpoint: "sm",
          // collapsed: { mobile: !opened },
        }}
        header={{ height: 50 }}
      >
        <AppShell.Header bg="none">
          <AdminShellHeader navModules={navModules} />
        </AppShell.Header>

        <AppShell.Navbar bg="none">
          <AdminShellNavbarWrapper
            navItems={navItems}
            navModules={navModules}
          />
        </AppShell.Navbar>

        <AppShell.Main bg="none">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
