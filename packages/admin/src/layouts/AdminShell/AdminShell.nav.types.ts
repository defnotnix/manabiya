
import { ReactNode } from "react";
import { Icon } from "@phosphor-icons/react";
import { MantineColor } from "@mantine/core";

// --- Types from Architecture ---

export type NavBadge = {
  content?: ReactNode;
  color?: MantineColor;
  variant?: "filled" | "light" | "outline" | "dot";
  size?: "xs" | "sm" | "md";
  visible?: boolean;
  animated?: boolean;
};

// NavElement Union Types

export type NavItemLink = {
  type: "link";
  id?: string;
  label: string;
  href: string;
  icon?: Icon;
  badge?: NavBadge;
  shortcut?: string;
  external?: boolean;
  children?: NavElement[];
  defaultExpanded?: boolean;
  activeMatch?: "exact" | "prefix" | "none";
  roles?: string[];
};

export type NavItemDivider = {
  type: "divider";
  id?: string;
  label?: string; // Optional label for divider section
  margin?: "xs" | "sm" | "md" | "lg";
};

export type NavItemHeader = {
  type: "header";
  id?: string;
  label: string;
  icon?: Icon;
  variant?: "default" | "subtle" | "highlighted";
  roles?: string[];
};

export type NavItemAction = {
  type: "action";
  id?: string;
  label: string;
  icon?: Icon;
  actionId: string; // Identifier for trigger
  badge?: NavBadge;
  roles?: string[];
};

export type NavItemCustom = {
  type: "custom";
  id?: string;
  render: () => ReactNode;
  roles?: string[];
};

export type NavElement =
  | NavItemLink
  | NavItemDivider
  | NavItemHeader
  | NavItemAction
  | NavItemCustom;

// Container Types

export type NavModule = {
  id: string;
  label: string;
  description?: string;
  icon?: Icon;
  color?: MantineColor;
  roles?: string[];
  showHeader?: boolean;
  items: NavElement[];
};

export type NavGroup = {
  type?: "group"; // Optional, defaults to "group"
  id: string;
  label: string;
  description?: string;
  icon: Icon; // Required for the Rail
  color?: MantineColor;
  roles?: string[];
  defaultCollapsed?: boolean;
  order?: number;
  modules: NavModule[];
  href?: string; // Direct navigation link (used when singleNavLayout is true)
};

export type NavRailDivider = {
  type: "divider";
  id?: string;
  margin?: "xs" | "sm" | "md" | "lg";
};

export type NavRailItem = NavGroup | NavRailDivider;

export type NavSettings = {
  searchEnabled?: boolean;
  searchShortcut?: string; // Default: "mod+k"
  accordion?: boolean; // Only one group/module open at a time
  persistState?: boolean; // Save collapsed state to localStorage
  storageKey?: string;
};

export type NavConfig = {
  groups: NavRailItem[]; // Can be NavGroup or NavRailDivider
  standaloneItems?: NavElement[]; // Shown above groups or in specific area
  footerItems?: NavElement[];
  settings?: NavSettings;
};
