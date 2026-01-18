"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import { NavConfig, NavGroup, NavRailItem } from "../AdminShell.nav.types";

// Helper to check if an item is a NavGroup (not a divider)
function isNavGroup(item: NavRailItem): item is NavGroup {
  return item.type !== "divider";
}

interface NavContextType {
  // Config
  config: NavConfig;

  // State
  activeGroupId: string | null;
  expandedItems: string[];
  searchQuery: string;

  // Actions
  setActiveGroupId: (id: string) => void;
  toggleItemExpansion: (id: string) => void;
  setSearchQuery: (query: string) => void;

  // Helpers
  activeGroup: NavGroup | undefined;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export function useNav() {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
}

interface NavProviderProps {
  config: NavConfig;
  children: ReactNode;
}

export function NavProvider({ config, children }: NavProviderProps) {
  const pathname = usePathname();
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter out dividers to get only NavGroups
  const navGroups = useMemo(
    () => config.groups.filter(isNavGroup),
    [config.groups]
  );

  // Initialize active group based on pathname or default
  useEffect(() => {
    if (activeGroupId) return; // Already set

    // Try to find group matching current path
    // This logic can be enhanced to search recursively
    // For now, default to the first group
    if (navGroups.length > 0) {
      setActiveGroupId(navGroups[0].id);
    }
  }, [navGroups, activeGroupId]);

  const toggleItemExpansion = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const activeGroup = navGroups.find((g) => g.id === activeGroupId);

  const value = {
    config,
    activeGroupId,
    expandedItems,
    searchQuery,
    setActiveGroupId,
    toggleItemExpansion,
    setSearchQuery,
    activeGroup,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
