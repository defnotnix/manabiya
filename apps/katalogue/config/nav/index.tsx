import {
  GearIcon,
  MapPinIcon,
  HouseIcon,
  MapTrifoldIcon,
  GraphIcon,
  UsersThree,
  User,
  Package,
  Tag,
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
        label: "Reporting",
        icon: GraphIcon,
        value: "/admin/stat",
      },
      {
        divider: true,
        dividerLabel: "Voting Analysis",
      },
      {
        label: "Catalog Nodes",
        icon: MapTrifoldIcon,
        value: "/admin/catalogue/nodes",
      },
      {
        label: "Products",
        icon: Package,
        value: "/admin/catalogue/products",
      },
      {
        label: "Packages",
        icon: Package,
        value: "/admin/catalogue/packages",
      },
      {
        label: "Offers",
        icon: Tag,
        value: "/admin/catalogue/offers",
      },
    ],
  },
];
