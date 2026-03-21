"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { BATCHES_MODULE_CONFIG, BATCH_API } from "../../module.config";
import { BatchesForm } from "../../form/BatchesForm";
import { batchesFormConfig } from "../../form/form.config";
import { batchesListColumns } from "./list.columns";
import { useIsAdmin } from "@/context/UserContext";

export function ListPage() {
  const isAdmin = useIsAdmin();

  return (
    <DataTableWrapper
        queryKey="batches.list"
        queryGetFn={async () => BATCH_API.getBatches({ is_active: true })}
        dataKey="data"
      >
        <DataTableModalShell
          moduleInfo={BATCHES_MODULE_CONFIG}
          columns={batchesListColumns}
          idAccessor="id"
          filterList={[]}
          onCreateApi={isAdmin ? async (data) => BATCH_API.createBatch(data) : undefined}
          onEditApi={isAdmin ? async (id, data) => BATCH_API.updateBatch(String(id), data) : undefined}
          onDeleteApi={isAdmin ? async (id) => BATCH_API.inactivateBatch(String(id)) : undefined}
          createFormComponent={<BatchesForm />}
          editFormComponent={<BatchesForm />}
          createFormConfig={batchesFormConfig}
          editFormConfig={batchesFormConfig}
          modalWidth="lg"
          disableReviewButton={true}
        />
      </DataTableWrapper>
  );
}
