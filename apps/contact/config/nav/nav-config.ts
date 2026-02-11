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
  AddressBookIcon,
  BuildingsIcon,
  UserGearIcon,
  UsersThreeIcon,
  IdentificationCardIcon,
  FlagIcon,
  CheckSquareIcon,
} from "@phosphor-icons/react";
import { NavConfig, NavGroup } from "@settle/admin";


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



// Contacts Module Group
const contactsGroup: NavGroup = {
  id: "contacts",
  label: "Contacts",
  icon: AddressBookIcon,
  color: "green",
  modules: [
    {
      id: "contacts-main",
      label: "Directory",
      items: [
        {
          type: "link",
          label: "Directory (Assignments)",
          href: "/admin/contacts/assignments",
          icon: AddressBookIcon,
        },
        {
          type: "link",
          label: "People",
          href: "/admin/contacts/people",
          icon: UsersThreeIcon,
        },
        {
          type: "link",
          label: "Organizations",
          href: "/admin/contacts/organizations",
          icon: BuildingsIcon,
        },
        {
          type: "link",
          label: "Roles",
          href: "/admin/contacts/roles",
          icon: IdentificationCardIcon,
        },
      ],
    },
  ],
};

// Elections Module Group
const electionsGroup: NavGroup = {
  id: "elections",
  label: "Elections",
  icon: CheckSquareIcon,
  color: "violet",
  modules: [
    {
      id: "elections-main",
      label: "Elections",
      items: [
        {
          type: "link",
          label: "Political Parties",
          href: "/admin/elections/parties",
          icon: FlagIcon,
        },
      ],
    },
  ],
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
    contactsGroup,
    electionsGroup,
    configGroup,
  ],
  settings: {
    searchEnabled: true,
    accordion: true,
  },
};
