"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  GEO_UNIT_GEOMETRIES_MODULE_CONFIG,
  GEO_UNIT_GEOMETRIES_API,
} from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="geo-unit-geometries.list"
      queryGetFn={GEO_UNIT_GEOMETRIES_API.getGeoUnitGeometries}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNIT_GEOMETRIES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
