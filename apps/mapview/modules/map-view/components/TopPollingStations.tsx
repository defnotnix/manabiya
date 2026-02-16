"use client";

import {
  Stack,
  Text,
  Paper,
  Group,
  Badge,
  Center,
  Loader,
  Box,
  UnstyledButton,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import {
  UsersIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  CrownIcon,
  FlagIcon,
  TrophyIcon,
  MedalIcon,
} from "@phosphor-icons/react";

interface TopPollingStationsProps {
  data: any;
  isLoading: boolean;
  onStationClick?: (station: any) => void;
}

const RANK_COLORS: Record<number, { bg: string; border: string; badge: string; icon: string }> = {
  0: { bg: "rgba(250,204,21,0.12)", border: "rgba(250,204,21,0.3)", badge: "yellow", icon: "#facc15" },
  1: { bg: "rgba(192,192,192,0.12)", border: "rgba(192,192,192,0.3)", badge: "gray", icon: "#c0c0c0" },
  2: { bg: "rgba(205,127,50,0.12)", border: "rgba(205,127,50,0.3)", badge: "orange", icon: "#cd7f32" },
};

function RankIcon({ idx }: { idx: number }) {
  if (idx === 0) return <CrownIcon size={16} weight="fill" color="#facc15" />;
  if (idx === 1) return <TrophyIcon size={16} weight="fill" color="#c0c0c0" />;
  if (idx === 2) return <MedalIcon size={16} weight="fill" color="#cd7f32" />;
  return null;
}

export function TopPollingStations({
  data,
  isLoading,
  onStationClick,
}: TopPollingStationsProps) {
  if (isLoading) {
    return (
      <Center py="md">
        <Loader size="sm" />
      </Center>
    );
  }

  // API format: { results: [{ top_polling_stations: [...], highest_booth, highest_ward, ... }] }
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

  return (
    <Stack gap="sm">
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

      {/* Station carousel */}
      <Carousel
        slideSize="70%"
        slideGap="sm"
        withControls={false}
        styles={{
          viewport: { overflow: "visible" },
        }}
      >
        {top_polling_stations.map((station: any, idx: number) => {
          const rankStyle = RANK_COLORS[idx] || {
            bg: "rgba(255,255,255,0.04)",
            border: "rgba(255,255,255,0.08)",
            badge: "teal",
            icon: "#2dd4bf",
          };

          return (
            <Carousel.Slide key={station.polling_station_id || idx}>
              <UnstyledButton
                onClick={() => onStationClick?.(station)}
                style={{ width: "100%" }}
              >
                <Paper
                  p="sm"
                  radius="md"
                  style={{
                    backgroundColor: rankStyle.bg,
                    border: `1px solid ${rankStyle.border}`,
                    height: 140,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  {/* Rank + name */}
                  <Box>
                    <Group gap={6} mb={6} wrap="nowrap">
                      <Badge
                        size="lg"
                        variant="filled"
                        color={rankStyle.badge}
                        circle
                        styles={{ root: { minWidth: 28, height: 28 } }}
                      >
                        {idx + 1}
                      </Badge>
                      <RankIcon idx={idx} />
                      <Text size="sm" fw={600} lineClamp={2} lh={1.3} style={{ flex: 1 }}>
                        {station.booth_name_ne ||
                          station.booth_name_en ||
                          `Station #${idx + 1}`}
                      </Text>
                    </Group>
                    {station.ward_no && (
                      <Text size="xs" c="dimmed">
                        Ward {station.ward_no}
                      </Text>
                    )}
                  </Box>

                  {/* Voter stats */}
                  <Group gap="md" mt={6}>
                    <Group gap={4}>
                      <UsersIcon size={14} color="#228be6" />
                      <Text size="xs" fw={600}>
                        {(station.total_voters_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                    <Group gap={4}>
                      <GenderMaleIcon size={14} color="#228be6" />
                      <Text size="xs" c="dimmed">
                        {(station.total_voters_male_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                    <Group gap={4}>
                      <GenderFemaleIcon size={14} color="#e64980" />
                      <Text size="xs" c="dimmed">
                        {(station.total_voters_female_count || 0).toLocaleString()}
                      </Text>
                    </Group>
                  </Group>
                </Paper>
              </UnstyledButton>
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Stack>
  );
}
