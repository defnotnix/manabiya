"use client";

import { useEffect } from "react";

interface VoterHeatmapProps {
  map: google.maps.Map | null;
  voterData: any;
}

export function VoterHeatmap({ map, voterData }: VoterHeatmapProps) {
  useEffect(() => {
    if (!map || !voterData || !voterData.results) return;

    // Extract coordinates from voter data
    const heatmapData: google.maps.LatLng[] = [];

    voterData.results.forEach((voter: any) => {
      // Check if voter has coordinates (either directly or through polling_station)
      let lat: number | null = null;
      let lng: number | null = null;

      if (voter.latitude && voter.longitude) {
        lat = parseFloat(voter.latitude);
        lng = parseFloat(voter.longitude);
      } else if (
        voter.polling_station?.latitude &&
        voter.polling_station?.longitude
      ) {
        lat = parseFloat(voter.polling_station.latitude);
        lng = parseFloat(voter.polling_station.longitude);
      }

      if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
        heatmapData.push(new google.maps.LatLng(lat, lng));
      }
    });

    if (heatmapData.length === 0) {
      console.log("No valid coordinates found for heatmap");
      return;
    }

    console.log(`Creating heatmap with ${heatmapData.length} points`);

    // Create heatmap layer
    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      map: map,
      radius: 20,
      opacity: 0.6,
      gradient: [
        "rgba(0, 255, 255, 0)",
        "rgba(0, 255, 255, 1)",
        "rgba(0, 191, 255, 1)",
        "rgba(0, 127, 255, 1)",
        "rgba(0, 63, 255, 1)",
        "rgba(0, 0, 255, 1)",
        "rgba(0, 0, 223, 1)",
        "rgba(0, 0, 191, 1)",
        "rgba(0, 0, 159, 1)",
        "rgba(0, 0, 127, 1)",
        "rgba(63, 0, 91, 1)",
        "rgba(127, 0, 63, 1)",
        "rgba(191, 0, 31, 1)",
        "rgba(255, 0, 0, 1)",
      ],
    });

    // Cleanup function
    return () => {
      heatmap.setMap(null);
    };
  }, [map, voterData]);

  return null; // This component doesn't render anything directly
}
