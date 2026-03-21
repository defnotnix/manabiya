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
  SignatureIcon,
  ClockCounterClockwiseIcon,
} from "@phosphor-icons/react";
import { PropAdminNavItems } from "@settle/admin";

const baseNavItems: PropAdminNavItems[] = [
  // General Group


  {
    label: "Batches",
    icon: CalendarIcon,
    value: "/admin/settings/batches",
    description: "Manage class batches",
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
    label: "Signatures",
    icon: SignatureIcon,
    value: "/admin/settings/signatures",
    description: "Manage certificate signatures",
  },
];

const adminOnlyNavItems: PropAdminNavItems[] = [
  {
    divider: true,
  },
  {
    label: "Audit Logs",
    icon: ClockCounterClockwiseIcon,
    value: "/admin/students/audit-logs",
    description: "Student activity audit trail",
  },
  {
    label: "Admin Accounts",
    icon: KeyIcon,
    value: "/admin/settings/users",
    description: "Manage user accounts",
  },
];

/**
 * Get navigation items filtered by user role
 * @param isAdmin - Whether the current user is an admin
 * @returns Filtered navigation items
 */
export function getNavItems(isAdmin: boolean): PropAdminNavItems[] {
  const items = [...baseNavItems];

  if (isAdmin) {
    items.push(...adminOnlyNavItems);
  }

  return items;
}

// Export base items for backward compatibility
export const navItems: PropAdminNavItems[] = getNavItems(true);
