"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PLACES_MODULE_CONFIG, PLACES_API } from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="places.list"
      queryGetFn={PLACES_API.getPlaces}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PLACES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
