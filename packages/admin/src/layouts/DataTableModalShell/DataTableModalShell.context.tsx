"use client";

import { createContext, useContext } from "react";

interface DataTableModalShellContextType {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  activeEditRecord: any;
  editLoading: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (record: any) => void;
  closeEditModal: () => void;
  setEditLoading: (loading: boolean) => void;
  setActiveEditRecord: (record: any) => void;
}

export const Context = createContext<DataTableModalShellContextType | undefined>(undefined);

export const useDataTableModalShellContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useDataTableModalShellContext must be used within DataTableModalShell provider"
    );
  }
  return context;
};
