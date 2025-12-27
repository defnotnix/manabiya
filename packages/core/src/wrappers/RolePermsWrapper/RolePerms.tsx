"use client";

import React, { useEffect, useState, useMemo } from "react";
import { RolePermsContext, useRolePermsContext } from "./RolePerms.context";
//props
import {
  PropRolePermsModuleWrapper,
  PropRolePermsWrapper,
} from "./RolePerms.type";

export function RolePermsWrapper({
  children,
  defaultPermissions = {},
}: PropRolePermsWrapper) {
  // * STATE: Initialize with default permissions
  const [permissions, setPermissions] =
    useState<Record<string, boolean>>(defaultPermissions);

  // * PRELOADING: Sync with defaultPermissions when they change
  useEffect(() => {
    setPermissions((prev: any) => ({ ...prev, ...defaultPermissions }));
  }, [defaultPermissions]);

  return (
    <RolePermsContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </RolePermsContext.Provider>
  );
}

// Custom Hook to Get Module Permissions
export function usePermissions(moduleKey?: string) {
  const { permissions, setPermissions } = useRolePermsContext();

  // Memoized permission lookup for better performance
  const allowAccess = useMemo(
    () => (moduleKey ? (permissions?.[moduleKey] ?? false) : false),
    [permissions, moduleKey]
  );

  return { allowAccess, permissions, setPermissions };
}

// * MODULE WRAPPER: Conditionally render module based on permissions
export function RolePermModule({
  children,
  moduleKey,
  fallback = null,
}: PropRolePermsModuleWrapper) {
  const { allowAccess } = usePermissions(moduleKey);

  return allowAccess ? children : fallback;
}
