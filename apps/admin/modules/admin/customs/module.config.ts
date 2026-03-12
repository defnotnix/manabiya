"use client";

import { FolderPlusIcon } from "@phosphor-icons/react";
import { CUSTOM_API } from "../docs/module.api";

export const CUSTOMS_MODULE_CONFIG = {
  name: "Custom",
  term: "Custom",
  label: "Custom Groups",
  description: "Manage custom document groups for batches and cohorts",
  pluralName: "customs",
  singularName: "custom",
  icon: FolderPlusIcon,
  basePath: "/admin/customs",
};

// Re-export API
export { CUSTOM_API };
