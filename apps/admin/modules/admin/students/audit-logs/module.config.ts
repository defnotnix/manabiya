"use client";

import { ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { AUDIT_LOG_API } from "../module.api";

export const AUDIT_LOGS_MODULE_CONFIG = {
  name: "audit-logs",
  term: "Audit Log",
  label: "Audit Logs",
  description: "Student activity audit trail",
  pluralName: "audit-logs",
  singularName: "audit-log",
  icon: ClockCounterClockwiseIcon,
  basePath: "/admin/students/audit-logs",
};

export { AUDIT_LOG_API };
