"use client";

import { Tag } from "@phosphor-icons/react";
import { OFFER_API } from "./module.api";

export const OFFER_MODULE_CONFIG = {
  name: "Offer",
  label: "Offers",
  description: "Manage product offers and pricing",
  term: "Offer",
  pluralName: "offers",
  singularName: "offer",
  icon: Tag,
};

export { OFFER_API };
