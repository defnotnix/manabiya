"use client";

import { getNavItems } from "@/config/nav";
import { ActionIcon, Menu, Text } from "@mantine/core";
import { AdminShell, AutoBreadcrumb } from "@settle/admin";
import { usePathname, useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useMemo, forwardRef } from "react";
import { DocContextProvider } from "@/context/DocumentContext";
import { useUser, useIsAdmin } from "@/context/UserContext";
import logoWhite from "@/assets/logowhite.png";

const LogoComponent = forwardRef<SVGSVGElement, { size?: string | number }>(({ size }, ref) => {
  const numSize = typeof size === "string" ? parseInt(size, 10) : (size || 16);
  return (
    <svg ref={ref} width={numSize} height={numSize} viewBox="0 0 16 16">
      <image href={logoWhite.src} width={numSize} height={numSize} />
    </svg>
  );
});

export function LayoutAdmin({ children }: PropsWithChildren) {
  const Pathname = usePathname();
  const router = useRouter();
  const { fetchCurrentUser } = useUser();
  const isAdmin = useIsAdmin();

  // Fetch user data on mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Get filtered nav items based on user role
  const filteredNavItems = useMemo(() => getNavItems(isAdmin), [isAdmin]);

  return (
    <DocContextProvider>
      <AdminShell
        navItems={filteredNavItems}
        disableNavRightPanel
        disableSetAway={true}
        disablePauseNotifications={true}
        disableHelp={true}
        disableSettings={true}
        disableTheme={true}
        navIcon={LogoComponent}
        asideProps={
          {
            width: 400,
            breakpoint: "xs"
          }
        }
      >
        {/* <AutoBreadcrumb hidden={["/admin", "/admin/docs"]} /> */}
        {children}


        {/* <Menu withArrow>
          <Menu.Target>
            <ActionIcon size="lg" pos="fixed" bottom={16} right={16}>
              <PlusIcon weight="bold" color="white" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>
              New Records
            </Menu.Label>
            <Menu.Item leftSection={<PlusIcon />} onClick={() => router.push("/admin/students/new")}>
              <Text size="xs" fw={800}>
                New Student
              </Text>
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>
              Documents
            </Menu.Label>

            <Menu.Item leftSection={<PlusIcon />} onClick={() => router.push("/admin/docs")}>
              <Text size="xs" fw={800}>
                Custom Documents
              </Text>
            </Menu.Item>

          </Menu.Dropdown>
        </Menu> */}

      </AdminShell>
    </DocContextProvider>
  );
}
