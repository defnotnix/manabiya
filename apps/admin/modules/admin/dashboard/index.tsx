"use client";

import dynamic from "next/dynamic";

const MapVisualizer = dynamic(
  () =>
    import("@/components/MapVisualizer").then((mod) => ({
      default: mod.MapVisualizer,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading map...
      </div>
    ),
  },
);

export function ModuleDashboard() {
  return <MapVisualizer />;
}
