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
  GraphIcon,
} from "@phosphor-icons/react";
import { PropAdminNavItems } from "@settle/admin";

export const navItems: PropAdminNavItems[] = [
  // General Group
  {
    label: "General",
    icon: HouseIcon,
    description: "Overview",
    children: [
      {
        label: "Map View",
        icon: MapTrifoldIcon,
        value: "/admin/home",
      },
      {
        label: "Reporting",
        icon: GraphIcon,
        value: "/admin/stat",
      },
    ],
  },

  {
    divider: true,
  },

  // Configuration Group
  {
    label: "Configuration",
    icon: GearIcon,
    description: "System Configuration",
    color: "blue",
    children: [
      // Auth Section
      {
        divider: true,
        dividerLabel: "Auth",
      },
      {
        label: "Users",
        icon: UsersIcon,
        value: "/admin/config/auth/users",
      },
      {
        label: "Roles",
        icon: ShieldIcon,
        value: "/admin/config/auth/roles",
      },

      // Location - Geo Section
      {
        divider: true,
        dividerLabel: "Location / Geo",
      },
      {
        label: "Geo Unit Types",
        icon: MapTrifoldIcon,
        value: "/admin/config/location/geo-unit-types",
      },
      {
        label: "Geo Units",
        icon: MapPinIcon,
        value: "/admin/config/location/geo-units",
      },
      {
        label: "Geo Unit Names",
        icon: TranslateIcon,
        value: "/admin/config/location/geo-unit-names",
      },
      {
        label: "Geo Unit Geometries",
        icon: PolygonIcon,
        value: "/admin/config/location/geo-unit-geometries",
      },

      // Location - Places Section
      {
        divider: true,
        dividerLabel: "Location / Places",
      },
      {
        label: "Place Types",
        icon: MapPinIcon,
        value: "/admin/config/location/place-types",
      },
      {
        label: "Places",
        icon: MapPinIcon,
        value: "/admin/config/location/places",
      },

      // Location - Metrics Section
      {
        divider: true,
        dividerLabel: "Location / Metrics",
      },
      {
        label: "Metrics",
        icon: ChartBarIcon,
        value: "/admin/config/location/metrics",
      },
      {
        label: "Metric Values",
        icon: ChartLineUpIcon,
        value: "/admin/config/location/geo-unit-metric-values",
      },
    ],
  },
];
