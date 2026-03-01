"use client";

import { ActionIcon, Badge, Button, Center, Divider, Drawer, Grid, Group, Loader, Paper, ScrollArea, Select, Stack, Text } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { ArrowClockwiseIcon, ArrowLeftIcon, CaretLeftIcon, CaretRightIcon, CaretUpIcon, CaretDownIcon, RobotIcon, UsersIcon, GenderMaleIcon, GenderFemaleIcon } from "@phosphor-icons/react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEO_UNIT_API, POLLING_STATIONS_API } from "../module.api";
import { REPORTING_API } from "../api/reporting.api";
import { GeoUnit, PollingStation, ReportLevel, formatDisplayName } from "../types";
import { GOOGLE_MAPS_API_KEY, LIBRARIES } from "../constants";
import { MapCanvas } from "../components/MapCanvas";
import { ExpandedSheetContent } from "../components/ExpandedSheetContent";
import { ReportDashboard } from "../components/ReportDashboard";
import { CandidateModal } from "../components/CandidateModal";
import { ashrabData } from "../data/ashrab";
import type { BoothReportCandidate, BoothReport } from "../types";

export function NewPage() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    // * UI STATES

    const [sideExtended, setSideExtended] = useState(false)
    const [locationDrawerOpened, { open: openLocationDrawer, close: closeLocationDrawer }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

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

    // Ranking mode state - shows top 10 booths by voter count
    const [rankingMode, setRankingMode] = useState(false);

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
    const pendingWardRef = useRef<string | null>(null);

    // Candidate modal state
    const [candidateModalOpen, setCandidateModalOpen] = useState(false);
    const [candidateModalStation, setCandidateModalStation] = useState<PollingStation | null>(null);
    const [savingCandidates, setSavingCandidates] = useState(false);

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
        setRankingMode(false);
        mapResetRef.current?.();
    }, []);

    // Get current selection label
    const getCurrentSelectionLabel = () => {
        if (selectedBooth) {
            const booth = booths?.find(b => String(b.id) === selectedBooth);
            if (booth) {
                return booth.place_name_ne || booth.place_name_en || `Booth ${selectedBooth}`;
            }
            return `Booth ${selectedBooth}`;
        }
        if (selectedWard) {
            const ward = wards?.find(w => String(w.id) === selectedWard);
            if (ward) {
                return ward.ward_no ? `Ward ${ward.ward_no}` : ward.display_name || `Ward ${selectedWard}`;
            }
            return `Ward ${selectedWard}`;
        }
        if (selectedMunicipality) {
            const muni = municipalities?.find(m => String(m.id) === selectedMunicipality);
            return muni?.display_name || `Municipality ${selectedMunicipality}`;
        }
        return "Gorkha-1 Overview";
    };

    // Map ref for zoom functionality
    const mapRef = useRef<google.maps.Map | null>(null);

    // Refs for mobile scroll between map and stats
    const mapSectionRef = useRef<HTMLDivElement | null>(null);
    const statsSectionRef = useRef<HTMLDivElement | null>(null);
    const scrollToStats = useCallback(() => {
        statsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    const scrollToMap = useCallback(() => {
        mapSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Smooth zoom helper - animates zoom transitions
    const smoothZoomTo = useCallback((
        target: google.maps.LatLngLiteral,
        targetZoom: number,
        duration: number = 800
    ) => {
        if (!mapRef.current) return;

        const map = mapRef.current;
        const startZoom = map.getZoom() || 12;
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

    // ── Fetch polling stations (all for map markers) ──
    const { data: pollingStations, refetch: refetchPollingStations } = useQuery({
        queryKey: ["polling-stations"],
        queryFn: async () => {
            const response = await POLLING_STATIONS_API.getPollingStations();
            // API returns direct array, not paginated
            const stations = Array.isArray(response) ? response : (response?.results || []);
            return stations as PollingStation[];
        },
        staleTime: 30_000, // Refetch after 30 seconds
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
    const { data: booths, isLoading: loadingBooths, refetch: refetchBooths } = useQuery({
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
        // If we have a pending ward (from direct booth click), use it instead of resetting
        if (pendingWardRef.current) {
            setSelectedWard(pendingWardRef.current);
            pendingWardRef.current = null;
        } else {
            setSelectedWard(null);
            setSelectedBooth(null);
        }
    }, [selectedMunicipality]);

    useEffect(() => {
        if (pendingBoothRef.current) {
            setSelectedBooth(pendingBoothRef.current);
            pendingBoothRef.current = null;
        } else {
            setSelectedBooth(null);
        }
    }, [selectedWard]);

    // Zoom to selected booth when booth data becomes available
    useEffect(() => {
        if (selectedBooth && booths) {
            const booth = booths.find((b) => String(b.id) === selectedBooth);
            if (booth?.latitude && booth?.longitude) {
                smoothZoomTo({ lat: booth.latitude, lng: booth.longitude }, 17);
            }
        }
    }, [selectedBooth, booths, smoothZoomTo]);

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
        refetch: refetchReport,
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

    // Get security report for selected booth (from booths data which has nested reports)
    const selectedBoothSecurityReport = useMemo(() => {
        if (!selectedBooth || !booths) return null;
        const booth = booths.find((b) => String(b.id) === selectedBooth);
        return booth?.reports?.[0] || null;
    }, [selectedBooth, booths]);

    if (!isLoaded) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <>
            <Grid gutter={0}>
                <Grid.Col ref={mapSectionRef} pos="relative" span={{ base: 12, lg: sideExtended ? 9 : 6 }} h={{ base: "80vh", lg: "100vh" }} bg="gray.3">
                    <MapCanvas
                        mapType={mapType}
                        routeMode={routeMode}
                        routePoints={routePoints}
                        onMapClick={handleMapClick}
                        selectedMunicipality={selectedMunicipality}
                        municipalities={municipalities}
                        onResetRef={mapResetRef}
                        mapRefCallback={mapRef}
                        ashrabMode={ashrabMode}
                        ashrabLocations={ashrabData.locations}
                        pollingStations={pollingStations}
                        heatmapMode={heatmapMode}
                        securityMode={true}
                        rankingMode={rankingMode}
                        onPollingStationClick={(station) => {
                            // Update side panel selection when a station is clicked on map
                            // Set pending refs BEFORE setting municipality to preserve them through cascading resets
                            if (station.ward_id) {
                                pendingWardRef.current = String(station.ward_id);
                                pendingBoothRef.current = String(station.id);
                            }
                            if (station.municipality_id) {
                                setSelectedMunicipality(String(station.municipality_id));
                            }
                        }}
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


                    {/* Location Selection - Desktop: Paper, Mobile: Drawer */}
                    {(() => {
                        // Determine current selection level
                        const currentLevel = selectedBooth ? 'booth' : selectedWard ? 'ward' : selectedMunicipality ? 'municipality' : 'none';

                        const selectionContent = (
                            <Stack gap="sm">
                                {/* Header with back button and current location */}
                                <Group justify="space-between" align="center">
                                    {currentLevel !== 'none' && (
                                        <Button
                                            size="xs"
                                            variant="subtle"
                                            leftSection={<ArrowLeftIcon size={14} />}
                                            onClick={goBackSelection}
                                        >
                                            Back
                                        </Button>
                                    )}
                                    {currentLevel === 'none' && <div />}
                                    <Badge size="sm" variant="light" color={
                                        currentLevel === 'booth' ? 'violet' :
                                        currentLevel === 'ward' ? 'teal' :
                                        currentLevel === 'municipality' ? 'brand' : 'gray'
                                    }>
                                        {currentLevel === 'booth' ? 'Booth' :
                                         currentLevel === 'ward' ? 'Ward' :
                                         currentLevel === 'municipality' ? 'Municipality' : 'Location'}
                                    </Badge>
                                </Group>

                                {/* Show current selection breadcrumb */}
                                {currentLevel !== 'none' && (
                                    <Text size="xs" c="dimmed" lineClamp={1}>
                                        {selectedMunicipality && municipalities?.find(m => String(m.id) === selectedMunicipality)?.display_name}
                                        {selectedWard && ` > Ward ${wards?.find(w => String(w.id) === selectedWard)?.ward_no || selectedWard}`}
                                        {selectedBooth && ` > ${booths?.find(b => String(b.id) === selectedBooth)?.place_name_ne || 'Booth'}`}
                                    </Text>
                                )}

                                <Divider />

                                {/* Municipality Selection - shown when no municipality selected */}
                                {!selectedMunicipality && (
                                    <>
                                        <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                            Select Municipality
                                        </Text>
                                        <Stack gap={6}>
                                            {loadingMunicipalities ? (
                                                <Text size="xs" c="dimmed">Loading...</Text>
                                            ) : (
                                                municipalities?.map((municipality) => (
                                                    <Paper
                                                        key={municipality.id}
                                                        p="xs"
                                                        radius="sm"
                                                        withBorder
                                                        style={{
                                                            cursor: 'pointer',
                                                            borderColor: 'var(--mantine-color-gray-3)',
                                                            backgroundColor: 'white',
                                                            transition: 'all 0.15s ease',
                                                        }}
                                                        onClick={() => {
                                                            setSelectedMunicipality(String(municipality.id));
                                                        }}
                                                    >
                                                        <Group gap="xs" wrap="nowrap">
                                                            <div
                                                                style={{
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: 'var(--mantine-color-brand-6)',
                                                                    flexShrink: 0,
                                                                }}
                                                            />
                                                            <Text size="sm" fw={500}>
                                                                {municipality.display_name}
                                                            </Text>
                                                        </Group>
                                                    </Paper>
                                                ))
                                            )}
                                        </Stack>
                                    </>
                                )}

                                {/* Ward Selection - shown when municipality selected but no ward */}
                                {selectedMunicipality && !selectedWard && (
                                    <>
                                        <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                            Select Ward
                                        </Text>
                                        <Stack gap={6}>
                                            {loadingWards ? (
                                                <Text size="xs" c="dimmed">Loading wards...</Text>
                                            ) : wards && wards.length > 0 ? (
                                                wards.map((ward) => {
                                                    const wardLabel = ward.ward_no ? `Ward ${ward.ward_no}` : ward.display_name || `Ward ${ward.id}`;
                                                    return (
                                                        <Paper
                                                            key={ward.id}
                                                            p="xs"
                                                            radius="sm"
                                                            withBorder
                                                            style={{
                                                                cursor: 'pointer',
                                                                borderColor: 'var(--mantine-color-gray-3)',
                                                                backgroundColor: 'white',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            onClick={() => {
                                                                setSelectedWard(String(ward.id));
                                                            }}
                                                        >
                                                            <Group gap="xs" wrap="nowrap">
                                                                <div
                                                                    style={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'var(--mantine-color-teal-6)',
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Text size="sm" fw={500}>
                                                                    {wardLabel}
                                                                </Text>
                                                            </Group>
                                                        </Paper>
                                                    );
                                                })
                                            ) : (
                                                <Text size="xs" c="dimmed">No wards found</Text>
                                            )}
                                        </Stack>
                                    </>
                                )}

                                {/* Booth Selection - shown when ward selected but no booth */}
                                {selectedWard && !selectedBooth && (
                                    <>
                                        <Text size="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.5px' }}>
                                            Select Polling Booth
                                        </Text>
                                        <Stack gap={6}>
                                            {loadingBooths ? (
                                                <Text size="xs" c="dimmed">Loading booths...</Text>
                                            ) : booths && booths.length > 0 ? (
                                                booths.map((booth) => {
                                                    const boothLabel = booth.place_name_ne || booth.place_name_en || `Booth ${booth.id}`;
                                                    return (
                                                        <Paper
                                                            key={booth.id}
                                                            p="xs"
                                                            radius="sm"
                                                            withBorder
                                                            style={{
                                                                cursor: 'pointer',
                                                                borderColor: 'var(--mantine-color-gray-3)',
                                                                backgroundColor: 'white',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            onClick={() => {
                                                                setSelectedBooth(String(booth.id));
                                                                if (booth.latitude && booth.longitude) {
                                                                    smoothZoomTo({ lat: booth.latitude, lng: booth.longitude }, 17);
                                                                }
                                                                if (isMobile) closeLocationDrawer();
                                                            }}
                                                        >
                                                            <Group gap="xs" wrap="nowrap">
                                                                <div
                                                                    style={{
                                                                        width: 8,
                                                                        height: 8,
                                                                        borderRadius: '50%',
                                                                        backgroundColor: 'var(--mantine-color-violet-6)',
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Text size="sm" fw={500} lineClamp={1}>
                                                                    {boothLabel}
                                                                </Text>
                                                            </Group>
                                                        </Paper>
                                                    );
                                                })
                                            ) : (
                                                <Text size="xs" c="dimmed">No booths found</Text>
                                            )}
                                        </Stack>
                                    </>
                                )}

                                {/* When booth is selected, show option to change */}
                                {selectedBooth && (
                                    <Stack gap="xs">
                                        <Text size="xs" c="dimmed">
                                            Viewing booth details. Use Back to change selection.
                                        </Text>
                                    </Stack>
                                )}
                            </Stack>
                        );

                        return (
                            <>
                                {/* Mobile: Button to open drawer */}
                                {isMobile && (
                                    <Button
                                        pos="absolute"
                                        bottom={12}
                                        left={12}
                                        size="sm"
                                        variant="white"
                                        onClick={openLocationDrawer}
                                        style={{ border: '1px solid var(--mantine-color-gray-3)' }}
                                    >
                                        {currentLevel === 'none' ? 'Select Location' : getCurrentSelectionLabel()}
                                    </Button>
                                )}

                                {/* Mobile: Drawer */}
                                <Drawer
                                    opened={locationDrawerOpened}
                                    onClose={closeLocationDrawer}
                                    title="Select Location"
                                    position="bottom"
                                    size="70%"
                                    radius="md"
                                    styles={{ body: { padding: 'var(--mantine-spacing-md)' } }}
                                >
                                    {selectionContent}
                                </Drawer>

                                {/* Desktop: Fixed Paper */}
                                {!isMobile && (
                                    <Paper
                                        pos="absolute"
                                        bottom={12}
                                        left={12}
                                        p="sm"
                                        radius="md"
                                        withBorder
                                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', maxHeight: '60vh', overflowY: 'auto', minWidth: 220 }}
                                    >
                                        {selectionContent}
                                    </Paper>
                                )}
                            </>
                        );
                    })()}


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
                        <Button
                            size="xs"
                            variant={rankingMode ? "filled" : "white"}
                            color={rankingMode ? "orange" : undefined}
                            onClick={() => setRankingMode(!rankingMode)}
                        >
                            Top 10
                        </Button>
                        <Button size="xs" variant="light" color="blue">
                            Booths: {pollingStations?.length || 0}
                        </Button>
                        <Select
                            size="xs"
                            placeholder="Search booth..."
                            searchable
                            clearable
                            nothingFoundMessage="No booths found"
                            data={(pollingStations || []).map((station) => {
                                const ne = station.place_name_ne;
                                const en = station.place_name_en;
                                let label = `Booth ${station.id}`;
                                if (ne && en) label = `${ne} (${en})`;
                                else if (ne) label = ne;
                                else if (en) label = en;
                                return { value: String(station.id), label };
                            })}
                            value={selectedBooth}
                            onChange={(value) => {
                                if (value) {
                                    const station = pollingStations?.find((s) => String(s.id) === value);
                                    if (station) {
                                        const muniId = station.municipality_id ? String(station.municipality_id) : null;
                                        const wardId = station.ward_id ? String(station.ward_id) : null;
                                        const boothId = String(station.id);

                                        if (muniId && muniId !== selectedMunicipality) {
                                            // Different municipality — full cascade via useEffects
                                            if (wardId) pendingWardRef.current = wardId;
                                            pendingBoothRef.current = boothId;
                                            setSelectedMunicipality(muniId);
                                        } else if (wardId && wardId !== selectedWard) {
                                            // Same municipality, different ward — skip muni effect, set ward directly
                                            pendingBoothRef.current = boothId;
                                            setSelectedWard(wardId);
                                        } else {
                                            // Same municipality AND same ward — set booth directly
                                            setSelectedBooth(boothId);
                                            if (station.latitude && station.longitude) {
                                                smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
                                            }
                                        }
                                    }
                                }
                            }}
                            styles={{ root: { minWidth: 200 } }}
                        />
                    </Group>






                    {/* Mobile: Scroll to stats button */}
                    {isMobile && (
                        <Button
                            pos="absolute"
                            bottom={12}
                            left="50%"
                            style={{ transform: 'translateX(-50%)' }}
                            size="sm"
                            variant="white"
                            leftSection={<CaretUpIcon size={16} />}
                            onClick={scrollToStats}
                        >
                            View Stats
                        </Button>
                    )}

                </Grid.Col>
                <Grid.Col ref={statsSectionRef} span={{ base: 12, lg: sideExtended ? 3 : 6 }} h={{ base: "auto", lg: "100vh" }} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>

                    <Group
                        px="md" py="xs"
                        justify="space-between"
                        style={{ flexShrink: 0 }}
                    >
                        <Group gap="xs">
                            {isMobile && (
                                <Button
                                    size="xs"
                                    variant="subtle"
                                    onClick={scrollToMap}
                                    leftSection={<CaretDownIcon size={14} />}
                                >
                                    Map
                                </Button>
                            )}
                            <Text size="sm" fw={900}>
                                zetsel.<span style={{
                                    color: 'var(--mantine-color-brand-6)'
                                }}>mapview</span>
                            </Text>
                        </Group>

                        <Group gap={4}>
                            <Button size="xs" variant="light" leftSection={<RobotIcon weight="fill" />}>
                                Ask AI
                            </Button>
                            <Button size="xs" variant="light" onClick={resetAll}>
                                <ArrowClockwiseIcon />
                            </Button>
                            <Button
                                size="xs"
                                variant="light"
                                onClick={() => setSideExtended(!sideExtended)}
                                title={sideExtended ? "Expand panel" : "Collapse panel"}
                            >
                                {sideExtended ? <CaretLeftIcon /> : <CaretRightIcon />}
                            </Button>
                        </Group>

                    </Group>

                    <Divider style={{ flexShrink: 0 }} />

                    <Group px="md" py="xs" bg="brand.0" style={{ flexShrink: 0 }}>
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
                    <Divider style={{ flexShrink: 0 }} />

                    <ScrollArea style={{ flex: 1 }} offsetScrollbars scrollbarSize={6} p="md">
                        {/* Navigation */}
                        <ExpandedSheetContent
                            reportLevel={reportLevel}
                            reportData={reportData}
                            loadingReport={loadingReport}
                            reportError={reportError}
                            selectedMunicipality={selectedMunicipality}
                            selectedWard={selectedWard}
                            selectedBooth={selectedBooth}
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
                                // Smooth zoom to booth location
                                if (booth?.latitude && booth?.longitude) {
                                    smoothZoomTo({ lat: booth.latitude, lng: booth.longitude }, 17);
                                }
                            }}
                            onBack={goBackSelection}
                            onDistrictStationClick={(station) => {
                                // Smooth zoom to station location
                                if (station?.latitude && station?.longitude) {
                                    smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
                                }
                                // Navigate to ward/booth
                                const stationId = station.polling_station_id || station.id;
                                if (station.ward_no && wards) {
                                    const ward = wards.find((w) => w.ward_no === station.ward_no);
                                    if (ward) {
                                        pendingBoothRef.current = String(stationId);
                                        setSelectedWard(String(ward.id));
                                        setSelectedMunicipality(String(station.municipality_id));
                                    }
                                }
                            }}
                            onMunicipalityStationClick={(station) => {
                                // Smooth zoom to station location
                                if (station?.latitude && station?.longitude) {
                                    smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
                                }
                                // Navigate to ward/booth
                                const stationId = station.polling_station_id || station.id;
                                if (station.ward_no && wards) {
                                    const ward = wards.find((w) => w.ward_no === station.ward_no);
                                    if (ward) {
                                        pendingBoothRef.current = String(stationId);
                                        setSelectedWard(String(ward.id));
                                    }
                                }
                            }}
                            onManageCandidates={(station) => {
                                setCandidateModalStation(station);
                                setCandidateModalOpen(true);
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
                                    onCandidatesSaved={() => {
                                        refetchReport();
                                        refetchPollingStations();
                                        refetchBooths();
                                    }}
                                    securityReport={reportLevel === "booth" ? selectedBoothSecurityReport : undefined}
                                    pollingStationId={reportLevel === "booth" && selectedBooth ? Number(selectedBooth) : null}
                                />
                            </>
                        ) : null}
                    </ScrollArea>

                </Grid.Col>
            </Grid>

            {/* Candidate Modal for map info window */}
            {candidateModalStation && candidateModalStation.reports?.[0] && (
                <CandidateModal
                    opened={candidateModalOpen}
                    onClose={() => {
                        setCandidateModalOpen(false);
                        setCandidateModalStation(null);
                    }}
                    report={candidateModalStation.reports[0] as BoothReport}
                    onSave={async (candidates: BoothReportCandidate[]) => {
                        setSavingCandidates(true);
                        const report = candidateModalStation.reports?.[0];
                        if (!report) return;

                        try {
                            // PATCH the polling station report with updated candidates array
                            await REPORTING_API.updatePollingStationReport(report.id, {
                                candidates: candidates.map(c => ({
                                    id: c.id,
                                    name: c.name,
                                    phone: c.phone,
                                    accepted: c.accepted,
                                    remarks: c.remarks,
                                }))
                            });

                            // Refetch data to show updated candidates
                            await Promise.all([
                                refetchReport(),
                                refetchPollingStations(),
                            ]);
                        } catch (error) {
                            console.error("Error saving candidates:", error);
                        } finally {
                            setSavingCandidates(false);
                        }
                    }}
                    isSaving={savingCandidates}
                />
            )}
        </>
    );
}