import {
  ChartBarIcon,
  GearIcon,
  MapPinIcon,
  UsersIcon,
  ShieldIcon,
  MapTrifoldIcon,
  TranslateIcon,
  PolygonIcon,
  ChartLineUpIcon,
  HouseIcon,
} from "@phosphor-icons/react";
import { NavConfig, NavGroup } from "@settle/admin";
import { navItems as mainNavItems } from "./navs/main-nav";

// Dashboard / General Group
const mainGroup: NavGroup = {
  id: "general",
  label: "General",
  icon: HouseIcon,
  modules: [
    {
      id: "general-main",
      label: "General",
      items: [
         // Keep existing main nav items (Home, etc.) if needed, or just Dashboard
         // User asked for "just dashboard for my the main module"
         // But maybe keep the standard navItems or just a Dashboard link. 
         // I'll add Dashboard explicitly and then the standard ones if they are generic.
         { 
            type: "link", 
            label: "Dashboard", 
            href: "/admin", 
            icon: ChartBarIcon 
         },
      ]
    }
  ]
};

// Configuration Module Group
const configGroup: NavGroup = {
  id: "config",
  label: "Configuration",
  icon: GearIcon,
  color: "blue", // Arbitrary color
  modules: [
    {
      id: "auth",
      label: "Auth",
      items: [
        {
          type: "link",
          label: "Users",
          href: "/admin/config/auth/users",
          icon: UsersIcon,
        },
        {
          type: "link",
          label: "Roles",
          href: "/admin/config/auth/roles",
          icon: ShieldIcon, // Using Shield for Roles
        },
      ],
    },
    {
      id: "location",
      label: "Location",
      items: [
        {
          type: "link",
          label: "Geo Unit Types",
          href: "/admin/config/location/geo-unit-types",
          icon: MapTrifoldIcon,
        },
        {
          type: "link",
          label: "Geo Units",
          href: "/admin/config/location/geo-units",
          icon: MapPinIcon,
        },
        {
          type: "link",
          label: "Geo Unit Names",
          href: "/admin/config/location/geo-unit-names",
          icon: TranslateIcon,
        },
        {
          type: "link",
          label: "Geo Unit Geometries",
          href: "/admin/config/location/geo-unit-geometries",
          icon: PolygonIcon,
        },
        {
           type: "divider",
           label: "Places"
        },
        {
          type: "link",
          label: "Place Types",
          href: "/admin/config/location/place-types",
          icon: MapPinIcon,
        },
        {
          type: "link",
          label: "Places",
          href: "/admin/config/location/places",
          icon: MapPinIcon,
        },
        {
           type: "divider",
           label: "Metrics"
        },
        {
          type: "link",
          label: "Metrics",
          href: "/admin/config/location/metrics",
          icon: ChartBarIcon,
        },
        {
          type: "link",
          label: "Metric Values",
          href: "/admin/config/location/geo-unit-metric-values",
          icon: ChartLineUpIcon,
        },
      ],
    },
  ],
};

export const navConfig: NavConfig = {
  groups: [
    mainGroup,
    configGroup,
  ],
  settings: {
    searchEnabled: true,
    accordion: true,
  },
};
