"use client";

import { useEffect, useState } from "react";
import { DataTableWrapper } from "@settle/core";
import { DataTableModalShell } from "@settle/admin";
import {
  PLACE_MODULE_CONFIG,
  PLACE_API,
} from "@/modules/config/location/places/module.config";
import { PlaceForm } from "@/modules/config/location/places/form/PlaceForm";
import { placeFormConfig } from "@/modules/config/location/places/form/form.config";
import { placeListColumns } from "./list.columns";
import { PLACE_TYPE_API } from "@/modules/config/location/place-types/module.api";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";

export function ListPage() {
  const [placeTypes, setPlaceTypes] = useState<
    { label: string; value: string }[]
  >([]);
  const [geoUnits, setGeoUnits] = useState<{ label: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchFilters() {
      try {
        const typesRes = await PLACE_TYPE_API.getPlaceTypes();
        if (typesRes?.data?.results) {
          setPlaceTypes(
            typesRes.data.results.map((t: any) => ({
              label: t.name,
              value: String(t.id),
            })),
          );
        }

        const unitsRes = await GEO_UNIT_API.getGeoUnits();
        if (unitsRes?.data?.results) {
          setGeoUnits(
            unitsRes.data.results.map((u: any) => ({
              label: u.display_name,
              value: String(u.id),
            })),
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchFilters();
  }, []);

  const filterList = [
    {
      label: "Geo Unit",
      field: "geo_unit",
      type: "select",
      options: geoUnits,
      placeholder: "Filter by Geo Unit",
    },
    {
      label: "Place Type",
      field: "place_type",
      type: "select",
      options: placeTypes,
      placeholder: "Filter by Place Type",
    },
  ];

  return (
    <DataTableWrapper
      queryKey="place.list"
      queryGetFn={async (params) => {
        return PLACE_API.getPlaces({ ...params, include_point: true });
      }}
      dataKey="results"
    >
      <DataTableModalShell
        moduleInfo={PLACE_MODULE_CONFIG}
        columns={placeListColumns}
        idAccessor="id"
        // @ts-ignore
        filterList={filterList}
        onCreateApi={async (data) => PLACE_API.createPlace(data)}
        onEditApi={async (id, data) => PLACE_API.updatePlace(String(id), data)}
        onDeleteApi={async (id) => PLACE_API.deletePlace(String(id))}
        createFormComponent={<PlaceForm />}
        editFormComponent={<PlaceForm />}
        createFormConfig={placeFormConfig}
        editFormConfig={placeFormConfig}
        modalWidth="lg"
      />
    </DataTableWrapper>
  );
}
