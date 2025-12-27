"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@mantine/core";
import type { PropAdminNavSideNav } from "../../AdminShell.type";

const AdminShellNavbarDynamic = dynamic(
  () => import("./index").then((mod) => ({ default: mod.AdminShellNavbar })),
  {
    ssr: false,
    loading: () => (
      <div style={{ padding: "1rem" }}>
        <Skeleton height={40} mb="lg" />
        <Skeleton height={40} mb="md" />
        <Skeleton height={40} mb="md" />
        <Skeleton height={40} mb="md" />
      </div>
    ),
  }
);

export function AdminShellNavbarWrapper(props: PropAdminNavSideNav) {
  return <AdminShellNavbarDynamic {...props} />;
}
