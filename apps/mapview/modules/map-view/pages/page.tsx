"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionIcon,
  Box,
  Center,
  Group,
  Loader,
  Paper,
  Text,
} from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import {
  GoogleMap,
  useJsApiLoader,
  OverlayViewF,
  OverlayView,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { useGeoBoundaries } from "../hooks/useGeoBoundaries";
import { REPORTING_API } from "../api/reporting.api";
import {
  GEO_UNIT_API,
  POLLING_STATIONS_API,
  PROBLEMS_API,
} from "../module.api";
import {
  GOOGLE_MAPS_API_KEY,
  LIBRARIES,
  GORKHA_1_CENTER,
  DEFAULT_ZOOM,
  MUNICIPALITY_NAME_TO_ID,
  MUNICIPALITY_ID_TO_NAME,
  MAP_STYLES_NO_LABELS,
  MAP_STYLES_DARK_THEME,
} from "../constants";
import { formatDisplayName } from "../types";
import type { ReportLevel, GeoUnit, PollingStation } from "../types";

import { MapToolbar } from "../components/MapToolbar";
import { FilterOverlay } from "../components/FilterOverlay";
import { MunicipalityPicker } from "../components/MunicipalityPicker";
import { ReportDrawer } from "../components/ReportDrawer";
import { ProblemInfoWindow } from "../components/ProblemInfoWindow";
import { ProblemMarkerDialog } from "../components/ProblemMarkerDialog";
import { ProblemForm } from "../components/ProblemForm";

// ── Main Page ─────────────────────────────────────────────────
export default function MapViewPage() {
  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [showProblems, setShowProblems] = useState(true);
  const [routeMode, setRouteMode] = useState(false);
  const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>(
    [],
  );
  const [directionsResult, setDirectionsResult] =
    useState<google.maps.DirectionsResult | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null,
  );
  const pendingBoothRef = useRef<string | null>(null);

  // Problem marker state
  const [clickedLocation, setClickedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showProblemDialog, setShowProblemDialog] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemMarkers, setProblemMarkers] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Smooth zoom helper - animates zoom transitions
  const smoothZoomTo = useCallback((
    target: google.maps.LatLngLiteral,
    targetZoom: number,
    duration: number = 800
  ) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const startZoom = map.getZoom() || DEFAULT_ZOOM;
    const startTime = performance.now();

    // First pan to the location
    map.panTo(target);

    // Then animate the zoom
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentZoom = startZoom + (targetZoom - startZoom) * easeOut;

      map.setZoom(currentZoom);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

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
    mapRef.current.setOptions({ mapTypeId: mapType });
  }, [mapType]);

  // ── Calculate route via Directions API ──
  useEffect(() => {
    if (routePoints.length < 2) {
      setDirectionsResult(null);
      return;
    }
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService();
    }
    const origin = routePoints[0];
    const destination = routePoints[routePoints.length - 1];
    const waypoints = routePoints.slice(1, -1).map((point) => ({
      location: new google.maps.LatLng(point.lat, point.lng),
      stopover: true,
    }));
    directionsServiceRef.current.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirectionsResult(result);
        }
      },
    );
  }, [routePoints]);

  // ── Handle map click ──
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        if (routeMode) {
          setRoutePoints((prev) => [...prev, { lat, lng }]);
        } else {
          setClickedLocation({ lat, lng });
          setShowProblemDialog(true);
        }
      }
    },
    [routeMode],
  );

  // ── Fetch problem markers ──
  const { data: problemsData } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      return PROBLEMS_API.getProblems({
        is_active: true,
        page_size: 1000,
      });
    },
    enabled: showProblems,
    staleTime: 30_000,
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
    setDrawerOpen(false);
    setShowFilters(false);
    setRouteMode(false);
    setRoutePoints([]);
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
    staleTime: Infinity,
  });

  // ── Fetch polling stations ──
  const { data: booths, isLoading: loadingBooths } = useQuery({
    queryKey: ["polling-stations", selectedWard],
    queryFn: async () => {
      const response = await POLLING_STATIONS_API.getPollingStations({
        ward: Number(selectedWard),
      });
      // API may return a direct array or a paginated { results: [...] } object
      const stations = Array.isArray(response)
        ? response
        : (response?.results as PollingStation[]) || [];
      return stations;
    },
    enabled: !!selectedWard,
    staleTime: Infinity,
  });

  // ── Cascading resets ──
  useEffect(() => {
    setSelectedWard(null);
    setSelectedBooth(null);
  }, [selectedMunicipality]);

  useEffect(() => {
    if (pendingBoothRef.current) {
      setSelectedBooth(pendingBoothRef.current);
      pendingBoothRef.current = null;
    } else {
      setSelectedBooth(null);
    }
  }, [selectedWard]);

  // NOTE: Previously auto-selected booth when ward had a single polling station.
  // Removed to let the user stay on ward-level view and navigate manually.

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
        const nepali = s.place_name_ne;
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
      setReportLevel("dashboard");
      setReportParams({ district: selectedDistrict });
      setReportTitle("District Overview");
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
      setDrawerOpen(true);
    }
  }, []);

  // Geo-boundary overlays
  const { boundariesEnabled } = useGeoBoundaries({
    map: mapRef.current,
    selectedMunicipalityName: selectedMunicipality
      ? MUNICIPALITY_ID_TO_NAME[Number(selectedMunicipality)]
      : null,
    onMunicipalityClick: handleMunicipalityClick,
  });

  // ── Fetch report data ──
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
        default:
          return null;
      }
    },
    enabled: !!reportLevel && !!reportParams,
    staleTime: 30_000,
  });

  // Fetch top polling stations for district
  const {
    data: districtTopStationsData,
    isLoading: loadingDistrictTopStations,
  } = useQuery({
    queryKey: ["district-top-polling-stations", selectedDistrict],
    queryFn: async () => {
      return REPORTING_API.getDistrictTopPollingStations({
        district: selectedDistrict!,
        top_n: 110,
      });
    },
    enabled:
      !!selectedDistrict &&
      drawerOpen &&
      (reportLevel === "district" || reportLevel === "dashboard"),
    staleTime: 30_000,
  });

  // Fetch top polling stations for municipality
  const {
    data: municipalityTopStationsData,
    isLoading: loadingMunicipalityTopStations,
  } = useQuery({
    queryKey: ["municipality-top-polling-stations", selectedMunicipality],
    queryFn: async () => {
      return REPORTING_API.getMunicipalityTopPollingStations({
        municipality: Number(selectedMunicipality),
        top_n: 110,
      });
    },
    enabled:
      !!selectedMunicipality && drawerOpen && reportLevel === "municipality",
    staleTime: 30_000,
  });

  // ── Extract route leg info ──
  const routeLegs = useMemo(() => {
    if (!directionsResult) return [];
    const legs = directionsResult.routes[0]?.legs || [];
    return legs.map((leg) => {
      const startLat = leg.start_location.lat();
      const startLng = leg.start_location.lng();
      const endLat = leg.end_location.lat();
      const endLng = leg.end_location.lng();
      return {
        midpoint: {
          lat: (startLat + endLat) / 2,
          lng: (startLng + endLng) / 2,
        },
        distance: leg.distance?.text || "",
        duration: leg.duration?.text || "",
      };
    });
  }, [directionsResult]);

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
          styles:
            mapType === "satellite"
              ? showLabels
                ? []
                : MAP_STYLES_NO_LABELS
              : showLabels
                ? MAP_STYLES_DARK_THEME
                : [...MAP_STYLES_DARK_THEME, ...MAP_STYLES_NO_LABELS],
        }}
      >
        {/* Route markers + directions */}
        {routePoints.length === 1 && (
          <MarkerF
            position={routePoints[0]}
            label={{
              text: "A",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          />
        )}
        {directionsResult && (
          <DirectionsRenderer
            directions={directionsResult}
            options={{
              polylineOptions: {
                strokeColor: "#4dabf7",
                strokeWeight: 5,
                strokeOpacity: 0.9,
              },
            }}
          />
        )}
        {routeLegs.map((leg, idx) => (
          <OverlayViewF
            key={`leg-info-${idx}`}
            position={leg.midpoint}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <Box
              style={{
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0,0,0,0.75)",
                color: "#fff",
                borderRadius: 8,
                padding: "4px 8px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              <Text size="xs" fw={600} lh={1.3} ta="center">
                {leg.distance}
              </Text>
              <Text size="xs" c="rgba(255,255,255,0.7)" lh={1.3} ta="center">
                {leg.duration}
              </Text>
            </Box>
          </OverlayViewF>
        ))}

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
                      <circle cx="16" cy="16" r="14" fill="${problem.status === "OPEN"
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
          <ProblemInfoWindow
            problem={selectedProblem}
            onClose={() => setSelectedProblem(null)}
          />
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
      {hasSelection && !drawerOpen && (
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

      {!hasSelection && (
        <MapToolbar
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters((v) => !v)}
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
          showDrawerButton={!!reportSummary}
          routeMode={routeMode}
          onToggleRoute={() => {
            setRouteMode((v) => {
              if (v) {
                setRoutePoints([]);
                setDirectionsResult(null);
              }
              return !v;
            });
          }}
          showProblems={showProblems}
          onToggleProblems={() => setShowProblems((v) => !v)}
          mapType={mapType}
          onToggleMapType={() =>
            setMapType((v) => (v === "roadmap" ? "satellite" : "roadmap"))
          }
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels((v) => !v)}
        />
      )}

      {/* ── Filter overlay ── */}
      {showFilters && (
        <FilterOverlay
          search={search}
          onSearch={handleSearch}
          predictions={predictions}
          onSelectPlace={selectPlace}
          municipalityOptions={municipalityOptions}
          selectedMunicipality={selectedMunicipality}
          onMunicipalityChange={setSelectedMunicipality}
          loadingMunicipalities={loadingMunicipalities}
          selectedDistrict={selectedDistrict}
          wardOptions={wardOptions}
          selectedWard={selectedWard}
          onWardChange={setSelectedWard}
          loadingWards={loadingWards}
          boothOptions={boothOptions}
          selectedBooth={selectedBooth}
          onBoothChange={(id) => {
            setSelectedBooth(id);
            // Smooth zoom to booth location if coordinates available
            if (id) {
              const booth = booths?.find((b) => String(b.id) === id);
              if (booth?.latitude && booth?.longitude) {
                smoothZoomTo({ lat: booth.latitude, lng: booth.longitude }, 17);
              }
            }
          }}
          loadingBooths={loadingBooths}
        />
      )}

      {/* ── Bottom sheet: municipality picker ── */}
      {municipalities &&
        municipalities.length > 0 &&
        !showProblemForm &&
        !drawerOpen && (
          <MunicipalityPicker
            municipalities={municipalities}
            onSelect={(id) => {
              setSelectedMunicipality(id);
              setDrawerOpen(true);
            }}
          />
        )}

      {/* ── Side Drawer: All reporting ── */}
      <ReportDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        reportTitle={reportTitle}
        reportLevel={reportLevel}
        reportData={reportData}
        loadingReport={loadingReport}
        reportError={reportError}
        reportSummary={reportSummary}
        selectedMunicipality={selectedMunicipality}
        selectedWard={selectedWard}
        municipalities={municipalities}
        wards={wards}
        loadingWards={loadingWards}
        booths={booths}
        loadingBooths={loadingBooths}
        districtTopStationsData={districtTopStationsData}
        loadingDistrictTopStations={loadingDistrictTopStations}
        municipalityTopStationsData={municipalityTopStationsData}
        loadingMunicipalityTopStations={loadingMunicipalityTopStations}
        onSelectMunicipality={(id) => setSelectedMunicipality(id)}
        onSelectWard={(id) => setSelectedWard(id)}
        onSelectBooth={(id: string, booth: PollingStation) => {
          setSelectedBooth(id);
          // Smooth zoom to booth location if coordinates available
          if (booth?.latitude && booth?.longitude) {
            smoothZoomTo({ lat: booth.latitude, lng: booth.longitude }, 17);
          }
        }}
        onBack={() => {
          if (reportLevel === "booth") {
            if (booths && booths.length <= 1) {
              setSelectedWard(null);
            } else {
              setSelectedBooth(null);
            }
          } else if (reportLevel === "ward") {
            setSelectedWard(null);
          } else if (reportLevel === "municipality") {
            setSelectedMunicipality(null);
            setDrawerOpen(false);
          }
        }}
        onDistrictStationClick={(station) => {
          // Smooth zoom to station location if coordinates available
          if (station.latitude && station.longitude) {
            smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
          }
          if (station.ward_no && wards) {
            const ward = wards.find((w) => w.ward_no === station.ward_no);
            if (ward) {
              pendingBoothRef.current = String(station.polling_station_id);
              setSelectedWard(String(ward.id));
              setSelectedMunicipality(String(station.municipality_id));
            }
          }
        }}
        onMunicipalityStationClick={(station) => {
          // Smooth zoom to station location if coordinates available
          if (station.latitude && station.longitude) {
            smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
          }
          if (station.ward_no && wards) {
            const ward = wards.find((w) => w.ward_no === station.ward_no);
            if (ward) {
              pendingBoothRef.current = String(station.polling_station_id);
              setSelectedWard(String(ward.id));
            }
          }
        }}
      />

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
