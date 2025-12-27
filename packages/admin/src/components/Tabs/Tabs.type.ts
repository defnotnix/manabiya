import { GroupProps } from "@mantine/core";
import { ReactNode } from "react";

export type PropTabsTab = {
  label: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
};

export type PropTabs = {
  tabs: PropTabsTab[];
  active?: number;
  onTabChange: (index: number) => void;
} & GroupProps;
