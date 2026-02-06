"use client";

import { useEffect, useState } from "react";
import { Stack, TextInput, NumberInput, Select } from "@mantine/core";
import { FormWrapper } from "@settle/core";
import { GEO_UNIT_TYPE_API } from "../../geo-unit-types/module.api";
import { GEO_UNIT_API } from "../module.api";

export function GeoUnitForm() {
  const form = FormWrapper.useForm();
  const [unitTypes, setUnitTypes] = useState<
    { value: string; label: string }[]
  >([]);
  const [parents, setParents] = useState<{ value: string; label: string }[]>(
    [],
  );

  // Fetch Unit Types
  useEffect(() => {
    async function fetchUnitTypes() {
      try {
        const response = await GEO_UNIT_TYPE_API.getGeoUnitTypes();
        if (response?.data?.results) {
          setUnitTypes(
            response.data.results.map((type: any) => ({
              value: String(type.id),
              label: type.name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch unit types", error);
      }
    }
    fetchUnitTypes();
  }, []);

  // Fetch Parents (Geo Units) - Simplified: Fetching all for now
  // In a real scenario, this should be filtered or use AsyncSelect
  useEffect(() => {
    async function fetchParents() {
      try {
        // Fetching potential parents.
        // NOTE: This might be heavy if there are many units.
        // Ideal: Filter by unit_type parent hierarchy if known, or search.
        const response = await GEO_UNIT_API.getGeoUnits({});
        if (response?.data?.results) {
          setParents(
            response.data.results.map((unit: any) => ({
              value: String(unit.id),
              label: unit.display_name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch parents", error);
      }
    }
    fetchParents();
  }, []);

  return (
    <Stack gap="md" p="md">
      <Select
        label="Unit Type"
        placeholder="Select Unit Type"
        data={unitTypes}
        {...form.getInputProps("unit_type")}
        required
        searchable
      />

      <Select
        label="Parent Unit"
        placeholder="Select Parent Unit (Optional)"
        data={parents}
        {...form.getInputProps("parent")}
        searchable
        clearable
      />

      <TextInput
        label="Display Name"
        {...form.getInputProps("display_name")}
        required
      />

      <TextInput
        label="Official Code"
        {...form.getInputProps("official_code")}
      />

      <NumberInput
        label="Ward No"
        description="Only for WARD type units"
        {...form.getInputProps("ward_no")}
      />
    </Stack>
  );
}
