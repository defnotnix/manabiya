"use client";

import { useEffect, useState, useRef } from "react";
import type { GeoJsonObject } from "geojson";
import { notifications } from "@mantine/notifications";
import { Box, Button, Center, Loader, Paper } from "@mantine/core";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

type LayerType = "states" | "districts" | "municipalities" | "wards";

const LAYERS: { id: LayerType; label: string; file: string }[] = [
  { id: "states", label: "States", file: "/geojson/nepal-states.geojson" },
  {
    id: "districts",
    label: "Districts",
    file: "/geojson/nepal-districts-new.geojson",
  },
  {
    id: "municipalities",
    label: "Municipalities",
    file: "/geojson/nepal-municipalities.geojson",
  },
  { id: "wards", label: "Wards", file: "/geojson/nepal-wards.geojson" },
];

export function MapVisualizer() {
  const [geoData, setGeoData] = useState<{
    data: GeoJsonObject;
    layer: LayerType;
  } | null>(null);
  const [activeLayer, setActiveLayer] = useState<LayerType>("states");
  const [isLoading, setIsLoading] = useState(false);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    GeoJSON: any;
  } | null>(null);
  const [isReady, setIsReady] = useState(false);
  const linkRef = useRef<HTMLLinkElement | null>(null);

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
          GeoJSON: reactLeaflet.GeoJSON,
        });
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
      if (linkRef.current && document.head.contains(linkRef.current)) {
        document.head.removeChild(linkRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const controller = new AbortController();
    const layer = LAYERS.find((l) => l.id === activeLayer);
    if (!layer) return;

    const notificationId = `loading-${activeLayer}`;
    setIsLoading(true);
    notifications.show({
      id: notificationId,
      title: "Loading",
      message: `Loading ${layer.label}...`,
      loading: true,
      color: "blue",
      autoClose: false,
      withCloseButton: false,
      position: "top-center",
    });

    fetch(layer.file, { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        setGeoData({ data: data as GeoJsonObject, layer: activeLayer });
        setIsLoading(false);
        notifications.update({
          id: notificationId,
          title: "Loaded",
          message: `${layer.label} loaded successfully`,
          icon: <CheckCircleIcon size={20} />,
          color: "green",
          loading: false,
          autoClose: 2000,
          withCloseButton: true,
          position: "top-center",
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error loading GeoJSON:", error);
          setIsLoading(false);
          notifications.update({
            id: notificationId,
            title: "Error",
            message: `Failed to load ${layer.label}`,
            icon: <XCircleIcon size={20} />,
            color: "red",
            loading: false,
            autoClose: 3000,
            withCloseButton: true,
            position: "top-center",
          });
        }
      });

    return () => {
      controller.abort();
      notifications.hide(notificationId);
    };
  }, [isReady, activeLayer]);

  if (!MapComponents) {
    return (
      <Center h="100vh" w="100%">
        <Loader />
      </Center>
    );
  }

  const { MapContainer, TileLayer, GeoJSON } = MapComponents;

  return (
    <Box h="100vh" w="100%" pos="relative">
      <Paper
        shadow="md"
        p="xs"
        radius="sm"
        pos="absolute"
        bottom={10}
        right={10}
        style={{ zIndex: 1000 }}
      >
        <Button.Group>
          {LAYERS.map((layer) => (
            <Button
              key={layer.id}
              size="xs"
              variant={activeLayer === layer.id ? "filled" : "light"}
              disabled={isLoading}
              onClick={() => setActiveLayer(layer.id)}
            >
              {layer.label}
            </Button>
          ))}
        </Button.Group>
      </Paper>
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        style={{
          height: "100%",
          width: "100%",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && geoData.layer === activeLayer && (
          <GeoJSON
            key={activeLayer}
            data={geoData.data}
            style={{
              fillColor: "#3b82f6",
              weight: 1,
              opacity: 1,
              color: "#1e40af",
              fillOpacity: 0.2,
            }}
          />
        )}
      </MapContainer>
    </Box>
  );
}
