"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import type { GeoJsonObject } from "geojson";

export function NepalMap() {
  const [nepalGeoJSON, setNepalGeoJSON] = useState<GeoJsonObject | null>(null);

  useEffect(() => {
    // Fetch Nepal's GeoJSON boundary data
    fetch("https://raw.githubusercontent.com/datasets/geo-boundaries-world-110m/master/countries.geojson")
      .then((response) => response.json())
      .then((data) => {
        // Filter to get only Nepal
        const nepal = {
          type: "FeatureCollection",
          features: data.features.filter(
            (feature: any) => feature.properties.ADMIN === "Nepal"
          ),
        };
        setNepalGeoJSON(nepal as GeoJsonObject);
      })
      .catch((error) => console.error("Error loading Nepal GeoJSON:", error));
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        style={{
          height: "100%",
          width: "100%",
          filter: "invert(1) hue-rotate(180deg)",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {nepalGeoJSON && (
          <GeoJSON
            data={nepalGeoJSON}
            style={{
              fillColor: "#3b82f6",
              weight: 3,
              opacity: 1,
              color: "#ef4444",
              fillOpacity: 0.3,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
