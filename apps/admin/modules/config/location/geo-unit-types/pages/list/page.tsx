"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  GEO_UNIT_TYPE_MODULE_CONFIG,
  GEO_UNIT_TYPE_API,
} from "../../module.config";
import { GeoUnitTypeForm } from "../../form/GeoUnitTypeForm";
import { geoUnitTypeFormConfig } from "../../form/form.config";
import { geoUnitTypeListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="geoUnitType.list"
      queryGetFn={async () => GEO_UNIT_TYPE_API.getGeoUnitTypes()}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={GEO_UNIT_TYPE_MODULE_CONFIG}
        columns={geoUnitTypeListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => GEO_UNIT_TYPE_API.createGeoUnitType(data)}
        onEditApi={async (id, data) =>
          GEO_UNIT_TYPE_API.updateGeoUnitType(String(id), data)
        }
        onDeleteApi={async (id) =>
          GEO_UNIT_TYPE_API.deleteGeoUnitType(String(id))
        }
        createFormComponent={<GeoUnitTypeForm />}
        editFormComponent={<GeoUnitTypeForm />}
        createFormConfig={geoUnitTypeFormConfig}
        editFormConfig={geoUnitTypeFormConfig}
        modalWidth="md"
      />
    </DataTableWrapper>
  );
}
