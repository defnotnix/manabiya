"use client";

import { navItems } from "@/config/nav";
import { ModuleAdminDocAside } from "@/modules/admin/docs/Aside";
import { DocContextProvider } from "@/modules/admin/docs/context";
import { AdminShell, AutoBreadcrumb } from "@settle/admin";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export function LayoutAdmin({ children }: PropsWithChildren) {
  const Pathname = usePathname();

  return (
    <DocContextProvider>
      <AdminShell
        navItems={navItems}
        aside={Pathname == "/admin/docs" ? <ModuleAdminDocAside /> : null}
        asideProps={
          {
            width: 400,
            breakpoint: "xs"
          }
        }
      >
        {/* <AutoBreadcrumb hidden={["/admin", "/admin/docs"]} /> */}
        {children}
      </AdminShell>
    </DocContextProvider>
  );
}
