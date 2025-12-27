import { createContext, useContext } from "react";

interface FormShellContextType {
  selectedRecords?: any[];
  setSelectedRecords?: (records: any[]) => void;
}

export const Context = createContext<FormShellContextType>({});

export const useFormShellContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useFormShellContext must be used within FormShell provider");
  }
  return context;
};
