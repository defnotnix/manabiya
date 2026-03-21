"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@mantine/core";
import type { PropAdminNavSideNav } from "../../AdminShell.type";

const AdminShellNavbarDynamic = dynamic(
  () => import("./index").then((mod) => ({ default: mod.AdminShellNavbar })),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "1rem", width: "fit-content" }}>
        <Skeleton height={40} width={40} radius="sm" />
      </div>
    ),
  },
);

export function AdminShellNavbarWrapper(props: PropAdminNavSideNav) {
  return <AdminShellNavbarDynamic {...props} />;
}
