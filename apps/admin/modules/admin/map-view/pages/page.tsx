"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Drawer,
  Group,
  Loader,
  Menu,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  TrashIcon,
  MapPinIcon,
  PathIcon,
  XIcon,
  DotsSixVerticalIcon,
  CursorIcon,
  RulerIcon,
  PencilSimpleIcon,
  CheckIcon,
  PlusIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  StackIcon,
  ChartBarIcon,
  ListIcon,
} from "@phosphor-icons/react";
import { useGeoBoundaries } from "../hooks/useGeoBoundaries";
import { LocationSelector } from "../components/LocationSelector";
import { ReportDashboard } from "../components/ReportDashboard";
import { VoterHeatmap } from "../components/VoterHeatmap";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { POLLING_STATIONS_API } from "@/modules/elections/data-entry-accounts/module.api";
import { moduleApiCall } from "@settle/core";
import { REPORTING_API } from "../api/reporting.api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";
const LIBRARIES: ("places" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "visualization",
];
const GORKHA_1_CENTER = { lat: 28.0, lng: 84.63 };
const DEFAULT_ZOOM = 12;

type MapMode = "browse" | "route" | "measure" | "reporting";

type ReportLevel =
  | "dashboard"
  | "district"
  | "municipality"
  | "ward"
  | "booth"
  | "religion-levels";

const MODES: { key: MapMode; icon: typeof CursorIcon; label: string }[] = [
  { key: "browse", icon: CursorIcon, label: "Browse" },
  { key: "route", icon: PathIcon, label: "Route" },
  { key: "measure", icon: RulerIcon, label: "Measure" },
  { key: "reporting", icon: ChartBarIcon, label: "Reporting" },
];

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

interface Booth {
  id: number;
  station_code: string | null;
  election_id: number;
  place_id: number;
  place_name_ne: string;
  place_name_en: string;
  ward_id: number;
  ward_no: number;
  ward_name_ne: string;
  ward_name_en: string;
  municipality_id: number;
  municipality_name_ne: string;
  municipality_name_en: string;
  district_id: number;
  district_name_ne: string;
  district_name_en: string;
  province_id: number;
  province_name_ne: string;
  province_name_en: string;
  latitude: number;
  longitude: number;
}

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  activities: Activity[];
}

interface RouteLeg {
  distance: string;
  duration: string;
  distanceValue: number;
  durationValue: number;
}

function getMarkerIcon(index: number, total: number) {
  const isFirst = index === 0;
  const isLast = index === total - 1 && total > 1;

  const color = isFirst ? "#38a169" : isLast ? "#e53e3e" : "#3182ce";

  return {
    path: "M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z",
    fillColor: color,
    fillOpacity: 1,
    strokeColor: "#fff",
    strokeWeight: 2,
    scale: 1.4,
    anchor: { x: 12, y: 24 } as google.maps.Point,
    labelOrigin: { x: 12, y: 9 } as google.maps.Point,
  };
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

// ── Mode Toolbar ──────────────────────────────────────────────
function ModeToolbar({
  active,
  onChange,
  mapRef,
  boundariesEnabled,
  onToggleBoundaries,
}: {
  active: MapMode;
  onChange: (mode: MapMode) => void;
  mapRef: React.RefObject<google.maps.Map | null>;
  boundariesEnabled: boolean;
  onToggleBoundaries: () => void;
}) {
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setPredictions([]);
      return;
    }
    if (!autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.AutocompleteService();
    }
    autocompleteRef.current.getPlacePredictions(
      { input: value, componentRestrictions: { country: "np" } },
      (results) => setPredictions(results || []),
    );
  }, []);

  const selectPlace = useCallback(
    (placeId: string) => {
      const placesService = new google.maps.places.PlacesService(
        mapRef.current!,
      );
      placesService.getDetails({ placeId, fields: ["geometry"] }, (place) => {
        if (place?.geometry?.location) {
          mapRef.current?.panTo(place.geometry.location);
          mapRef.current?.setZoom(15);
        }
      });
      setSearch("");
      setPredictions([]);
    },
    [mapRef],
  );

  return (
    <Paper
      pos="absolute"
      bottom={16}
      left="50%"
      style={{
        zIndex: 1000,
        transform: "translateX(-50%)",
        backgroundColor: "rgba(24, 24, 27, 0.92)",
        backdropFilter: "blur(8px)",
      }}
      radius="md"
      p={6}
      shadow="lg"
    >
      <Group gap={6} wrap="nowrap">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = active === mode.key;
          return (
            <Tooltip key={mode.key} label={mode.label} position="top" withArrow>
              <ActionIcon
                size="md"
                variant={isActive ? "filled" : "subtle"}
                color={isActive ? "blue" : "gray"}
                onClick={() => onChange(mode.key)}
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                }}
              >
                <Icon size={18} weight={isActive ? "fill" : "regular"} />
              </ActionIcon>
            </Tooltip>
          );
        })}
        <Divider orientation="vertical" color="rgba(255,255,255,0.15)" />
        <Box pos="relative">
          <TextInput
            size="xs"
            placeholder="Search places..."
            value={search}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            leftSection={
              <MagnifyingGlassIcon size={14} color="rgba(255,255,255,0.5)" />
            }
            w={200}
            styles={{
              input: {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderColor: "rgba(255,255,255,0.15)",
                color: "#fff",
                "&::placeholder": { color: "rgba(255,255,255,0.4)" },
              },
            }}
          />
          {predictions.length > 0 && (
            <Paper
              pos="absolute"
              bottom="100%"
              left={0}
              right={0}
              mb={4}
              shadow="md"
              radius="sm"
              style={{ overflow: "hidden" }}
            >
              {predictions.map((p) => (
                <Box
                  key={p.place_id}
                  px="sm"
                  py={6}
                  style={{
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "var(--mantine-color-gray-0)",
                    },
                  }}
                  onClick={() => selectPlace(p.place_id)}
                >
                  <Text size="xs" truncate>
                    {p.structured_formatting.main_text}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    {p.structured_formatting.secondary_text}
                  </Text>
                </Box>
              ))}
            </Paper>
          )}
        </Box>
        <Divider orientation="vertical" color="rgba(255,255,255,0.15)" />
        <Tooltip
          label={boundariesEnabled ? "Hide Boundaries" : "Show Boundaries"}
          position="top"
          withArrow
        >
          <ActionIcon
            size="md"
            variant={boundariesEnabled ? "filled" : "subtle"}
            color={boundariesEnabled ? "teal" : "gray"}
            onClick={onToggleBoundaries}
            style={{
              color: boundariesEnabled ? "#fff" : "rgba(255,255,255,0.7)",
            }}
          >
            <StackIcon
              size={18}
              weight={boundariesEnabled ? "fill" : "regular"}
            />
          </ActionIcon>
        </Tooltip>
      </Group>
    </Paper>
  );
}

