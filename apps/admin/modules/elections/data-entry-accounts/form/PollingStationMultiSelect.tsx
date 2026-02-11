"use client";

import { useEffect, useMemo, useState, useRef } from "react";
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
  Center,
  SimpleGrid,
} from "@mantine/core";
import { CaretDown, CaretUp, X, Trash, MapPin } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useLocationSelector } from "@/components/LocationSelector";
import { PLACE_API } from "@/modules/config/location/places/module.api";
import { POLLING_STATIONS_API } from "../module.api";

interface PollingStation {
  id: number;
  place: number;
  place_name: string;
  place_name_en?: string;
  station_code?: string | null;
}

interface Place {
  id: number;
  name: string;
  name_en?: string;
  point?: { lat: number; lng: number } | null;
}

interface PollingStationWithCoords extends PollingStation {
  point?: { lat: number; lng: number } | null;
}

interface MapComponents {
  MapContainer: any;
  TileLayer: any;
  CircleMarker: any;
  Popup: any;
  useMap: any;
}

interface PollingStationMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  showMap?: boolean;
  mapHeight?: number | string;
}

// Helper to extract results from API response
const extractResults = (response: any): any[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.results) return response.results;
  if (response.data?.results) return response.data.results;
  return [];
};

// Map bounds fitter component
function MapBoundsFitter({
  stations,
  useMap,
}: {
  stations: PollingStationWithCoords[];
  useMap: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (stations.length === 0) return;

    const validStations = stations.filter(
      (s) => s.point?.lat != null && s.point?.lng != null
    );
    if (validStations.length === 0) return;

    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(
        validStations.map((s) => [s.point!.lat, s.point!.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    });
  }, [stations, map]);

  return null;
}

