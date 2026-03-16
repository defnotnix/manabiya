"use client";

import { KeyIcon } from "@phosphor-icons/react";
import { USER_API } from "./module.api";

export const USERS_MODULE_CONFIG = {
  name: "user",
  term: "User",
  label: "Admin Accounts",
  description: "Manage admin user accounts",
  pluralName: "users",
  singularName: "user",
  icon: KeyIcon,
  basePath: "/admin/settings/users",
};

// Re-export API
export { USER_API };
