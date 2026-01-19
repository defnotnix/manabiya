import { GroupProps } from "@mantine/core";
import { ReactNode } from "react";

export type PropTabsTab = {
  label: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  /** Additional params to merge with existing query params when tab is active */
  params?: Record<string, string | number | boolean>;
  /** Query key override when this tab is active */
  queryKey?: string;
  /** Custom API function to call when this tab is active */
  queryFn?: (queryProps: any) => Promise<any>;
};

export type PropTabs = {
  tabs: PropTabsTab[];
  active?: number;
  onTabChange: (index: number) => void;
} & GroupProps;
