import { ActionIcon, Box, Group, Paper, Text } from "@mantine/core";
import { Check, X } from "@phosphor-icons/react";
import { OverlayViewF, OverlayView } from "@react-google-maps/api";

interface ProblemMarkerDialogProps {
  position: { lat: number; lng: number };
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProblemMarkerDialog({
  position,
  onConfirm,
  onCancel,
}: ProblemMarkerDialogProps) {
  return (
    <OverlayViewF
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <Box
        style={{
          transform: "translate(-50%, -100%)",
          marginTop: -10,
        }}
      >
        <Paper
          shadow="lg"
          radius="md"
          p="sm"
          withBorder
          style={{
            backgroundColor: "#fff",
            minWidth: 180,
            position: "relative",
          }}
        >
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600}>
              Create a new marker?
            </Text>
            <Group gap={4}>
              <ActionIcon
                size="sm"
                variant="filled"
                color="green"
                onClick={onConfirm}
              >
                <Check size={16} weight="bold" />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="filled"
                color="red"
                onClick={onCancel}
              >
                <X size={16} weight="bold" />
              </ActionIcon>
            </Group>
          </Group>
        </Paper>
        {/* Pointer arrow */}
        <Box
          style={{
            position: "absolute",
            bottom: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderTop: "8px solid #fff",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
          }}
        />
      </Box>
      {/* Location Dot */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          backgroundColor: "#fff",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          border: "2px solid rgba(0,0,0,0.2)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
      />
    </OverlayViewF>
  );
}
