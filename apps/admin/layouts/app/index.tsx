"use client";

import { PropsWithChildren, useState, useEffect } from "react";
import { MantineProvider, Loader, Center } from "@mantine/core";
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
import { UserContextProvider } from "@/context/UserContext";

export function LayoutApp({ children }: PropsWithChildren) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContextProvider>
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
        <MantineProvider theme={configThemeMantine} forceColorScheme="dark">
          <ModalsProvider>
            <Notifications />

            {!isLoaded ? (
              <Center style={{ minHeight: "100vh", backgroundColor: "#1a1b1e" }}>
                <Loader />
              </Center>
            ) : (
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
            )}
          </ModalsProvider>
        </MantineProvider>
      </QueryWrapper>
    </UserContextProvider>
  );
}
