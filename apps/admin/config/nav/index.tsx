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
  FolderPlusIcon,
  FileTextIcon,
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
    value: "/admin/students",
    description: "Student Management",
  },
  {
    label: "Documents",
    icon: FileTextIcon,
    value: "/admin/docs",
    description: "Document Management",
  },
  {
    label: "Custom Documents",
    icon: FolderPlusIcon,
    value: "/admin/customs",
    description: "Custom Documents",
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
