import {
  GearIcon,
  HouseIcon,
  StorefrontIcon,
  TagIcon,
  TreeViewIcon,
  PackageIcon,
  BoxIcon,
  PuzzlePieceIcon,
  ListBulletsIcon,
  LockKeyIcon,
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
        label: "Home",
        icon: HouseIcon,
        value: "/dealer/home",
      },
    ],
  },

  // Dealer Management Group
  {
    label: "Dealer Management",
    icon: StorefrontIcon,
    children: [
      {
        label: "Dealers",
        icon: StorefrontIcon,
        value: "/dealer/dealer",
      },
      {
        label: "Offers",
        icon: TagIcon,
        value: "/dealer/dealer-offer",
      },
    ],
  },

  // Catalog Group
  {
    label: "Catalog",
    icon: TreeViewIcon,
    children: [
      {
        label: "Catalog Nodes",
        icon: TreeViewIcon,
        value: "/dealer/catalog",
      },
      {
        label: "Products",
        icon: PackageIcon,
        value: "/dealer/product",
      },
      {
        label: "Packages",
        icon: BoxIcon,
        value: "/dealer/package",
      },
      {
        label: "Components",
        icon: PuzzlePieceIcon,
        value: "/dealer/package-component",
      },
      {
        label: "Listings",
        icon: ListBulletsIcon,
        value: "/dealer/catalog-listing",
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
      {
        label: "Users",
        icon: LockKeyIcon,
        value: "/dealer/config/auth/users",
      },
      {
        label: "Roles",
        icon: LockKeyIcon,
        value: "/dealer/config/auth/roles",
      },
    ],
  },
];
