"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Select,
  Text,
  Loader,
  Group,
  Badge,
  Center,
  ActionIcon,
  Breadcrumbs,
  Anchor,
  Tabs,
} from "@mantine/core";
import { ArrowLeft, X } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { GEO_UNIT_API } from "@/modules/config/location/geo-units/module.api";
import { PLACE_API } from "@/modules/config/location/places/module.api";

interface GeoUnit {
  id: number;
  unit_type: string;
  parent_id: number | null;
  display_name: string;
  official_code?: string;
  ward_no?: number | null;
}

interface Place {
  id: number;
  name: string;
  name_en?: string;
  place_type: string;
  point?: { lat: number; lng: number } | null;
}

interface MapComponents {
  MapContainer: any;
  TileLayer: any;
  CircleMarker: any;
  Popup: any;
  useMap: any;
}

// Helper to extract results from API response
const extractResults = (response: any): any[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response.results) return response.results;
  if (response.data?.results) return response.data.results;
  return [];
};

type LocationLevel = "PROVINCE" | "DISTRICT" | "LOCAL_BODY" | "WARD" | "PLACES";

const LEVEL_LABELS: Record<LocationLevel, string> = {
  PROVINCE: "Province",
  DISTRICT: "District",
  LOCAL_BODY: "Local Body",
  WARD: "Ward",
  PLACES: "Places",
};

// Map bounds fitter component
function MapBoundsFitter({
  points,
  useMap,
}: {
  points: { lat: number; lng: number }[];
  useMap: any;
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    import("leaflet").then((L) => {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    });
  }, [points, map]);

  return null;
}

