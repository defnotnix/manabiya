"use client";

import { CalendarIcon } from "@phosphor-icons/react";
import { BATCH_API } from "./module.api";

export const BATCHES_MODULE_CONFIG = {
  name: "batch",
  term: "Batch",
  label: "Batches",
  description: "Manage class batches",
  pluralName: "batches",
  singularName: "batch",
  icon: CalendarIcon,
  basePath: "/admin/settings/batches",
};

// Re-export API
export { BATCH_API };
