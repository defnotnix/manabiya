"use client";

//mantine
import { AppShell } from "@mantine/core";
//hooks
import { useDisclosure } from "@mantine/hooks";
import { AdminShellNavbarWrapper } from "./component/Navbar/Navbar.dynamic";
//props
import { PropAdminNavLayout } from "./AdminShell.type";

import "mantine-datatable/styles.css";

export function AdminShell({
  children,
  navItems = [],
  navModules,
  navConfig,
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
      >
        <AppShell.Navbar bg="none">
          <AdminShellNavbarWrapper
            navItems={navItems}
            navModules={navModules}
            navConfig={navConfig}
          />
        </AppShell.Navbar>

        <AppShell.Main bg="none">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
