"use client";

import { PropsWithChildren } from "react";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryWrapper } from "@settle/admin";
import { configThemeMantine } from "@/config/theme";
import classes from "./app.module.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";

import "@/public/styles/global.css";
import { PreferenceWrapper, RolePermsWrapper } from "@settle/core";
import cx from "clsx";

export function LayoutApp({ children }: PropsWithChildren) {
  return (
    <QueryWrapper
      apiProvider={process.env.NEXT_PUBLIC_ENDPOINT_URL || ""}
      withCredentials={true}
      timeout={5000}
      queryProps={{
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }}
    >
      <MantineProvider theme={configThemeMantine} defaultColorScheme="light">
        <ModalsProvider>
          <Notifications />

          <RolePermsWrapper defaultPermissions={{}}>
            <div
              className={cx(classes.root, {
                [classes.body]: classes.body,
              })}
              style={{
                minHeight: "100vh",
              }}
            >
              {children}
            </div>
          </RolePermsWrapper>
        </ModalsProvider>
      </MantineProvider>
    </QueryWrapper>
  );
}