export function PollingStationMultiSelect({
  value,
  onChange,
  error,
  showMap = true,
  mapHeight = 250,
}: PollingStationMultiSelectProps) {
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [MapComponents, setMapComponents] = useState<MapComponents | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  // Use the reusable location selector hook
  const locationSelector = useLocationSelector({
    fetchPlaces: false,
  });

  // Fetch Polling Stations (when ward selected)
  const { data: pollingStationsData, isLoading: loadingPollingStations } =
    useQuery({
      queryKey: ["polling-stations", locationSelector.selectedWard],
      queryFn: async () => {
        if (!locationSelector.selectedWard) return [];
        const response = await POLLING_STATIONS_API.getPollingStations({
          ward: Number(locationSelector.selectedWard),
        });
        return extractResults(response) as PollingStation[];
      },
      enabled: !!locationSelector.selectedWard,
    });

  // Fetch Places with coordinates (when ward selected) to merge with polling stations
  const { data: placesData, isLoading: loadingPlaces } = useQuery({
    queryKey: ["places-with-coords", locationSelector.selectedWard],
    queryFn: async () => {
      if (!locationSelector.selectedWard) return [];
      const response = await PLACE_API.getPlaces({
        geo_unit: Number(locationSelector.selectedWard),
        include_point: true,
        page_size: 200,
      });
      return extractResults(response) as Place[];
    },
    enabled: showMap && !!locationSelector.selectedWard,
  });

  // Merge polling stations with place coordinates
  const stationsWithCoords: PollingStationWithCoords[] = useMemo(() => {
    if (!pollingStationsData) return [];

    const placeMap = new Map<number, Place>();
    (placesData || []).forEach((place) => {
      placeMap.set(place.id, place);
    });

    return pollingStationsData.map((station) => {
      const place = placeMap.get(station.place);
      return {
        ...station,
        point: place?.point || null,
      };
    });
  }, [pollingStationsData, placesData]);

  // Stations that have valid coordinates
  const stationsOnMap = useMemo(
    () => stationsWithCoords.filter((s) => s.point?.lat != null && s.point?.lng != null),
    [stationsWithCoords]
  );

  // Load Leaflet CSS and components
  useEffect(() => {
    if (!showMap) return;

    let mounted = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    linkRef.current = link;

    import("react-leaflet").then((reactLeaflet) => {
      if (mounted) {
        setMapComponents({
          MapContainer: reactLeaflet.MapContainer,
          TileLayer: reactLeaflet.TileLayer,
          CircleMarker: reactLeaflet.CircleMarker,
          Popup: reactLeaflet.Popup,
          useMap: reactLeaflet.useMap,
        });
        setIsMapReady(true);
      }
    });

    return () => {
      mounted = false;
      if (linkRef.current && document.head.contains(linkRef.current)) {
        document.head.removeChild(linkRef.current);
      }
    };
  }, [showMap]);

  // Build select options for polling stations
  const pollingStationOptions = useMemo(
    () =>
      (pollingStationsData || [])
        .filter((station) => station.id != null)
        .map((station) => ({
          value: String(station.id),
          label:
            station.place_name ||
            station.place_name_en ||
            `Station ${station.id}`,
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

  const handleMapMarkerClick = (station: PollingStationWithCoords) => {
    const stationId = String(station.id);
    const isSelected = value.includes(stationId);
    handleToggleStation(stationId, !isSelected);
  };

  // Get labels for selected stations
  const [selectedStationsMap, setSelectedStationsMap] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (pollingStationsData) {
      const newMap = { ...selectedStationsMap };
      pollingStationsData.forEach((station) => {
        const id = String(station.id);
        if (value.includes(id)) {
          newMap[id] =
            station.place_name ||
            station.place_name_en ||
            `Station ${station.id}`;
        }
      });
      setSelectedStationsMap(newMap);
    }
  }, [pollingStationsData, value]);

  const selectedCount = value.length;
  const isLoadingMap = loadingPollingStations || loadingPlaces;

  return (
    <Stack gap="xs">
      <Group justify="space-between" align="center">
        <Text size="sm" fw={500}>
          Polling Stations{" "}
          <span style={{ color: "var(--mantine-color-red-6)" }}>*</span>
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
              {locationSelector.hasActiveFilters && (
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={locationSelector.clearFilters}
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
                {filterExpanded ? (
                  <CaretUp size={14} />
                ) : (
                  <CaretDown size={14} />
                )}
              </ActionIcon>
            </Group>
          </Group>

          <Collapse in={filterExpanded}>
            <Stack gap="xs">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                <Select
                  size="xs"
                  placeholder="Select Province"
                  data={locationSelector.provinceOptions}
                  value={locationSelector.selectedProvince}
                  onChange={locationSelector.setSelectedProvince}
                  searchable
                  clearable
                  disabled={locationSelector.loadingProvinces}
                  rightSection={
                    locationSelector.loadingProvinces ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  comboboxProps={{ withinPortal: false }}
                />

                <Select
                  size="xs"
                  placeholder="Select District"
                  data={locationSelector.districtOptions}
                  value={locationSelector.selectedDistrict}
                  onChange={locationSelector.setSelectedDistrict}
                  searchable
                  clearable
                  disabled={
                    !locationSelector.selectedProvince ||
                    locationSelector.loadingDistricts
                  }
                  rightSection={
                    locationSelector.loadingDistricts ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  comboboxProps={{ withinPortal: false }}
                />

                <Select
                  size="xs"
                  placeholder="Select Local Body"
                  data={locationSelector.localBodyOptions}
                  value={locationSelector.selectedLocalBody}
                  onChange={locationSelector.setSelectedLocalBody}
                  searchable
                  clearable
                  disabled={
                    !locationSelector.selectedDistrict ||
                    locationSelector.loadingLocalBodies
                  }
                  rightSection={
                    locationSelector.loadingLocalBodies ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  comboboxProps={{ withinPortal: false }}
                />

                <Select
                  size="xs"
                  placeholder="Select Ward"
                  data={locationSelector.wardOptions}
                  value={locationSelector.selectedWard}
                  onChange={locationSelector.setSelectedWard}
                  searchable
                  clearable
                  disabled={
                    !locationSelector.selectedLocalBody ||
                    locationSelector.loadingWards
                  }
                  rightSection={
                    locationSelector.loadingWards ? (
                      <Loader size="xs" />
                    ) : undefined
                  }
                  comboboxProps={{ withinPortal: false }}
                />
              </SimpleGrid>

              {/* Location Path Display */}
              {locationSelector.hasActiveFilters && (
                <Text size="xs" c="dimmed">
                  {locationSelector.getFullLocationPath()}
                </Text>
              )}
            </Stack>
          </Collapse>
        </Stack>
      </Paper>

      {/* Map Display */}
      {showMap && locationSelector.selectedWard && (
        <Paper withBorder style={{ overflow: "hidden" }}>
          <Box h={mapHeight} pos="relative">
            {!isMapReady || !MapComponents ? (
              <Center h="100%">
                <Loader size="sm" />
              </Center>
            ) : isLoadingMap ? (
              <Center h="100%">
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="xs" c="dimmed">
                    Loading polling stations...
                  </Text>
                </Stack>
              </Center>
            ) : stationsOnMap.length === 0 ? (
              <Center h="100%" bg="gray.0">
                <Stack align="center" gap="xs">
                  <MapPin size={32} color="var(--mantine-color-gray-5)" />
                  <Text size="sm" c="dimmed" ta="center">
                    {pollingStationsData && pollingStationsData.length > 0
                      ? "Polling stations found but no coordinates available"
                      : "No polling stations found in this ward"}
                  </Text>
                </Stack>
              </Center>
            ) : (
              <MapComponents.MapContainer
                center={[28.3949, 84.124]}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <MapComponents.TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapBoundsFitter
                  stations={stationsOnMap}
                  useMap={MapComponents.useMap}
                />
                {stationsOnMap.map((station) => {
                  const stationId = String(station.id);
                  const isSelected = value.includes(stationId);
                  return (
                    <MapComponents.CircleMarker
                      key={station.id}
                      center={[station.point!.lat, station.point!.lng]}
                      radius={isSelected ? 12 : 8}
                      pathOptions={{
                        fillColor: isSelected ? "#22c55e" : "#3b82f6",
                        color: isSelected ? "#16a34a" : "#2563eb",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8,
                      }}
                      eventHandlers={{
                        click: () => handleMapMarkerClick(station),
                      }}
                    >
                      <MapComponents.Popup>
                        <Box>
                          <Text size="sm" fw={500}>
                            {station.place_name || station.place_name_en}
                          </Text>
                          {station.station_code && (
                            <Text size="xs" c="dimmed">
                              Code: {station.station_code}
                            </Text>
                          )}
                          {isSelected && (
                            <Badge size="xs" color="green" mt={4}>
                              Selected
                            </Badge>
                          )}
                          <Text size="xs" c="blue" mt={4} style={{ cursor: "pointer" }}>
                            Click to {isSelected ? "deselect" : "select"}
                          </Text>
                        </Box>
                      </MapComponents.Popup>
                    </MapComponents.CircleMarker>
                  );
                })}
              </MapComponents.MapContainer>
            )}

            {/* Stations count badge */}
            {stationsOnMap.length > 0 && (
              <Badge
                pos="absolute"
                top={10}
                right={10}
                style={{ zIndex: 1000 }}
                variant="filled"
              >
                {stationsOnMap.length} on map
              </Badge>
            )}
          </Box>
        </Paper>
      )}

      {/* Available Polling Stations */}
      {locationSelector.selectedWard ? (
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
                    onChange={(e) =>
                      handleToggleStation(station.value, e.currentTarget.checked)
                    }
                  />
                ))}
              </Stack>
            </ScrollArea.Autosize>
          )}
        </Paper>
      ) : (
        <Text size="xs" c="dimmed">
          Please select Province → District → Local Body → Ward to view polling
          stations
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
                <Group
                  key={stationId}
                  justify="space-between"
                  align="center"
                  gap="xs"
                >
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
