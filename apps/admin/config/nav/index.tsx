import {
  GearIcon,
  MapPinIcon,
  HouseIcon,
  MapTrifoldIcon,
  GraphIcon,
  UsersThree,
  User,
  AddressBookIcon,
  ListBulletsIcon,
  BuildingsIcon,
  ShieldCheckIcon,
  FlagIcon,
  CheckSquareIcon,
  UsersIcon,
  CalendarIcon,
  KeyIcon,
  HouseSimpleIcon,
} from "@phosphor-icons/react";
import { PropAdminNavItems } from "@settle/admin";

export const navItems: PropAdminNavItems[] = [
  // General Group
  {
    label: "Quick Access",
    icon: HouseSimpleIcon,
    value: "/admin",
    description: "Overview",
  },
  {
    divider: true,
  },
  {
    label: "Students",
    icon: UsersIcon,
    description: "Overview",

  },
  {
    label: "Intakes",
    icon: CalendarIcon,
    description: "Overview",

  },
  {
    divider: true,
  },
  {
    label: "Admin Accounts",
    icon: KeyIcon,
    description: "Overview",

  },




];
