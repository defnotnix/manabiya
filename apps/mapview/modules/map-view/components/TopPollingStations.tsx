"use client";

import { useState } from "react";
import {
  Stack,
  Text,
  Group,
  Badge,
  Center,
  Loader,
  Box,
  UnstyledButton,
  Button,
  Collapse,
  SimpleGrid,
  Paper,
  Divider,
  ActionIcon,
} from "@mantine/core";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  CrownIcon,
  FlagIcon,
  TrophyIcon,
  MedalIcon,
  CaretDownIcon,
  CaretUpIcon,
  ChurchIcon,
  IdentificationCardIcon,
} from "@phosphor-icons/react";

interface TopPollingStationsProps {
  data: any;
  isLoading: boolean;
  onStationClick?: (station: any) => void;
  onViewDetails?: (station: any) => void;
}

const RANK_COLORS: Record<number, { bg: string; border: string; badge: string }> = {
  0: { bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.25)", badge: "yellow" },
  1: { bg: "rgba(192,192,192,0.08)", border: "rgba(192,192,192,0.25)", badge: "gray" },
  2: { bg: "rgba(205,127,50,0.08)", border: "rgba(205,127,50,0.25)", badge: "orange" },
};

function RankIcon({ idx }: { idx: number }) {
  if (idx === 0) return <CrownIcon size={14} weight="fill" color="#facc15" />;
  if (idx === 1) return <TrophyIcon size={14} weight="fill" color="#c0c0c0" />;
  if (idx === 2) return <MedalIcon size={14} weight="fill" color="#cd7f32" />;
  return null;
}

const INITIAL_LIMIT = 5;

