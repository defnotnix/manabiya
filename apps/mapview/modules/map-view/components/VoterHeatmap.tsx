"use client";

import { useEffect, useRef } from "react";
import type { PollingStation } from "../types";

interface VoterHeatmapProps {
  map: google.maps.Map | null;
  pollingStations: PollingStation[];
  enabled: boolean;
}

export function VoterHeatmap({ map, pollingStations, enabled }: VoterHeatmapProps) {
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);

  useEffect(() => {
    if (!map) return;

    // Cleanup existing heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    if (!enabled || !pollingStations || pollingStations.length === 0) {
      return;
    }

    // Filter stations with valid data
    const validStations = pollingStations.filter(
      ps => ps.latitude && ps.longitude && ps.voter_population
    );

    if (validStations.length === 0) {
      console.log("No valid coordinates with voter_population found for heatmap");
      return;
    }

    // Calculate min/max for normalization
    const populations = validStations.map(ps => ps.voter_population || 0);
    const maxPop = Math.max(...populations);
    const minPop = Math.min(...populations);
    const range = maxPop - minPop || 1;

    console.log(`Heatmap stats: min=${minPop}, max=${maxPop}, stations=${validStations.length}`);

    // Create weighted data points with normalized weights
    // Use smaller weight range to prevent merging
    const heatmapData: google.maps.visualization.WeightedLocation[] = validStations.map(ps => {
      const normalized = (ps.voter_population! - minPop) / range; // 0-1
      const weight = 0.5 + (normalized * 1.5); // Scale to 0.5-2 (small range to prevent merging)
      return {
        location: new google.maps.LatLng(ps.latitude, ps.longitude),
        weight: weight,
      };
    });

    console.log(`Creating heatmap with ${heatmapData.length} weighted points`);

    // Create heatmap layer with weighted data
    // Micro-focused settings for pinpointing localities
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 100, // Very small radius in pixels for tight locality focus
      opacity: 0.75,
      dissipating: true, // Radius is in pixels, stays fixed on screen
      maxIntensity: 5, // Higher value prevents points from merging
      gradient: [
        "rgba(0, 255, 0, 0)",      // Transparent
        "rgba(0, 255, 0, 0.8)",    // Green (low population)
        "rgba(128, 255, 0, 0.9)",  // Yellow-green
        "rgba(255, 255, 0, 1)",    // Yellow
        "rgba(255, 192, 0, 1)",    // Gold
        "rgba(255, 128, 0, 1)",    // Orange
        "rgba(255, 64, 0, 1)",     // Red-orange
        "rgba(255, 0, 0, 1)",      // Red (high population)
      ],
    });

    heatmapRef.current = heatmap;

    // Cleanup function
    return () => {
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, pollingStations, enabled]);

  return null; // This component doesn't render anything directly
}
