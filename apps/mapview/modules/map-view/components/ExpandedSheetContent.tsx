"use client";

import { useState } from "react";
import {
  Box,
  Text,
  Center,
  Loader,
  Divider,
  Paper,
  Badge,
  Group,
  UnstyledButton,
  Stack,
  Button,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { BuildingsIcon, UsersIcon, ShieldWarningIcon, UserPlusIcon } from "@phosphor-icons/react";
import { ActionIcon } from "@mantine/core";
import { TopPollingStations } from "./TopPollingStations";
import { DistrictTopPollingStations } from "./DistrictTopPollingStations";
import type { ReportLevel, GeoUnit, PollingStation } from "../types";
import { formatDisplayName } from "../types";

const BOOTH_INITIAL_LIMIT = 5;

interface ExpandedSheetContentProps {
  reportLevel: ReportLevel | null;
  reportData: any;
  loadingReport: boolean;
  reportError: any;

  selectedMunicipality: string | null;
  selectedWard: string | null;
  selectedBooth: string | null;

  municipalities: GeoUnit[] | undefined;

  wards: GeoUnit[] | undefined;
  loadingWards: boolean;

  booths: PollingStation[] | undefined;
  loadingBooths: boolean;

  districtTopStationsData: any;
  loadingDistrictTopStations: boolean;

  municipalityTopStationsData: any;
  loadingMunicipalityTopStations: boolean;

  onSelectMunicipality: (id: string) => void;
  onSelectWard: (id: string) => void;
  onSelectBooth: (id: string, booth: PollingStation) => void;
  onBack: () => void;

  onDistrictStationClick: (station: any) => void;
  onMunicipalityStationClick: (station: any) => void;
  onManageCandidates?: (station: PollingStation) => void;
}

export function ExpandedSheetContent({
  reportLevel,
  reportData,
  loadingReport,
  reportError,
  selectedMunicipality,
  selectedWard,
  selectedBooth,
  municipalities,
  wards,
  loadingWards,
  booths,
  loadingBooths,
  districtTopStationsData,
  loadingDistrictTopStations,
  municipalityTopStationsData,
  loadingMunicipalityTopStations,
  onSelectMunicipality,
  onSelectWard,
  onSelectBooth,
  onBack,
  onDistrictStationClick,
  onMunicipalityStationClick,
  onManageCandidates,
}: ExpandedSheetContentProps) {
  const [showAllBooths, setShowAllBooths] = useState(false);

  const visibleBooths = showAllBooths
    ? booths || []
    : (booths || []).slice(0, BOOTH_INITIAL_LIMIT);
  const hasMoreBooths = (booths?.length ?? 0) > BOOTH_INITIAL_LIMIT;

  return (
    <Box
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "100%",
        overflow: "hidden",
        color: "#000",
      }}
    >
      {loadingReport && (
        <Center py="xl">
          <Loader size="md" />
        </Center>
      )}
      {reportError && (
        <Center py="xl">
          <Text size="sm" c="red">
            {(reportError as Error).message || "Failed to load report"}
          </Text>
        </Center>
      )}
      {!loadingReport && !reportError && reportData && (
        <>
          {/* ── District level: Top Stations ── */}
          {reportLevel === "district" && (
            <>
              <Text fw={700} size="md" mb="xs">
                Recommended / Important Stations
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                Top polling stations by voter count
              </Text>
              <DistrictTopPollingStations
                data={districtTopStationsData}
                wards={(wards as any) || []}
                isLoading={loadingDistrictTopStations}
                onStationClick={onDistrictStationClick}
                onViewDetails={onDistrictStationClick}
              />
              <Divider my="lg" />
            </>
          )}

          {/* ── Municipality level: Top Stations + Ward selector ── */}
          {reportLevel === "municipality" && (
            <>
              <Text fw={700} size="md" mb="xs">
                Recommended / Important Stations
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                Top polling stations by voter count
              </Text>
              <TopPollingStations
                data={municipalityTopStationsData}
                isLoading={loadingMunicipalityTopStations}
                onStationClick={onMunicipalityStationClick}
                onViewDetails={onMunicipalityStationClick}
              />
              <Divider my="lg" />

              <Text fw={700} size="md" mb="xs">
                Wards
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                Select a ward to view its report
              </Text>
              {loadingWards ? (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              ) : wards && wards.length > 0 ? (
                <Carousel
                  slideSize="auto"
                  slideGap="xs"
                  withControls={false}
                  styles={{ viewport: { overflow: "visible" } }}
                >
                  {wards.map((ward) => (
                    <Carousel.Slide key={ward.id} style={{ width: "auto" }}>
                      <UnstyledButton onClick={() => onSelectWard(String(ward.id))}>
                        <Badge
                          size="xl"
                          variant="light"
                          color="blue"
                          style={{ cursor: "pointer" }}
                        >
                          {ward.ward_no
                            ? `Ward ${ward.ward_no}`
                            : ward.display_name || `Ward ${ward.id}`}
                        </Badge>
                      </UnstyledButton>
                    </Carousel.Slide>
                  ))}
                </Carousel>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No wards available
                </Text>
              )}
              <Divider my="lg" />
            </>
          )}

          {/* ── Ward level: Booth list ── */}
          {reportLevel === "ward" && (
            <>
              <Text fw={700} size="md" mb="xs">
                Polling Stations
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                Select a booth to view its report
              </Text>
              {loadingBooths ? (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              ) : booths && booths.length > 0 ? (
                <Stack gap="xs">
                  <Stack gap={0}>
                    {visibleBooths.map((booth, idx) => {
                      const name =
                        booth.place_name_ne && booth.place_name_en
                          ? `${booth.place_name_ne} (${booth.place_name_en})`
                          : booth.place_name_ne ||
                          booth.place_name_en ||
                          `Booth ${booth.id}`;

                      // Get security priority from reports
                      const latestReport = booth.reports?.[0];
                      const priority = latestReport?.priority;
                      const priorityColor = priority === "RED" ? "red" : priority === "YELLOW" ? "yellow" : priority === "GREEN" ? "green" : undefined;
                      const isSelected = selectedBooth === String(booth.id);

                      return (
                        <UnstyledButton
                          key={booth.id}
                          onClick={() => onSelectBooth(String(booth.id), booth)}
                          style={{ width: "100%" }}
                        >
                          <Box
                            style={{
                              borderBottom: "1px solid rgba(0,0,0,0.08)",
                              borderTop: idx === 0 ? "1px solid rgba(0,0,0,0.08)" : undefined,
                              padding: "10px 12px",
                              cursor: "pointer",
                              transition: "background 0.15s",
                              backgroundColor: isSelected
                                ? "rgba(124, 58, 237, 0.1)"
                                : priority === "RED"
                                  ? "rgba(220, 38, 38, 0.05)"
                                  : priority === "YELLOW"
                                    ? "rgba(234, 179, 8, 0.05)"
                                    : undefined,
                              borderLeft: isSelected ? "3px solid #7c3aed" : "3px solid transparent",
                            }}
                          >
                            <Group justify="space-between" wrap="nowrap" gap="sm">
                              <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                                <Badge
                                  size="md"
                                  variant="filled"
                                  color={priorityColor || "violet"}
                                  circle
                                  styles={{ root: { minWidth: 24, height: 24, flexShrink: 0 } }}
                                >
                                  {idx + 1}
                                </Badge>
                                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                  <Text
                                    size="sm"
                                    fw={600}
                                    lineClamp={1}
                                    lh={1.4}
                                  >
                                    {name}
                                  </Text>
                                  {priority && (
                                    <Group gap={4}>
                                      <ShieldWarningIcon size={12} color={priorityColor === "red" ? "#dc2626" : priorityColor === "yellow" ? "#eab308" : "#16a34a"} weight="fill" />
                                      <Text size="xs" c={priorityColor} fw={500}>
                                        {priority} Priority
                                      </Text>
                                    </Group>
                                  )}
                                </Stack>
                              </Group>

                              <Group gap={8} wrap="nowrap" style={{ flexShrink: 0 }}>
                                {booth.voter_population != null && (
                                  <Group gap={4} wrap="nowrap">
                                    <UsersIcon size={13} color="#228be6" />
                                    <Text size="xs" fw={600}>
                                      {booth.voter_population.toLocaleString()}
                                    </Text>
                                  </Group>
                                )}
                                {latestReport && onManageCandidates && (
                                  <ActionIcon
                                    size="sm"
                                    variant="light"
                                    color="violet"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onManageCandidates(booth);
                                    }}
                                    title="Manage Candidates"
                                  >
                                    <UserPlusIcon size={14} />
                                  </ActionIcon>
                                )}
                              </Group>
                            </Group>
                          </Box>
                        </UnstyledButton>
                      );
                    })}
                  </Stack>

                  {hasMoreBooths && (
                    <Button
                      variant="subtle"
                      color="gray"
                      size="xs"
                      fullWidth
                      mt={2}
                      onClick={() => setShowAllBooths((v) => !v)}
                    >
                      {showAllBooths
                        ? "Show less"
                        : `Show all ${booths.length} stations`}
                    </Button>
                  )}
                </Stack>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No polling stations available
                </Text>
              )}
              <Divider my="lg" />
            </>
          )}
        </>
      )}
    </Box>
  );
}
