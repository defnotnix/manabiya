"use client";

import { FileTextIcon } from "@phosphor-icons/react";
import { CUSTOMS_API } from "./module.api";

export const CUSTOMS_MODULE_CONFIG = {
  name: "custom-document",
  term: "Custom Document",
  label: "Custom Documents",
  description: "Manage custom document templates and groups",
  pluralName: "customs",
  singularName: "custom",
  icon: FileTextIcon,
  basePath: "/admin/customs",
};

// Re-export API
export { CUSTOMS_API };
