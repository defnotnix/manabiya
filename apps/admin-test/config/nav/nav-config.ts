
import { 
  FilesIcon,
  GearIcon,
  TagIcon,
  TicketIcon,
  UsersIcon,
  ChartBarIcon, 
  ReceiptIcon,
  BankIcon,
  TruckIcon,
  GlobeIcon,
  MegaphoneIcon,
  HouseIcon
} from "@phosphor-icons/react";
import { NavConfig, NavElement, NavGroup, NavModule } from "@settle/admin";

// Import existing configs
import { navItems as mainNavItems } from "./navs/main-nav";
import { navModules } from "./navs/modules";

// Helper to convert legacy items to new structure
function convertLegacyItems(items: any[]): NavElement[] {
  return items.map(item => ({
    type: "link",
    label: item.label,
    href: item.value || "#",
    icon: item.icon,
    // Add dummy children for testing depth if needed
    // children: ...
  }));
}

// Helper to generate dummy items for testing (Goal: 10-20 items per module)
function generateDummyItems(moduleId: string, count: number): NavElement[] {
  return Array.from({ length: count }).map((_, i) => ({
    type: "link",
    label: `${moduleId} Item ${i + 1}`,
    href: `/admin/${moduleId}/item-${i + 1}`,
    icon: FilesIcon
  }));
}

// 1. Create groups from navModules
const moduleGroups: NavGroup[] = navModules.map((mod, index) => {
  const modId = mod.label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  
  return {
    id: modId,
    label: mod.label,
    icon: mod.icon,
    color: mod.color as any,
    modules: [
      {
        id: `${modId}-main`,
        label: "Main",
        showHeader: false, // Cleaner look for main module
        items: [
           // Add a dashboard/overview link for this module
           { type: "link", label: "Dashboard", href: `/admin/${modId}`, icon: ChartBarIcon },
           { type: "divider" },
           // Add generated dummy items
           ...generateDummyItems(modId, 15) 
        ]
      },
      {
          id: `${modId}-settings`,
          label: "Settings",
          showHeader: true,
          items: [
              { type: "link", label: "Configuration", href: `/admin/${modId}/config`, icon: GearIcon },
              { type: "link", label: "Permissions", href: `/admin/${modId}/perms`, icon: UsersIcon },
              { type: "link", label: "Tags", href: `/admin/${modId}/tags`, icon: TagIcon },
          ]
      }
    ]
  };
});

// 2. Handle the "Main" nav items (Home, Agendas)
// We'll put these in a "General" or "Home" group at the top
const mainGroup: NavGroup = {
  id: "general",
  label: "General",
  icon: HouseIcon,
  modules: [
    {
      id: "general-main",
      label: "General",
      items: [
        ...convertLegacyItems(mainNavItems),
        { type: "divider" },
        // Add some dummy items here too for testing
        ...generateDummyItems("general", 10)
      ]
    }
  ]
};

// 3. Assemble final config
export const navConfig: NavConfig = {
  groups: [
    mainGroup,
    ...moduleGroups
  ],
  settings: {
      searchEnabled: true,
      accordion: true
  }
};
