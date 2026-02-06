import { ROLES_API } from "./module.api";

export const ROLES_MODULE_CONFIG = {
  name: "Role",
  label: "Roles",
  description: "Manage user roles and permissions",
  term: "Role",
  pluralName: "roles",
  singularName: "role",
  icon: "UsersIcon", // Using string identifier, icon import handled where used or in nav config
};

export { ROLES_API };
