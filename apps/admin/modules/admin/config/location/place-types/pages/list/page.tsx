"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  PLACE_TYPES_MODULE_CONFIG,
  PLACE_TYPES_API,
} from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="place-types.list"
      queryGetFn={PLACE_TYPES_API.getPlaceTypes}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PLACE_TYPES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
