"use client";

import { User } from "@phosphor-icons/react";
import { DATA_ENTRY_ACCOUNTS_API } from "./module.api";

export const DATA_ENTRY_ACCOUNTS_MODULE_CONFIG = {
  name: "DataEntryAccounts",
  label: "Data Entry Accounts",
  description: "Manage data entry operator accounts",
  term: "Account",
  pluralName: "accounts",
  singularName: "account",
  icon: User,
};

export { DATA_ENTRY_ACCOUNTS_API };
