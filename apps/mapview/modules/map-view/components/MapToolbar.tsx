"use client";

import { ActionIcon, Group } from "@mantine/core";
import {
  FunnelIcon,
  SparkleIcon,
  TagIcon,
  MountainsIcon,
  MapPinIcon,
  PathIcon,
} from "@phosphor-icons/react";

interface MapToolbarProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  showDrawerButton: boolean;
  routeMode: boolean;
  onToggleRoute: () => void;
  showProblems: boolean;
  onToggleProblems: () => void;
  mapType: "roadmap" | "satellite";
  onToggleMapType: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
}

export function MapToolbar({
  showFilters,
  onToggleFilters,
  drawerOpen,
  onToggleDrawer,
  showDrawerButton,
  routeMode,
  onToggleRoute,
  showProblems,
  onToggleProblems,
  mapType,
  onToggleMapType,
  showLabels,
  onToggleLabels,
}: MapToolbarProps) {
  return (
    <Group
      gap={10}
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <ActionIcon
        variant="white"
        radius="xl"
        size={40}
        onClick={onToggleFilters}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          backgroundColor: showFilters ? "#4c6ef5" : "#fff",
        }}
      >
        <FunnelIcon
          size={20}
          color={showFilters ? "#fff" : "#333"}
          weight={showFilters ? "fill" : "regular"}
        />
      </ActionIcon>

      {showDrawerButton && (
        <ActionIcon
          variant="white"
          radius="xl"
          size={40}
          onClick={onToggleDrawer}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            backgroundColor: drawerOpen ? "#7c3aed" : "#fff",
          }}
        >
          <SparkleIcon
            size={20}
            color={drawerOpen ? "#fff" : "#333"}
            weight={drawerOpen ? "fill" : "regular"}
          />
        </ActionIcon>
      )}

      <ActionIcon
        variant="white"
        radius="xl"
        size={40}
        onClick={onToggleRoute}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          backgroundColor: routeMode ? "#1098ad" : "#fff",
        }}
      >
        <PathIcon
          size={20}
          color={routeMode ? "#fff" : "#333"}
          weight={routeMode ? "fill" : "regular"}
        />
      </ActionIcon>

      <ActionIcon
        variant="white"
        radius="xl"
        size={40}
        onClick={onToggleProblems}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          backgroundColor: showProblems ? "#e03131" : "#fff",
        }}
      >
        <MapPinIcon
          size={20}
          color={showProblems ? "#fff" : "#333"}
          weight={showProblems ? "fill" : "regular"}
        />
      </ActionIcon>

      <ActionIcon
        variant="white"
        radius="xl"
        size={40}
        onClick={onToggleMapType}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          backgroundColor: mapType === "satellite" ? "#2f9e44" : "#fff",
        }}
      >
        <MountainsIcon
          size={20}
          color={mapType === "satellite" ? "#fff" : "#333"}
          weight={mapType === "satellite" ? "fill" : "regular"}
        />
      </ActionIcon>

      <ActionIcon
        variant="white"
        radius="xl"
        size={40}
        onClick={onToggleLabels}
        style={{
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          backgroundColor: !showLabels ? "#e8590c" : "#fff",
        }}
      >
        <TagIcon
          size={20}
          color={!showLabels ? "#fff" : "#333"}
          weight={!showLabels ? "fill" : "regular"}
        />
      </ActionIcon>
    </Group>
  );
}
