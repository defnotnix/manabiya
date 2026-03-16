"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { BATCHES_MODULE_CONFIG, BATCH_API } from "../../module.config";
import { BatchesForm } from "../../form/BatchesForm";
import { batchesFormConfig } from "../../form/form.config";
import { batchesListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="batches.list"
      queryGetFn={async () => BATCH_API.getBatches()}
      dataKey="data"
    >
      <DataTableModalShell
        moduleInfo={BATCHES_MODULE_CONFIG}
        columns={batchesListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => BATCH_API.createBatch(data)}
        onEditApi={async (id, data) => BATCH_API.updateBatch(String(id), data)}
        onDeleteApi={async (id) => BATCH_API.deleteBatch(String(id))}
        createFormComponent={<BatchesForm />}
        editFormComponent={<BatchesForm />}
        createFormConfig={batchesFormConfig}
        editFormConfig={batchesFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
