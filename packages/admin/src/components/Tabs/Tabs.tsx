"use client";

import { Group, UnstyledButton } from "@mantine/core";
//style
import cx from "clsx";
import classes from "./Tabs.module.css";
import { PropTabs } from "./Tabs.type";

export function Tabs({ tabs = [], active, onTabChange, ...props }: PropTabs) {
  return (
    <Group gap={0} {...props} className={classes.root}>
      {tabs.map((tabinfo: any, index: number) => {
        return (
          <UnstyledButton
            key={index}
            className={cx(classes.btn, {
              [classes.btn_active]: active === index,
            })}
            onClick={() => {
              if (active !== index) {
                onTabChange(index);
              }
            }}
          >
            <Group gap="xs">
              {tabinfo.leftSection}
              {tabinfo.label}
              {tabinfo.rightSection}
            </Group>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
