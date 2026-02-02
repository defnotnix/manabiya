"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  VOTER_ROLL_ENTRIES_MODULE_CONFIG,
  VOTER_ROLL_ENTRIES_API,
} from "../../module.config";
import { VoterRollEntryForm } from "../../form/VoterRollEntryForm";
import { voterRollEntryFormConfig } from "../../form/form.config";
import { voterRollEntryListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="voter-roll-entries.list"
      queryGetFn={async (params) => VOTER_ROLL_ENTRIES_API.getEntries(params)}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={VOTER_ROLL_ENTRIES_MODULE_CONFIG}
        columns={voterRollEntryListColumns}
        idAccessor="id"
        filterList={[
          {
            label: "Polling Station",
            field: "polling_station",
            type: "text",
            placeholder: "Enter ID",
          },
          {
            label: "Roll",
            field: "roll",
            type: "text",
          },
          {
            label: "Voter No",
            field: "voter_no",
            type: "text",
          },
        ]}
        onEditApi={async (id, data) =>
          VOTER_ROLL_ENTRIES_API.updateEntry(String(id), data)
        }
        editFormComponent={<VoterRollEntryForm />}
        editFormConfig={voterRollEntryFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
