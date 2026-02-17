"use client";

import { useMemo, useState } from "react";
import { Box, Center, Loader, Text, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { REPORTING_API } from "../api/reporting.api";
import { WARD_MAP_DATA } from "../data/wardMapData";

interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  ward_no?: number | null;
}

interface WardMapProps {
  municipalityId: number;
  wards: GeoUnit[];
  selectedWardNo?: number | null;
  onSelectWard: (id: string) => void;
}

/** Interpolate between two hex colors by ratio 0–1 */
function lerpColor(a: string, b: string, t: number): string {
  const parse = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
  };
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const bl = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r},${g},${bl})`;
}

/** Approximate centroid of an SVG path by sampling its move/line coordinates */
function getPathCentroid(d: string): { x: number; y: number } {
  const coords: { x: number; y: number }[] = [];
  // Match numbers that follow M, L, H, V or are plain coordinate pairs
  const regex = /[ML]\s*([\d.]+)[,\s]+([\d.]+)/gi;
  let match;
  while ((match = regex.exec(d)) !== null) {
    coords.push({ x: parseFloat(match[1]), y: parseFloat(match[2]) });
  }
  if (coords.length === 0) return { x: 0, y: 0 };
  const sum = coords.reduce(
    (acc, c) => ({ x: acc.x + c.x, y: acc.y + c.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / coords.length, y: sum.y / coords.length };
}

const COLOR_LOW = "#dbeafe"; // light blue
const COLOR_HIGH = "#1e40af"; // dark blue
const COLOR_DEFAULT = "#D9D9D9";
const COLOR_HOVER = "#fbbf24"; // amber on hover
const COLOR_SELECTED = "#2563eb"; // solid blue for selected ward

export function WardMap({
  municipalityId,
  wards,
  selectedWardNo,
  onSelectWard,
}: WardMapProps) {
  const [hoveredWard, setHoveredWard] = useState<number | null>(null);

  const svgData = WARD_MAP_DATA[municipalityId];

  // Fetch ward-level reports for population data
  // Results come ordered by ward (1, 2, 3...) — index maps to SVG path index
  const { data: wardReportsData, isLoading } = useQuery({
    queryKey: ["ward-reports-for-map", municipalityId],
    queryFn: async () => {
      return REPORTING_API.getWards({
        municipality: municipalityId,
        page_size: 50,
      });
    },
    staleTime: 60_000,
  });

  // Build ward_no → { wardId, population } mapping
  // API results are ordered ward 1, 2, 3... matching SVG path order
  const wardDataMap = useMemo(() => {
    const map: Record<number, { wardId: number; population: number }> = {};
    const reports: any[] = wardReportsData?.results || [];

    // Match reports to wards by ward_id === ward.id
    for (const ward of wards) {
      if (!ward.ward_no) continue;
      const report = reports.find((r: any) => r.ward_id === ward.id);
      map[ward.ward_no] = {
        wardId: ward.id,
        population: report?.total_voters_count || 0,
      };
    }

    return map;
  }, [wards, wardReportsData]);

  // Compute min/max for color gradient
  const { minPop, maxPop } = useMemo(() => {
    const pops = Object.values(wardDataMap)
      .map((d) => d.population)
      .filter((p) => p > 0);
    if (pops.length === 0) return { minPop: 0, maxPop: 1 };
    return { minPop: Math.min(...pops), maxPop: Math.max(...pops) };
  }, [wardDataMap]);

  // Pre-compute centroids for labels
  const centroids = useMemo(() => {
    if (!svgData) return [];
    return svgData.paths.map((d) => getPathCentroid(d));
  }, [svgData]);

  // Compute font size based on viewBox
  const labelFontSize = useMemo(() => {
    if (!svgData) return 12;
    const [, , w, h] = svgData.viewBox.split(" ").map(Number);
    return Math.max(6, Math.min(11, Math.round(Math.min(w, h) / 28)));
  }, [svgData]);

  if (!svgData) {
    return (
      <Text size="sm" c="dimmed" ta="center" py="md">
        No map available for this municipality
      </Text>
    );
  }

  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  return (
    <Box>
      <svg
        viewBox={svgData.viewBox}
        style={{ width: "100%", height: "auto", maxHeight: 280 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {svgData.paths.map((d, idx) => {
          const wardNo = idx + 1;
          const data = wardDataMap[wardNo];
          const isHovered = hoveredWard === wardNo;
          const isSelected = selectedWardNo === wardNo;

          // Compute fill color
          let fill = COLOR_DEFAULT;
          const hasSelection = selectedWardNo != null;

          if (isSelected) {
            fill = COLOR_SELECTED;
          } else if (hasSelection) {
            // Monochrome all non-selected wards when a ward is active
            fill = isHovered ? "#d1d5db" : "#e5e7eb";
          } else {
            // No selection — show population density gradient
            if (data && data.population > 0) {
              const t =
                maxPop === minPop
                  ? 0.5
                  : (data.population - minPop) / (maxPop - minPop);
              fill = lerpColor(COLOR_LOW, COLOR_HIGH, t);
            }
            if (isHovered) fill = COLOR_HOVER;
          }

          const isDark = isSelected;
          const centroid = centroids[idx];

          return (
            <Tooltip
              key={wardNo}
              label={
                data
                  ? `Ward ${wardNo} — ${data.population.toLocaleString()} voters`
                  : `Ward ${wardNo}`
              }
              position="top"
              withArrow
              opened={isHovered}
            >
              <g
                onMouseEnter={() => setHoveredWard(wardNo)}
                onMouseLeave={() => setHoveredWard(null)}
                onClick={() => {
                  if (data) onSelectWard(String(data.wardId));
                }}
                style={{
                  cursor: data ? "pointer" : "default",
                }}
              >
                <path
                  d={d}
                  fill={fill}
                  stroke={isSelected ? "#1e3a8a" : "#fff"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  style={{ transition: "fill 0.15s ease" }}
                />
                {centroid && (
                  <text
                    x={centroid.x}
                    y={centroid.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={labelFontSize}
                    fontWeight={700}
                    fill={isDark ? "#fff" : "#1e3a8a"}
                    style={{ pointerEvents: "none" }}
                  >
                    {wardNo}
                  </text>
                )}
              </g>
            </Tooltip>
          );
        })}
      </svg>

      {/* Legend — only when no ward is selected (density view) */}
      {!selectedWardNo && (
        <Box mt="xs" px="xs">
          <Text size="xs" c="dimmed" mb={4}>
            Voter density
          </Text>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text size="xs" c="dimmed">
              {minPop.toLocaleString()}
            </Text>
            <Box
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: `linear-gradient(to right, ${COLOR_LOW}, ${COLOR_HIGH})`,
              }}
            />
            <Text size="xs" c="dimmed">
              {maxPop.toLocaleString()}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
