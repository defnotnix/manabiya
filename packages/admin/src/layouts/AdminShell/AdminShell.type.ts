import { JSX, ReactNode, ComponentType } from "react";
import { Icon } from "@phosphor-icons/react";
import {
  AppShellAsideConfiguration,
  MantineColor,
  TreeNodeData,
} from "@mantine/core";
import { NavConfig } from "./AdminShell.nav.types";

type PropAdminNavItemLink = {
  divider?: false;
  label: string;
  value?: string;
  roles?: string[];
  icon?: Icon;
  children?: PropAdminNavItems[];
  // Module-level properties (for top-level items that represent groups)
  description?: string;
  color?: MantineColor;
};

type PropAdminNavItemDivider = {
  divider: true;
  dividerLabel?: string;
  label?: never;
  value?: never;
  roles?: never;
  icon?: never;
  children?: never;
  description?: never;
  color?: never;
};

type PropAdminNavItems = PropAdminNavItemLink | PropAdminNavItemDivider;

type PropAdminNavModule = {
  icon: Icon;
  label?: string;
  description?: string;
  color?: MantineColor;
};

type PropAdminNavSideNav = {
  softwareInfo?: {
    org?: string;
    module?: string;
    moduleDescription?: string;
  };

  essentials?: JSX.Element;
  navItems?: PropAdminNavItems[];
  navModules?: PropAdminNavModule[];
  navConfig?: NavConfig; // Added new prop
  onLogout?: () => void;
  singleNavLayout?: boolean; // When true, only shows rail with direct href navigation
  onNavbarWidthChange?: (width: number) => void;
  toggle?: () => void;
  // Avatar menu disable options
  disableSetAway?: boolean;
  disablePauseNotifications?: boolean;
  disableHelp?: boolean;
  disableSettings?: boolean;
  disableTheme?: boolean;
  // NavRightPanel disable option
  disableNavRightPanel?: boolean;
  // Navigation icon
  navIcon?: Icon | ComponentType<any>;
};

type PropAdminNavStyles = {
  classNames?: {
    root?: any;
    topnav?: any;
    sidenav?: any;
  };
};

type PropAdminNavGeneral = {
  classNames?: any;
  children: ReactNode;
  aside?: ReactNode;
  asideProps?: AppShellAsideConfiguration;
  navIcon?: Icon;
};

export type PropAdminNavLayout = PropAdminNavStyles &
  PropAdminNavGeneral &
  PropAdminNavSideNav;

export type {
  PropAdminNavItems,
  PropAdminNavItemLink,
  PropAdminNavSideNav,
  PropAdminNavModule,
};
