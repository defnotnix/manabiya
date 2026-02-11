"use client";

import { FlagIcon } from "@phosphor-icons/react";
import { PARTY_API } from "./module.api";

export const PARTY_MODULE_CONFIG = {
    name: "Party",
    label: "Political Parties",
    description: "Political Parties from Elections Module",
    term: "Party",
    pluralName: "parties",
    singularName: "party",
    icon: FlagIcon,
};

export { PARTY_API };
