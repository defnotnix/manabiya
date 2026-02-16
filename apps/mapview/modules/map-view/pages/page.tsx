"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionIcon,
  Badge,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  XIcon,
  FunnelIcon,
  SparkleIcon,
  TagIcon,
  UsersIcon,
  GenderFemaleIcon,
  GenderMaleIcon,
  MagnifyingGlassIcon,
  CaretDownIcon,
  MountainsIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useGeoBoundaries } from "../hooks/useGeoBoundaries";
import { ReportDashboard } from "../components/ReportDashboard";
import { REPORTING_API } from "../api/reporting.api";
import {
  GEO_UNIT_API,
  POLLING_STATIONS_API,
  PROBLEMS_API,
} from "../module.api";
import { ProblemMarkerDialog } from "../components/ProblemMarkerDialog";
import { ProblemForm } from "../components/ProblemForm";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayViewF,
  OverlayView,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "";
const LIBRARIES: ("places" | "geometry" | "visualization")[] = [
  "places",
  "geometry",
  "visualization",
];
const GORKHA_1_CENTER = { lat: 28.0, lng: 84.63 };
const DEFAULT_ZOOM = 12;

type ReportLevel = "district" | "municipality" | "ward" | "booth";

// GeoJSON municipality name → API municipality ID
const MUNICIPALITY_NAME_TO_ID: Record<string, number> = {
  Aarughat: 110,
  Arughat: 110,
  Gandaki: 121,
  Gorkha: 130,
  Chumnuwri: 145,
  Chumanuvri: 145,
  Dharche: 153,
  Bhimsen: 161,
  Bhimasenathapa: 161,
  "Sahid Lakhan": 170,
};

