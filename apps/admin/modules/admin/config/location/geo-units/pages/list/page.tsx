"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { GEO_UNITS_MODULE_CONFIG, GEO_UNITS_API } from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="geo-units.list"
      queryGetFn={GEO_UNITS_API.getGeoUnits}
      enableServerQuery={true}
      dataKey="results"
      paginationDataKey="pagination"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNITS_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        hasServerSearch={true}
        filterList={[]}
        // Read-only
      />
    </DataTableWrapper>
  );
}
