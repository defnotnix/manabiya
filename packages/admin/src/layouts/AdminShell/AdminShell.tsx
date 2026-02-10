"use client";

//mantine
import { ActionIcon, AppShell, Button, Group } from "@mantine/core";
//hooks
import { useDisclosure } from "@mantine/hooks";
import { AdminShellNavbarWrapper } from "./component/Navbar/Navbar.dynamic";
//props
import { PropAdminNavLayout } from "./AdminShell.type";

import "mantine-datatable/styles.css";
import { useCallback, useEffect, useState } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { usePathname } from "next/navigation";

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

  const [opened, { toggle, close }] = useDisclosure();
  const [navbarWidth, setNavbarWidth] = useState(singleNavLayout ? 45 : 300);
  const pathname = usePathname();

  // Close navbar on route change (mobile)
  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleNavbarWidthChange = useCallback((width: number) => {
    setNavbarWidth(width);
  }, []);

  return (
    <>
      <AppShell
        navbar={{
          width: navbarWidth,
          breakpoint: "xs",
          collapsed: { mobile: !opened },
        }}
      >

        <AppShell.Header hiddenFrom="md">
          <Group h={50} justify="space-between" px="md">
            <ActionIcon onClick={() => {
              toggle()
            }}>
              <ArrowRightIcon />
            </ActionIcon>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar bg="none">
          <AdminShellNavbarWrapper
            navItems={navItems}
            navModules={navModules}
            navConfig={navConfig}
            singleNavLayout={singleNavLayout}
            onNavbarWidthChange={handleNavbarWidthChange}
            toggle={toggle}
          />
        </AppShell.Navbar>

        <AppShell.Main style={{
          position: "relative",
          zIndex: 10,
        }} bg="none" pt={{
          base: opened ? 0 : 50,
        }}>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
