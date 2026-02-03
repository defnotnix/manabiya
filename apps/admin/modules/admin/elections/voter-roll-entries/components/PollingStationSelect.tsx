"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Stack,
  Select,
  Paper,
  Text,
  Loader,
  Group,
  ActionIcon,
  Collapse,
  Badge,
} from "@mantine/core";
import { CaretDown, CaretUp, X } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";
import { POLLING_STATIONS_API } from "../../data-entry-accounts/module.api";

interface PollingStation {
  id: number;
  name: string;
  display_name?: string;
}

interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  official_code?: string;
  ward_no?: number | null;
}

interface PollingStationSelectProps {
  value: string | null;
  onChange: (value: string | null, stationData?: PollingStation) => void;
  singleRow?: boolean;
}

export function PollingStationSelect({
  value,
  onChange,
  singleRow = false,
}: PollingStationSelectProps) {
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLocalBody, setSelectedLocalBody] = useState<string | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedStationName, setSelectedStationName] = useState<string>("");

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
  const { data: pollingStationsData, isLoading: loadingPollingStations } =
    useQuery({
      queryKey: ["polling-stations", selectedWard],
      queryFn: async () => {
        if (!selectedWard) return [];
        const response = await POLLING_STATIONS_API.getPollingStations({
          ward: Number(selectedWard),
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
    onChange(null);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedLocalBody(null);
    setSelectedWard(null);
    onChange(null);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedWard(null);
    onChange(null);
  }, [selectedLocalBody]);

  useEffect(() => {
    onChange(null);
  }, [selectedWard]);

  // Build select options
  const provinceOptions = useMemo(
    () =>
      (provincesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Province ${unit.id}`,
        })),
    [provincesData],
  );

  const districtOptions = useMemo(
    () =>
      (districtsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `District ${unit.id}`,
        })),
    [districtsData],
  );

  const localBodyOptions = useMemo(
    () =>
      (localBodiesData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.display_name || `Local Body ${unit.id}`,
        })),
    [localBodiesData],
  );

  const wardOptions = useMemo(
    () =>
      (wardsData || [])
        .filter((unit) => unit.id != null)
        .map((unit) => ({
          value: String(unit.id),
          label: unit.ward_no
            ? `Ward ${unit.ward_no}`
            : unit.display_name || `Ward ${unit.id}`,
        })),
    [wardsData],
  );

  const pollingStationOptions = useMemo(
    () =>
      (pollingStationsData || [])
        .filter((station) => station.id != null)
        .map((station) => ({
          value: String(station.id),
          label:
            station.display_name || station.name || `Station ${station.id}`,
        })),
    [pollingStationsData],
  );

  const handlePollingStationChange = (stationId: string | null) => {
    if (stationId) {
      const station = pollingStationsData?.find(
        (s) => String(s.id) === stationId,
      );
      setSelectedStationName(
        station?.display_name || station?.name || `Station ${stationId}`,
      );
      onChange(stationId, station);
    } else {
      setSelectedStationName("");
      onChange(null);
    }
  };

  const handleClearFilters = () => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
    onChange(null);
    setSelectedStationName("");
  };

  const Selects = (
    <>
      <Select
        size="xs"
        label="Province"
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
        label="District"
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
        label="Local Body"
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
        label="Ward"
        placeholder="Select Ward"
        data={wardOptions}
        value={selectedWard}
        onChange={setSelectedWard}
        searchable
        clearable
        disabled={!selectedLocalBody || loadingWards}
        rightSection={loadingWards ? <Loader size="xs" /> : undefined}
      />

      <Select
        size="xs" // Changed to xs to match others in single row
        label="Polling Station"
        placeholder={
          selectedWard ? "Select Polling Station" : "Select location first"
        }
        data={pollingStationOptions}
        value={value}
        onChange={handlePollingStationChange}
        searchable
        clearable
        disabled={!selectedWard}
        rightSection={loadingPollingStations ? <Loader size="xs" /> : undefined}
      />
    </>
  );

  if (singleRow) {
    return (
      <Paper bg="none">
        <Group grow align="flex-end">
          {Selects}
          {(selectedProvince ||
            selectedDistrict ||
            selectedLocalBody ||
            selectedWard) && (
            <ActionIcon
              size="lg" // slightly larger to match input height
              variant="subtle"
              color="gray"
              onClick={handleClearFilters}
              title="Clear all"
              mb={2} // align with inputs
            >
              <X size={16} />
            </ActionIcon>
          )}
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="md">
      <Stack gap="sm">
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            Select Polling Station
          </Text>
          <Group gap="xs">
            {value && (
              <Badge size="sm" color="green">
                Selected: {selectedStationName || value}
              </Badge>
            )}
            {(selectedProvince ||
              selectedDistrict ||
              selectedLocalBody ||
              selectedWard) && (
              <ActionIcon
                size="xs"
                variant="subtle"
                color="gray"
                onClick={handleClearFilters}
                title="Clear all"
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
            <Group grow>
              <Select
                size="xs"
                label="Province"
                placeholder="Select Province"
                data={provinceOptions}
                value={selectedProvince}
                onChange={setSelectedProvince}
                searchable
                clearable
                disabled={loadingProvinces}
                rightSection={
                  loadingProvinces ? <Loader size="xs" /> : undefined
                }
              />

              <Select
                size="xs"
                label="District"
                placeholder="Select District"
                data={districtOptions}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                searchable
                clearable
                disabled={!selectedProvince || loadingDistricts}
                rightSection={
                  loadingDistricts ? <Loader size="xs" /> : undefined
                }
              />
            </Group>

            <Group grow>
              <Select
                size="xs"
                label="Local Body"
                placeholder="Select Local Body"
                data={localBodyOptions}
                value={selectedLocalBody}
                onChange={setSelectedLocalBody}
                searchable
                clearable
                disabled={!selectedDistrict || loadingLocalBodies}
                rightSection={
                  loadingLocalBodies ? <Loader size="xs" /> : undefined
                }
              />

              <Select
                size="xs"
                label="Ward"
                placeholder="Select Ward"
                data={wardOptions}
                value={selectedWard}
                onChange={setSelectedWard}
                searchable
                clearable
                disabled={!selectedLocalBody || loadingWards}
                rightSection={loadingWards ? <Loader size="xs" /> : undefined}
              />
            </Group>

            <Select
              size="sm"
              label="Polling Station"
              placeholder={
                selectedWard
                  ? "Select Polling Station"
                  : "Select location first"
              }
              data={pollingStationOptions}
              value={value}
              onChange={handlePollingStationChange}
              searchable
              clearable
              disabled={!selectedWard}
              rightSection={
                loadingPollingStations ? <Loader size="xs" /> : undefined
              }
            />
          </Stack>
        </Collapse>

        {!selectedWard && !value && (
          <Text size="xs" c="dimmed">
            Select Province → District → Local Body → Ward → Polling Station to
            view voter roll entries
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
