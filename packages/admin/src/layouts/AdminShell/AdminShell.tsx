"use client";

//mantine
import { AppShell } from "@mantine/core";
//hooks
import { useDisclosure } from "@mantine/hooks";
import { AdminShellNavbarWrapper } from "./component/Navbar/Navbar.dynamic";
//props
import { PropAdminNavLayout } from "./AdminShell.type";

import "mantine-datatable/styles.css";
import { useCallback, useState } from "react";

export function AdminShell({
  children,
  navItems = [],
  navModules,
  navConfig,
  essentials,
  softwareInfo,
  onLogout,
  singleNavLayout = false,
}: PropAdminNavLayout) {
  // * STATES

  const [opened, { toggle }] = useDisclosure();
  const [navbarWidth, setNavbarWidth] = useState(singleNavLayout ? 45 : 300);

  const handleNavbarWidthChange = useCallback((width: number) => {
    setNavbarWidth(width);
  }, []);

  return (
    <>
      <AppShell
        navbar={{
          width: navbarWidth,
          breakpoint: "sm",
          // collapsed: { mobile: !opened },
        }}
      >
        <AppShell.Navbar bg="none">
          <AdminShellNavbarWrapper
            navItems={navItems}
            navModules={navModules}
            navConfig={navConfig}
            singleNavLayout={singleNavLayout}
            onNavbarWidthChange={handleNavbarWidthChange}
          />
        </AppShell.Navbar>

        <AppShell.Main bg="none">{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
