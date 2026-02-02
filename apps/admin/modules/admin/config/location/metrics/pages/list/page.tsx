"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { METRICS_MODULE_CONFIG, METRICS_API } from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="metrics.list"
      queryGetFn={METRICS_API.getMetrics}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={METRICS_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
