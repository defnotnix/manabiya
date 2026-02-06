"use client";

import { useEffect, useState, useRef, useMemo } from "react";
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
  Box,
  Center,
  SimpleGrid,
} from "@mantine/core";
import { CaretDown, CaretUp, X, MapPin } from "@phosphor-icons/react";
import {
  useLocationSelector,
  UseLocationSelectorOptions,
  Place,
} from "./useLocationSelector";

interface MapComponents {
  MapContainer: any;
  TileLayer: any;
  CircleMarker: any;
  Popup: any;
  useMap: any;
}

interface LocationSelectorWithMapProps extends UseLocationSelectorOptions {
  /** Height of the map container */
  mapHeight?: number | string;
  /** Whether to show the map */
  showMap?: boolean;
  /** Callback when a place is clicked on the map */
  onPlaceClick?: (place: Place) => void;
  /** Currently selected place IDs (for highlighting) */
  selectedPlaceIds?: string[];
  /** Custom marker color */
  markerColor?: string;
  /** Show filter panel expanded by default */
  defaultExpanded?: boolean;
  /** Label for the component */
  label?: string;
  /** Enable compact mode (smaller gaps, smaller text) */
  compact?: boolean;
}

// Map bounds fitter component
function MapBoundsFitter({
  places,
  useMap,
}: {
  places: Place[];
  useMap: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const validPlaces = places.filter(
      (p) => p.point?.lat != null && p.point?.lng != null
    );
    if (validPlaces.length === 0) return;

    // Import Leaflet dynamically to get LatLngBounds
    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(
        validPlaces.map((p) => [p.point!.lat, p.point!.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    });
  }, [places, map]);

  return null;
}

