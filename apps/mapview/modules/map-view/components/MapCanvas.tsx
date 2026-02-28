"use client";

import { GoogleMap, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api";
import { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { useGeoBoundaries } from "../hooks/useGeoBoundaries";
import { GORKHA_1_CENTER, DEFAULT_ZOOM, NEPALI_TO_GEOJSON_NAME } from "../constants";
import type { PollingStation } from "../types";
import { VoterHeatmap } from "./VoterHeatmap";

// Colors for top 10 ranked stations (gold to bronze gradient)
const TOP_10_COLORS = [
    "#FFD700", // 1 - Gold
    "#FFC400", // 2
    "#FFB300", // 3
    "#FFA000", // 4
    "#FF8F00", // 5
    "#FF6F00", // 6
    "#F57C00", // 7
    "#EF6C00", // 8
    "#E65100", // 9
    "#D84315", // 10 - Deep orange
];

interface Municipality {
    id: number;
    display_name?: string;
}

interface AshrabLocation {
    id: string;
    name: { en: string; ne: string };
    geo: { type: string; lat?: number; lng?: number; url?: string; value?: unknown };
    issues?: Array<{ en: string; ne: string }>;
    notes?: Array<{ en: string; ne: string }>;
    contacts?: Array<{ name: string | null; phone: string }>;
    population?: number | string | null;
    voters?: number | string | null;
    booth?: unknown;
}

interface MapCanvasProps {
    mapType?: "roadmap" | "satellite";
    routeMode?: boolean;
    routePoints?: google.maps.LatLngLiteral[];
    onMapClick?: (latLng: google.maps.LatLngLiteral) => void;
    selectedMunicipality?: string | null;
    municipalities?: Municipality[];
    onMunicipalityClick?: (municipalityName: string) => void;
    onResetRef?: React.MutableRefObject<(() => void) | null>;
    ashrabMode?: boolean;
    ashrabLocations?: AshrabLocation[];
    pollingStations?: PollingStation[];
    heatmapMode?: boolean;
}

export function MapCanvas({
    mapType = "roadmap",
    routeMode = false,
    routePoints = [],
    onMapClick,
    selectedMunicipality,
    municipalities = [],
    onMunicipalityClick,
    onResetRef,
    ashrabMode = false,
    ashrabLocations = [],
    pollingStations = [],
    heatmapMode = false,
}: MapCanvasProps) {
    const initialCenter = useRef(GORKHA_1_CENTER);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [directionsResult, setDirectionsResult] = useState<google.maps.DirectionsResult | null>(null);
    const [selectedAshrabLocation, setSelectedAshrabLocation] = useState<AshrabLocation | null>(null);
    const [selectedPollingStation, setSelectedPollingStation] = useState<PollingStation | null>(null);

    // Filter ashrab locations that have coordinates
    const ashrabMarkersData = ashrabLocations.filter(
        (loc) => loc.geo.type === "coords" && loc.geo.lat && loc.geo.lng
    );

    // Calculate top 10 polling stations by voter population
    const top10Map = useMemo(() => {
        const validStations = pollingStations.filter(
            ps => ps.latitude && ps.longitude && ps.voter_population
        );
        const sorted = [...validStations].sort(
            (a, b) => (b.voter_population || 0) - (a.voter_population || 0)
        );
        const top10 = sorted.slice(0, 10);
        return new Map(top10.map((s, idx) => [s.id, idx]));
    }, [pollingStations]);

    // Debug: log polling stations
    useEffect(() => {
        console.log("MapCanvas received pollingStations:", pollingStations);
        console.log("Stations with coords:", pollingStations.filter(ps => ps.latitude && ps.longitude).length);
    }, [pollingStations]);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        setMapLoaded(true);
    }, []);

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

    // Reset map to default center and zoom
    const resetMap = useCallback(() => {
        if (mapRef.current) {
            mapRef.current.panTo(GORKHA_1_CENTER);
            mapRef.current.setZoom(DEFAULT_ZOOM);
        }
        setDirectionsResult(null);
    }, []);

    // Expose reset function to parent
    useEffect(() => {
        if (onResetRef) {
            onResetRef.current = resetMap;
        }
    }, [onResetRef, resetMap]);

    // Get selected municipality name from API data and convert to GeoJSON name
    const selectedMunicipalityName = (() => {
        if (!selectedMunicipality) return null;
        const muni = municipalities.find(m => String(m.id) === selectedMunicipality);
        if (!muni?.display_name) return null;
        // Convert Nepali name to GeoJSON English name
        return NEPALI_TO_GEOJSON_NAME[muni.display_name] || muni.display_name;
    })();

    // GeoJSON boundaries
    useGeoBoundaries({
        map: mapLoaded ? mapRef.current : null,
        selectedMunicipalityName,
        onMunicipalityClick,
    });

    const handleMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (routeMode && e.latLng && onMapClick) {
                onMapClick({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                });
            }
        },
        [routeMode, onMapClick]
    );

    // Calculate route live as points are added
    useEffect(() => {
        // Only clear when starting fresh (no points)
        if (routePoints.length === 0) {
            setDirectionsResult(null);
            return;
        }

        // Need at least 2 points and be in route mode to calculate
        if (!routeMode || routePoints.length < 2) {
            return;
        }

        // Clear previous result while calculating new route
        setDirectionsResult(null);

        const calculateRoute = async () => {
            const directionsService = new google.maps.DirectionsService();
            const origin = routePoints[0];
            const destination = routePoints[routePoints.length - 1];
            const waypoints = routePoints.slice(1, -1).map((point) => ({
                location: point,
                stopover: true,
            }));

            try {
                const result = await directionsService.route({
                    origin,
                    destination,
                    waypoints,
                    travelMode: google.maps.TravelMode.DRIVING,
                });
                setDirectionsResult(result);
            } catch (error) {
                console.error("Error calculating route:", error);
                setDirectionsResult(null);
            }
        };

        calculateRoute();
    }, [routeMode, routePoints]);

    return (
        <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={initialCenter.current}
            zoom={DEFAULT_ZOOM}
            onLoad={onMapLoad}
            onClick={handleMapClick}
            options={{
                disableDefaultUI: true,
                mapTypeId: mapType,
                draggableCursor: routeMode ? "crosshair" : undefined,
            }}
        >
            {/* Show markers for route points when building route */}
            {routeMode && !directionsResult && routePoints.map((point, index) => (
                <Marker
                    key={index}
                    position={point}
                    label={String(index + 1)}
                />
            ))}

            {/* Render the calculated route */}
            {directionsResult && (
                <DirectionsRenderer
                    directions={directionsResult}
                    options={{
                        suppressMarkers: false,
                        polylineOptions: {
                            strokeColor: "#1976D2",
                            strokeWeight: 4,
                        },
                    }}
                />
            )}

            {/* Ashrab mode markers */}
            {ashrabMode && ashrabMarkersData.map((location) => (
                <Marker
                    key={location.id}
                    position={{ lat: location.geo.lat!, lng: location.geo.lng! }}
                    onClick={() => {
                        setSelectedAshrabLocation(location);
                        // Smooth zoom to the location
                        if (location.geo.lat && location.geo.lng) {
                            smoothZoomTo({ lat: location.geo.lat, lng: location.geo.lng }, 17);
                        }
                    }}
                    icon={{
                        url: "data:image/svg+xml," + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#e11d48" stroke="#fff" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/>
                            </svg>
                        `),
                        scaledSize: new google.maps.Size(24, 24),
                        anchor: new google.maps.Point(12, 12),
                    }}
                />
            ))}

            {/* Ashrab location info window */}
            {ashrabMode && selectedAshrabLocation && selectedAshrabLocation.geo.lat && selectedAshrabLocation.geo.lng && (
                <InfoWindow
                    position={{ lat: selectedAshrabLocation.geo.lat, lng: selectedAshrabLocation.geo.lng }}
                    onCloseClick={() => setSelectedAshrabLocation(null)}
                >
                    <div style={{ maxWidth: 280, fontSize: 12 }}>
                        <h4 style={{ margin: "0 0 8px", fontSize: 14 }}>
                            {selectedAshrabLocation.name.ne}
                        </h4>
                        <p style={{ margin: "0 0 4px", color: "#666" }}>
                            {selectedAshrabLocation.name.en}
                        </p>

                        {selectedAshrabLocation.population && (
                            <p style={{ margin: "4px 0" }}>
                                <strong>Population:</strong> {selectedAshrabLocation.population}
                            </p>
                        )}
                        {selectedAshrabLocation.voters && (
                            <p style={{ margin: "4px 0" }}>
                                <strong>Voters:</strong> {selectedAshrabLocation.voters}
                            </p>
                        )}

                        {selectedAshrabLocation.issues && selectedAshrabLocation.issues.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <strong style={{ color: "#dc2626" }}>Issues:</strong>
                                <ul style={{ margin: "4px 0", paddingLeft: 16 }}>
                                    {selectedAshrabLocation.issues.map((issue, idx) => (
                                        <li key={idx} style={{ marginBottom: 2 }}>{issue.en}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedAshrabLocation.notes && selectedAshrabLocation.notes.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <strong style={{ color: "#2563eb" }}>Notes:</strong>
                                <ul style={{ margin: "4px 0", paddingLeft: 16 }}>
                                    {selectedAshrabLocation.notes.map((note, idx) => (
                                        <li key={idx} style={{ marginBottom: 2 }}>{note.en}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {selectedAshrabLocation.contacts && selectedAshrabLocation.contacts.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                                <strong>Contacts:</strong>
                                <ul style={{ margin: "4px 0", paddingLeft: 16 }}>
                                    {selectedAshrabLocation.contacts.map((contact, idx) => (
                                        <li key={idx}>
                                            {contact.name || "Unknown"}: {contact.phone}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </InfoWindow>
            )}

            {/* Polling station markers */}
            {pollingStations.filter(ps => ps.latitude && ps.longitude).map((station) => {
                const rank = top10Map.get(station.id);
                const isTop10 = rank !== undefined;
                const color = isTop10 ? TOP_10_COLORS[rank] : "#1e40af";
                const size = isTop10 ? 36 : 28;

                return (
                    <Marker
                        key={station.id}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        onClick={() => {
                            setSelectedPollingStation(station);
                            // Smooth zoom to the station location
                            smoothZoomTo({ lat: station.latitude, lng: station.longitude }, 17);
                        }}
                        title={station.place_name_ne}
                        zIndex={isTop10 ? 1000 - rank : 1}
                        icon={{
                            url: "data:image/svg+xml," + encodeURIComponent(
                                isTop10
                                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36">
                                        <path fill="${color}" stroke="#fff" stroke-width="2" d="M18 3C12.48 3 8 7.48 8 13c0 7.88 10 20 10 20s10-12.12 10-20c0-5.52-4.48-10-10-10z"/>
                                        <circle cx="18" cy="13" r="8" fill="#fff"/>
                                        <text x="18" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="${color}">#${rank + 1}</text>
                                    </svg>`
                                    : `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                                        <path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                                        <circle cx="12" cy="9" r="3" fill="#fff"/>
                                    </svg>`
                            ),
                            scaledSize: new google.maps.Size(size, size),
                            anchor: new google.maps.Point(size / 2, size),
                        }}
                    />
                );
            })}

            {/* Polling station info window */}
            {selectedPollingStation && selectedPollingStation.latitude && selectedPollingStation.longitude && (() => {
                const selectedRank = top10Map.get(selectedPollingStation.id);
                const isSelectedTop10 = selectedRank !== undefined;
                return (
                    <InfoWindow
                        position={{ lat: selectedPollingStation.latitude, lng: selectedPollingStation.longitude }}
                        onCloseClick={() => setSelectedPollingStation(null)}
                    >
                        <div style={{ maxWidth: 300, fontSize: 12, lineHeight: 1.5 }}>
                            {isSelectedTop10 && (
                                <div style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    backgroundColor: TOP_10_COLORS[selectedRank],
                                    color: "#fff",
                                    borderRadius: 4,
                                    fontWeight: "bold",
                                    fontSize: 11,
                                    marginBottom: 8
                                }}>
                                    #{selectedRank + 1} Top Station
                                </div>
                            )}
                            <h4 style={{ margin: "0 0 8px", fontSize: 14, color: isSelectedTop10 ? TOP_10_COLORS[selectedRank] : "#1e40af" }}>
                                {selectedPollingStation.place_name_ne}
                            </h4>
                            {selectedPollingStation.place_name_en && (
                                <p style={{ margin: "0 0 8px", color: "#666", fontStyle: "italic" }}>
                                    {selectedPollingStation.place_name_en}
                                </p>
                            )}

                            {selectedPollingStation.voter_population && (
                                <p style={{ margin: "4px 0", padding: "4px 8px", backgroundColor: "#f0fdf4", borderRadius: 4 }}>
                                    <strong style={{ color: "#16a34a" }}>Voters:</strong> {selectedPollingStation.voter_population.toLocaleString()}
                                </p>
                            )}

                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 8 }}>
                                <p style={{ margin: "4px 0" }}>
                                    <strong>Ward:</strong> {selectedPollingStation.ward_name_ne} (Ward {selectedPollingStation.ward_no})
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                    <strong>Municipality:</strong> {selectedPollingStation.municipality_name_ne}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                    <strong>District:</strong> {selectedPollingStation.district_name_ne}
                                </p>
                                <p style={{ margin: "4px 0" }}>
                                    <strong>Province:</strong> {selectedPollingStation.province_name_ne}
                                </p>
                            </div>

                            {selectedPollingStation.station_code && (
                                <p style={{ margin: "8px 0 4px", color: "#059669" }}>
                                    <strong>Station Code:</strong> {selectedPollingStation.station_code}
                                </p>
                            )}

                            <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 8, color: "#6b7280", fontSize: 11 }}>
                                <p style={{ margin: "2px 0" }}>
                                    Lat: {selectedPollingStation.latitude.toFixed(6)}, Lng: {selectedPollingStation.longitude.toFixed(6)}
                                </p>
                            </div>
                        </div>
                    </InfoWindow>
                );
            })()}

            {/* Voter population heatmap */}
            <VoterHeatmap
                map={mapRef.current}
                pollingStations={pollingStations}
                enabled={heatmapMode}
            />
        </GoogleMap>
    );
}
