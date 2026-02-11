export interface AssignmentFilters {
  search: string;
  party: string | null;
  role: string | null;
  page: number;
  page_size: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface Assignment {
  id: number;
  contact?: {
    id: number;
    name?: string;
    name_en?: string;
    primary_phone?: string;
    email?: string;
  };
  role?: {
    id: number;
    name?: string;
    name_en?: string;
    key?: string;
  };
  party?: {
    id: number;
    name?: string;
    abbrev?: string;
  };
  organization?: {
    id: number;
    name?: string;
    name_en?: string;
  };
  location?: {
    province?: any;
    district?: any;
    local_body?: any;
    ward?: any;
  };
  label?: string;
  is_active?: boolean;
}

export interface RoleGroup {
  role: {
    id: string;
    name: string;
  };
  assignments: Assignment[];
}
