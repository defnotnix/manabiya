"use client";

import { PenNibIcon } from "@phosphor-icons/react";
import { SIGNATURE_API } from "./module.api";

export const SIGNATURES_MODULE_CONFIG = {
  name: "signature",
  term: "Signature",
  label: "Signatures",
  description: "Manage certificate signatures",
  pluralName: "signatures",
  singularName: "signature",
  icon: PenNibIcon,
  basePath: "/admin/settings/signatures",
};

// Re-export API
export { SIGNATURE_API };
