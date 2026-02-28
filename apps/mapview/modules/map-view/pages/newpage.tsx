"use client";

import { ActionIcon, Badge, Button, Center, Divider, Grid, Group, Loader, ScrollArea, Stack, Text } from "@mantine/core";
import { ArrowClockwiseIcon, ArrowLeftIcon, CaretLeftIcon, CaretRightIcon, RobotIcon, UsersIcon, GenderMaleIcon, GenderFemaleIcon } from "@phosphor-icons/react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEO_UNIT_API, POLLING_STATIONS_API } from "../module.api";
import { REPORTING_API } from "../api/reporting.api";
import { GeoUnit, PollingStation, ReportLevel, formatDisplayName } from "../types";
import { GOOGLE_MAPS_API_KEY, LIBRARIES, GEOJSON_TO_NEPALI_NAME } from "../constants";
import { MapCanvas } from "../components/MapCanvas";
import { ExpandedSheetContent } from "../components/ExpandedSheetContent";
import { ReportDashboard } from "../components/ReportDashboard";
import { ashrabData } from "../data/ashrab";

export function NewPage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    // * UI STATES

    const [sideExtended, setSideExtended] = useState(false)

    // * STATES

    const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
    const [curMode, setCurMode] = useState<"view" | "edit">("view");

    // Route mode states
    const [routeMode, setRouteMode] = useState(false);
    const [routePoints, setRoutePoints] = useState<google.maps.LatLngLiteral[]>([]);

    // Ashrab mode state
    const [ashrabMode, setAshrabMode] = useState(false);

    // Heatmap mode state
    const [heatmapMode, setHeatmapMode] = useState(false);

    // Location selection state
    const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
    const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
    const [selectedWard, setSelectedWard] = useState<string | null>(null);
    const [selectedBooth, setSelectedBooth] = useState<string | null>(null);

    // Report state
    const [reportLevel, setReportLevel] = useState<ReportLevel | null>(null);
    const [reportParams, setReportParams] = useState<any>(null);
    const [reportTitle, setReportTitle] = useState("");
    const pendingBoothRef = useRef<string | null>(null);

    // * EFFECTS

    // * FUNCTIONS

    const handleMapClick = useCallback((latLng: google.maps.LatLngLiteral) => {
        setRoutePoints((prev) => [...prev, latLng]);
    }, []);

    const startNewRoute = useCallback(() => {
        setRouteMode(true);
        setRoutePoints([]);
    }, []);

    const finishRoute = useCallback(() => {
        setRouteMode(false);
    }, []);

    const cancelRoute = useCallback(() => {
        setRouteMode(false);
        setRoutePoints([]);
    }, []);

    // Go back one step in selection hierarchy
    const goBackSelection = useCallback(() => {
        if (selectedBooth) {
            setSelectedBooth(null);
        } else if (selectedWard) {
            setSelectedWard(null);
        } else if (selectedMunicipality) {
            setSelectedMunicipality(null);
        }
    }, [selectedBooth, selectedWard, selectedMunicipality]);

    // Reset all selections and map
    const mapResetRef = useRef<(() => void) | null>(null);
    const resetAll = useCallback(() => {
        setSelectedMunicipality(null);
        setSelectedWard(null);
        setSelectedBooth(null);
        setRouteMode(false);
        setRoutePoints([]);
        setAshrabMode(false);
        setHeatmapMode(false);
        mapResetRef.current?.();
    }, []);

    // Get current selection label
    const getCurrentSelectionLabel = () => {
        if (selectedBooth) {
            return `Booth ${selectedBooth}`;
        }
        if (selectedWard) {
            return `Ward ${selectedWard}`;
        }
        if (selectedMunicipality) {
            const muni = municipalities?.find(m => String(m.id) === selectedMunicipality);
            return muni?.display_name || `Municipality ${selectedMunicipality}`;
        }
        return "Gorkha-1 Overview";
    };

    // Places search
    const [search, setSearch] = useState("");
    const [predictions, setPredictions] = useState<
        google.maps.places.AutocompletePrediction[]
    >([]);
    const autocompleteRef = useRef<google.maps.places.AutocompleteService | null>(
        null,
    );


    // * FLOPWS

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
            console.log("Fetching municipalities for district:", selectedDistrict);
            const response = await GEO_UNIT_API.getGeoUnits({
                unit_type: "LOCAL_BODY",
                parent: selectedDistrict,
                ordering: "display_name",
            });
            console.log("Municipalities response:", response?.results);
            return (response?.results as GeoUnit[]) || [];
        },
        enabled: !!selectedDistrict,
        staleTime: Infinity,
    });

    // Debug: log selection chain
    console.log("Selection chain:", { selectedProvince, selectedDistrict, municipalitiesCount: municipalities?.length });

    // ── Fetch polling stations (all for map markers) ──
    const { data: pollingStations } = useQuery({
        queryKey: ["polling-stations"],
        queryFn: async () => {
            const response = await POLLING_STATIONS_API.getPollingStations();
            console.log("Polling stations response:", response);
            // API returns direct array, not paginated
            const stations = Array.isArray(response) ? response : (response?.results || []);
            return stations as PollingStation[];
        },
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

    // ── Fetch booths for selected ward ──
    const { data: booths, isLoading: loadingBooths } = useQuery({
        queryKey: ["polling-stations-ward", selectedWard],
        queryFn: async () => {
            const response = await POLLING_STATIONS_API.getPollingStations({
                ward: Number(selectedWard),
            });
            // API may return a direct array or a paginated { results: [...] } object
            return (Array.isArray(response) ? response : (response?.results as PollingStation[])) || [];
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

    // ── Select options for report title ──
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
        enabled: !!selectedMunicipality && reportLevel === "municipality",
        staleTime: 30_000,
    });

    // Report summary for display
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

    if (!isLoaded) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Grid gutter={0}>
            <Grid.Col pos="relative" span={{ base: 12, lg: sideExtended ? 9 : 6 }} h={{ base: "80vh", lg: "100vh" }} bg="gray.3">
                <MapCanvas
                    mapType={mapType}
                    routeMode={routeMode}
                    routePoints={routePoints}
                    onMapClick={handleMapClick}
                    selectedMunicipality={selectedMunicipality}
                    municipalities={municipalities}
                    onResetRef={mapResetRef}
                    onMunicipalityClick={(geoJsonName) => {
                        console.log("onMunicipalityClick called with:", geoJsonName);
                        // Convert GeoJSON English name to Nepali name
                        const nepaliName = GEOJSON_TO_NEPALI_NAME[geoJsonName];
                        console.log("Mapped to Nepali name:", nepaliName);
                        // Find municipality from API data
                        const muni = municipalities?.find(m => m.display_name === nepaliName);
                        console.log("Found municipality:", muni);
                        if (muni) {
                            setSelectedMunicipality(String(muni.id));
                        }
                    }}
                    ashrabMode={ashrabMode}
                    ashrabLocations={ashrabData.locations}
                    pollingStations={pollingStations}
                    heatmapMode={heatmapMode}
                />
                {/* 
                <Group pos="absolute" bottom={8} left={8} gap={4}>

                    <Popover>
                        <Popover.Target>
                            <Button size="xs" variant="white">
                                Route Details
                            </Button>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Text size="xs" fw={700}>
                                Route Details
                            </Text>
                        </Popover.Dropdown>
                    </Popover>

                </Group> */}


                <Stack pos="absolute" bottom={8} left={8} gap={4}>
                    {loadingMunicipalities ? (
                        <Text size="xs" c="dimmed">Loading...</Text>
                    ) : (
                        municipalities?.map((municipality) => (
                            <Button
                                key={municipality.id}
                                size="xs"
                                variant={selectedMunicipality === String(municipality.id) ? "filled" : "white"}
                                onClick={() => {
                                    setSelectedMunicipality(String(municipality.id));
                                }}
                            >
                                {municipality.display_name}
                            </Button>
                        ))
                    )}
                </Stack>


                <Group pos="absolute" top={8} left={8} gap={4}>
                    {!routeMode ? (
                        <Button size="xs" variant="white" onClick={startNewRoute}>
                            New Route
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="xs"
                                variant="filled"
                                color="green"
                                onClick={finishRoute}
                                disabled={routePoints.length < 2}
                            >
                                Done ({routePoints.length} points)
                            </Button>
                            <Button size="xs" variant="white" onClick={cancelRoute}>
                                Cancel
                            </Button>
                        </>
                    )}
                    <Button
                        size="xs"
                        variant={ashrabMode ? "filled" : "white"}
                        onClick={() => setAshrabMode(!ashrabMode)}
                    >
                        Ashrab Pointers
                    </Button>
                    <Button
                        size="xs"
                        variant={heatmapMode ? "filled" : "white"}
                        onClick={() => setHeatmapMode(!heatmapMode)}
                    >
                        Heatmap
                    </Button>
                    <Button size="xs" variant="light" color="blue">
                        Booths: {pollingStations?.length || 0}
                    </Button>
                </Group>






            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: sideExtended ? 3 : 6 }}>


                <Group
                    px="md" py="xs"
                    justify="space-between"
                >
                    <Text size="sm" fw={900}>
                        zetsel.<span style={{
                            color: 'var(--mantine-color-brand-6)'
                        }}>mapview</span>
                    </Text>

                    <Group gap={4}>
                        <Button size="xs" variant="light" leftSection={<RobotIcon weight="fill" />}>
                            Ask AI
                        </Button>
                        <Button size="xs" variant="light" onClick={resetAll}>
                            <ArrowClockwiseIcon />
                        </Button>
                    </Group>

                </Group>

                <Divider />

                <Group px="md" py="xs" bg="brand.0">
                    <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={goBackSelection}
                        disabled={!selectedMunicipality && !selectedWard && !selectedBooth}
                    >
                        <ArrowLeftIcon />
                    </ActionIcon>
                    <Stack gap={2}>
                        <Text size="xs" fw={700}>
                            {getCurrentSelectionLabel()}
                        </Text>
                        <Badge
                            size="xs"
                            variant="light"
                            color={
                                reportLevel === "dashboard"
                                    ? "gray"
                                    : reportLevel === "municipality"
                                        ? "teal"
                                        : reportLevel === "ward"
                                            ? "blue"
                                            : reportLevel === "booth"
                                                ? "violet"
                                                : "gray"
                            }
                        >
                            {reportLevel || "dashboard"} view
                        </Badge>
                    </Stack>
                </Group>
                <Divider />

                <ScrollArea h="calc(100vh - 140px)" offsetScrollbars scrollbarSize={6} p="md">
                    {/* Navigation */}
                    <ExpandedSheetContent
                        reportLevel={reportLevel}
                        reportData={reportData}
                        loadingReport={loadingReport}
                        reportError={reportError}
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
                        onSelectBooth={(id) => setSelectedBooth(id)}
                        onBack={goBackSelection}
                        onDistrictStationClick={(station) => {
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
                            if (station.ward_no && wards) {
                                const ward = wards.find((w) => w.ward_no === station.ward_no);
                                if (ward) {
                                    pendingBoothRef.current = String(station.polling_station_id);
                                    setSelectedWard(String(ward.id));
                                }
                            }
                        }}
                    />

                    {/* Divider between navigation and report */}
                    {reportData && <Divider my="lg" />}

                    {/* Full Report */}
                    {loadingReport ? (
                        <Center py="xl">
                            <Loader size="md" />
                        </Center>
                    ) : reportError ? (
                        <Center py="xl">
                            <Text size="sm" c="red">
                                {(reportError as Error).message || "Failed to load report"}
                            </Text>
                        </Center>
                    ) : reportData ? (
                        <>
                            {reportSummary && (
                                <>
                                    <Group gap="xl" mb="md">
                                        <Stack gap={4}>
                                            <Group gap={8}>
                                                <UsersIcon size={18} color="#228be6" weight="duotone" />
                                                <Text size="lg" fw={600}>
                                                    {reportSummary.total.toLocaleString()}
                                                </Text>
                                            </Group>
                                            <Text size="xs" c="dimmed">
                                                Total Voters
                                            </Text>
                                        </Stack>
                                        <Stack gap={4}>
                                            <Group gap={8}>
                                                <GenderMaleIcon size={18} color="#228be6" weight="duotone" />
                                                <Text size="lg" fw={600}>
                                                    {reportSummary.male.toLocaleString()}
                                                </Text>
                                            </Group>
                                            <Text size="xs" c="dimmed">
                                                Male
                                            </Text>
                                        </Stack>
                                        <Stack gap={4}>
                                            <Group gap={8}>
                                                <GenderFemaleIcon size={18} color="#e64980" weight="duotone" />
                                                <Text size="lg" fw={600}>
                                                    {reportSummary.female.toLocaleString()}
                                                </Text>
                                            </Group>
                                            <Text size="xs" c="dimmed">
                                                Female
                                            </Text>
                                        </Stack>
                                    </Group>
                                    <Divider mb="md" />
                                </>
                            )}
                            <ReportDashboard
                                data={reportData}
                                reportType={reportLevel || "dashboard"}
                            />
                        </>
                    ) : null}
                </ScrollArea>

            </Grid.Col>
        </Grid>

    );
}