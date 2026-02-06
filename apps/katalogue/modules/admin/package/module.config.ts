"use client";

import { Package } from "@phosphor-icons/react";
import { PACKAGE_API } from "./module.api";

export const PACKAGE_MODULE_CONFIG = {
  name: "Package",
  label: "Packages",
  description: "Manage product packages and components",
  term: "Package",
  pluralName: "packages",
  singularName: "package",
  icon: Package,
};

export { PACKAGE_API };