const MAP_STYLES_NO_LABELS: google.maps.MapTypeStyle[] = [
  {
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];

const MAP_STYLES_DARK_THEME: google.maps.MapTypeStyle[] = [
  {
    elementType: "geometry",
    stylers: [{ color: "#212121" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }, { visibility: "off" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  ward_no?: number | null;
}

interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
}

function formatDisplayName(unit: GeoUnit): string {
  const nepali = unit.display_name || unit.display_name_ne;
  const english = unit.display_name_en;
  if (nepali && english) return `${nepali} (${english})`;
  return nepali || english || `${unit.id}`;
}

// ── Main Page ─────────────────────────────────────────────────
export default function MapViewPage() {
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [mapType, setMapType] = useState<"roadmap" | "terrain">("roadmap");
  const [showProblems, setShowProblems] = useState(true);

  // Problem marker state
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showProblemDialog, setShowProblemDialog] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemMarkers, setProblemMarkers] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

  // Location selection state
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

  // Report state
  const [reportLevel, setReportLevel] = useState<ReportLevel | null>(null);
  const [reportParams, setReportParams] = useState<any>(null);
  const [reportTitle, setReportTitle] = useState("");

  // Places search
  const [search, setSearch] = useState("");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // ── Toggle map labels ──
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setOptions({
      styles: showLabels ? [] : MAP_STYLES_NO_LABELS,
    });
  }, [showLabels]);

  // ── Toggle map type ──
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setOptions({
      mapTypeId: mapType,
    });
  }, [mapType]);

  // ── Handle map click for problem markers ──
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setClickedLocation({ lat, lng });
      setShowProblemDialog(true);
    }
  }, []);

  // ── Fetch problem markers ──
  const { data: problemsData } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      return PROBLEMS_API.getProblems({
        is_active: true,
        page_size: 1000, // Get all problems
      });
    },
    enabled: showProblems,
  });

  useEffect(() => {
    if (problemsData?.results) {
      setProblemMarkers(problemsData.results);
    }
  }, [problemsData]);

  // ── Places search ──
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

  const selectPlace = useCallback((placeId: string) => {
    const placesService = new google.maps.places.PlacesService(mapRef.current!);
    placesService.getDetails({ placeId, fields: ["geometry"] }, (place) => {
      if (place?.geometry?.location) {
        mapRef.current?.panTo(place.geometry.location);
        mapRef.current?.setZoom(15);
      }
    });
    setSearch("");
    setPredictions([]);
  }, []);

  // ── Reset all selections ──
  const handleReset = useCallback(() => {
    setSelectedMunicipality(null);
    setSelectedWard(null);
    setSelectedBooth(null);
    setReportLevel(null);
    setReportParams(null);
    setReportTitle("");
    setBottomSheetExpanded(false);
    setShowFilters(false);
    mapRef.current?.panTo(GORKHA_1_CENTER);
    mapRef.current?.setZoom(DEFAULT_ZOOM);
  }, []);

  // ── Auto-select province & district ──
  const { data: provinces } = useQuery({
    queryKey: ["geo-units", "PROVINCE"],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "PROVINCE",
        ordering: "display_name",
      });
      return response?.results || [];
    },
  });

  useEffect(() => {
    if (provinces && provinces.length > 0 && !selectedProvince) {
      setSelectedProvince(provinces[0].id);
    }
  }, [provinces, selectedProvince]);

  const { data: districts } = useQuery({
    queryKey: ["geo-units", "DISTRICT", selectedProvince],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "DISTRICT",
        parent: selectedProvince,
        ordering: "display_name",
      });
      return response?.results || [];
    },
    enabled: !!selectedProvince,
  });

  useEffect(() => {
    if (districts && districts.length > 0 && !selectedDistrict) {
      setSelectedDistrict(districts[0].id);
    }
  }, [districts, selectedDistrict]);

  // ── Fetch municipalities ──
  const { data: municipalities, isLoading: loadingMunicipalities } = useQuery({
    queryKey: ["geo-units", "LOCAL_BODY", selectedDistrict],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "LOCAL_BODY",
        parent: selectedDistrict,
        ordering: "display_name",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedDistrict,
  });

  // ── Fetch wards ──
  const { data: wards, isLoading: loadingWards } = useQuery({
    queryKey: ["geo-units", "WARD", selectedMunicipality],
    queryFn: async () => {
      const response = await GEO_UNIT_API.getGeoUnits({
        unit_type: "WARD",
        parent: Number(selectedMunicipality),
        ordering: "ward_no",
      });
      return (response?.results as GeoUnit[]) || [];
    },
    enabled: !!selectedMunicipality,
  });

  // ── Fetch polling stations ──
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

  // ── Cascading resets ──
  useEffect(() => {
    setSelectedWard(null);
    setSelectedBooth(null);
  }, [selectedMunicipality]);

  useEffect(() => {
    setSelectedBooth(null);
  }, [selectedWard]);

  // ── Select options ──
  const municipalityOptions = useMemo(
    () =>
      (municipalities || []).map((u) => ({
        value: String(u.id),
        label: formatDisplayName(u),
      })),
    [municipalities],
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

  // ── Update report when selection changes ──
  useEffect(() => {
    if (selectedBooth && selectedWard) {
      setReportLevel("booth");
      setReportParams({
        polling_station: Number(selectedBooth),
        ward: Number(selectedWard),
      });
      const booth = boothOptions.find((b) => b.value === selectedBooth);
      setReportTitle(booth?.label || "Booth Report");
    } else if (selectedWard && selectedMunicipality) {
      setReportLevel("ward");
      setReportParams({
        ward: Number(selectedWard),
        municipality: Number(selectedMunicipality),
        district: selectedDistrict,
      });
      const ward = wardOptions.find((w) => w.value === selectedWard);
      setReportTitle(ward?.label || "Ward Report");
    } else if (selectedMunicipality && selectedDistrict) {
      setReportLevel("municipality");
      setReportParams({
        municipality: Number(selectedMunicipality),
        district: selectedDistrict,
      });
      const muni = municipalityOptions.find(
        (m) => m.value === selectedMunicipality,
      );
      setReportTitle(muni?.label || "Municipality Report");
    } else if (selectedDistrict) {
      setReportLevel("district");
      setReportParams({ district: selectedDistrict });
      setReportTitle("District Report");
    }
  }, [
    selectedMunicipality,
    selectedWard,
    selectedBooth,
    selectedDistrict,
    municipalityOptions,
    wardOptions,
    boothOptions,
  ]);

  // ── Handle municipality boundary click on map ──
  const handleMunicipalityClick = useCallback((municipalityName: string) => {
    const municipalityId = MUNICIPALITY_NAME_TO_ID[municipalityName];
    if (municipalityId) {
      setSelectedMunicipality(String(municipalityId));
    }
  }, []);

  // Geo-boundary overlays
  const { boundariesEnabled } = useGeoBoundaries({
    map: mapRef.current,
    onMunicipalityClick: handleMunicipalityClick,
  });

  // Fetch report data
  const {
    data: reportData,
    isLoading: loadingReport,
    error: reportError,
  } = useQuery({
    queryKey: ["reporting", reportLevel, reportParams],
    queryFn: async () => {
      if (!reportLevel) return null;
      switch (reportLevel) {
        case "district":
          return REPORTING_API.getDistricts(reportParams);
        case "municipality":
          return REPORTING_API.getMunicipalities(reportParams);
        case "ward":
          return REPORTING_API.getWards(reportParams);
        case "booth":
          return REPORTING_API.getBooths(reportParams);
        default:
          return null;
      }
    },
    enabled: !!reportLevel && !!reportParams,
  });

  // Extract report summary data
  const reportSummary = useMemo(() => {
    if (!reportData || loadingReport) return null;
    let d = reportData;
    if (d.results && Array.isArray(d.results) && d.results.length > 0) {
      d = d.results[0];
    }
    const total = d.total_voters_count || 0;
    const male = d.total_voters_male_count || 0;
    const female = d.total_voters_female_count || 0;
    if (!total) return null;
    return { total, male, female };
  }, [reportData, loadingReport]);

  const hasSelection =
    !!selectedMunicipality || !!selectedWard || !!selectedBooth;

  if (!isLoaded) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Box pos="relative" h="100vh" style={{ overflow: "hidden" }}>
      {/* Full-screen Google Map */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={GORKHA_1_CENTER}
        zoom={DEFAULT_ZOOM}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          mapTypeId: mapType,
          styles: showLabels
            ? MAP_STYLES_DARK_THEME
            : [...MAP_STYLES_DARK_THEME, ...MAP_STYLES_NO_LABELS],
        }}
      >
        {/* Problem markers */}
        {showProblems &&
          problemMarkers
            .filter(
              (problem) =>
                typeof problem.latitude === "number" &&
                typeof problem.longitude === "number" &&
                !isNaN(problem.latitude) &&
                !isNaN(problem.longitude),
            )
            .map((problem) => (
              <MarkerF
                key={problem.id}
                position={{ lat: problem.latitude, lng: problem.longitude }}
                onClick={() => setSelectedProblem(problem)}
                icon={{
                  url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="14" fill="${
                        problem.status === "OPEN"
                          ? "#fa5252"
                          : problem.status === "IN_PROGRESS"
                            ? "#fab005"
                            : "#51cf66"
                      }" stroke="#fff" stroke-width="2"/>
                      <text x="16" y="23" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">!</text>
                    </svg>
                  `)}`,
                  scaledSize: new google.maps.Size(32, 32),
                  anchor: new google.maps.Point(16, 16),
                }}
                title={problem.name}
              />
            ))}

        {/* Problem info window */}
        {selectedProblem && (
          <OverlayViewF
            position={{
              lat: selectedProblem.latitude,
              lng: selectedProblem.longitude,
            }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Paper
              radius="md"
              shadow="sm"
              style={{
                transform: "translate(-50%, -100%)",
                marginTop: -20,
              }}
            >
              <Group
                p="sm"
                bg="red.1"
                justify="space-between"
                align="center"
                mb={4}
              >
                <Text size="xs" fw={700}>
                  Problem Pointer
                </Text>
                <ActionIcon
                  size="xs"
                  variant="subtle"
                  color="gray"
                  onClick={() => setSelectedProblem(null)}
                >
                  <XIcon size={14} />
                </ActionIcon>
              </Group>
              <Box
                p="sm"
                style={{
                  minWidth: 220,
                  maxWidth: 320,
                  backgroundColor: "#fff",
                }}
              >
                <Stack gap={6}>
                  <Text size="xs" fw={600}>
                    {selectedProblem.name}
                  </Text>
                  {selectedProblem.name_en && (
                    <Text size="xs" c="dimmed">
                      {selectedProblem.name_en}
                    </Text>
                  )}
                  {selectedProblem.issues &&
                    selectedProblem.issues.length > 0 && (
                      <>
                        <Text size="xs" fw={500} mt={4}>
                          Issues:
                        </Text>
                        {selectedProblem.issues.map(
                          (issue: any, idx: number) => (
                            <Text key={idx} size="xs" c="dimmed">
                              • {issue.ne} {issue.en && `(${issue.en})`}
                            </Text>
                          ),
                        )}
                      </>
                    )}
                  {selectedProblem.booth &&
                    selectedProblem.booth.length > 0 && (
                      <>
                        <Text size="xs" fw={500} mt={4}>
                          Booth:
                        </Text>
                        {selectedProblem.booth.map((b: any, idx: number) => (
                          <Text key={idx} size="xs" c="dimmed">
                            • {b.ne} {b.en && `(${b.en})`}
                          </Text>
                        ))}
                      </>
                    )}
                  {selectedProblem.population && (
                    <Text size="xs" c="dimmed">
                      Population: {selectedProblem.population}
                    </Text>
                  )}
                  {selectedProblem.houses && (
                    <Text size="xs" c="dimmed">
                      Houses: {selectedProblem.houses}
                    </Text>
                  )}
                  {selectedProblem.voters && (
                    <Text size="xs" c="dimmed">
                      Voters: {selectedProblem.voters}
                    </Text>
                  )}
                  {selectedProblem.people_present && (
                    <Text size="xs" c="dimmed">
                      People Present: {selectedProblem.people_present}
                    </Text>
                  )}
                  {selectedProblem.previous_records && (
                    <>
                      <Text size="xs" fw={500} mt={4}>
                        Previous Records:
                      </Text>
                      <Text size="xs" c="dimmed">
                        {selectedProblem.previous_records}
                      </Text>
                      {selectedProblem.previous_records_en && (
                        <Text size="xs" c="dimmed">
                          {selectedProblem.previous_records_en}
                        </Text>
                      )}
                    </>
                  )}
                  {selectedProblem.notes && (
                    <>
                      <Text size="xs" fw={500} mt={4}>
                        Notes:
                      </Text>
                      <Text size="xs" c="dimmed">
                        {selectedProblem.notes}
                      </Text>
                    </>
                  )}
                </Stack>
              </Box>
            </Paper>
          </OverlayViewF>
        )}

        {/* Confirmation dialog at clicked location */}
        {showProblemDialog && clickedLocation && (
          <ProblemMarkerDialog
            position={clickedLocation}
            onConfirm={() => {
              setShowProblemDialog(false);
              setShowProblemForm(true);
            }}
            onCancel={() => {
              setShowProblemDialog(false);
              setClickedLocation(null);
            }}
          />
        )}
      </GoogleMap>

      {/* Problem form modal */}
      {showProblemForm && clickedLocation && (
        <ProblemForm
          coordinates={clickedLocation}
          wardId={selectedWard ? Number(selectedWard) : undefined}
          municipalityId={
            selectedMunicipality ? Number(selectedMunicipality) : undefined
          }
          onClose={() => {
            setShowProblemForm(false);
            setClickedLocation(null);
          }}
          onSuccess={(newProblem) => {
            setProblemMarkers([...problemMarkers, newProblem]);
            setShowProblemForm(false);
            setClickedLocation(null);
          }}
        />
      )}

      {/* ── Top floating buttons ── */}
      {/* Left: X (reset) */}
      {hasSelection && (
        <ActionIcon
          variant="white"
          color="dark"
          radius="xl"
          size={40}
          onClick={handleReset}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          <XIcon size={20} weight="bold" />
        </ActionIcon>
      )}

      {/* Right: filter + spark + labels */}
      <Group
        gap={10}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <ActionIcon
          variant="white"
          color="dark"
          radius="xl"
          size={40}
          onClick={() => setShowFilters((v) => !v)}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            backgroundColor: showFilters ? "#e0e0e0" : "#fff",
          }}
        >
          <FunnelIcon size={20} weight={showFilters ? "fill" : "regular"} />
        </ActionIcon>

        {reportSummary && (
          <ActionIcon
            variant="white"
            color="dark"
            radius="xl"
            size={40}
            onClick={() => setBottomSheetExpanded((v) => !v)}
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              backgroundColor: bottomSheetExpanded ? "#e0e0e0" : "#fff",
            }}
          >
            <SparkleIcon
              size={20}
              weight={bottomSheetExpanded ? "fill" : "regular"}
            />
          </ActionIcon>
        )}

        <ActionIcon
          variant="white"
          color="dark"
          radius="xl"
          size={40}
          onClick={() => setShowProblems((v) => !v)}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            backgroundColor: showProblems ? "#e0e0e0" : "#fff",
          }}
        >
          <MapPinIcon size={20} weight={showProblems ? "fill" : "regular"} />
        </ActionIcon>

        <ActionIcon
          variant="white"
          color="dark"
          radius="xl"
          size={40}
          onClick={() =>
            setMapType((v) => (v === "roadmap" ? "terrain" : "roadmap"))
          }
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            backgroundColor: mapType === "terrain" ? "#e0e0e0" : "#fff",
          }}
        >
          <MountainsIcon
            size={20}
            weight={mapType === "terrain" ? "fill" : "regular"}
          />
        </ActionIcon>

        <ActionIcon
          variant="white"
          color="dark"
          radius="xl"
          size={40}
          onClick={() => setShowLabels((v) => !v)}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            backgroundColor: !showLabels ? "#e0e0e0" : "#fff",
          }}
        >
          <TagIcon size={20} weight={!showLabels ? "fill" : "regular"} />
        </ActionIcon>
      </Group>

      {/* ── Filter overlay ── */}
      {showFilters && (
        <Paper
          pos="absolute"
          top={68}
          right={16}
          left={16}
          radius="md"
          p="sm"
          shadow="lg"
          withBorder
          style={{ zIndex: 1000 }}
        >
          <Stack gap={8}>
            {/* Places search */}
            <Box pos="relative">
              <TextInput
                size="xs"
                placeholder="Search places..."
                value={search}
                onChange={(e) => handleSearch(e.currentTarget.value)}
                leftSection={<MagnifyingGlassIcon size={14} />}
                rightSection={
                  <img
                    src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                    alt="Google"
                    style={{ height: 12, opacity: 0.6 }}
                  />
                }
              />
              {predictions.length > 0 && (
                <Paper
                  pos="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  mt={4}
                  shadow="md"
                  radius="sm"
                  withBorder
                  style={{ zIndex: 1001, overflow: "hidden" }}
                >
                  {predictions.map((p) => (
                    <Box
                      key={p.place_id}
                      px="sm"
                      py={6}
                      style={{ cursor: "pointer" }}
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

            {/* Location selects */}
            <Select
              size="xs"
              placeholder="Municipality"
              data={municipalityOptions}
              value={selectedMunicipality}
              onChange={setSelectedMunicipality}
              searchable
              clearable
              disabled={!selectedDistrict || loadingMunicipalities}
              rightSection={
                loadingMunicipalities ? <Loader size={10} /> : undefined
              }
            />
            <Select
              size="xs"
              placeholder="Ward"
              data={wardOptions}
              value={selectedWard}
              onChange={setSelectedWard}
              searchable
              clearable
              disabled={!selectedMunicipality || loadingWards}
              rightSection={loadingWards ? <Loader size={10} /> : undefined}
            />
            <Select
              size="xs"
              placeholder="Booth"
              data={boothOptions}
              value={selectedBooth}
              onChange={setSelectedBooth}
              searchable
              clearable
              disabled={!selectedWard || loadingBooths}
              rightSection={loadingBooths ? <Loader size={10} /> : undefined}
            />
          </Stack>
        </Paper>
      )}

      {/* ── Bottom sheet ── */}
      {reportSummary && !showProblemForm && (
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            zIndex: 1000,
            maxHeight: bottomSheetExpanded ? "90vh" : "none",
            height: bottomSheetExpanded ? "90vh" : "auto",
            display: "flex",
            flexDirection: "column",
            transition: "height 0.3s ease-in-out",
          }}
        >
          <Paper
            radius="20px 20px 0 0"
            style={{
              backgroundColor: "#2a2a2a",
              color: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: bottomSheetExpanded ? "90vh" : "auto",
              paddingTop: 12,
              paddingBottom: 20,
              paddingLeft: 20,
              paddingRight: 20,
              transition: "height 0.3s ease-in-out",
            }}
          >
            {/* Drag handle - positioned at very top */}
            <Center mb="md">
              <Box
                style={{
                  width: 40,
                  height: 5,
                  borderRadius: 3,
                  backgroundColor: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                }}
                onClick={() => setBottomSheetExpanded((v) => !v)}
              />
            </Center>

            {/* Collapsed: summary */}
            <Box
              style={{ cursor: "pointer" }}
              onClick={() => setBottomSheetExpanded((v) => !v)}
            >
              <Group gap={8} mb={12}>
                <Badge
                  size="sm"
                  variant="light"
                  color="gray"
                  style={{ textTransform: "uppercase", fontWeight: 600 }}
                >
                  {reportLevel}
                </Badge>
                <CaretDownIcon
                  size={16}
                  color="rgba(255,255,255,0.4)"
                  style={{
                    transform: bottomSheetExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </Group>

              <Text fw={700} size="xl" c="white" mb={4}>
                {reportTitle}
              </Text>

              <Text size="sm" c="rgba(255,255,255,0.6)" mb={16}>
                Voter Statistics Report
              </Text>

              <Group gap="xl" mb={bottomSheetExpanded ? "lg" : 0}>
                <Stack gap={4}>
                  <Group gap={8}>
                    <UsersIcon size={18} color="#86efac" weight="duotone" />
                    <Text size="lg" c="white" fw={600}>
                      {reportSummary.total.toLocaleString()}
                    </Text>
                  </Group>
                  <Text size="xs" c="rgba(255,255,255,0.5)">
                    Total Voters
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Group gap={8}>
                    <GenderMaleIcon
                      size={18}
                      color="#93c5fd"
                      weight="duotone"
                    />
                    <Text size="lg" c="white" fw={600}>
                      {reportSummary.male.toLocaleString()}
                    </Text>
                  </Group>
                  <Text size="xs" c="rgba(255,255,255,0.5)">
                    Male
                  </Text>
                </Stack>
                <Stack gap={4}>
                  <Group gap={8}>
                    <GenderFemaleIcon
                      size={18}
                      color="#f9a8d4"
                      weight="duotone"
                    />
                    <Text size="lg" c="white" fw={600}>
                      {reportSummary.female.toLocaleString()}
                    </Text>
                  </Group>
                  <Text size="xs" c="rgba(255,255,255,0.5)">
                    Female
                  </Text>
                </Stack>
              </Group>
            </Box>

            {/* Expanded: full report */}
            {bottomSheetExpanded && (
              <ScrollArea
                style={{ flex: 1, minHeight: 0, marginTop: 16 }}
                offsetScrollbars
                scrollbarSize={6}
              >
                <Box
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 16,
                    color: "#000",
                  }}
                >
                  {loadingReport && (
                    <Center py="xl">
                      <Loader size="md" />
                    </Center>
                  )}
                  {reportError && (
                    <Center py="xl">
                      <Text size="sm" c="red">
                        {(reportError as Error).message ||
                          "Failed to load report"}
                      </Text>
                    </Center>
                  )}
                  {!loadingReport && !reportError && reportData && (
                    <ReportDashboard
                      data={reportData}
                      reportType={reportLevel || "district"}
                    />
                  )}
                </Box>
              </ScrollArea>
            )}
          </Paper>
        </Box>
      )}

      {/* Loading indicator for report */}
      {loadingReport && !reportSummary && (
        <Box
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
          }}
        >
          <Paper radius="xl" px="md" py="xs" shadow="md" withBorder>
            <Group gap="xs">
              <Loader size={14} />
              <Text size="xs" c="dimmed">
                Loading report...
              </Text>
            </Group>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
