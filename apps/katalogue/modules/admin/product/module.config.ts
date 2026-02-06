"use client";

import { Package, PackageIcon } from "@phosphor-icons/react";
import { PRODUCT_API } from "./module.api";

export const PRODUCT_MODULE_CONFIG = {
  name: "Product",
  label: "Products",
  description: "Manage catalog products",
  term: "Product",
  pluralName: "products",
  singularName: "product",
  icon: Package, // Using Package icon as placeholder for Product
};

export { PRODUCT_API };
