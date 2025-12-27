// ─────────────────────────────────────────────
// ConfigShell Type Definitions
// ─────────────────────────────────────────────

export type PropConfigBread = {
  label: string;
  link?: string;
};

export type PropConfigField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "number" | "textarea";
  required?: boolean;
};

// ─────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────

export type PropConfigShellHeader = {
  bread?: PropConfigBread[];
  moduleInfo: {
    label: string;
    description?: string;
  };
};

// ─────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────

export type PropConfigShellCard = {
  item: any;
  fields?: PropConfigField[];
  idAccessor?: string;
  onEdit?: (item: any) => void;
  onDelete?: (id: string | number) => void;
  isEditing?: boolean;
  onSave?: (item: any) => void;
  onCancel?: () => void;
};

export type PropConfigShellCardNew = {
  fields?: PropConfigField[];
  onCreate?: (data: any) => void;
  isLoading?: boolean;
  validator?: any; // Zod schema or validation function
};

// ─────────────────────────────────────────────
// Shell (full config wrapper)
// ─────────────────────────────────────────────

export type PropConfigShell = PropConfigShellHeader & {
  fields: PropConfigField[];
  idAccessor?: string;

  // API functions
  onCreateApi?: (data: any) => Promise<any>;
  onEditApi?: (id: string | number, data: any) => Promise<any>;
  onDeleteApi?: (id: string | number) => Promise<any>;

  // Legacy callbacks (for backwards compatibility)
  onEdit?: (item: any) => void;
  onDelete?: (id: string | number) => void;
  onCreate?: (data: any) => void;

  // Transform functions (optional data transformation before API call)
  transformOnCreate?: (data: any) => any;
  transformOnEdit?: (data: any) => any;
  transformOnDelete?: (id: string | number) => string | number;

  // Custom components
  renderCard?: React.ComponentType<{
    item: any;
    isEditing: boolean;
    onEdit: (item: any) => void | Promise<void>;
    onDelete: (id: string | number) => void | Promise<void>;
    onSave: (item: any) => void | Promise<void>;
    onCancel: () => void;
    [key: string]: any; // Allow additional props
  }>;
  renderNewCard?: React.ComponentType<{
    onCreate: (data: any) => void;
    isLoading: boolean;
  }>;

  searchPlaceholder?: string;
  createButtonLabel?: string;
  isLoading?: boolean;
  emptyStateMessage?: string;
  validator?: any; // Zod schema or validation function
};
