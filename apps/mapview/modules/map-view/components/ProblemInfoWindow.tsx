"use client";

import { ActionIcon, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { XIcon } from "@phosphor-icons/react";
import { OverlayViewF, OverlayView } from "@react-google-maps/api";

interface ProblemInfoWindowProps {
  problem: any;
  onClose: () => void;
}

export function ProblemInfoWindow({
  problem,
  onClose,
}: ProblemInfoWindowProps) {
  return (
    <OverlayViewF
      position={{
        lat: problem.latitude,
        lng: problem.longitude,
      }}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <Paper
        radius="md"
        shadow="sm"
        style={{
          transform: "translate(-50%, -100%)",
          marginTop: -20,
        }}
      >
        <Group
          p="sm"
          bg="red.1"
          justify="space-between"
          align="center"
          mb={4}
        >
          <Text size="xs" fw={700}>
            Problem Pointer
          </Text>
          <ActionIcon
            size="xs"
            variant="subtle"
            color="gray"
            onClick={onClose}
          >
            <XIcon size={14} />
          </ActionIcon>
        </Group>
        <Box
          p="sm"
          style={{
            minWidth: 220,
            maxWidth: 320,
            backgroundColor: "#fff",
          }}
        >
          <Stack gap={6}>
            <Text size="xs" fw={600}>
              {problem.name}
            </Text>
            {problem.name_en && (
              <Text size="xs" c="dimmed">
                {problem.name_en}
              </Text>
            )}
            {problem.issues && problem.issues.length > 0 && (
              <>
                <Text size="xs" fw={500} mt={4}>
                  Issues:
                </Text>
                {problem.issues.map((issue: any, idx: number) => (
                  <Text key={idx} size="xs" c="dimmed">
                    • {issue.ne} {issue.en && `(${issue.en})`}
                  </Text>
                ))}
              </>
            )}
            {problem.booth && problem.booth.length > 0 && (
              <>
                <Text size="xs" fw={500} mt={4}>
                  Booth:
                </Text>
                {problem.booth.map((b: any, idx: number) => (
                  <Text key={idx} size="xs" c="dimmed">
                    • {b.ne} {b.en && `(${b.en})`}
                  </Text>
                ))}
              </>
            )}
            {problem.population && (
              <Text size="xs" c="dimmed">
                Population: {problem.population}
              </Text>
            )}
            {problem.houses && (
              <Text size="xs" c="dimmed">
                Houses: {problem.houses}
              </Text>
            )}
            {problem.voters && (
              <Text size="xs" c="dimmed">
                Voters: {problem.voters}
              </Text>
            )}
            {problem.people_present && (
              <Text size="xs" c="dimmed">
                People Present: {problem.people_present}
              </Text>
            )}
            {problem.previous_records && (
              <>
                <Text size="xs" fw={500} mt={4}>
                  Previous Records:
                </Text>
                <Text size="xs" c="dimmed">
                  {problem.previous_records}
                </Text>
                {problem.previous_records_en && (
                  <Text size="xs" c="dimmed">
                    {problem.previous_records_en}
                  </Text>
                )}
              </>
            )}
            {problem.notes && (
              <>
                <Text size="xs" fw={500} mt={4}>
                  Notes:
                </Text>
                <Text size="xs" c="dimmed">
                  {problem.notes}
                </Text>
              </>
            )}
          </Stack>
        </Box>
      </Paper>
    </OverlayViewF>
  );
}