export function TopPollingStations({
  data,
  isLoading,
  onStationClick,
  onViewDetails,
}: TopPollingStationsProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedStation, setExpandedStation] = useState<number | null>(null);
  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  const result = data?.results?.[0];

  if (!result) {
    return (
      <Text c="dimmed" size="sm" ta="center" py="md">
        No polling station data available
      </Text>
    );
  }

  const { top_polling_stations = [], highest_ward } = result;

  if (top_polling_stations.length === 0) {
    return (
      <Text c="dimmed" size="sm" ta="center" py="md">
        No polling station data available
      </Text>
    );
  }

  const visibleStations = showAll
    ? top_polling_stations
    : top_polling_stations.slice(0, INITIAL_LIMIT);
  const hasMore = top_polling_stations.length > INITIAL_LIMIT;

  return (
    <Stack gap="xs">
      {/* Highlights */}
      {highest_ward && (
        <Group gap="xs" mb={4}>
          <Badge
            size="sm"
            variant="light"
            color="blue"
            leftSection={<FlagIcon size={12} />}
          >
            Top Ward: {highest_ward.ward_name_ne || `Ward ${highest_ward.ward_no}`} ({highest_ward.total_voters_count?.toLocaleString()})
          </Badge>
        </Group>
      )}

      {/* Station list */}
      <Stack gap={0}>
        {visibleStations.map((station: any, idx: number) => {
          const rankStyle = RANK_COLORS[idx] || {
            bg: "transparent",
            border: "rgba(0,0,0,0.08)",
            badge: "teal",
          };

          const name =
            station.booth_name_ne ||
            station.booth_name_en ||
            `Station #${idx + 1}`;

          const isExpanded = expandedStation === (station.polling_station_id || idx);
          const stationId = station.polling_station_id || idx;

          return (
            <Box key={stationId}>
              <Box
                style={{
                  backgroundColor: rankStyle.bg,
                  borderBottom: `1px solid ${rankStyle.border}`,
                  borderTop: idx === 0 ? `1px solid ${rankStyle.border}` : undefined,
                  padding: "10px 12px",
                  transition: "background 0.15s",
                }}
              >
                <Group justify="space-between" wrap="nowrap" gap="sm">
                  {/* Left: rank + name */}
                  <UnstyledButton
                    onClick={() => onStationClick?.(station)}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <Group gap={8} wrap="nowrap">
                      <Badge
                        size="md"
                        variant="filled"
                        color={rankStyle.badge}
                        circle
                        styles={{ root: { minWidth: 24, height: 24, flexShrink: 0 } }}
                      >
                        {idx + 1}
                      </Badge>
                      <RankIcon idx={idx} />
                      <Box style={{ minWidth: 0 }}>
                        <Text size="sm" fw={600} lineClamp={1} lh={1.4}>
                          {name}
                        </Text>
                        {station.ward_no && (
                          <Text size="xs" c="dimmed" lh={1.3}>
                            Ward {station.ward_no}
                          </Text>
                        )}
                      </Box>
                    </Group>
                  </UnstyledButton>

                  {/* Right: voter stats + expand button */}
                  <Group gap={10} wrap="nowrap" style={{ flexShrink: 0 }}>
                    <Group gap={4} wrap="nowrap">
                      <UsersIcon size={13} color="#228be6" />
                      <Text size="xs" fw={600}>
                        {(station.total_voters_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                    <Group gap={4} wrap="nowrap">
                      <GenderMaleIcon size={13} color="#228be6" />
                      <Text size="xs" c="dimmed">
                        {(station.total_voters_male_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                    <Group gap={4} wrap="nowrap">
                      <GenderFemaleIcon size={13} color="#e64980" />
                      <Text size="xs" c="dimmed">
                        {(station.total_voters_female_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      color="gray"
                      onClick={() => setExpandedStation(isExpanded ? null : stationId)}
                    >
                      {isExpanded ? <CaretUpIcon size={14} /> : <CaretDownIcon size={14} />}
                    </ActionIcon>
                  </Group>
                </Group>
              </Box>

              {/* Expanded Details */}
              <Collapse in={isExpanded}>
                <Paper p="sm" bg="gray.0" style={{ borderBottom: `1px solid ${rankStyle.border}` }}>
                  <SimpleGrid cols={2} spacing="xs">
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">Total Voters</Text>
                      <Group gap={4}>
                        <UsersIcon size={14} color="#228be6" />
                        <Text size="sm" fw={600}>{(station.total_voters_count || 0).toLocaleString()}</Text>
                      </Group>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">Male Voters</Text>
                      <Group gap={4}>
                        <GenderMaleIcon size={14} color="#228be6" />
                        <Text size="sm" fw={600}>{(station.total_voters_male_count || 0).toLocaleString()}</Text>
                      </Group>
                    </Stack>
                    <Stack gap={2}>
                      <Text size="xs" c="dimmed">Female Voters</Text>
                      <Group gap={4}>
                        <GenderFemaleIcon size={14} color="#e64980" />
                        <Text size="sm" fw={600}>{(station.total_voters_female_count || 0).toLocaleString()}</Text>
                      </Group>
                    </Stack>
                    {station.unique_castes_count != null && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">Unique Castes</Text>
                        <Group gap={4}>
                          <IdentificationCardIcon size={14} color="#7c3aed" />
                          <Text size="sm" fw={600}>{station.unique_castes_count}</Text>
                        </Group>
                      </Stack>
                    )}
                    {station.dominant_religion && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">Dominant Religion</Text>
                        <Group gap={4}>
                          <ChurchIcon size={14} color="#f97316" />
                          <Text size="sm" fw={600}>{station.dominant_religion}</Text>
                        </Group>
                      </Stack>
                    )}
                    {station.married_ratio != null && (
                      <Stack gap={2}>
                        <Text size="xs" c="dimmed">Married Ratio</Text>
                        <Text size="sm" fw={600}>{(station.married_ratio * 100).toFixed(1)}%</Text>
                      </Stack>
                    )}
                  </SimpleGrid>
                  <Divider my="xs" />
                  <Button
                    variant="light"
                    size="xs"
                    fullWidth
                    onClick={() => onViewDetails?.(station)}
                  >
                    View Full Report
                  </Button>
                </Paper>
              </Collapse>
            </Box>
          );
        })}
      </Stack>

      {hasMore && (
        <Button
          variant="subtle"
          color="gray"
          size="xs"
          onClick={() => setShowAll((v) => !v)}
          fullWidth
          mt={2}
        >
          {showAll
            ? "Show less"
            : `Show all ${top_polling_stations.length} stations`}
        </Button>
      )}
    </Stack>
  );
}
