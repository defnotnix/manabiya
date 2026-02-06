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
         { 
            type: "link", 
            label: "Dashboard", 
            href: "/dealer/home", 
            icon: HouseIcon 
         },
      ]
    }
  ]
};

// Dealer Management Group
const dealerGroup: NavGroup = {
  id: "dealer-mgmt",
  label: "Dealer Management",
  icon: StorefrontIcon,
  modules: [
    {
      id: "dealer",
      label: "Dealer",
      items: [
        {
          type: "link",
          label: "Dealers",
          href: "/dealer/dealer",
          icon: StorefrontIcon,
        },
        {
          type: "link",
          label: "Offers",
          href: "/dealer/dealer-offer",
          icon: TagIcon,
        },
      ]
    }
  ]
};

// Catalog Group
const catalogGroup: NavGroup = {
  id: "catalog",
  label: "Catalog",
  icon: TreeViewIcon,
  modules: [
    {
      id: "catalog-mgmt",
      label: "Catalog",
      items: [
        {
          type: "link",
          label: "Catalog Nodes",
          href: "/dealer/catalog",
          icon: TreeViewIcon,
        },
        {
          type: "link",
          label: "Products",
          href: "/dealer/product",
          icon: PackageIcon,
        },
        {
          type: "link",
          label: "Packages",
          href: "/dealer/package",
          icon: BoxIcon,
        },
        {
          type: "link",
          label: "Components",
          href: "/dealer/package-component",
          icon: PuzzlePieceIcon,
        },
        {
          type: "link",
          label: "Listings",
          href: "/dealer/catalog-listing",
          icon: ListBulletsIcon,
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
  color: "blue",
  modules: [
    {
      id: "auth",
      label: "Auth",
      items: [
        {
          type: "link",
          label: "Users",
          href: "/dealer/config/auth/users",
          icon: LockKeyIcon,
        },
        {
          type: "link",
          label: "Roles",
          href: "/dealer/config/auth/roles",
          icon: LockKeyIcon,
        },
      ],
    },
  ],
};

export const navConfig: NavConfig = {
  groups: [
    mainGroup,
    dealerGroup,
    catalogGroup,
    configGroup,
  ],
  settings: {
    searchEnabled: true,
    accordion: true,
  },
};