export function LocationSelectorWithMap({
  mapHeight = 300,
  showMap = true,
  onPlaceClick,
  selectedPlaceIds = [],
  markerColor = "#3b82f6",
  defaultExpanded = true,
  label = "Location Filter",
  compact = false,
  ...selectorOptions
}: LocationSelectorWithMapProps) {
  const [filterExpanded, setFilterExpanded] = useState(defaultExpanded);
  const [MapComponents, setMapComponents] = useState<MapComponents | null>(
    null
  );
  const [isMapReady, setIsMapReady] = useState(false);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  const selector = useLocationSelector({
    ...selectorOptions,
    includePoint: showMap ? true : selectorOptions.includePoint,
  });

  // Load Leaflet CSS and components
  useEffect(() => {
    if (!showMap) return;

    let mounted = true;

    // Add Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    linkRef.current = link;

    // Load react-leaflet components
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

  // Places with valid coordinates
  const placesWithCoords = useMemo(
    () =>
      selector.places.filter(
        (p) => p.point?.lat != null && p.point?.lng != null
      ),
    [selector.places]
  );

  const gap = compact ? "xs" : "sm";
  const textSize = compact ? "xs" : "sm";

  return (
    <Stack gap={gap}>
      {/* Location Filter Panel */}
      <Paper withBorder p="xs">
        <Stack gap="xs">
          <Group justify="space-between" align="center">
            <Text size={textSize} c="dimmed">
              {label}
            </Text>
            <Group gap="xs">
              {selector.hasActiveFilters && (
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={selector.clearFilters}
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
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xs">
              <Select
                size="xs"
                placeholder="Select Province"
                data={selector.provinceOptions}
                value={selector.selectedProvince}
                onChange={selector.setSelectedProvince}
                searchable
                clearable
                disabled={selector.loadingProvinces}
                rightSection={
                  selector.loadingProvinces ? <Loader size="xs" /> : undefined
                }
                comboboxProps={{ withinPortal: false }}
              />

              <Select
                size="xs"
                placeholder="Select District"
                data={selector.districtOptions}
                value={selector.selectedDistrict}
                onChange={selector.setSelectedDistrict}
                searchable
                clearable
                disabled={!selector.selectedProvince || selector.loadingDistricts}
                rightSection={
                  selector.loadingDistricts ? <Loader size="xs" /> : undefined
                }
                comboboxProps={{ withinPortal: false }}
              />

              <Select
                size="xs"
                placeholder="Select Local Body"
                data={selector.localBodyOptions}
                value={selector.selectedLocalBody}
                onChange={selector.setSelectedLocalBody}
                searchable
                clearable
                disabled={
                  !selector.selectedDistrict || selector.loadingLocalBodies
                }
                rightSection={
                  selector.loadingLocalBodies ? <Loader size="xs" /> : undefined
                }
                comboboxProps={{ withinPortal: false }}
              />

              <Select
                size="xs"
                placeholder="Select Ward"
                data={selector.wardOptions}
                value={selector.selectedWard}
                onChange={selector.setSelectedWard}
                searchable
                clearable
                disabled={!selector.selectedLocalBody || selector.loadingWards}
                rightSection={
                  selector.loadingWards ? <Loader size="xs" /> : undefined
                }
                comboboxProps={{ withinPortal: false }}
              />
            </SimpleGrid>

            {/* Location Path Display */}
            {selector.hasActiveFilters && (
              <Text size="xs" c="dimmed" mt="xs">
                {selector.getFullLocationPath()}
              </Text>
            )}
          </Collapse>
        </Stack>
      </Paper>

      {/* Map Display */}
      {showMap && (
        <Paper withBorder style={{ overflow: "hidden" }}>
          <Box h={mapHeight} pos="relative">
            {!isMapReady || !MapComponents ? (
              <Center h="100%">
                <Loader size="sm" />
              </Center>
            ) : !selector.selectedWard ? (
              <Center h="100%" bg="gray.0">
                <Stack align="center" gap="xs">
                  <MapPin size={32} color="var(--mantine-color-gray-5)" />
                  <Text size="sm" c="dimmed">
                    Select a location to view places on map
                  </Text>
                </Stack>
              </Center>
            ) : selector.loadingPlaces ? (
              <Center h="100%">
                <Stack align="center" gap="xs">
                  <Loader size="sm" />
                  <Text size="xs" c="dimmed">
                    Loading places...
                  </Text>
                </Stack>
              </Center>
            ) : placesWithCoords.length === 0 ? (
              <Center h="100%" bg="gray.0">
                <Stack align="center" gap="xs">
                  <MapPin size={32} color="var(--mantine-color-gray-5)" />
                  <Text size="sm" c="dimmed">
                    No places with coordinates found
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
                  places={placesWithCoords}
                  useMap={MapComponents.useMap}
                />
                {placesWithCoords.map((place) => {
                  const isSelected = selectedPlaceIds.includes(
                    String(place.id)
                  );
                  return (
                    <MapComponents.CircleMarker
                      key={place.id}
                      center={[place.point!.lat, place.point!.lng]}
                      radius={isSelected ? 12 : 8}
                      pathOptions={{
                        fillColor: isSelected ? "#22c55e" : markerColor,
                        color: isSelected ? "#16a34a" : "#2563eb",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8,
                      }}
                      eventHandlers={{
                        click: () => onPlaceClick?.(place),
                      }}
                    >
                      <MapComponents.Popup>
                        <Box>
                          <Text size="sm" fw={500}>
                            {place.name || place.name_en}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {place.place_type}
                          </Text>
                          {isSelected && (
                            <Badge size="xs" color="green" mt={4}>
                              Selected
                            </Badge>
                          )}
                        </Box>
                      </MapComponents.Popup>
                    </MapComponents.CircleMarker>
                  );
                })}
              </MapComponents.MapContainer>
            )}

            {/* Places count badge */}
            {selector.selectedWard && placesWithCoords.length > 0 && (
              <Badge
                pos="absolute"
                top={10}
                right={10}
                style={{ zIndex: 1000 }}
                variant="filled"
              >
                {placesWithCoords.length} place
                {placesWithCoords.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </Box>
        </Paper>
      )}
    </Stack>
  );
}

export { useLocationSelector };
export type { Place, GeoUnit, LocationState } from "./useLocationSelector";
