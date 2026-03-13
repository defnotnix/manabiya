"use client";

import { navItems } from "@/config/nav";
import { ActionIcon, Menu, Text } from "@mantine/core";
import { PlusIcon } from "@phosphor-icons/react";
import { AdminShell, AutoBreadcrumb } from "@settle/admin";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { DocContextProvider } from "@/context/DocumentContext";

export function LayoutAdmin({ children }: PropsWithChildren) {
  const Pathname = usePathname();

  return (
    <DocContextProvider>
      <AdminShell
        navItems={navItems}
        asideProps={
          {
            width: 400,
            breakpoint: "xs"
          }
        }
      >
        {/* <AutoBreadcrumb hidden={["/admin", "/admin/docs"]} /> */}
        {children}


      <Menu withArrow>
        <Menu.Target>
          <ActionIcon size="lg" pos="fixed" bottom={16} right={16}>
            <PlusIcon weight="bold" color="white" />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>
            New Records
          </Menu.Label>
          <Menu.Item leftSection={<PlusIcon />}>
            <Text size="xs" fw={800}>
              New Student
            </Text>
          </Menu.Item>
          <Menu.Item leftSection={<PlusIcon />}>
            <Text size="xs" fw={800}>
              New Intake
            </Text>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>
            Documents
          </Menu.Label>
          <Menu.Item leftSection={<PlusIcon />}>
            <Text size="xs" fw={800}>
              Student Document
            </Text>
          </Menu.Item>

          <Menu.Item leftSection={<PlusIcon />}>
            <Text size="xs" fw={800}>
              Custom Documents
            </Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

    </AdminShell>
    </DocContextProvider>
  );
}
