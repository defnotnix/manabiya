"use client";

import { UsersThree } from "@phosphor-icons/react";
import { VOTER_ROLL_ENTRIES_API } from "./module.api";

export const VOTER_ROLL_ENTRIES_MODULE_CONFIG = {
  name: "VoterRollEntries",
  label: "Voter Roll Entries",
  description: "View voter rolls and update extra details",
  term: "Entry",
  pluralName: "entries",
  singularName: "entry",
  icon: UsersThree,
};

export { VOTER_ROLL_ENTRIES_API };
