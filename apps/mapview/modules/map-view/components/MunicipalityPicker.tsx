"use client";

import {
  Box,
  Center,
  Group,
  Paper,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { BuildingsIcon } from "@phosphor-icons/react";
import { GeoUnit, formatDisplayName } from "../types";

interface MunicipalityPickerProps {
  municipalities: GeoUnit[];
  onSelect: (id: string) => void;
}

export function MunicipalityPicker({
  municipalities,
  onSelect,
}: MunicipalityPickerProps) {
  return (
    <Box
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Paper
        radius="20px 20px 0 0"
        style={{
          backgroundColor: "#2a2a2a",
          color: "#fff",
          paddingTop: 12,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Center mb="sm">
          <Box
            style={{
              width: 40,
              height: 5,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.25)",
            }}
          />
        </Center>

        <Group gap={8} mb="md">
          <BuildingsIcon size={20} color="#86efac" weight="duotone" />
          <Text fw={700} size="md" c="white">
            Select Municipality
          </Text>
        </Group>

        <Carousel
          slideSize="45%"
          slideGap="sm"
          withControls={false}
          styles={{ viewport: { overflow: "visible" } }}
        >
          {municipalities.map((muni) => (
            <Carousel.Slide key={muni.id}>
              <UnstyledButton
                onClick={() => onSelect(String(muni.id))}
                style={{ width: "100%" }}
              >
                <Paper
                  p="sm"
                  radius="md"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    height: 72,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <BuildingsIcon
                    size={20}
                    color="#86efac"
                    weight="duotone"
                    style={{ marginBottom: 4 }}
                  />
                  <Text
                    size="xs"
                    c="white"
                    fw={500}
                    lineClamp={2}
                    lh={1.3}
                  >
                    {formatDisplayName(muni)}
                  </Text>
                </Paper>
              </UnstyledButton>
            </Carousel.Slide>
          ))}
        </Carousel>
      </Paper>
    </Box>
  );
}
