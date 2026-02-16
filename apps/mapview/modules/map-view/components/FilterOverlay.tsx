"use client";

import {
  Box,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

interface FilterOverlayProps {
  search: string;
  onSearch: (value: string) => void;
  predictions: google.maps.places.AutocompletePrediction[];
  onSelectPlace: (placeId: string) => void;
  municipalityOptions: { value: string; label: string }[];
  selectedMunicipality: string | null;
  onMunicipalityChange: (value: string | null) => void;
  loadingMunicipalities: boolean;
  selectedDistrict: number | null;
  wardOptions: { value: string; label: string }[];
  selectedWard: string | null;
  onWardChange: (value: string | null) => void;
  loadingWards: boolean;
  boothOptions: { value: string; label: string }[];
  selectedBooth: string | null;
  onBoothChange: (value: string | null) => void;
  loadingBooths: boolean;
}

export function FilterOverlay({
  search,
  onSearch,
  predictions,
  onSelectPlace,
  municipalityOptions,
  selectedMunicipality,
  onMunicipalityChange,
  loadingMunicipalities,
  selectedDistrict,
  wardOptions,
  selectedWard,
  onWardChange,
  loadingWards,
  boothOptions,
  selectedBooth,
  onBoothChange,
  loadingBooths,
}: FilterOverlayProps) {
  return (
    <Paper
      pos="absolute"
      top={68}
      right={16}
      left={16}
      radius="md"
      p="sm"
      shadow="lg"
      withBorder
      style={{ zIndex: 1000, overflow: "visible" }}
    >
      <Stack gap={8} style={{ overflow: "visible" }}>
        {/* Places search */}
        <Box pos="relative">
          <TextInput
            size="xs"
            placeholder="Search places..."
            value={search}
            onChange={(e) => onSearch(e.currentTarget.value)}
            leftSection={<MagnifyingGlassIcon size={14} />}
            rightSection={
              <img
                src="https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg"
                alt="Google"
                style={{ height: 12, opacity: 0.6 }}
              />
            }
          />
          {predictions.length > 0 && (
            <Paper
              pos="absolute"
              top="100%"
              left={0}
              right={0}
              mt={4}
              shadow="md"
              radius="sm"
              withBorder
              style={{ zIndex: 1001, overflow: "hidden" }}
            >
              {predictions.map((p) => (
                <Box
                  key={p.place_id}
                  px="sm"
                  py={6}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelectPlace(p.place_id)}
                >
                  <Text size="xs" truncate>
                    {p.structured_formatting.main_text}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    {p.structured_formatting.secondary_text}
                  </Text>
                </Box>
              ))}
            </Paper>
          )}
        </Box>

        {/* Location selects */}
        <Select
          size="xs"
          placeholder="Municipality"
          data={municipalityOptions}
          value={selectedMunicipality}
          onChange={onMunicipalityChange}
          searchable
          clearable
          disabled={!selectedDistrict || loadingMunicipalities}
          rightSection={
            loadingMunicipalities ? <Loader size={10} /> : undefined
          }
          comboboxProps={{ zIndex: 1002 }}
        />
        <Select
          size="xs"
          placeholder="Ward"
          data={wardOptions}
          value={selectedWard}
          onChange={onWardChange}
          searchable
          clearable
          disabled={!selectedMunicipality || loadingWards}
          rightSection={loadingWards ? <Loader size={10} /> : undefined}
          comboboxProps={{ zIndex: 1002 }}
        />
        <Select
          size="xs"
          placeholder="Booth"
          data={boothOptions}
          value={selectedBooth}
          onChange={onBoothChange}
          searchable
          clearable
          disabled={!selectedWard || loadingBooths}
          rightSection={loadingBooths ? <Loader size={10} /> : undefined}
          comboboxProps={{ zIndex: 1002 }}
        />
      </Stack>
    </Paper>
  );
}
