"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  GEO_UNIT_TYPES_MODULE_CONFIG,
  GEO_UNIT_TYPES_API,
} from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="geo-unit-types.list"
      queryGetFn={GEO_UNIT_TYPES_API.getGeoUnitTypes}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNIT_TYPES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
        // Read-only: No create/edit/delete handlers
      />
    </DataTableWrapper>
  );
}
