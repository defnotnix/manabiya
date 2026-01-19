import { PropDataTableShell } from "../DataTableShell/DataTableShell.type";
import { Step } from "../FormShell/FormShell.type";

// ─────────────────────────────────────────────
// Shared Modal Types
// ─────────────────────────────────────────────

export type PropDataTableModalFormConfig = {
  /** Initial form values */
  initial?: Record<string, any>;
  /** Number of steps in the form (default: 1) */
  steps?: number;
  /** Step labels for multi-step forms */
  stepLabels?: (string | Step)[];
  /** Array of validation schemas per step */
  validation?: any[];
  /** Steps to disable/skip */
  disabledSteps?: number[];
  /** Custom step validation function */
  stepValidationFn?: (current: number, formdata: any) => Promise<any>;
  /** Format for submission: 'json' or 'formdata' */
  submitFormat?: "json" | "formdata";
  /** Enable dirt check for tracking changed fields */
  hasDirtCheck?: boolean;
  /** Configuration for JSON submit formatting */
  formatJsonSubmitConfig?: {
    keyIgnore?: string[];
    stringify?: string[];
  };
  /** Clear form on successful submission (default: true for create, false for edit) */
  formClearOnSuccess?: boolean;
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
    /** @deprecated Use createFormConfig and editFormConfig instead */
    modalFormConfig?: PropDataTableModalFormConfig;
    /** Form configuration for the create modal */
    createFormConfig?: PropDataTableModalFormConfig;
    /** Form configuration for the edit modal */
    editFormConfig?: PropDataTableModalFormConfig;
    showCreateButton?: boolean;
    createButtonLabel?: string;
    editFormComponent?: React.ReactNode | ((props: { isCreate: boolean; currentStep: number }) => React.ReactNode);
    createFormComponent?: React.ReactNode | ((props: { isCreate: boolean; currentStep: number }) => React.ReactNode);
    /** Custom title for the create modal. Defaults to "New {moduleTerm}" */
    createModalTitle?: string;
    /** Custom title for the edit modal. Defaults to "Edit {moduleTerm}" */
    editModalTitle?: string;
    // Review page
    hasReviewPage?: boolean;
    // Validator
    // Validator
    validator?: any;
  };

// ─────────────────────────────────────────────
// Modal Handler Props
// ─────────────────────────────────────────────

export type PropModalStepper = {
  steps: (string | Step)[];
  currentStep: number;
};

export type PropSharedModalContent = {
  moduleTerm: string;
  idAccessor: string;
  apiFunction?: any; // onCreateApi or onEditApi
  onSuccessCallback: (res: any) => void;
  onErrorCallback: (err: any) => void;
  closeModal: () => void;
  formComponent: any;
  formConfig?: PropDataTableModalFormConfig;
  mode: "create" | "edit";
  activeRecord?: any; // For edit mode
  transformData?: (data: any) => any;
  loading?: boolean;
};

export type PropSharedModalBody = {
  formComponent: any;
  closeModal: () => void;
  stepLabels?: (string | Step)[];
  totalSteps: number;
  isCreate: boolean;
};

export type PropModalHandler = Pick<
  PropDataTableModalShell,
  | "modalWidth"
  | "onCreateApi"
  | "onEditApi"
  | "onCreateSuccess"
  | "onEditSuccess"
  | "onEditTrigger"
  | "transformOnCreate"
  | "transformOnEdit"
  | "validator"
  | "idAccessor"
  | "createFormComponent"
  | "editFormComponent"
  | "createModalTitle"
  | "editModalTitle"
  | "createFormConfig"
  | "editFormConfig"
> & {
  moduleName?: string;
  moduleTerm?: string;
};
