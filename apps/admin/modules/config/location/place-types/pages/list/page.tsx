"use client";

import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import { PLACE_TYPE_MODULE_CONFIG, PLACE_TYPE_API } from "../../module.config";
import { PlaceTypeForm } from "../../form/PlaceTypeForm";
import { placeTypeFormConfig } from "../../form/form.config";
import { placeTypeListColumns } from "./list.columns";

export function ListPage() {
  return (
    <DataTableWrapper
      queryKey="placeType.list"
      queryGetFn={async () => PLACE_TYPE_API.getPlaceTypes()}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PLACE_TYPE_MODULE_CONFIG}
        columns={placeTypeListColumns}
        idAccessor="id"
        filterList={[]}
        onCreateApi={async (data) => PLACE_TYPE_API.createPlaceType(data)}
        onEditApi={async (id, data) =>
          PLACE_TYPE_API.updatePlaceType(String(id), data)
        }
        onDeleteApi={async (id) => PLACE_TYPE_API.deletePlaceType(String(id))}
        createFormComponent={<PlaceTypeForm />}
        editFormComponent={<PlaceTypeForm />}
        createFormConfig={placeTypeFormConfig}
        editFormConfig={placeTypeFormConfig}
        modalWidth="md"
      />
    </DataTableWrapper>
  );
}
