"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  DATA_ENTRY_ACCOUNTS_MODULE_CONFIG,
  DATA_ENTRY_ACCOUNTS_API,
} from "../../module.config";
import { DataEntryAccountForm } from "../../form/DataEntryAccountForm";
import { dataEntryAccountFormConfig } from "../../form/form.config";
import { dataEntryAccountListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="data-entry-accounts.list"
      queryGetFn={async () => DATA_ENTRY_ACCOUNTS_API.getAccounts()}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={DATA_ENTRY_ACCOUNTS_MODULE_CONFIG}
        columns={dataEntryAccountListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => {
          const payload = {
            ...data,
            polling_stations: data.polling_stations.map((id: string) =>
              Number(id),
            ),
          };
          return DATA_ENTRY_ACCOUNTS_API.createAccount(payload);
        }}
        onEditApi={async (id, data) => {
          const payload = {
            ...data,
            polling_stations: data.polling_stations.map((id: string) =>
              Number(id),
            ),
          };
          // Password logic: If empty, maybe don't send?
          // But schema requires it min(6). User must re-enter or we change schema.
          // For now assuming re-enter is fine for this admins-only tool.
          return DATA_ENTRY_ACCOUNTS_API.updateAccount(String(id), payload);
        }}
        onDeleteApi={async (id) =>
          DATA_ENTRY_ACCOUNTS_API.deleteAccount(String(id))
        }
        createFormComponent={<DataEntryAccountForm />}
        editFormComponent={<DataEntryAccountForm />}
        createFormConfig={dataEntryAccountFormConfig}
        editFormConfig={dataEntryAccountFormConfig}
        modalWidth="md"
      />
    </DataTableWrapper>
  );
}
