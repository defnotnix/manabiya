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
    label: "Custom Documents",
    icon: FolderPlusIcon,
    value: "/admin/customs",
    description: "Custom Documents",
  },
  {
    label: "Intakes",
    icon: CalendarIcon,
    value: "/admin/intakes",
    description: "Overview",
  },
  {
    divider: true,
  },
  {
    label: "Batches",
    icon: CalendarIcon,
    value: "/admin/settings/batches",
    description: "Manage class batches",
  },
  {
    label: "Signatures",
    icon: FileTextIcon,
    value: "/admin/settings/signatures",
    description: "Manage certificate signatures",
  },
  {
    label: "Admin Accounts",
    icon: KeyIcon,
    value: "/admin/settings/users",
    description: "Manage user accounts",
  },




];
