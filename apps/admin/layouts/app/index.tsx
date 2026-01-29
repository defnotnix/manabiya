"use client";

import { PropsWithChildren, useEffect } from "react";
//vfw
import { QueryWrapper, AppWrapper } from "@settle/admin";
//themes
import { configThemeMantine } from "@/config/theme";
//styles
import classes from "./app.module.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";

import "@/public/styles/global.css";
import { PreferenceWrapper, RolePermsWrapper } from "@settle/core";

//oauth

export function LayoutApp({ children }: PropsWithChildren) {
  return (
    <QueryWrapper
      apiProvider={process.env.NEXT_PUBLIC_ENDPOINT_URL || ""}
      withCredentials={false}
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
      <AppWrapper
        theme={configThemeMantine}
        defaultColorScheme={"light"}
        classNames={classes}
        extraHeadTags={
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Stack+Sans+Headline:wght@200..700&family=Stack+Sans+Notch:wght@200..700&family=Stack+Sans+Text:wght@200..700&family=Unbounded:wght@200..900&display=swap"
              rel="stylesheet"
            />
          </>
        }
      >
        {/* // todo - Haven't tested server side cookie fetch */}

        <PreferenceWrapper
          defaults={{}}
          appKey="vsphere"
          userId="1"
          //VersionControl
          version="2.0"
        />

        <RolePermsWrapper defaultPermissions={{}}>
          <div
            style={{
              minHeight: "100vh",
            }}
          >
            {children}
          </div>
        </RolePermsWrapper>
      </AppWrapper>
    </QueryWrapper>
  );
}
