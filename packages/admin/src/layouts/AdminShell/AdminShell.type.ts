import { JSX, ReactNode } from "react";
import { Icon } from "@phosphor-icons/react";
import { MantineColor, TreeNodeData } from "@mantine/core";

type PropAdminNavItems = {
  label: string;
  value?: string;
  divider?: boolean;
  roles?: string[];
  icon?: Icon;
  children?: PropAdminNavItems[];
};

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
  onLogout?: () => void;
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
};

export type PropAdminNavLayout = PropAdminNavStyles &
  PropAdminNavGeneral &
  PropAdminNavSideNav;
export type { PropAdminNavItems, PropAdminNavSideNav, PropAdminNavModule };
