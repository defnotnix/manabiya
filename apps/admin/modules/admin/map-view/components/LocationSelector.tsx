"use client";

import { useEffect, useMemo } from "react";
import {
  Paper,
  Group,
  Select,
  Loader,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";
import { POLLING_STATIONS_API } from "@/modules/elections/data-entry-accounts/module.api";

interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  official_code?: string;
  ward_no?: number | null;
}

interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
  station_code?: string | null;
}

interface LocationSelectorProps {
  selectedProvince: string | null;
  selectedDistrict: string | null;
  selectedLocalBody: string | null;
  selectedWard: string | null;
  selectedBooth: string | null;
  onProvinceChange: (value: string | null) => void;
  onDistrictChange: (value: string | null) => void;
  onLocalBodyChange: (value: string | null) => void;
  onWardChange: (value: string | null) => void;
  onBoothChange: (value: string | null) => void;
  onClearAll: () => void;
}

function formatDisplayName(unit: GeoUnit, fallback: string): string {
  const nepaliName = unit.display_name || unit.display_name_ne;
  const englishName = unit.display_name_en;
  if (nepaliName && englishName) return `${nepaliName} (${englishName})`;
  return nepaliName || englishName || fallback;
}

export function LocationSelector({
  selectedProvince,
  selectedDistrict,
  selectedLocalBody,
  selectedWard,
  selectedBooth,
  onProvinceChange,
  onDistrictChange,
  onLocalBodyChange,
  onWardChange,
  onBoothChange,
  onClearAll,
}: LocationSelectorProps) {
  // Fetch geo-units
  const { data: provinces, isLoading: loadingProvinces } = useQuery({
    queryKey: ["geo-units", "PROVINCE"],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "PROVINCE",
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ["geo-units", "DISTRICT", selectedProvince],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "DISTRICT",
        parent: Number(selectedProvince),
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedProvince,
  });

  const { data: localBodies, isLoading: loadingLocalBodies } = useQuery({
    queryKey: ["geo-units", "LOCAL_BODY", selectedDistrict],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "LOCAL_BODY",
        parent: Number(selectedDistrict),
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedDistrict,
  });

  const { data: wards, isLoading: loadingWards } = useQuery({
    queryKey: ["geo-units", "WARD", selectedLocalBody],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "WARD",
        parent: Number(selectedLocalBody),
        ordering: "ward_no",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedLocalBody,
  });

  const { data: booths, isLoading: loadingBooths } = useQuery({
    queryKey: ["polling-stations", selectedWard],
    queryFn: async () => {
      const response = await POLLING_STATIONS_API.getPollingStations({
        ward: Number(selectedWard),
      });
      return (response?.results as PollingStation[]) || [];
    },
    enabled: !!selectedWard,
  });

  // Auto-select first province when provinces load
  useEffect(() => {
    if (provinces && provinces.length > 0 && !selectedProvince) {
      onProvinceChange(String(provinces[0].id));
    }
  }, [provinces, selectedProvince, onProvinceChange]);

  // Auto-select first district when districts load
  useEffect(() => {
    if (districts && districts.length > 0 && !selectedDistrict) {
      onDistrictChange(String(districts[0].id));
    }
  }, [districts, selectedDistrict, onDistrictChange]);

  // Build select options
  const provinceOptions = useMemo(
    () =>
      (provinces || []).map((u) => ({
        value: String(u.id),
        label: formatDisplayName(u, `Province ${u.id}`),
      })),
    [provinces],
  );

  const districtOptions = useMemo(
    () =>
      (districts || []).map((u) => ({
        value: String(u.id),
        label: formatDisplayName(u, `District ${u.id}`),
      })),
    [districts],
  );

  const localBodyOptions = useMemo(
    () =>
      (localBodies || []).map((u) => ({
        value: String(u.id),
        label: formatDisplayName(u, `Local Body ${u.id}`),
      })),
    [localBodies],
  );

  const wardOptions = useMemo(
    () =>
      (wards || []).map((u) => ({
        value: String(u.id),
        label: u.ward_no
          ? `Ward ${u.ward_no}`
          : u.display_name || `Ward ${u.id}`,
      })),
    [wards],
  );

  const boothOptions = useMemo(
    () =>
      (booths || []).map((s) => {
        const nepali = s.place_name;
        const english = s.place_name_en;
        let label = `Booth ${s.id}`;
        if (nepali && english) label = `${nepali} (${english})`;
        else if (nepali) label = nepali;
        else if (english) label = english;
        return { value: String(s.id), label };
      }),
    [booths],
  );

  const hasFilters =
    selectedProvince ||
    selectedDistrict ||
    selectedLocalBody ||
    selectedWard ||
    selectedBooth;

  return (
    <Paper
      pos="absolute"
      top={16}
      left="50%"
      style={{
        zIndex: 1000,
        transform: "translateX(-50%)",
      }}
      radius="md"
      p="xs"
      shadow="lg"
      withBorder
    >
      <Group gap="xs" wrap="nowrap">
        <Select
          size="xs"
          placeholder="Province"
          data={provinceOptions}
          value={selectedProvince}
          onChange={onProvinceChange}
          searchable
          disabled={true}
          rightSection={loadingProvinces ? <Loader size="xs" /> : undefined}
          w={180}
        />

        <Select
          size="xs"
          placeholder="District"
          data={districtOptions}
          value={selectedDistrict}
          onChange={onDistrictChange}
          searchable
          disabled={true}
          rightSection={loadingDistricts ? <Loader size="xs" /> : undefined}
          w={180}
        />

        <Select
          size="xs"
          placeholder="Municipality"
          data={localBodyOptions}
          value={selectedLocalBody}
          onChange={onLocalBodyChange}
          searchable
          clearable
          disabled={!selectedDistrict || loadingLocalBodies}
          rightSection={loadingLocalBodies ? <Loader size="xs" /> : undefined}
          w={180}
        />

        <Select
          size="xs"
          placeholder="Ward"
          data={wardOptions}
          value={selectedWard}
          onChange={onWardChange}
          searchable
          clearable
          disabled={!selectedLocalBody || loadingWards}
          rightSection={loadingWards ? <Loader size="xs" /> : undefined}
          w={140}
        />

        <Select
          size="xs"
          placeholder="Booth"
          data={boothOptions}
          value={selectedBooth}
          onChange={onBoothChange}
          searchable
          clearable
          disabled={!selectedWard || loadingBooths}
          rightSection={loadingBooths ? <Loader size="xs" /> : undefined}
          w={200}
        />

        {hasFilters && (
          <Tooltip label="Clear all" position="bottom" withArrow>
            <ActionIcon
              size="sm"
              variant="subtle"
              color="gray"
              onClick={onClearAll}
            >
              <XIcon size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Paper>
  );
}
