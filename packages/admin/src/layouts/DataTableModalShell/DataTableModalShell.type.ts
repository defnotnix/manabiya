import { PropDataTableShell } from "../DataTableShell/DataTableShell.type";

// ─────────────────────────────────────────────
// Shared Modal Types
// ─────────────────────────────────────────────

export type PropDataTableModalFormConfig = {
  initial?: Record<string, any>;
  steps?: string[];
  validation?: any[];
};

export type PropDataTableModalAction = {
  onCreateApi?: (data: any) => Promise<any>;
  onEditApi?: (id: string | number, data: any) => Promise<any>;
  onDeleteApi?: (id: string | number) => Promise<any>;
};

export type PropDataTableModalCallbacks = {
  onCreateSuccess?: (res: any) => void;
  onEditSuccess?: (res: any) => void;
  onDeleteSuccess?: (id: string | number) => void;
  /**
   * Triggered when edit modal opens. Use this to fetch full record data from API.
   * If not provided, uses the row data from the table (default approach).
   *
   * @param row - The row data from the table
   * @returns - The full record data to populate the form (from API or transformed)
   */
  onEditTrigger?: (row: any) => Promise<any>;
  /**
   * Triggered when review button is clicked.
   * If not provided, defaults to navigating to /[id] page.
   *
   * @param row - The row data from the table
   */
  onReviewClick?: (row: any) => void;
};

export type PropDataTableModalTransform = {
  transformOnCreate?: (data: any) => any;
  transformOnEdit?: (data: any) => any;
  transformOnDelete?: (id: any) => any;
};

// ─────────────────────────────────────────────
// Modal Shell Props
// ─────────────────────────────────────────────

export type PropDataTableModalShell = PropDataTableShell &
  PropDataTableModalAction &
  PropDataTableModalCallbacks &
  PropDataTableModalTransform & {
    // Modal-specific props
    modalWidth?: string | number;
    modalFormConfig?: PropDataTableModalFormConfig;
    showCreateButton?: boolean;
    createButtonLabel?: string;
    editFormComponent?: React.ReactNode | ((props: { isCreate: boolean }) => React.ReactNode);
    createFormComponent?: React.ReactNode | ((props: { isCreate: boolean }) => React.ReactNode);
    // Review page
    hasReviewPage?: boolean;
    // Validator
    validator?: any;
  };
