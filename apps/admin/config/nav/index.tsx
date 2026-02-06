import {
  GearIcon,
  MapPinIcon,
  HouseIcon,
  MapTrifoldIcon,
  GraphIcon,
  UsersThree,
  User,
} from "@phosphor-icons/react";
import { PropAdminNavItems } from "@settle/admin";

export const navItems: PropAdminNavItems[] = [
  // General Group
  {
    label: "Map View",
    icon: MapTrifoldIcon,
    value: "/admin/home",
    description: "Overview",
  },
  {
    label: "General",
    icon: HouseIcon,
    description: "Overview",
    children: [
      {
        label: "Reporting",
        icon: GraphIcon,
        value: "/admin/stat",
      },
      {
        divider: true,
        dividerLabel: "Voting Analysis",
      },
      {
        label: "Entries",
        icon: UsersThree,
        value: "/admin/elections/voter-roll-entries",
      },
      {
        label: "Accounts",
        icon: User,
        value: "/admin/elections/data-entry-accounts",
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

      // Auth Section
      {
        divider: true,
        dividerLabel: "Auth / Access Control",
      },
      {
        label: "Users",
        icon: User,
        value: "/admin/config/auth/users",
      },
      {
        label: "Roles",
        icon: UsersThree,
        value: "/admin/config/auth/roles",
      },
    ],
  },
];
