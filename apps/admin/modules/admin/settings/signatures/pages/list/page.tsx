"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { SIGNATURES_MODULE_CONFIG, SIGNATURE_API } from "../../module.config";
import { SignaturesForm } from "../../form/SignaturesForm";
import { signaturesFormConfig } from "../../form/form.config";
import { signaturesListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="signatures.list"
      queryGetFn={async () => SIGNATURE_API.getSignatures()}
      dataKey="data"
    >
      <DataTableModalShell
        moduleInfo={SIGNATURES_MODULE_CONFIG}
        columns={signaturesListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => SIGNATURE_API.createSignature(data)}
        onEditApi={async (id, data) => SIGNATURE_API.updateSignature(String(id), data)}
        onDeleteApi={async (id) => SIGNATURE_API.deleteSignature(String(id))}
        createFormComponent={<SignaturesForm />}
        editFormComponent={<SignaturesForm />}
        createFormConfig={signaturesFormConfig}
        editFormConfig={signaturesFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
