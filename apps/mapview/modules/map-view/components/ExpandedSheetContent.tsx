"use client";

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
  ActionIcon,
  Stack,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { BuildingsIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { TopPollingStations } from "./TopPollingStations";
import { DistrictTopPollingStations } from "./DistrictTopPollingStations";
import { WardMap } from "./WardMap";

type ReportLevel = "dashboard" | "district" | "municipality" | "ward" | "booth";

interface GeoUnit {
  id: number;
  unit_type: string;
  display_name: string;
  display_name_ne?: string;
  display_name_en?: string;
  ward_no?: number | null;
}

interface PollingStation {
  id: number;
  place_name: string;
  place_name_en?: string;
}

function formatDisplayName(unit: GeoUnit): string {
  const nepali = unit.display_name || unit.display_name_ne;
  const english = unit.display_name_en;
  if (nepali && english) return `${nepali} (${english})`;
  return nepali || english || `${unit.id}`;
}

interface ExpandedSheetContentProps {
  reportLevel: ReportLevel | null;
  reportData: any;
  loadingReport: boolean;
  reportError: any;

  // Selected municipality/ward IDs (for ward map SVG)
  selectedMunicipality: string | null;
  selectedWard: string | null;

  // Municipalities
  municipalities: GeoUnit[] | undefined;

  // Wards
  wards: GeoUnit[] | undefined;
  loadingWards: boolean;

  // Booths
  booths: PollingStation[] | undefined;
  loadingBooths: boolean;

  // Top polling stations (district level)
  districtTopStationsData: any;
  loadingDistrictTopStations: boolean;

  // Top polling stations (municipality level)
  municipalityTopStationsData: any;
  loadingMunicipalityTopStations: boolean;

  // Political affiliations
  wardPoliticalAffiliationsData: any;
  loadingPoliticalAffiliations: boolean;

  // Selection callbacks
  onSelectMunicipality: (id: string) => void;
  onSelectWard: (id: string) => void;
  onSelectBooth: (id: string) => void;
  onBack: () => void;

  // For station click (navigate to booth directly)
  onDistrictStationClick: (station: any) => void;
  onMunicipalityStationClick: (station: any) => void;
}

export function ExpandedSheetContent({
  reportLevel,
  reportData,
  loadingReport,
  reportError,
  selectedMunicipality,
  selectedWard,
  municipalities,
  wards,
  loadingWards,
  booths,
  loadingBooths,
  districtTopStationsData,
  loadingDistrictTopStations,
  municipalityTopStationsData,
  loadingMunicipalityTopStations,
  wardPoliticalAffiliationsData,
  loadingPoliticalAffiliations,
  onSelectMunicipality,
  onSelectWard,
  onSelectBooth,
  onBack,
  onDistrictStationClick,
  onMunicipalityStationClick,
}: ExpandedSheetContentProps) {
  return (
    <Box
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        width: "`100%",
        overflow: "hidden",
        color: "#000",
      }}
    >
      {/* Back button — visible when deeper than dashboard */}
      {reportLevel && reportLevel !== "dashboard" && (
        <Group gap="xs" mb="md">
          <ActionIcon
            variant="light"
            color="gray"
            radius="xl"
            size={32}
            onClick={onBack}
          >
            <ArrowLeftIcon size={16} />
          </ActionIcon>
        </Group>
      )}

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
          {/* ── Dashboard level: Municipality selector ── */}
          {(reportLevel === "dashboard" || reportLevel === "district") &&
            municipalities &&
            municipalities.length > 0 && (
              <>
                <Text fw={700} size="md" mb="xs">
                  Select Municipality
                </Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Tap a municipality to view its report
                </Text>
                <Carousel
                  slideSize="45%"
                  slideGap="sm"
                  withControls={false}
                  styles={{ viewport: { overflow: "visible" } }}
                >
                  {municipalities.map((muni) => (
                    <Carousel.Slide key={muni.id}>
                      <UnstyledButton
                        onClick={() => onSelectMunicipality(String(muni.id))}
                        style={{ width: "100%" }}
                      >
                        <Paper
                          p="sm"
                          radius="md"
                          withBorder
                          style={{
                            height: 80,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            cursor: "pointer",
                          }}
                        >
                          <BuildingsIcon
                            size={22}
                            color="#2f9e44"
                            weight="duotone"
                            style={{ marginBottom: 6 }}
                          />
                          <Text size="xs" fw={500} lineClamp={2} lh={1.3}>
                            {formatDisplayName(muni)}
                          </Text>
                        </Paper>
                      </UnstyledButton>
                    </Carousel.Slide>
                  ))}
                </Carousel>
                <Divider my="lg" />
              </>
            )}

          {/* ── Dashboard level: District Top Stations ── */}
          {(reportLevel === "dashboard" || reportLevel === "district") &&
            wards &&
            wards.length > 0 && (
              <>
                <Text fw={700} size="md" mb="xs">
                  Recommended / Important Stations
                </Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Top polling stations by voter count
                </Text>
                <DistrictTopPollingStations
                  data={districtTopStationsData}
                  wards={wards as any}
                  isLoading={loadingDistrictTopStations}
                  onStationClick={onDistrictStationClick}
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
              />
              <Divider my="lg" />

              {/* Ward map SVG */}
              {selectedMunicipality && wards && wards.length > 0 && (
                <>
                  <Text fw={700} size="md" mb="xs">
                    Ward Map
                  </Text>
                  <Text size="xs" c="dimmed" mb="sm">
                    Tap a ward to view its report
                  </Text>
                  <WardMap
                    municipalityId={Number(selectedMunicipality)}
                    wards={wards}
                    onSelectWard={onSelectWard}
                  />
                  <Divider my="lg" />
                </>
              )}

              {/* Ward carousel */}
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
                      <UnstyledButton
                        onClick={() => onSelectWard(String(ward.id))}
                      >
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

          {/* ── Ward/Booth level: Ward map with selection ── */}
          {(reportLevel === "ward" || reportLevel === "booth") &&
            selectedMunicipality &&
            wards &&
            wards.length > 0 && (
              <>
                <Text fw={700} size="md" mb="xs">
                  Ward Map
                </Text>
                <WardMap
                  municipalityId={Number(selectedMunicipality)}
                  wards={wards}
                  selectedWardNo={
                    selectedWard
                      ? wards.find((w) => String(w.id) === selectedWard)
                          ?.ward_no ?? null
                      : null
                  }
                  onSelectWard={onSelectWard}
                />
                <Divider my="lg" />
              </>
            )}

          {/* ── Ward level: Booth selector ── */}
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
                <Carousel
                  slideSize="70%"
                  slideGap="sm"
                  withControls={false}
                  styles={{ viewport: { overflow: "visible" } }}
                >
                  {booths.map((booth, idx) => {
                    const name =
                      booth.place_name && booth.place_name_en
                        ? `${booth.place_name} (${booth.place_name_en})`
                        : booth.place_name ||
                          booth.place_name_en ||
                          `Booth ${booth.id}`;
                    return (
                      <Carousel.Slide key={booth.id}>
                        <UnstyledButton
                          onClick={() => onSelectBooth(String(booth.id))}
                          style={{ width: "100%" }}
                        >
                          <Paper
                            p="sm"
                            radius="md"
                            withBorder
                            style={{
                              cursor: "pointer",
                              height: 60,
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <Badge
                              size="lg"
                              variant="filled"
                              color="violet"
                              circle
                              styles={{
                                root: { minWidth: 28, height: 28 },
                              }}
                            >
                              {idx + 1}
                            </Badge>
                            <Text size="sm" fw={500} lineClamp={2} lh={1.3}>
                              {name}
                            </Text>
                          </Paper>
                        </UnstyledButton>
                      </Carousel.Slide>
                    );
                  })}
                </Carousel>
              ) : (
                <Text size="sm" c="dimmed" ta="center" py="md">
                  No polling stations available
                </Text>
              )}
              <Divider my="lg" />
            </>
          )}

          {/* ── Municipality/Ward level: Political Affiliations ── */}
          {(reportLevel === "municipality" || reportLevel === "ward") && (
            <>
              <Text fw={700} size="md" mb="xs">
                Past Political Affiliations
              </Text>
              <Text size="xs" c="dimmed" mb="sm">
                {reportLevel === "ward"
                  ? "Historical party affiliations for this ward"
                  : "Historical party affiliations by ward"}
              </Text>
              {loadingPoliticalAffiliations ? (
                <Center py="md">
                  <Loader size="sm" />
                </Center>
              ) : (() => {
                  const items = wardPoliticalAffiliationsData?.results
                    ? wardPoliticalAffiliationsData.results
                    : wardPoliticalAffiliationsData?.top_party_1_name
                      ? [wardPoliticalAffiliationsData]
                      : [];
                  return items.length > 0 ? (
                    <Carousel
                      slideSize="75%"
                      slideGap="sm"
                      withControls={false}
                      styles={{ viewport: { overflow: "visible" } }}
                    >
                      {items.map((d: any) => (
                        <Carousel.Slide key={d.id}>
                          <Paper p="sm" radius="md" withBorder>
                            <Group gap="xs" mb={6}>
                              <Text size="sm" fw={600}>
                                {d.ward_name_ne || `वडा नं ${d.ward_no}`}
                              </Text>
                              <Badge size="xs" variant="outline" color="gray">
                                {d.election_label}
                              </Badge>
                            </Group>
                            <Stack gap={6}>
                              {d.top_party_1_name && (
                                <Group gap="xs" justify="space-between">
                                  <Badge size="md" variant="light" color="blue">
                                    {d.top_party_1_name}
                                  </Badge>
                                  <Text size="sm" fw={600}>
                                    {d.top_party_1_votes?.toLocaleString()}
                                  </Text>
                                </Group>
                              )}
                              {d.top_party_2_name && (
                                <Group gap="xs" justify="space-between">
                                  <Badge size="md" variant="light" color="red">
                                    {d.top_party_2_name}
                                  </Badge>
                                  <Text size="sm" fw={600}>
                                    {d.top_party_2_votes?.toLocaleString()}
                                  </Text>
                                </Group>
                              )}
                              {d.top_party_3_name && (
                                <Group gap="xs" justify="space-between">
                                  <Badge size="md" variant="light" color="orange">
                                    {d.top_party_3_name}
                                  </Badge>
                                  <Text size="sm" fw={600}>
                                    {d.top_party_3_votes?.toLocaleString()}
                                  </Text>
                                </Group>
                              )}
                            </Stack>
                            {d.notes && (
                              <Text size="xs" c="dimmed" mt="xs">
                                {d.notes}
                              </Text>
                            )}
                          </Paper>
                        </Carousel.Slide>
                      ))}
                    </Carousel>
                  ) : (
                    <Text c="dimmed" size="sm" ta="center" py="md">
                      No political affiliation data available
                    </Text>
                  );
                })()}
              <Divider my="lg" />
            </>
          )}
        </>
      )}
    </Box>
  );
}
