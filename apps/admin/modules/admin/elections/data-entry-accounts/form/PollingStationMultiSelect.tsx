"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Select,
  Paper,
  Text,
  Loader,
  Group,
  Badge,
  ActionIcon,
  Collapse,
  Checkbox,
  ScrollArea,
  Box,
} from "@mantine/core";
import { CaretDown, CaretUp, X, Trash } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";
import { POLLING_STATIONS_API } from "../module.api";

interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
  station_code?: string | null;
}

interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  official_code?: string;
  ward_no?: number | null;
}

interface PollingStationMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function PollingStationMultiSelect({
  value,
  onChange,
  error,
}: PollingStationMultiSelectProps) {
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLocalBody, setSelectedLocalBody] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Provinces
  const { data: provincesData, isLoading: loadingProvinces } = useQuery({
    queryKey: ["geo-units", "PROVINCE"],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "PROVINCE",
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
  });

  // Fetch Districts (when province selected)
  const { data: districtsData, isLoading: loadingDistricts } = useQuery({
    queryKey: ["geo-units", "DISTRICT", selectedProvince],
    queryFn: async () => {
      if (!selectedProvince) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "DISTRICT",
        parent: Number(selectedProvince),
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedProvince,
  });

  // Fetch Local Bodies (when district selected)
  const { data: localBodiesData, isLoading: loadingLocalBodies } = useQuery({
    queryKey: ["geo-units", "LOCAL_BODY", selectedDistrict],
    queryFn: async () => {
      if (!selectedDistrict) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "LOCAL_BODY",
        parent: Number(selectedDistrict),
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedDistrict,
  });

  // Fetch Wards (when local body selected)
  const { data: wardsData, isLoading: loadingWards } = useQuery({
    queryKey: ["geo-units", "WARD", selectedLocalBody],
    queryFn: async () => {
      if (!selectedLocalBody) return [];
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "WARD",
        parent: Number(selectedLocalBody),
        ordering: "ward_no",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedLocalBody,
  });

  // Fetch Polling Stations (when ward selected)
  const { data: pollingStationsData, isLoading: loadingPollingStations } = useQuery({
    queryKey: ["polling-stations", selectedWard, searchQuery],
    queryFn: async () => {
      if (!selectedWard) return [];
      const response = await POLLING_STATIONS_API.getPollingStations({
        ward: Number(selectedWard),
        search: searchQuery || undefined,
      });
      return (response?.results as PollingStation[]) || [];
    },
    enabled: !!selectedWard,
  });

  // Reset cascading values when parent changes
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedLocalBody(null);
    setSelectedWard(null);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedWard(null);
  }, [selectedLocalBody]);

  // Build select options - ensure labels are always valid strings
  const provinceOptions = useMemo(
    () =>
      (provincesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Province ${unit.id}`,
        })),
    [provincesData]
  );

  const districtOptions = useMemo(
    () =>
      (districtsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `District ${unit.id}`,
        })),
    [districtsData]
  );

  const localBodyOptions = useMemo(
    () =>
      (localBodiesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Local Body ${unit.id}`,
        })),
    [localBodiesData]
  );

  const wardOptions = useMemo(
    () =>
      (wardsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.ward_no ? `Ward ${unit.ward_no}` : (unit.display_name || `Ward ${unit.id}`),
        })),
    [wardsData]
  );

  const pollingStationOptions = useMemo(
    () =>
      (pollingStationsData || [])
        .filter((station) => station.id != null)
        .map((station) => ({
          value: String(station.id),
          label: station.place_name || station.place_name_en || `Station ${station.id}`,
        })),
    [pollingStationsData]
  );

  const handleToggleStation = (stationId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, stationId]);
    } else {
      onChange(value.filter((id) => id !== stationId));
    }
  };

  const handleRemoveStation = (stationId: string) => {
    onChange(value.filter((id) => id !== stationId));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleClearFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
    setSearchQuery("");
  };

  // Get labels for selected stations (we need to track them separately since they might be from different wards)
  const [selectedStationsMap, setSelectedStationsMap] = useState<Record<string, string>>({});

  // Update selected stations map when polling stations data changes
  useEffect(() => {
    if (pollingStationsData) {
      const newMap = { ...selectedStationsMap };
      pollingStationsData.forEach((station) => {
        const id = String(station.id);
        if (value.includes(id)) {
          newMap[id] = station.place_name || station.place_name_en || `Station ${station.id}`;
        }
      });
      setSelectedStationsMap(newMap);
    }
  }, [pollingStationsData, value]);

  const selectedCount = value.length;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Polling Stations <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
        </Text>
        {selectedCount > 0 && (
          <Badge size="sm" variant="light">
            {selectedCount} selected
          </Badge>
        )}
      </Group>

      {/* Location Filter */}
      <Paper withBorder p="xs">
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size="xs" c="dimmed">
              Location Filter
            </Text>
            <Group gap="xs">
              {(selectedProvince || selectedDistrict || selectedLocalBody || selectedWard) && (
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={handleClearFilters}
                  title="Clear filters"
                >
                  <X size={14} />
                </ActionIcon>
              )}
              <ActionIcon
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => setFilterExpanded(!filterExpanded)}
              >
                {filterExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
              </ActionIcon>
            </Group>
          </Group>

          <Collapse in={filterExpanded}>
            <Stack gap="xs">
              <Select
                size="xs"
                placeholder="Select Province"
                data={provinceOptions}
                value={selectedProvince}
                onChange={setSelectedProvince}
                searchable
                clearable
                disabled={loadingProvinces}
                rightSection={loadingProvinces ? <Loader size="xs" /> : undefined}
              />

              <Select
                size="xs"
                placeholder="Select District"
                data={districtOptions}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                searchable
                clearable
                disabled={!selectedProvince || loadingDistricts}
                rightSection={loadingDistricts ? <Loader size="xs" /> : undefined}
              />

              <Select
                size="xs"
                placeholder="Select Local Body"
                data={localBodyOptions}
                value={selectedLocalBody}
                onChange={setSelectedLocalBody}
                searchable
                clearable
                disabled={!selectedDistrict || loadingLocalBodies}
                rightSection={loadingLocalBodies ? <Loader size="xs" /> : undefined}
              />

              <Select
                size="xs"
                placeholder="Select Ward"
                data={wardOptions}
                value={selectedWard}
                onChange={setSelectedWard}
                searchable
                clearable
                disabled={!selectedLocalBody || loadingWards}
                rightSection={loadingWards ? <Loader size="xs" /> : undefined}
              />
            </Stack>
          </Collapse>
        </Stack>
      </Paper>

      {/* Available Polling Stations */}
      {selectedWard ? (
        <Paper withBorder p="xs">
          <Text size="xs" c="dimmed" mb="xs">
            Available Polling Stations
          </Text>
          {loadingPollingStations ? (
            <Group justify="center" py="sm">
              <Loader size="xs" />
            </Group>
          ) : pollingStationOptions.length === 0 ? (
            <Text size="xs" c="dimmed" ta="center" py="sm">
              No polling stations found
            </Text>
          ) : (
            <ScrollArea.Autosize mah={150}>
              <Stack gap={4}>
                {pollingStationOptions.map((station) => (
                  <Checkbox
                    key={station.value}
                    label={station.label}
                    size="xs"
                    checked={value.includes(station.value)}
                    onChange={(e) => handleToggleStation(station.value, e.currentTarget.checked)}
                  />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
        </Paper>
      ) : (
        <Text size="xs" c="dimmed">
          Please select Province → District → Local Body → Ward to view polling stations
        </Text>
      )}

      {/* Selected Polling Stations */}
      {selectedCount > 0 && (
        <Paper withBorder p="xs" bg="blue.0">
          <Group justify="space-between" align="center" mb="xs">
            <Text size="xs" fw={500}>
              Selected Polling Stations ({selectedCount})
            </Text>
            <ActionIcon
              size="xs"
              variant="subtle"
              color="red"
              onClick={handleClearAll}
              title="Clear all"
            >
              <Trash size={14} />
            </ActionIcon>
          </Group>
          <ScrollArea.Autosize mah={120}>
            <Stack gap={4}>
              {value.map((stationId) => (
                <Group key={stationId} justify="space-between" align="center" gap="xs">
                  <Text size="xs" style={{ flex: 1 }}>
                    {selectedStationsMap[stationId] || `Station ${stationId}`}
                  </Text>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemoveStation(stationId)}
                  >
                    <X size={12} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Paper>
      )}

      {error && (
        <Text size="xs" c="red">
          {error}
        </Text>
      )}
    </Stack>
  );
}
