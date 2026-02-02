"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  GEO_UNIT_METRIC_VALUES_MODULE_CONFIG,
  GEO_UNIT_METRIC_VALUES_API,
} from "../../module.config";
import { columns } from "./list.column";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="geo-unit-metric-values.list"
      queryGetFn={GEO_UNIT_METRIC_VALUES_API.getGeoUnitMetricValues}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNIT_METRIC_VALUES_MODULE_CONFIG}
        columns={columns}
        idAccessor="id"
        filterList={[]}
      />
    </DataTableWrapper>
  );
}
