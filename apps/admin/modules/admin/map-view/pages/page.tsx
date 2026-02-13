"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Box,
  Loader,
  Center,
  Paper,
  Stack,
  Text,
  Group,
  ActionIcon,
  Badge,
  Divider,
  ScrollArea,
  Tooltip,
  TextInput,
} from "@mantine/core";
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
} from "@phosphor-icons/react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];
const GORKHA_1_CENTER = { lat: 28.0, lng: 84.63 };
const DEFAULT_ZOOM = 12;

type MapMode = "browse" | "route" | "measure";

const MODES: { key: MapMode; icon: typeof CursorIcon; label: string }[] = [
  { key: "browse", icon: CursorIcon, label: "Browse" },
  { key: "route", icon: PathIcon, label: "Route" },
  { key: "measure", icon: RulerIcon, label: "Measure" },
];

interface Activity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
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
}: {
  active: MapMode;
  onChange: (mode: MapMode) => void;
  mapRef: React.RefObject<google.maps.Map | null>;
}) {
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (!value.trim()) {
        setPredictions([]);
        return;
      }
      if (!autocompleteRef.current) {
        autocompleteRef.current =
          new google.maps.places.AutocompleteService();
      }
      autocompleteRef.current.getPlacePredictions(
        { input: value, componentRestrictions: { country: "np" } },
        (results) => setPredictions(results || [])
      );
    },
    []
  );

  const selectPlace = useCallback(
    (placeId: string) => {
      const placesService = new google.maps.places.PlacesService(
        mapRef.current!
      );
      placesService.getDetails(
        { placeId, fields: ["geometry"] },
        (place) => {
          if (place?.geometry?.location) {
            mapRef.current?.panTo(place.geometry.location);
            mapRef.current?.setZoom(15);
          }
        }
      );
      setSearch("");
      setPredictions([]);
    },
    [mapRef]
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
            <Tooltip
              key={mode.key}
              label={mode.label}
              position="top"
              withArrow
            >
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
            leftSection={<MagnifyingGlassIcon size={14} color="rgba(255,255,255,0.5)" />}
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
                    "&:hover": { backgroundColor: "var(--mantine-color-gray-0)" },
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
  onUpdateActivity: (waypointId: string, activityId: string, updates: Partial<Activity>) => void;
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
                        <ClockIcon size={12} color="var(--mantine-color-gray-5)" />
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
                          styles={{ input: { height: 24, minHeight: 24, fontSize: 11 } }}
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
                          styles={{ input: { height: 24, minHeight: 24, fontSize: 11 } }}
                        />
                        <Text size="xs" c="dimmed">–</Text>
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
                          styles={{ input: { height: 24, minHeight: 24, fontSize: 11 } }}
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

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    map.setOptions({ controlSize: 24 });
  }, []);

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
          : w
      )
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
                  a.id === activityId ? { ...a, ...updates } : a
                ),
              }
            : w
        )
      );
    },
    []
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
            : w
        )
      );
    },
    []
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
    <Box h="100vh" w="100%" pos="relative">
      {/* Mode Toolbar */}
      <ModeToolbar active={mode} onChange={setMode} mapRef={mapRef} />

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
          draggableCursor: mode === "browse" ? undefined : "crosshair",
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
      </GoogleMap>
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
