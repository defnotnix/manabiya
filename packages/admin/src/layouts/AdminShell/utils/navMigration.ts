import { HouseIcon } from "@phosphor-icons/react";
import { PropAdminNavItems, PropAdminNavItemLink } from "../AdminShell.type";
import {
  NavConfig,
  NavElement,
  NavGroup,
  NavModule,
  NavItemLink,
  NavRailItem,
  NavRailDivider,
} from "../AdminShell.nav.types";

/**
 * Converts a PropAdminNavItems item into a NavElement (for children items)
 */
function convertItemToNavElement(item: PropAdminNavItems): NavElement {
  // Dividers in children are handled differently
  if (item.divider) {
    return { type: "divider", label: item.dividerLabel };
  }

  // If it has children, map them recursively
  if (item.children && item.children.length > 0) {
    const linkItem: NavItemLink = {
      type: "link",
      label: item.label,
      href: item.value || "#",
      icon: item.icon,
      children: item.children.map(convertItemToNavElement),
    };
    return linkItem;
  }

  // Standard link item
  const linkItem: NavItemLink = {
    type: "link",
    label: item.label,
    href: item.value || "#",
    icon: item.icon,
  };
  return linkItem;
}

/**
 * Generates a URL-safe ID from a label
 */
function generateId(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]/g, "-");
}

/**
 * Converts a top-level navItem into a NavGroup.
 * Each top-level item becomes a group in the rail, with its children shown in the panel.
 * If the item has no children but has a value, it becomes a direct link.
 */
function convertTopLevelItemToGroup(item: PropAdminNavItemLink): NavGroup {
  const groupId = generateId(item.label);

  // If item has no children but has a value, make it a direct link
  if ((!item.children || item.children.length === 0) && item.value) {
    return {
      id: groupId,
      label: item.label,
      description: item.description,
      icon: item.icon || HouseIcon,
      color: item.color,
      href: item.value,
      modules: [],
    };
  }

  // Convert children to NavElements for the panel
  const panelItems: NavElement[] = item.children
    ? item.children.map(convertItemToNavElement)
    : [];

  // Create a module to hold the items
  const module: NavModule = {
    id: `${groupId}-main`,
    label: item.label,
    showHeader: false,
    items: panelItems,
  };

  return {
    id: groupId,
    label: item.label,
    description: item.description,
    icon: item.icon || HouseIcon,
    color: item.color,
    modules: [module],
  };
}

/**
 * Converts a top-level item to either a NavGroup or NavRailDivider
 */
function convertTopLevelItem(
  item: PropAdminNavItems,
  index: number
): NavRailItem {
  // Handle divider items
  if (item.divider) {
    const divider: NavRailDivider = {
      type: "divider",
      id: `divider-${index}`,
    };
    return divider;
  }

  // Otherwise convert to NavGroup
  return convertTopLevelItemToGroup(item);
}

/**
 * Migrates navItems into the new NavConfig structure.
 * Each top-level item becomes a NavGroup (shown in the rail) or a divider.
 * Children of each top-level item become the panel content for that group.
 */
export function migrateLegacyNavItems(items?: PropAdminNavItems[]): NavConfig {
  if (!items || items.length === 0) {
    return { groups: [] };
  }

  // Each top-level item becomes its own group or divider
  const groups: NavRailItem[] = items.map(convertTopLevelItem);

  return {
    groups,
    settings: {
      searchEnabled: true,
    },
  };
}
