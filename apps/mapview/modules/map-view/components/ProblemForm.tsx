"use client";

import { useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  ActionIcon,
  Text,
  Box,
  Loader,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { PlusIcon, TrashIcon, Info } from "@phosphor-icons/react";
import { PROBLEMS_API, PLACE_API } from "../module.api";

interface ProblemFormProps {
  coordinates: { lat: number; lng: number };
  wardId?: number;
  municipalityId?: number;
  onClose: () => void;
  onSuccess: (problem: any) => void;
}

interface IssueItem {
  ne: string;
  en?: string;
}

interface BoothItem {
  ne: string;
  en?: string;
}

export function ProblemForm({
  coordinates,
  wardId,
  municipalityId,
  onClose,
  onSuccess,
}: ProblemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      name_en: "",
      placeName: "",
      placeName_en: "",
      population: undefined as number | undefined,
      houses: undefined as number | undefined,
      voters: undefined as number | undefined,
      people_present: "",
      issues: [{ ne: "", en: "" }] as IssueItem[],
      booth: [] as BoothItem[],
      previous_records: "",
      previous_records_en: "",
      status: "OPEN" as "OPEN" | "IN_PROGRESS" | "RESOLVED",
      notes: "",
    },
    validate: {
      name: (value) => (!value ? "Name (Nepali) is required" : null),
      placeName: (value) => (!value ? "Place name is required" : null),
      issues: (value) =>
        value.length === 0 || !value[0].ne
          ? "At least one issue is required"
          : null,
    },
  });

  const addIssue = () => {
    form.setFieldValue("issues", [...form.values.issues, { ne: "", en: "" }]);
  };

  const removeIssue = (index: number) => {
    form.setFieldValue(
      "issues",
      form.values.issues.filter((_, i) => i !== index),
    );
  };

  const addBooth = () => {
    form.setFieldValue("booth", [...form.values.booth, { ne: "", en: "" }]);
  };

  const removeBooth = (index: number) => {
    form.setFieldValue(
      "booth",
      form.values.booth.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError(null);

    try {
      // Validate that we have a municipality selected
      if (!municipalityId) {
        throw new Error(
          "Please select a municipality first before creating a problem marker",
        );
      }

      // Step 1: Create place entry
      const placeData = {
        place_type: 2, // POLLING_CENTER type
        geo_unit: municipalityId, // Always use municipality
        name: values.placeName,
        name_en: values.placeName_en || undefined,
        normalized_name: values.placeName.toLowerCase(),
        normalized_name_en: values.placeName_en?.toLowerCase() || undefined,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      };

      const placeResponse = await PLACE_API.createPlace(placeData);

      if (!placeResponse || !placeResponse.id) {
        throw new Error("Failed to create place");
      }

      // Step 2: Create problem entry
      const problemData = {
        external_id: `map_click_${Date.now()}`,
        name: values.name,
        name_en: values.name_en || undefined,
        place: placeResponse.id,
        population: values.population,
        houses: values.houses,
        voters: values.voters,
        people_present: values.people_present || undefined,
        issues: values.issues.filter((issue) => issue.ne),
        booth: values.booth.filter((b) => b.ne),
        previous_records: values.previous_records || undefined,
        previous_records_en: values.previous_records_en || undefined,
        status: values.status,
        source: "map_click",
        notes: values.notes || undefined,
      };

      const problemResponse = await PROBLEMS_API.createProblem(problemData);

      if (!problemResponse) {
        throw new Error("Failed to create problem");
      }

      // Enrich the response with coordinates for immediate rendering
      const enrichedProblem = {
        ...problemResponse,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      };

      onSuccess(enrichedProblem);
    } catch (err: any) {
      console.error("Error creating problem:", err);
      setError(err.message || "Failed to create problem marker");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened
      onClose={onClose}
      title="Create Problem Marker"
      size="lg"
      styles={{
        body: { maxHeight: "70vh", overflowY: "auto" },
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {error && (
            <Alert color="red" icon={<Info size={16} />}>
              {error}
            </Alert>
          )}

          <Box>
            <Text size="xs" c="dimmed" mb="xs">
              Location: {coordinates.lat.toFixed(6)},{" "}
              {coordinates.lng.toFixed(6)}
            </Text>
          </Box>

          {/* Place Information */}
          <TextInput
            label="Place Name (Nepali)"
            placeholder="e.g., नवदुर्गा/फिनाम बूथ"
            required
            {...form.getInputProps("placeName")}
          />
          <TextInput
            label="Place Name (English)"
            placeholder="e.g., Navadurga/Phinam Booth"
            {...form.getInputProps("placeName_en")}
          />

          {/* Problem Information */}
          <TextInput
            label="Problem Name (Nepali)"
            placeholder="e.g., बस्ती समस्या"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Problem Name (English)"
            placeholder="e.g., Settlement Issue"
            {...form.getInputProps("name_en")}
          />

          {/* Issues */}
          <Box>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Issues *
              </Text>
              <ActionIcon size="sm" onClick={addIssue}>
                <PlusIcon size={16} />
              </ActionIcon>
            </Group>
            {form.values.issues.map((issue, index) => (
              <Group key={index} mb="xs" align="flex-start">
                <TextInput
                  placeholder="Issue (Nepali)"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`issues.${index}.ne`)}
                />
                <TextInput
                  placeholder="Issue (English)"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`issues.${index}.en`)}
                />
                {form.values.issues.length > 1 && (
                  <ActionIcon
                    color="red"
                    variant="light"
                    onClick={() => removeIssue(index)}
                  >
                    <TrashIcon size={16} />
                  </ActionIcon>
                )}
              </Group>
            ))}
          </Box>

          {/* Booth */}
          <Box>
            <Group justify="space-between" mb="xs">
              <Text size="sm" fw={500}>
                Booth (Optional)
              </Text>
              <ActionIcon size="sm" onClick={addBooth}>
                <PlusIcon size={16} />
              </ActionIcon>
            </Group>
            {form.values.booth.map((booth, index) => (
              <Group key={index} mb="xs" align="flex-start">
                <TextInput
                  placeholder="Booth (Nepali)"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`booth.${index}.ne`)}
                />
                <TextInput
                  placeholder="Booth (English)"
                  style={{ flex: 1 }}
                  {...form.getInputProps(`booth.${index}.en`)}
                />
                <ActionIcon
                  color="red"
                  variant="light"
                  onClick={() => removeBooth(index)}
                >
                  <TrashIcon size={16} />
                </ActionIcon>
              </Group>
            ))}
          </Box>

          {/* Statistics */}
          <Group grow>
            <NumberInput
              label="Population"
              placeholder="200"
              min={0}
              {...form.getInputProps("population")}
            />
            <NumberInput
              label="Houses"
              placeholder="70"
              min={0}
              {...form.getInputProps("houses")}
            />
            <NumberInput
              label="Voters"
              placeholder="170"
              min={0}
              {...form.getInputProps("voters")}
            />
          </Group>

          <TextInput
            label="People Present"
            placeholder="e.g., 20-25"
            {...form.getInputProps("people_present")}
          />

          {/* Previous Records */}
          <Textarea
            label="Previous Records (Nepali)"
            placeholder="समस्या छैन..."
            rows={2}
            {...form.getInputProps("previous_records")}
          />
          <Textarea
            label="Previous Records (English)"
            placeholder="No issue..."
            rows={2}
            {...form.getInputProps("previous_records_en")}
          />

          {/* Status */}
          <Select
            label="Status"
            data={[
              { value: "OPEN", label: "Open" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "RESOLVED", label: "Resolved" },
            ]}
            {...form.getInputProps("status")}
          />

          {/* Notes */}
          <Textarea
            label="Notes"
            placeholder="Additional notes..."
            rows={3}
            {...form.getInputProps("notes")}
          />

          {/* Actions */}
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create Problem Marker
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
