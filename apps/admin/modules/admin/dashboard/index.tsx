"use client";

import dynamic from "next/dynamic";

const NepalMap = dynamic(() => import("@/components/NepalMap").then((mod) => ({ default: mod.NepalMap })), {
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
});

export function ModuleDashboard() {
  return <NepalMap />;
}