export default function MapViewPage() {
  // Selection state - stores the selected item at each level
  const [selections, setSelections] = useState<{
    province: GeoUnit | null;
    district: GeoUnit | null;
    localBody: GeoUnit | null;
    ward: GeoUnit | null;
  }>({
    province: null,
    district: null,
    localBody: null,
    ward: null,
  });

  // Current level being selected
  const currentLevel = useMemo((): LocationLevel => {
    if (!selections.province) return "PROVINCE";
    if (!selections.district) return "DISTRICT";
    if (!selections.localBody) return "LOCAL_BODY";
    if (!selections.ward) return "WARD";
    return "PLACES";
  }, [selections]);

  // Map components state
  const [MapComponents, setMapComponents] = useState<MapComponents | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  // Get parent ID for current level
  const getParentId = (): number | null => {
    switch (currentLevel) {
      case "DISTRICT":
        return selections.province?.id || null;
      case "LOCAL_BODY":
        return selections.district?.id || null;
      case "WARD":
        return selections.localBody?.id || null;
      default:
        return null;
    }
  };

  // Fetch geo units for current level
  const parentId = getParentId();
  const { data: geoUnitsData, isLoading: loadingGeoUnits } = useQuery({
    queryKey: ["geo-units", currentLevel, parentId],
    queryFn: async () => {
      if (currentLevel === "PLACES") return [];

      const params: any = {
        unit_type: currentLevel,
        ordering: currentLevel === "WARD" ? "ward_no" : "display_name",
        page_size: 100,
      };

      if (parentId) {
        params.parent = parentId;
      }

      const response = await GEO_UNIT_API.getGeoUnits(params);
      return extractResults(response) as GeoUnit[];
    },
    enabled: currentLevel !== "PLACES",
  });

  // Fetch Places (when ward selected)
  const { data: placesData, isLoading: loadingPlaces } = useQuery({
    queryKey: ["places", selections.ward?.id],
    queryFn: async () => {
      if (!selections.ward) return [];
      const response = await PLACE_API.getPlaces({
        geo_unit: selections.ward.id,
        include_point: true,
        page_size: 200,
      });
      return extractResults(response) as Place[];
    },
    enabled: !!selections.ward,
  });

  // Load Leaflet
  useEffect(() => {
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
  }, []);

  // Build select options for current level
  const selectOptions = useMemo(() => {
    if (!geoUnitsData || geoUnitsData.length === 0) return [];
    return geoUnitsData.map((unit) => ({
      value: String(unit.id),
      label: unit.ward_no ? `Ward ${unit.ward_no}` : unit.display_name || `${currentLevel} ${unit.id}`,
    }));
  }, [geoUnitsData, currentLevel]);

  // Handle selection
  const handleSelect = (value: string | null) => {
    if (!value || !geoUnitsData) return;

    const selectedUnit = geoUnitsData.find((u) => String(u.id) === value);
    if (!selectedUnit) return;

    switch (currentLevel) {
      case "PROVINCE":
        setSelections({ province: selectedUnit, district: null, localBody: null, ward: null });
        break;
      case "DISTRICT":
        setSelections((prev) => ({ ...prev, district: selectedUnit, localBody: null, ward: null }));
        break;
      case "LOCAL_BODY":
        setSelections((prev) => ({ ...prev, localBody: selectedUnit, ward: null }));
        break;
      case "WARD":
        setSelections((prev) => ({ ...prev, ward: selectedUnit }));
        break;
    }
  };

  // Go back one level
  const goBack = () => {
    if (selections.ward) {
      setSelections((prev) => ({ ...prev, ward: null }));
    } else if (selections.localBody) {
      setSelections((prev) => ({ ...prev, localBody: null }));
    } else if (selections.district) {
      setSelections((prev) => ({ ...prev, district: null }));
    } else if (selections.province) {
      setSelections((prev) => ({ ...prev, province: null }));
    }
  };

  // Navigate to specific level
  const navigateToLevel = (level: LocationLevel) => {
    switch (level) {
      case "PROVINCE":
        setSelections({ province: null, district: null, localBody: null, ward: null });
        break;
      case "DISTRICT":
        setSelections((prev) => ({ ...prev, district: null, localBody: null, ward: null }));
        break;
      case "LOCAL_BODY":
        setSelections((prev) => ({ ...prev, localBody: null, ward: null }));
        break;
      case "WARD":
        setSelections((prev) => ({ ...prev, ward: null }));
        break;
    }
  };

  // Clear all
  const clearAll = () => {
    setSelections({ province: null, district: null, localBody: null, ward: null });
  };

  // Build breadcrumb items
  const breadcrumbItems = useMemo(() => {
    const items: { label: string; level: LocationLevel }[] = [];

    if (selections.province) {
      items.push({ label: selections.province.display_name, level: "PROVINCE" });
    }
    if (selections.district) {
      items.push({ label: selections.district.display_name, level: "DISTRICT" });
    }
    if (selections.localBody) {
      items.push({ label: selections.localBody.display_name, level: "LOCAL_BODY" });
    }
    if (selections.ward) {
      items.push({
        label: selections.ward.ward_no ? `Ward ${selections.ward.ward_no}` : selections.ward.display_name,
        level: "WARD"
      });
    }

    return items;
  }, [selections]);

  // Places with coordinates for map
  const placesWithCoords = useMemo(
    () => (placesData || []).filter((p) => p.point?.lat != null && p.point?.lng != null),
    [placesData]
  );

  // Only consider places loading when we're at the PLACES level
  const isLoading = currentLevel === "PLACES" ? loadingPlaces : loadingGeoUnits;
  const hasSelections = selections.province !== null;

  return (
    <Box h="100vh" w="100%" pos="relative">
      {/* Location Selector Overlay */}
      <Paper
        shadow="md"
        p="md"
        radius="md"
        pos="absolute"
        top={16}
        left={16}
        style={{ zIndex: 1000, maxWidth: 600 }}
      >
        <Stack gap="sm">
          {/* Header with breadcrumbs */}
          <Group justify="space-between" align="center">
            <Group gap="xs">
              {hasSelections && (
                <ActionIcon size="sm" variant="subtle" color="gray" onClick={goBack}>
                  <ArrowLeft size={16} />
                </ActionIcon>
              )}
              <Text size="sm" fw={600}>
                Select {LEVEL_LABELS[currentLevel]}
              </Text>
            </Group>
            {hasSelections && (
              <ActionIcon size="sm" variant="subtle" color="gray" onClick={clearAll}>
                <X size={16} />
              </ActionIcon>
            )}
          </Group>

          {/* Breadcrumbs showing current path */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs separator="→" separatorMargin={4}>
              {breadcrumbItems.map((item, index) => (
                <Anchor
                  key={item.level}
                  size="xs"
                  c={index === breadcrumbItems.length - 1 ? "blue" : "dimmed"}
                  onClick={() => navigateToLevel(item.level)}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </Anchor>
              ))}
            </Breadcrumbs>
          )}

          {/* Single Select for current level */}
          {currentLevel !== "PLACES" && (
            <>
              <Select
                placeholder={`Select ${LEVEL_LABELS[currentLevel]}...`}
                data={selectOptions}
                value={null}
                onChange={handleSelect}
                searchable
                clearable
                disabled={loadingGeoUnits}
                rightSection={loadingGeoUnits ? <Loader size="xs" /> : undefined}
                size="sm"
                nothingFoundMessage="No options found"
                comboboxProps={{ withinPortal: false }}
              />
            </>
          )}

          {/* Show places count when at places level */}
          {currentLevel === "PLACES" && (
            <Group gap="xs">
              <Badge size="lg" variant="light" color="blue">
                {placesWithCoords.length} places with coordinates
              </Badge>
              {loadingPlaces && <Loader size="xs" />}
            </Group>
          )}
        </Stack>
      </Paper>

      {/* Map */}
      {!isMapReady || !MapComponents ? (
        <Center h="100%">
          <Loader size="lg" />
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

          {/* Show places when ward is selected */}
          {selections.ward && placesWithCoords.length > 0 && (
            <>
              <MapBoundsFitter
                points={placesWithCoords.map((p) => p.point!)}
                useMap={MapComponents.useMap}
              />
              {placesWithCoords.map((place) => (
                <MapComponents.CircleMarker
                  key={place.id}
                  center={[place.point!.lat, place.point!.lng]}
                  radius={10}
                  pathOptions={{
                    fillColor: "#3b82f6",
                    color: "#2563eb",
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.8,
                  }}
                >
                  <MapComponents.Popup>
                    <Box>
                      <Text size="sm" fw={500}>
                        {place.name || place.name_en}
                      </Text>
                      <Badge size="xs" color="blue" mt={4}>
                        {place.place_type}
                      </Badge>
                    </Box>
                  </MapComponents.Popup>
                </MapComponents.CircleMarker>
              ))}
            </>
          )}
        </MapComponents.MapContainer>
      )}

      {/* Right Side Panel */}
      <Paper
        shadow="md"
        radius="md"
        pos="absolute"
        top={16}
        right={16}
        bottom={16}
        w="30%"
        style={{ zIndex: 1000, overflow: "hidden" }}
      >
        <Tabs defaultValue="plans" h="100%">
          <Tabs.List>
            <Tabs.Tab value="plans">Plans</Tabs.Tab>
            <Tabs.Tab value="statistics">Statistics</Tabs.Tab>
            <Tabs.Tab value="news">News</Tabs.Tab>
            <Tabs.Tab value="notes">Notes</Tabs.Tab>
          </Tabs.List>

          <Box p="md" style={{ height: "calc(100% - 42px)", overflowY: "auto" }}>
            <Tabs.Panel value="plans">
              <Text c="dimmed">Plans content goes here</Text>
            </Tabs.Panel>

            <Tabs.Panel value="statistics">
              <Text c="dimmed">Statistics content goes here</Text>
            </Tabs.Panel>

            <Tabs.Panel value="news">
              <Text c="dimmed">News content goes here</Text>
            </Tabs.Panel>

            <Tabs.Panel value="notes">
              <Text c="dimmed">Notes content goes here</Text>
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Paper>
    </Box>
  );
}
