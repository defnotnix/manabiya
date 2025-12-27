import { ReactNode } from "react";

export type PropRolePermsWrapper = {
  testMode?: boolean;
  children: ReactNode;
  defaultPermissions?: Record<string, boolean>;
};

export type PropRolePermsModuleWrapper = {
  children: ReactNode;
  moduleKey: string;
  fallback?: any;
};
