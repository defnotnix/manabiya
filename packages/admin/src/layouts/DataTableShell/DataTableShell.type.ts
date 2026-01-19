import type { PropTabsTab } from "@settle/admin";

// ─────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────

type PropSustained = {
  sustained?: boolean;
};

type PropIdAccessor = {
  idAccessor?: string;
};

type PropRowStyle = {
  // row-styles
  enableRowStyle?: boolean;
  rowColor?: string;
  rowBackgroundColor?: string;
  rowStyle?: any;
};

type PropServerSearch = {
  hasServerSearch?: boolean;
};

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────

export type PropDataTableHeader = {
  moduleInfo: any;
  newButtonHref?: string;
  sustained?: boolean;
  onNewClick?: () => void;
};

// ─────────────────────────────────────────────
// Toolbar
// ─────────────────────────────────────────────

export type PropDataTableToolbar = PropSustained & {
  tabs: PropTabsTab[];
  activeTab: number;
  onTabChange: (index: number) => void;
  customColumns: any[];
  hideFilters?: boolean;
  filterList: any[];
  setCustomColumns?: any;
  onToggleColumn?: any;
  onResetColumns?: any;
};

// ─────────────────────────────────────────────
// DataTable config
// ─────────────────────────────────────────────

export type PropDataTableShellDataTable = PropRowStyle &
  PropServerSearch & {
    customColumns?: any[];
    pageSizes?: number[];
    forceFilter?: (data: any) => any;
    disableActions?: boolean;
    columns: any[];
  } & PropIdAccessor;

// ─────────────────────────────────────────────
// Shell (full table wrapper)
// ─────────────────────────────────────────────

export type PropDataTableShell = PropSustained &
  PropDataTableHeader &
  PropDataTableShellDataTable & {
    tabs?: PropTabsTab[];
    hideFilters?: boolean;
    filterList: any[];
    tableActions?: any[];
    sortStatus?: any;
    newButtonHref?: string;
    onNewClick?: () => void;
    onEditClick?: (record: any) => void;
    onDeleteClick?: (ids: (string | number)[]) => void;
    onReviewClick?: (record: any) => void;
  };

export type PropDataTableShellActions = PropIdAccessor & PropSustained & {
  onNewClick?: () => void;
  onEditClick?: (record: any) => void;
  onDeleteClick?: (ids: (string | number)[]) => void;
  onReviewClick?: (record: any) => void;
};