// ── Route Panel ───────────────────────────────────────────────
function RoutePanel({
  waypoints,
  routeLegs,
  isCalculating,
  totalDistance,
  totalDuration,
  draggedIndex,
  onRemove,
  onRename,
  onClearAll,
  onDragStart,
  onDragOver,
  onDragEnd,
  onAddActivity,
  onUpdateActivity,
  onRemoveActivity,
}: {
  waypoints: Waypoint[];
  routeLegs: RouteLeg[];
  isCalculating: boolean;
  totalDistance: number;
  totalDuration: number;
  draggedIndex: number | null;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onClearAll: () => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onAddActivity: (waypointId: string) => void;
  onUpdateActivity: (
    waypointId: string,
    activityId: string,
    updates: Partial<Activity>,
  ) => void;
  onRemoveActivity: (waypointId: string, activityId: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (wp: Waypoint) => {
    setEditingId(wp.id);
    setEditValue(wp.label);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  return (
    <Paper
      shadow="md"
      radius="md"
      pos="absolute"
      top={16}
      right={16}
      bottom={16}
      w={320}
      style={{
        zIndex: 999,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box p="md" pb="xs">
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <PathIcon size={20} weight="bold" />
            <Text fw={700} size="md">
              Route Designer
            </Text>
          </Group>
          {waypoints.length > 0 && (
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={onClearAll}
              title="Clear all"
            >
              <TrashIcon size={16} />
            </ActionIcon>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          Click on the map to add waypoints
        </Text>
      </Box>

      <Divider />

      <ScrollArea flex={1} p="xs" px="md">
        {waypoints.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <MapPinIcon size={32} weight="thin" color="gray" />
              <Text size="sm" c="dimmed" ta="center">
                Click on the map to start
                <br />
                adding route points
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap={0}>
            {waypoints.map((wp, index) => (
              <Box key={wp.id}>
                <Group
                  gap="xs"
                  py={6}
                  px={4}
                  draggable={editingId !== wp.id}
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  style={{
                    cursor: editingId === wp.id ? "default" : "grab",
                    borderRadius: 6,
                    backgroundColor:
                      draggedIndex === index
                        ? "var(--mantine-color-blue-0)"
                        : undefined,
                  }}
                >
                  <DotsSixVerticalIcon
                    size={14}
                    color="var(--mantine-color-gray-5)"
                  />
                  <Badge
                    size="sm"
                    circle
                    color={
                      index === 0
                        ? "green"
                        : index === waypoints.length - 1
                          ? "red"
                          : "blue"
                    }
                  >
                    {index + 1}
                  </Badge>
                  <Stack gap={0} flex={1} miw={0}>
                    {editingId === wp.id ? (
                      <TextInput
                        size="xs"
                        value={editValue}
                        onChange={(e) => setEditValue(e.currentTarget.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit();
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        rightSection={
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            color="blue"
                            onClick={commitEdit}
                          >
                            <CheckIcon size={12} />
                          </ActionIcon>
                        }
                      />
                    ) : (
                      <Group gap={4} wrap="nowrap">
                        <Text size="xs" fw={500} truncate>
                          {wp.label}
                          {index === 0 && (
                            <Text span size="xs" c="green" ml={4}>
                              (Start)
                            </Text>
                          )}
                          {index === waypoints.length - 1 &&
                            waypoints.length > 1 && (
                              <Text span size="xs" c="red" ml={4}>
                                (End)
                              </Text>
                            )}
                        </Text>
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="gray"
                          onClick={() => startEditing(wp)}
                        >
                          <PencilSimpleIcon size={12} />
                        </ActionIcon>
                      </Group>
                    )}
                    <Text size="xs" c="dimmed">
                      {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
                    </Text>
                  </Stack>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => onRemove(wp.id)}
                  >
                    <XIcon size={12} />
                  </ActionIcon>
                </Group>

                {/* Activities */}
                <Box pl={38} pr={4}>
                  {wp.activities.map((act) => (
                    <Stack key={act.id} gap={0} py={3}>
                      <Group gap={4} wrap="nowrap">
                        <ClockIcon
                          size={12}
                          color="var(--mantine-color-gray-5)"
                        />
                        <TextInput
                          size="xs"
                          placeholder="Activity name"
                          value={act.name}
                          onChange={(e) =>
                            onUpdateActivity(wp.id, act.id, {
                              name: e.currentTarget.value,
                            })
                          }
                          style={{ flex: 1 }}
                          styles={{
                            input: { height: 24, minHeight: 24, fontSize: 11 },
                          }}
                        />
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => onRemoveActivity(wp.id, act.id)}
                        >
                          <XIcon size={10} />
                        </ActionIcon>
                      </Group>
                      <Group gap={4} pl={16} pt={2} wrap="nowrap">
                        <TextInput
                          size="xs"
                          type="time"
                          value={act.startTime}
                          onChange={(e) =>
                            onUpdateActivity(wp.id, act.id, {
                              startTime: e.currentTarget.value,
                            })
                          }
                          w={70}
                          styles={{
                            input: { height: 24, minHeight: 24, fontSize: 11 },
                          }}
                        />
                        <Text size="xs" c="dimmed">
                          –
                        </Text>
                        <TextInput
                          size="xs"
                          type="time"
                          value={act.endTime}
                          onChange={(e) =>
                            onUpdateActivity(wp.id, act.id, {
                              endTime: e.currentTarget.value,
                            })
                          }
                          w={70}
                          styles={{
                            input: { height: 24, minHeight: 24, fontSize: 11 },
                          }}
                        />
                      </Group>
                    </Stack>
                  ))}
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="blue"
                    onClick={() => onAddActivity(wp.id)}
                    mt={2}
                    mb={4}
                  >
                    <PlusIcon size={12} />
                  </ActionIcon>
                </Box>

                {index < waypoints.length - 1 && (
                  <Group gap={4} pl={30} py={2}>
                    <Box w={1} h={16} ml={8} bg="var(--mantine-color-blue-3)" />
                    {routeLegs[index] ? (
                      <Group gap={4}>
                        <Badge size="xs" variant="light" color="blue">
                          {routeLegs[index].distance}
                        </Badge>
                        <Badge size="xs" variant="light" color="gray">
                          {routeLegs[index].duration}
                        </Badge>
                      </Group>
                    ) : isCalculating ? (
                      <Loader size={10} />
                    ) : (
                      <Text size="xs" c="dimmed">
                        --
                      </Text>
                    )}
                  </Group>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </ScrollArea>

      {routeLegs.length > 0 && (
        <>
          <Divider />
          <Box p="md">
            <Group justify="space-between">
              <Text size="sm" fw={600}>
                Total
              </Text>
              <Group gap="xs">
                <Badge variant="filled" color="blue" size="md">
                  {formatDistance(totalDistance)}
                </Badge>
                <Badge variant="filled" color="gray" size="md">
                  {formatDuration(totalDuration)}
                </Badge>
              </Group>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              {waypoints.length} points, {routeLegs.length} legs
            </Text>
          </Box>
        </>
      )}
    </Paper>
  );
}

// ── Measure Panel ─────────────────────────────────────────────
function MeasurePanel({
  waypoints,
  onRemove,
  onClearAll,
}: {
  waypoints: Waypoint[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}) {
  // Calculate straight-line distances between consecutive points
  const legs: { distance: number }[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    const dist = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(a.lat, a.lng),
      new google.maps.LatLng(b.lat, b.lng),
    );
    legs.push({ distance: dist });
  }
  const totalDistance = legs.reduce((s, l) => s + l.distance, 0);

  return (
    <Paper
      shadow="md"
      radius="md"
      pos="absolute"
      top={16}
      right={16}
      bottom={16}
      w={320}
      style={{
        zIndex: 999,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box p="md" pb="xs">
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <RulerIcon size={20} weight="bold" />
            <Text fw={700} size="md">
              Measure Distance
            </Text>
          </Group>
          {waypoints.length > 0 && (
            <ActionIcon
              size="sm"
              variant="subtle"
              color="red"
              onClick={onClearAll}
              title="Clear all"
            >
              <TrashIcon size={16} />
            </ActionIcon>
          )}
        </Group>
        <Text size="xs" c="dimmed">
          Click on the map to measure straight-line distance
        </Text>
      </Box>

      <Divider />

      <ScrollArea flex={1} p="xs" px="md">
        {waypoints.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="xs">
              <RulerIcon size={32} weight="thin" color="gray" />
              <Text size="sm" c="dimmed" ta="center">
                Click on the map to place
                <br />
                measurement points
              </Text>
            </Stack>
          </Center>
        ) : (
          <Stack gap={0}>
            {waypoints.map((wp, index) => (
              <Box key={wp.id}>
                <Group gap="xs" py={6} px={4}>
                  <Badge size="sm" circle color="orange">
                    {index + 1}
                  </Badge>
                  <Stack gap={0} flex={1}>
                    <Text size="xs" fw={500}>
                      {wp.label}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
                    </Text>
                  </Stack>
                  <ActionIcon
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => onRemove(wp.id)}
                  >
                    <XIcon size={12} />
                  </ActionIcon>
                </Group>

                {index < waypoints.length - 1 && legs[index] && (
                  <Group gap={4} pl={30} py={2}>
                    <Box
                      w={1}
                      h={16}
                      ml={8}
                      bg="var(--mantine-color-orange-3)"
                    />
                    <Badge size="xs" variant="light" color="orange">
                      {formatDistance(Math.round(legs[index].distance))}
                    </Badge>
                  </Group>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </ScrollArea>

      {legs.length > 0 && (
        <>
          <Divider />
          <Box p="md">
            <Group justify="space-between">
              <Text size="sm" fw={600}>
                Total
              </Text>
              <Badge variant="filled" color="orange" size="md">
                {formatDistance(Math.round(totalDistance))}
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              {waypoints.length} points, {legs.length} segments
            </Text>
          </Box>
        </>
      )}
    </Paper>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function MapViewPage() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const isMobile = useMediaQuery("(max-width: 768px)");

  // Map instance ref
  const mapRef = useRef<google.maps.Map | null>(null);
  const [mode, setMode] = useState<MapMode>("browse");

  // Route mode state
  const [routeWaypoints, setRouteWaypoints] = useState<Waypoint[]>([]);
  const [routeLegs, setRouteLegs] = useState<RouteLeg[]>([]);
  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Measure mode state
  const [measureWaypoints, setMeasureWaypoints] = useState<Waypoint[]>([]);

  // Location selection state
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLocalBody, setSelectedLocalBody] = useState<string | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const [infoWindowBoothId, setInfoWindowBoothId] = useState<number | null>(
    null,
  );

  // Fetch voter data for heatmap when booth is selected
  const { data: voterData } = useQuery({
    queryKey: ["voter-roll-entries", selectedBooth],
    queryFn: async () => {
      if (!selectedBooth) return null;
      const response = await fetch(
        `/api/elections/voter-roll-entries/?polling_station=${selectedBooth}`,
      );
      const data = await response.json();
      return data;
    },
    enabled: !!selectedBooth && mode === "reporting",
  });

  // Cascading resets
  useEffect(() => {
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
    setSelectedBooth(null);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedLocalBody(null);
    setSelectedWard(null);
    setSelectedBooth(null);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedWard(null);
    setSelectedBooth(null);
  }, [selectedLocalBody]);

  useEffect(() => {
    setSelectedBooth(null);
  }, [selectedWard]);

  // Fetch polling stations based on current selection level
  const { data: booths } = useQuery({
    queryKey: [
      "polling-stations",
      selectedProvince,
      selectedDistrict,
      selectedLocalBody,
      selectedWard,
    ],
    queryFn: async () => {
      // Build query parameters based on selection level
      const params: any = {};

      // Priority: Ward > Municipality > District > Province
      if (selectedWard && selectedLocalBody) {
        params.municipality = Number(selectedLocalBody);
        params.ward_no = Number(selectedWard);
      } else if (selectedLocalBody) {
        // Fetch all polling stations for the municipality
        params.municipality = Number(selectedLocalBody);
      } else if (selectedDistrict) {
        params.district = Number(selectedDistrict);
      } else if (selectedProvince) {
        params.province = Number(selectedProvince);
        params.election = 1;
        params.page = 1;
        params.page_size = 500;
      } else {
        return [];
      }

      const data = await moduleApiCall.getRecords({
        endpoint: "/api/location/polling-stations/",
        params,
      });
      return (data?.results as Booth[]) || data || [];
    },
    enabled:
      !!(selectedProvince || selectedDistrict || selectedLocalBody) &&
      mode === "reporting",
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Mapping from GeoJSON municipality names to API municipality IDs
  const MUNICIPALITY_NAME_TO_ID: Record<string, string> = {
    Aarughat: "110",
    Arughat: "110",
    Gandaki: "121",
    Gorkha: "130",
    Chumnuwri: "145",
    Chumanuvri: "145",
    Dharche: "153",
    Bhimsen: "161",
    Bhimasenathapa: "161",
    "Sahid Lakhan": "170",
  };

  // Handle municipality boundary click
  const handleMunicipalityClick = useCallback((municipalityName: string) => {
    const municipalityId = MUNICIPALITY_NAME_TO_ID[municipalityName];
    if (municipalityId) {
      setSelectedLocalBody(municipalityId);
    }
  }, []);

  // Geo-boundary overlays
  const {
    isLoading: boundariesLoading,
    activeLayer,
    boundariesEnabled,
    setBoundariesEnabled,
  } = useGeoBoundaries({
    map: mapRef.current,
    onMunicipalityClick: handleMunicipalityClick,
  });

  // ── Reverse geocode to get place name ──
  const reverseGeocode = useCallback((id: string, lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const components = results[0].address_components;
        const locality =
          components.find((c) => c.types.includes("locality"))?.long_name ||
          components.find((c) => c.types.includes("sublocality_level_1"))
            ?.long_name ||
          components.find((c) =>
            c.types.includes("administrative_area_level_2"),
          )?.long_name ||
          results[0].formatted_address.split(",")[0];

        setRouteWaypoints((prev) =>
          prev.map((w) => (w.id === id ? { ...w, label: locality } : w)),
        );
      }
    });
  }, []);

  // ── Map click handler based on mode ──
  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng || mode === "browse") return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (mode === "route") {
        const id = `wp-${Date.now()}`;
        const newPoint: Waypoint = {
          id,
          lat,
          lng,
          label: `Point ${routeWaypoints.length + 1}`,
          activities: [],
        };
        setRouteWaypoints((prev) => [...prev, newPoint]);
        reverseGeocode(id, lat, lng);
      }

      if (mode === "measure") {
        const newPoint: Waypoint = {
          id: `mp-${Date.now()}`,
          lat,
          lng,
          label: `Point ${measureWaypoints.length + 1}`,
          activities: [],
        };
        setMeasureWaypoints((prev) => [...prev, newPoint]);
      }
    },
    [mode, routeWaypoints.length, measureWaypoints.length, reverseGeocode],
  );

  // ── Route helpers ──
  const renameRouteWaypoint = useCallback((id: string, name: string) => {
    setRouteWaypoints((prev) =>
      prev.map((w) => (w.id === id ? { ...w, label: name } : w)),
    );
  }, []);

  const removeRouteWaypoint = useCallback((id: string) => {
    setRouteWaypoints((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const clearRoute = useCallback(() => {
    setRouteWaypoints([]);
    setRouteLegs([]);
    setDirectionsResult(null);
  }, []);

  const handleDragStart = (index: number) => setDraggedIndex(index);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setRouteWaypoints((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(draggedIndex, 1);
      updated.splice(index, 0, moved);
      return updated.map((w, i) => ({ ...w, label: `Point ${i + 1}` }));
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  // ── Activity helpers ──
  const addActivity = useCallback((waypointId: string) => {
    setRouteWaypoints((prev) =>
      prev.map((w) =>
        w.id === waypointId
          ? {
              ...w,
              activities: [
                ...w.activities,
                {
                  id: `act-${Date.now()}`,
                  name: "",
                  startTime: "09:00",
                  endTime: "10:00",
                },
              ],
            }
          : w,
      ),
    );
  }, []);

  const updateActivity = useCallback(
    (waypointId: string, activityId: string, updates: Partial<Activity>) => {
      setRouteWaypoints((prev) =>
        prev.map((w) =>
          w.id === waypointId
            ? {
                ...w,
                activities: w.activities.map((a) =>
                  a.id === activityId ? { ...a, ...updates } : a,
                ),
              }
            : w,
        ),
      );
    },
    [],
  );

  const removeActivity = useCallback(
    (waypointId: string, activityId: string) => {
      setRouteWaypoints((prev) =>
        prev.map((w) =>
          w.id === waypointId
            ? {
                ...w,
                activities: w.activities.filter((a) => a.id !== activityId),
              }
            : w,
        ),
      );
    },
    [],
  );

  // ── Measure helpers ──
  const removeMeasureWaypoint = useCallback((id: string) => {
    setMeasureWaypoints((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      return filtered.map((w, i) => ({ ...w, label: `Point ${i + 1}` }));
    });
  }, []);

  const clearMeasure = useCallback(() => {
    setMeasureWaypoints([]);
  }, []);

  // Location selection handlers
  const handleClearAllLocations = useCallback(() => {
    setSelectedProvince(null);
    setSelectedDistrict(null);
    setSelectedLocalBody(null);
    setSelectedWard(null);
    setSelectedBooth(null);
  }, []);

  // Handle booth marker click
  const handleBoothClick = useCallback((boothId: number) => {
    setSelectedBooth(String(boothId));
    setInfoWindowBoothId(boothId);
  }, []);

  // Auto-focus map on selected location
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // If booth is selected, center on that booth
    if (selectedBooth && booths && booths.length > 0) {
      const booth = booths.find((b) => b.id === Number(selectedBooth));
      if (booth && booth.latitude && booth.longitude) {
        map.panTo({
          lat: booth.latitude,
          lng: booth.longitude,
        });
        map.setZoom(16); // Zoom in close for booth view
      }
    }
    // If no booth selected, fit bounds to all booths
    else if (booths && booths.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      let hasValidCoords = false;

      booths.forEach((booth) => {
        if (booth.latitude && booth.longitude) {
          bounds.extend({
            lat: booth.latitude,
            lng: booth.longitude,
          });
          hasValidCoords = true;
        }
      });

      if (hasValidCoords) {
        map.fitBounds(bounds);
        // Limit max zoom after fitBounds
        const listener = google.maps.event.addListenerOnce(
          map,
          "bounds_changed",
          () => {
            const currentZoom = map.getZoom();
            if (currentZoom && currentZoom > 15) {
              map.setZoom(15);
            }
          },
        );
      }
    }
  }, [selectedBooth, selectedWard, booths]);

  // Report modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [reportLevel, setReportLevel] = useState<ReportLevel | null>(null);
  const [reportParams, setReportParams] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState("");

  // Fetch report data when modal is open
  const {
    data: reportData,
    isLoading: loadingReport,
    error: reportError,
  } = useQuery({
    queryKey: ["reporting", reportLevel, reportParams],
    queryFn: async () => {
      if (!reportLevel) return null;
      switch (reportLevel) {
        case "dashboard":
          return REPORTING_API.getDashboardSummary(reportParams);
        case "district":
          return REPORTING_API.getDistricts(reportParams);
        case "municipality":
          return REPORTING_API.getMunicipalities(reportParams);
        case "ward":
          return REPORTING_API.getWards(reportParams);
        case "booth":
          return REPORTING_API.getBooths(reportParams);
        case "religion-levels":
          return REPORTING_API.getReligionLevels(reportParams);
        default:
          return null;
      }
    },
    enabled: modalOpen && !!reportLevel,
  });

  const openReport = (level: ReportLevel, params: any, title: string) => {
    setReportLevel(level);
    setReportParams(params);
    setReportTitle(title);
    setModalOpen(true);
  };

  // Auto-open report panel only when a new selection is made (not on clear)
  const prevSelectionRef = useRef({
    district: selectedDistrict,
    localBody: selectedLocalBody,
    ward: selectedWard,
    booth: selectedBooth,
  });
  useEffect(() => {
    const prev = prevSelectionRef.current;
    const isNewSelection =
      (selectedDistrict && selectedDistrict !== prev.district) ||
      (selectedLocalBody && selectedLocalBody !== prev.localBody) ||
      (selectedWard && selectedWard !== prev.ward) ||
      (selectedBooth && selectedBooth !== prev.booth);

    prevSelectionRef.current = {
      district: selectedDistrict,
      localBody: selectedLocalBody,
      ward: selectedWard,
      booth: selectedBooth,
    };

    if (isNewSelection && mode === "reporting") {
      const report = getCurrentLocationReport();
      if (report) {
        setReportLevel(report.level);
        setReportParams(report.params);
        setReportTitle(report.title);
        setModalOpen(true);
      }
    }
  }, [selectedDistrict, selectedLocalBody, selectedWard, selectedBooth, mode]);

  // Determine current location level and params
  const getCurrentLocationReport = () => {
    if (selectedBooth && selectedWard) {
      return {
        level: "booth" as ReportLevel,
        params: {
          polling_station: Number(selectedBooth),
          ward: Number(selectedWard),
        },
        title: "Booth Report",
      };
    }
    if (selectedWard && selectedLocalBody) {
      return {
        level: "ward" as ReportLevel,
        params: {
          ward: Number(selectedWard),
          municipality: Number(selectedLocalBody),
          district: Number(selectedDistrict),
        },
        title: "Ward Report",
      };
    }
    if (selectedLocalBody && selectedDistrict) {
      return {
        level: "municipality" as ReportLevel,
        params: {
          municipality: Number(selectedLocalBody),
          district: Number(selectedDistrict),
        },
        title: "Municipality Report",
      };
    }
    if (selectedDistrict) {
      return {
        level: "district" as ReportLevel,
        params: { district: Number(selectedDistrict) },
        title: "District Report",
      };
    }
    return null;
  };

  const getReligionParams = () => {
    if (selectedBooth) {
      return {
        scope: "BOOTH" as const,
        polling_station: Number(selectedBooth),
      };
    }
    if (selectedWard) {
      return { scope: "WARD" as const, geo_unit: Number(selectedWard) };
    }
    if (selectedLocalBody) {
      return {
        scope: "MUNICIPALITY" as const,
        geo_unit: Number(selectedLocalBody),
      };
    }
    if (selectedDistrict) {
      return {
        scope: "DISTRICT" as const,
        geo_unit: Number(selectedDistrict),
      };
    }
    return { scope: "NATIONAL" as const };
  };

  // ── Directions calculation ──
  useEffect(() => {
    if (routeWaypoints.length < 2) {
      setDirectionsResult(null);
      setRouteLegs([]);
      return;
    }

    setIsCalculating(true);
    const directionsService = new google.maps.DirectionsService();

    const origin = { lat: routeWaypoints[0].lat, lng: routeWaypoints[0].lng };
    const destination = {
      lat: routeWaypoints[routeWaypoints.length - 1].lat,
      lng: routeWaypoints[routeWaypoints.length - 1].lng,
    };
    const intermediateWaypoints = routeWaypoints.slice(1, -1).map((wp) => ({
      location: { lat: wp.lat, lng: wp.lng },
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints: intermediateWaypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false,
      },
      (result, status) => {
        setIsCalculating(false);
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResult(result);
          const legs = result.routes[0].legs.map((leg) => ({
            distance: leg.distance?.text || "",
            duration: leg.duration?.text || "",
            distanceValue: leg.distance?.value || 0,
            durationValue: leg.duration?.value || 0,
          }));
          setRouteLegs(legs);
        } else {
          setDirectionsResult(null);
          setRouteLegs([]);
        }
      },
    );
  }, [routeWaypoints]);

  const totalDistance = routeLegs.reduce((s, l) => s + l.distanceValue, 0);
  const totalDuration = routeLegs.reduce((s, l) => s + l.durationValue, 0);

  if (!isLoaded) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box pos="relative" h="100vh" style={{ overflow: "hidden" }}>
      {/* Main Map Container */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: modalOpen && mode === "reporting" ? "500px" : 0,
          bottom: 0,
          transition: "right 0.3s ease",
        }}
      >
        <Box h="100vh" w="100%" pos="relative">
          {/* Mode Toolbar */}
          <ModeToolbar
            active={mode}
            onChange={setMode}
            mapRef={mapRef}
            boundariesEnabled={boundariesEnabled}
            onToggleBoundaries={() => setBoundariesEnabled(!boundariesEnabled)}
          />
          {boundariesEnabled && (
            <Badge
              pos="absolute"
              top={16}
              left={16}
              style={{ zIndex: 1000 }}
              variant="light"
              color="blue"
              size="sm"
              leftSection={boundariesLoading ? <Loader size={10} /> : undefined}
            >
              {activeLayer === "constituency"
                ? "Constituency"
                : activeLayer === "municipalities"
                  ? "Municipalities"
                  : "Wards"}
            </Badge>
          )}

          {/* Route Panel */}
          {mode === "route" && (
            <RoutePanel
              waypoints={routeWaypoints}
              routeLegs={routeLegs}
              isCalculating={isCalculating}
              totalDistance={totalDistance}
              totalDuration={totalDuration}
              draggedIndex={draggedIndex}
              onRemove={removeRouteWaypoint}
              onRename={renameRouteWaypoint}
              onClearAll={clearRoute}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onAddActivity={addActivity}
              onUpdateActivity={updateActivity}
              onRemoveActivity={removeActivity}
            />
          )}

          {/* Measure Panel */}
          {mode === "measure" && (
            <MeasurePanel
              waypoints={measureWaypoints}
              onRemove={removeMeasureWaypoint}
              onClearAll={clearMeasure}
            />
          )}

          {/* Location Selector (only in reporting mode) */}
          {mode === "reporting" && (
            <LocationSelector
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedLocalBody={selectedLocalBody}
              selectedWard={selectedWard}
              selectedBooth={selectedBooth}
              onProvinceChange={setSelectedProvince}
              onDistrictChange={setSelectedDistrict}
              onLocalBodyChange={setSelectedLocalBody}
              onWardChange={setSelectedWard}
              onBoothChange={setSelectedBooth}
              onClearAll={handleClearAllLocations}
            />
          )}

          {/* Google Map */}
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={GORKHA_1_CENTER}
            zoom={DEFAULT_ZOOM}
            onLoad={onMapLoad}
            onClick={onMapClick}
            options={{
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
              mapTypeId: "roadmap",
              draggableCursor:
                mode === "browse" || mode === "reporting"
                  ? undefined
                  : "crosshair",
            }}
          >
            {/* Route markers */}
            {mode === "route" &&
              routeWaypoints.map((wp, index) => (
                <MarkerF
                  key={wp.id}
                  position={{ lat: wp.lat, lng: wp.lng }}
                  label={{
                    text: String(index + 1),
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  icon={getMarkerIcon(index, routeWaypoints.length)}
                  draggable
                  onDragEnd={(e) => {
                    if (!e.latLng) return;
                    setRouteWaypoints((prev) =>
                      prev.map((w, i) =>
                        i === index
                          ? { ...w, lat: e.latLng!.lat(), lng: e.latLng!.lng() }
                          : w,
                      ),
                    );
                  }}
                />
              ))}

            {/* Route directions */}
            {mode === "route" && directionsResult && (
              <DirectionsRenderer
                directions={directionsResult}
                options={{
                  suppressMarkers: true,
                  preserveViewport: true,
                  polylineOptions: {
                    strokeColor: "#3b82f6",
                    strokeWeight: 4,
                    strokeOpacity: 0.85,
                  },
                }}
              />
            )}

            {/* Measure markers + lines */}
            {mode === "measure" &&
              measureWaypoints.map((wp, index) => (
                <MarkerF
                  key={wp.id}
                  position={{ lat: wp.lat, lng: wp.lng }}
                  label={{
                    text: String(index + 1),
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "bold",
                  }}
                  icon={{
                    path: "M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0Z",
                    fillColor: "#e8590c",
                    fillOpacity: 1,
                    strokeColor: "#fff",
                    strokeWeight: 2,
                    scale: 1.4,
                    anchor: { x: 12, y: 24 } as google.maps.Point,
                    labelOrigin: { x: 12, y: 9 } as google.maps.Point,
                  }}
                  draggable
                  onDragEnd={(e) => {
                    if (!e.latLng) return;
                    setMeasureWaypoints((prev) =>
                      prev.map((w, i) =>
                        i === index
                          ? { ...w, lat: e.latLng!.lat(), lng: e.latLng!.lng() }
                          : w,
                      ),
                    );
                  }}
                />
              ))}

            {/* Measure polyline (straight lines) */}
            {mode === "measure" && measureWaypoints.length >= 2 && (
              <>
                {(() => {
                  const path = measureWaypoints.map((wp) => ({
                    lat: wp.lat,
                    lng: wp.lng,
                  }));
                  return <MarkerF visible={false} position={path[0]} />;
                })()}
                {/* Render polyline via map ref */}
                <MeasurePolyline mapRef={mapRef} waypoints={measureWaypoints} />
              </>
            )}

            {/* TODO: Booth markers disabled for now — re-enable when lat/lng ready */}

            {/* Gorkha-1 constituency label */}
            {boundariesEnabled && (
              <OverlayViewF
                position={{ lat: 28.28, lng: 84.83 }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div
                  style={{
                    transform: "translate(-50%, -50%)",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#1e3a5f",
                    textShadow:
                      "0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.7)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    userSelect: "none",
                    letterSpacing: "1px",
                  }}
                >
                  गोरखा-१ | Gorkha-1
                </div>
              </OverlayViewF>
            )}

            {/* Voter Heatmap - shows when booth is selected */}
            {mode === "reporting" && selectedBooth && voterData && (
              <VoterHeatmap map={mapRef.current} voterData={voterData} />
            )}
          </GoogleMap>
        </Box>
      </Box>

      {/* Report Panel Content */}
      {(() => {
        if (!modalOpen || mode !== "reporting") return null;

        const reportContent = (
          <>
            <Box p="md" style={{ borderBottom: "1px solid #e0e0e0" }}>
              <Group justify="space-between" mb="sm">
                <Group gap="xs">
                  <ChartBarIcon size={20} weight="bold" />
                  <Text fw={600}>{reportTitle}</Text>
                </Group>
                {!isMobile && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => setModalOpen(false)}
                  >
                    <XIcon size={18} />
                  </ActionIcon>
                )}
              </Group>

              {/* Report Navigation Buttons */}
              <Group gap="xs" wrap="wrap">
                <Button
                  size="xs"
                  variant={reportLevel === "dashboard" ? "filled" : "light"}
                  color="indigo"
                  onClick={() => {
                    openReport(
                      "dashboard",
                      {
                        ...(selectedDistrict && {
                          district: Number(selectedDistrict),
                        }),
                        ...(selectedLocalBody && {
                          municipality: Number(selectedLocalBody),
                        }),
                        top_n: 5,
                      },
                      "Dashboard Summary",
                    );
                  }}
                  leftSection={<ChartBarIcon size={14} />}
                >
                  Dashboard
                </Button>

                {getCurrentLocationReport() && (
                  <Button
                    size="xs"
                    variant={
                      reportLevel === getCurrentLocationReport()!.level
                        ? "filled"
                        : "light"
                    }
                    color="blue"
                    onClick={() => {
                      const report = getCurrentLocationReport()!;
                      openReport(report.level, report.params, report.title);
                    }}
                    leftSection={<ChartBarIcon size={14} />}
                  >
                    Current Location
                  </Button>
                )}

                <Button
                  size="xs"
                  variant={reportLevel === "religion-levels" ? "filled" : "light"}
                  color="violet"
                  onClick={() => {
                    openReport(
                      "religion-levels",
                      { ...getReligionParams(), ordering: "-count" },
                      "Religion Levels",
                    );
                  }}
                  leftSection={<ChartBarIcon size={14} />}
                >
                  Religion
                </Button>
              </Group>
            </Box>

            <ScrollArea h={isMobile ? "calc(70vh - 65px)" : "calc(100vh - 65px)"} px="md">
              {loadingReport && (
                <Stack align="center" py="xl">
                  <Loader size="md" />
                  <Text size="sm" c="dimmed">
                    Loading report data...
                  </Text>
                </Stack>
              )}

              {reportError && (
                <Stack align="center" py="xl">
                  <Badge color="red" size="lg">
                    Error
                  </Badge>
                  <Text size="sm" c="red">
                    {(reportError as Error).message || "Failed to load report"}
                  </Text>
                </Stack>
              )}

              {!loadingReport && !reportError && reportData && (
                <ReportDashboard
                  data={reportData}
                  reportType={reportLevel || "booth"}
                />
              )}

              {!loadingReport && !reportError && !reportData && (
                <Text c="dimmed" ta="center" py="xl">
                  No report data available
                </Text>
              )}
            </ScrollArea>
          </>
        );

        if (isMobile) {
          return (
            <Drawer
              opened={modalOpen}
              onClose={() => setModalOpen(false)}
              position="bottom"
              size="75%"
              withCloseButton
              title={reportTitle}
            >
              {reportContent}
            </Drawer>
          );
        }

        return (
          <Box
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "500px",
              height: "100vh",
              backgroundColor: "white",
              borderLeft: "1px solid #e0e0e0",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {reportContent}
          </Box>
        );
      })()}
    </Box>
  );
}

// ── Measure Polyline component (uses imperative Google Maps API) ──
function MeasurePolyline({
  mapRef,
  waypoints,
}: {
  mapRef: React.RefObject<google.maps.Map | null>;
  waypoints: Waypoint[];
}) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const path = waypoints.map((wp) => ({ lat: wp.lat, lng: wp.lng }));
    polylineRef.current = new google.maps.Polyline({
      path,
      strokeColor: "#e8590c",
      strokeWeight: 3,
      strokeOpacity: 0.8,
      geodesic: true,
      map: mapRef.current,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [mapRef, waypoints]);

  return null;
}
