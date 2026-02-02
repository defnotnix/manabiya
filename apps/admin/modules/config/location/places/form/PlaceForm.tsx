"use client";

import { useEffect, useState } from "react";
import { Stack, TextInput, Select, NumberInput, Group } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { PLACE_TYPE_API } from "../../place-types/module.api";
import { GEO_UNIT_API } from "../../geo-units/module.api";

export function PlaceForm() {
  const form = FormWrapper.useForm();
  const [placeTypes, setPlaceTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [geoUnits, setGeoUnits] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const typesRes = await PLACE_TYPE_API.getPlaceTypes();
        if (typesRes?.data?.results) {
          setPlaceTypes(
            typesRes.data.results.map((t: any) => ({
              value: String(t.id),
              label: t.name,
            })),
          );
        }

        // Ideally fetch GeoUnits filtered or searchable. Fetching defaults for now.
        const unitsRes = await GEO_UNIT_API.getGeoUnits();
        if (unitsRes?.data?.results) {
          setGeoUnits(
            unitsRes.data.results.map((u: any) => ({
              value: String(u.id),
              label: u.display_name,
            })),
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  return (
    <Stack gap="md" p="md">
      <Select
        label="Place Type"
        placeholder="Select Place Type"
        data={placeTypes}
        {...form.getInputProps("place_type")}
        required
        searchable
      />

      <Select
        label="Geo Unit"
        placeholder="Select Geo Unit"
        data={geoUnits}
        {...form.getInputProps("geo_unit")}
        required
        searchable
      />

      <TextInput label="Name" {...form.getInputProps("name")} required />

      <TextInput label="Name (English)" {...form.getInputProps("name_en")} />

      <Group grow>
        <NumberInput
          label="Latitude"
          decimalScale={6}
          {...form.getInputProps("point.lat")}
        />
        <NumberInput
          label="Longitude"
          decimalScale={6}
          {...form.getInputProps("point.lng")}
        />
      </Group>
    </Stack>
  );
}
